import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, formatCurrency } from "@/data/mockData";
import { Brain, Sparkles, Check, Calendar, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddExpense() {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [naturalInput, setNaturalInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiParsed, setAiParsed] = useState<{ amount?: number; category?: string; description?: string } | null>(null);

  const handleNaturalLanguage = () => {
    if (!naturalInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI parsing
    setTimeout(() => {
      const parsed = parseNaturalInput(naturalInput);
      setAiParsed(parsed);
      if (parsed.amount) setAmount(parsed.amount.toString());
      if (parsed.category) setCategory(parsed.category);
      if (parsed.description) setDescription(parsed.description);
      setIsProcessing(false);
      
      toast({
        title: "AI Parsed Successfully",
        description: "We've extracted the expense details from your input.",
      });
    }, 1000);
  };

  const parseNaturalInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    let amount = 0;
    let category = "other";
    let description = input;

    // Extract amount
    const amountMatch = input.match(/(\d+)/);
    if (amountMatch) {
      amount = parseInt(amountMatch[1]);
    }

    // Determine category based on keywords
    if (lowerInput.includes("swiggy") || lowerInput.includes("zomato") || lowerInput.includes("food") || lowerInput.includes("lunch") || lowerInput.includes("dinner") || lowerInput.includes("breakfast")) {
      category = "food";
    } else if (lowerInput.includes("uber") || lowerInput.includes("ola") || lowerInput.includes("metro") || lowerInput.includes("fuel") || lowerInput.includes("petrol")) {
      category = "transport";
    } else if (lowerInput.includes("amazon") || lowerInput.includes("flipkart") || lowerInput.includes("shopping") || lowerInput.includes("clothes")) {
      category = "shopping";
    } else if (lowerInput.includes("netflix") || lowerInput.includes("movie") || lowerInput.includes("spotify") || lowerInput.includes("game")) {
      category = "entertainment";
    } else if (lowerInput.includes("electricity") || lowerInput.includes("water") || lowerInput.includes("internet") || lowerInput.includes("bill")) {
      category = "utilities";
    } else if (lowerInput.includes("doctor") || lowerInput.includes("medicine") || lowerInput.includes("hospital") || lowerInput.includes("gym")) {
      category = "health";
    } else if (lowerInput.includes("course") || lowerInput.includes("book") || lowerInput.includes("udemy") || lowerInput.includes("class")) {
      category = "education";
    }

    return { amount, category, description };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Expense Added!",
      description: `${formatCurrency(parseInt(amount))} added to ${categories.find(c => c.id === category)?.name}`,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setNaturalInput("");
    setAiParsed(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* AI Natural Language Input */}
      <Card variant="elevated" className="border-primary/20 overflow-hidden">
        <div className="gradient-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI-Powered Entry</h3>
              <p className="text-sm opacity-90">Describe your expense in natural language</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Try something like:</Label>
            <p className="text-sm text-muted-foreground italic">
              "Spent 450 on Swiggy dinner today" or "Uber ride to office 200"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your expense..."
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleNaturalLanguage}
              disabled={isProcessing || !naturalInput.trim()}
            >
              {isProcessing ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse
                </>
              )}
            </Button>
          </div>
          
          {aiParsed && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 animate-scale-in">
              <div className="flex items-center gap-2 text-success mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium text-sm">AI Parsed Successfully</span>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                {aiParsed.amount && <p>Amount: {formatCurrency(aiParsed.amount)}</p>}
                {aiParsed.category && <p>Category: {categories.find(c => c.id === aiParsed.category)?.name}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Entry Form */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Enter your expense information manually or edit AI-parsed data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-lg font-semibold"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      category === cat.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xl block mb-1">{cat.icon}</span>
                    <span className="text-xs truncate block">{cat.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button type="submit" variant="hero" className="w-full" size="lg">
              <Check className="w-4 h-4" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
