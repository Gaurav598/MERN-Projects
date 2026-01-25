import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an AI-powered financial intelligence engine embedded in a personal finance application.
Analyze expense data, detect patterns, identify anomalies, forecast spending, and generate personalized insights.
Do not provide generic advice. Base all responses strictly on the user's data provided.
Never hallucinate values. Assume all currency is INR.
Always respond with valid JSON in the exact format requested.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, expenses, budget, categoryLimits } = await req.json();

    let prompt = "";
    let responseFormat = "";

    switch (type) {
      case "categorize":
        const { text } = await req.json();
        prompt = `Analyze this expense description and categorize it: "${text}"
        
Available categories: food, transport, shopping, entertainment, utilities, health, education, other

Return JSON:
{
  "category": "category_id",
  "amount": extracted_amount_or_null,
  "description": "cleaned description"
}`;
        break;

      case "insights":
        prompt = `Analyze these expenses and provide personalized insights:

Expenses (last 30 days): ${JSON.stringify(expenses)}
Monthly Budget: ${budget}
Category Limits: ${JSON.stringify(categoryLimits)}

Provide 3-5 actionable insights. Return JSON array:
[
  {
    "type": "warning" | "tip" | "achievement" | "anomaly",
    "title": "short title",
    "description": "detailed insight based on actual data",
    "potentialSavings": number_or_0
  }
]`;
        break;

      case "forecast":
        prompt = `Based on these expense patterns, forecast next month's spending:

Historical Expenses: ${JSON.stringify(expenses)}
Current Month Spent: Calculate from data

Return JSON:
{
  "forecastedTotal": number,
  "categoryForecasts": { "category": number },
  "trend": "increasing" | "decreasing" | "stable",
  "confidence": "high" | "medium" | "low",
  "explanation": "brief explanation"
}`;
        break;

      case "health-score":
        prompt = `Calculate a financial health score (0-100) based on:

Expenses: ${JSON.stringify(expenses)}
Budget: ${budget}
Category Limits: ${JSON.stringify(categoryLimits)}

Consider: budget adherence, spending patterns, savings rate, category balance.

Return JSON:
{
  "score": number,
  "grade": "Excellent" | "Good" | "Fair" | "Poor",
  "factors": [
    { "name": "factor name", "score": number, "status": "good" | "warning" | "critical" }
  ],
  "recommendations": ["recommendation1", "recommendation2"]
}`;
        break;

      case "anomaly":
        prompt = `Detect spending anomalies in this data:

Expenses: ${JSON.stringify(expenses)}

Look for: unusual amounts, unexpected timing, category spikes.

Return JSON array:
[
  {
    "expenseId": "id",
    "type": "high_amount" | "unusual_category" | "frequency_spike",
    "severity": "low" | "medium" | "high",
    "explanation": "why this is anomalous"
  }
]`;
        break;

      case "summary":
        prompt = `Generate a comprehensive monthly summary:

Expenses: ${JSON.stringify(expenses)}
Budget: ${budget}

Return JSON:
{
  "totalSpent": number,
  "budgetUsedPercent": number,
  "topCategories": [{ "name": "category", "amount": number, "percent": number }],
  "comparison": "vs last month analysis",
  "highlights": ["key insight 1", "key insight 2"],
  "aiSummary": "2-3 sentence personalized summary"
}`;
        break;

      default:
        throw new Error("Invalid analysis type");
    }

    console.log(`Processing ${type} analysis request`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      result = { raw: content };
    }

    console.log(`Successfully processed ${type} analysis`);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in ai-analyze function:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
