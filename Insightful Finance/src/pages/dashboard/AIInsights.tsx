import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/mockData";
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Trophy, 
  Lightbulb,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from "lucide-react";

const insights = [
  {
    id: "1",
    type: "warning",
    icon: AlertTriangle,
    title: "Unusual Food Spending Detected",
    description: "Your food expenses are 35% higher than your monthly average. You've spent ₹5,520 on food this month, compared to your usual ₹4,000.",
    potentialSavings: 1520,
    actionable: true,
  },
  {
    id: "2",
    type: "tip",
    icon: Lightbulb,
    title: "Subscription Optimization",
    description: "You have 3 active entertainment subscriptions totaling ₹1,500/month. Consider bundling or choosing one primary service to save money.",
    potentialSavings: 800,
    actionable: true,
  },
  {
    id: "3",
    type: "achievement",
    icon: Trophy,
    title: "Budget Champion! 🎉",
    description: "Congratulations! You've stayed under budget for 3 consecutive months. Your discipline is paying off with total savings of ₹12,500.",
    potentialSavings: 0,
    actionable: false,
  },
  {
    id: "4",
    type: "anomaly",
    icon: Zap,
    title: "Large Transaction Alert",
    description: "A ₹3,500 shopping expense was detected yesterday. This is 5x your average daily spending. Was this planned?",
    potentialSavings: 0,
    actionable: true,
  },
];

const recommendations = [
  {
    title: "Set up auto-categorization",
    description: "Enable AI to automatically categorize your expenses",
    impact: "Save 10 mins daily",
  },
  {
    title: "Create weekly spending alerts",
    description: "Get notified when you exceed weekly limits",
    impact: "Reduce overspending by 20%",
  },
  {
    title: "Review recurring charges",
    description: "Audit your subscriptions and memberships",
    impact: "Potential ₹2,000 savings",
  },
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "warning":
      return "bg-warning/10 border-warning/20 text-warning";
    case "tip":
      return "bg-primary/10 border-primary/20 text-primary";
    case "achievement":
      return "bg-success/10 border-success/20 text-success";
    case "anomaly":
      return "bg-destructive/10 border-destructive/20 text-destructive";
    default:
      return "bg-muted border-border text-foreground";
  }
};

export default function AIInsights() {
  const totalSavings = insights.reduce((sum, i) => sum + i.potentialSavings, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card variant="elevated" className="flex-1 border-primary/20 overflow-hidden">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-foreground/20">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Financial Assistant</h2>
                <p className="opacity-90">Personalized insights based on your spending patterns</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-3xl font-bold text-primary">{insights.length}</div>
                <div className="text-sm text-muted-foreground">Active Insights</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-3xl font-bold text-success">{formatCurrency(totalSavings)}</div>
                <div className="text-sm text-muted-foreground">Potential Savings</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-3xl font-bold">78</div>
                <div className="text-sm text-muted-foreground">Financial Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Latest Insights
        </h3>
        
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <Card 
              key={insight.id}
              variant="interactive"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className={`p-3 rounded-xl self-start ${getTypeStyles(insight.type)}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold">{insight.title}</h4>
                      {insight.potentialSavings > 0 && (
                        <span className="shrink-0 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                          Save {formatCurrency(insight.potentialSavings)}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{insight.description}</p>
                  </div>

                  {insight.actionable && (
                    <Button variant="outline" className="shrink-0">
                      Take Action
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Actions that could improve your financial health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div 
                key={rec.title}
                className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h4 className="font-medium mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <TrendingDown className="w-3 h-3" />
                  {rec.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ask AI */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Ask AI Assistant</h4>
              <p className="text-sm text-muted-foreground">
                Have a question about your finances? Our AI can help analyze and provide personalized advice.
              </p>
            </div>
            <Button variant="hero">
              <Sparkles className="w-4 h-4" />
              Chat with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
