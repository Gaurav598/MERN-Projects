import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useBudget, CATEGORIES } from "@/hooks/useBudget";
import { useExpenses } from "@/hooks/useExpenses";
import { Wallet, AlertTriangle, Check, Edit2, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Budget() {
  const { toast } = useToast();
  const { budget, categoryLimits, loading, updateBudget, updateCategoryLimit } = useBudget();
  const { expenses, totalSpent, spendingByCategory } = useExpenses();
  
  const [totalBudgetInput, setTotalBudgetInput] = useState(50000);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (budget) {
      setTotalBudgetInput(budget.total_budget);
    }
  }, [budget]);

  const budgetUsed = budget ? (totalSpent / budget.total_budget) * 100 : 0;

  const handleSaveBudget = async () => {
    setSaving(true);
    const { error } = await updateBudget(totalBudgetInput);
    setSaving(false);
    if (!error) {
      toast({
        title: "Budget Saved",
        description: `Monthly budget set to ${formatCurrency(totalBudgetInput)}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive",
      });
    }
  };

  const handleSaveLimit = async (category: string) => {
    const newLimit = parseInt(tempLimit);
    if (newLimit > 0) {
      const { error } = await updateCategoryLimit(category, newLimit);
      if (!error) {
        toast({
          title: "Budget Updated",
          description: `${category} limit set to ${formatCurrency(newLimit)}`,
        });
      }
    }
    setEditingCategory(null);
    setTempLimit("");
  };

  const getCategoryLimit = (category: string) => {
    const limit = categoryLimits.find(l => l.category === category);
    return limit?.limit_amount || 0;
  };

  const getCategorySpent = (category: string) => {
    return spendingByCategory[category] || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Budget */}
      <Card variant="elevated" className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl gradient-primary">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Monthly Budget</CardTitle>
                <CardDescription>
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(budget?.total_budget || 50000)}</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Budget Used</span>
              <span className="font-medium">{Math.min(budgetUsed, 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(budgetUsed, 100)} className="h-4" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{formatCurrency(totalSpent)} spent</span>
              <span className="text-primary font-medium">
                {formatCurrency(Math.max((budget?.total_budget || 50000) - totalSpent, 0))} remaining
              </span>
            </div>
          </div>

          {/* Edit Total Budget */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="totalBudget">Set Monthly Budget</Label>
              <Input
                id="totalBudget"
                type="number"
                value={totalBudgetInput}
                onChange={(e) => setTotalBudgetInput(parseInt(e.target.value) || 0)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSaveBudget} className="mt-6" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Limits */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Category Limits</CardTitle>
          <CardDescription>Set spending limits for each category to stay on track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {CATEGORIES.map((category) => {
              const limit = getCategoryLimit(category.id);
              const spent = getCategorySpent(category.id);
              const percentage = limit > 0 ? (spent / limit) * 100 : 0;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage > 80 && percentage <= 100;

              return (
                <div 
                  key={category.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(spent)} / {limit > 0 ? formatCurrency(limit) : "No limit"}
                        </p>
                      </div>
                    </div>

                    {editingCategory === category.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(e.target.value)}
                          className="w-28"
                          placeholder="Amount"
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleSaveLimit(category.id)}>
                          <Check className="w-4 h-4 text-success" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingCategory(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isOverBudget && (
                          <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Over Budget
                          </span>
                        )}
                        {isNearLimit && (
                          <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                            Near Limit
                          </span>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category.id);
                            setTempLimit(limit.toString());
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget 
                          ? "bg-destructive" 
                          : isNearLimit 
                            ? "bg-warning" 
                            : "gradient-primary"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Budget Tip</h4>
              <p className="text-sm text-muted-foreground">
                {expenses.length === 0 
                  ? "Start adding expenses to get personalized budget tips based on your spending patterns."
                  : `Based on your spending patterns, your highest expense category is ${
                      Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "Food & Dining"
                    }. Consider setting limits to stay on track.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}