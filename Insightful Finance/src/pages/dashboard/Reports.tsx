import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudget } from "@/hooks/useBudget";
import { useAI } from "@/hooks/useAI";
import { FileText, Download, Calendar, TrendingUp, TrendingDown, Brain, ChevronRight, Loader2 } from "lucide-react";
import { format, subMonths } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "hsl(160, 84%, 39%)",
  "Transport": "hsl(200, 80%, 50%)",
  "Shopping": "hsl(280, 70%, 60%)",
  "Entertainment": "hsl(38, 92%, 50%)",
  "Bills & Utilities": "hsl(0, 84%, 60%)",
  "Healthcare": "hsl(180, 70%, 45%)",
  "Education": "hsl(220, 70%, 50%)",
  "Other": "hsl(240, 5%, 50%)",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Shopping": "🛍️",
  "Entertainment": "🎬",
  "Bills & Utilities": "💡",
  "Healthcare": "🏥",
  "Education": "📚",
  "Other": "📦",
};

export default function Reports() {
  const { expenses, loading, totalSpent, spendingByCategory } = useExpenses();
  const { budget } = useBudget();
  const { analyzeExpenses, loading: aiLoading, insights } = useAI();

  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [expenses]);

  const lastMonthExpenses = useMemo(() => {
    return expenses.filter(e => {
      const date = new Date(e.date);
      const lastMonth = subMonths(new Date(), 1);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });
  }, [expenses]);

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const monthChange = totalLastMonth > 0 
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth * 100).toFixed(1) 
    : "0";

  const categorySpendingArray = useMemo(() => {
    return Object.entries(spendingByCategory)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Other"],
        icon: CATEGORY_ICONS[name] || CATEGORY_ICONS["Other"],
      }))
      .sort((a, b) => b.value - a.value);
  }, [spendingByCategory]);

  const uniqueCategories = new Set(expenses.map(e => e.category)).size;
  const budgetRemaining = (budget?.total_budget || 50000) - totalSpent;

  // Generate historical reports data
  const historicalReports = useMemo(() => {
    const reports = [];
    for (let i = 1; i <= 4; i++) {
      const date = subMonths(new Date(), i);
      const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate.getMonth() === date.getMonth() && expDate.getFullYear() === date.getFullYear();
      });
      const total = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      reports.push({
        month: format(date, "MMMM yyyy"),
        totalSpent: total,
        transactions: monthExpenses.length,
      });
    }
    return reports;
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Month Report */}
      <Card variant="elevated" className="border-primary/20 overflow-hidden">
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-foreground/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{format(new Date(), "MMMM yyyy")} Report</h2>
                <p className="opacity-90">AI-Generated Monthly Summary</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold">{formatCurrency(totalThisMonth)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className={`text-2xl font-bold ${budgetRemaining >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(Math.abs(budgetRemaining))}
              </div>
              <div className="text-sm text-muted-foreground">
                {budgetRemaining >= 0 ? "Remaining" : "Over Budget"}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold">{uniqueCategories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold">{currentMonthExpenses.length}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold">AI Executive Summary</h4>
                {insights ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insights.summary}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {expenses.length === 0 ? (
                        "Start adding expenses to generate your AI-powered monthly summary."
                      ) : (
                        <>
                          Your {format(new Date(), "MMMM")} spending is{" "}
                          <span className={parseFloat(monthChange) <= 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                            {Math.abs(parseFloat(monthChange))}% {parseFloat(monthChange) <= 0 ? "lower" : "higher"}
                          </span>{" "}
                          than last month. 
                          {categorySpendingArray[0] && (
                            <> {categorySpendingArray[0].name} is your highest expense at {formatCurrency(categorySpendingArray[0].value)}.</>
                          )}
                        </>
                      )}
                    </p>
                    {expenses.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeExpenses(expenses)}
                        disabled={aiLoading}
                      >
                        {aiLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        Generate AI Summary
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="font-semibold mb-4">Top Spending Categories</h4>
            <div className="space-y-3">
              {categorySpendingArray.length > 0 ? (
                categorySpendingArray.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-4">
                    <span className="text-lg">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span className="font-medium">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(cat.value / (categorySpendingArray[0]?.value || 1)) * 100}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No expenses recorded yet</p>
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div>
            <h4 className="font-semibold mb-4">Key Insights</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${parseFloat(monthChange) <= 0 ? "bg-success/10" : "bg-warning/10"}`}>
                {parseFloat(monthChange) <= 0 ? (
                  <TrendingDown className="w-5 h-5 text-success" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-warning" />
                )}
                <span className="text-sm">
                  Spending {parseFloat(monthChange) <= 0 ? "decreased" : "increased"} by {Math.abs(parseFloat(monthChange))}% vs last month
                </span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${budgetRemaining >= 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                {budgetRemaining >= 0 ? (
                  <TrendingDown className="w-5 h-5 text-success" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-destructive" />
                )}
                <span className="text-sm">
                  {budgetRemaining >= 0 
                    ? `${formatCurrency(budgetRemaining)} under budget`
                    : `${formatCurrency(Math.abs(budgetRemaining))} over budget`
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Past Reports */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Historical Reports</CardTitle>
          <CardDescription>View and download your past monthly reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historicalReports.map((report, index) => (
              <div
                key={report.month}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{report.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(report.totalSpent)} • {report.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}