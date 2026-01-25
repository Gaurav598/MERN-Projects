import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/hooks/useExpenses";

export interface AIInsight {
  type: "warning" | "tip" | "achievement" | "anomaly";
  title: string;
  description: string;
  potentialSavings: number;
}

export interface HealthScore {
  score: number;
  grade: string;
  factors: Array<{ name: string; score: number; status: string }>;
  recommendations: string[];
}

export interface Forecast {
  forecastedTotal: number;
  categoryForecasts: Record<string, number>;
  trend: string;
  confidence: string;
  explanation: string;
}

export interface Summary {
  summary: string;
  highlights: string[];
}

export function useAI() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{ summary: string } | null>(null);

  const analyze = async (
    type: string,
    data: {
      expenses?: Expense[];
      budget?: number;
      categoryLimits?: Record<string, number>;
      text?: string;
    }
  ) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("ai-analyze", {
        body: { type, ...data },
      });

      if (error) throw error;
      return result.result;
    } catch (error: any) {
      console.error("AI analysis error:", error);
      
      if (error.message?.includes("429")) {
        toast({
          title: "Rate Limited",
          description: "Too many AI requests. Please try again later.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402")) {
        toast({
          title: "AI Usage Limit",
          description: "AI usage limit reached for this period.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "AI Error",
          description: "Failed to get AI analysis. Please try again.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async (expenses: Expense[], budget: number, categoryLimits: Record<string, number>) => {
    return analyze("insights", { expenses, budget, categoryLimits }) as Promise<AIInsight[] | null>;
  };

  const getHealthScore = async (expenses: Expense[], budget: number, categoryLimits: Record<string, number>) => {
    return analyze("health-score", { expenses, budget, categoryLimits }) as Promise<HealthScore | null>;
  };

  const getForecast = async (expenses: Expense[]) => {
    return analyze("forecast", { expenses }) as Promise<Forecast | null>;
  };

  const categorizeExpense = async (text: string) => {
    return analyze("categorize", { text }) as Promise<{ category: string; amount: number | null; description: string } | null>;
  };

  const getSummary = async (expenses: Expense[], budget: number) => {
    return analyze("summary", { expenses, budget });
  };

  const getAnomalies = async (expenses: Expense[]) => {
    return analyze("anomaly", { expenses });
  };

  const analyzeExpenses = async (expenses: Expense[]) => {
    const result = await analyze("summary", { expenses, budget: 50000 });
    if (result) {
      setInsights({ summary: result.summary || result });
    }
    return result;
  };

  return {
    loading,
    insights,
    getInsights,
    getHealthScore,
    getForecast,
    categorizeExpense,
    getSummary,
    getAnomalies,
    analyzeExpenses,
  };
}