import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockExpenses, mockBudget, categorySpending, formatCurrency, getCategoryById, monthlyData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const statCards = [
  {
    title: "Total Spent",
    value: formatCurrency(mockBudget.spent),
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Budget Remaining",
    value: formatCurrency(mockBudget.total - mockBudget.spent),
    change: "67% left",
    trend: "stable",
    icon: Wallet,
    color: "text-success",
  },
  {
    title: "Highest Category",
    value: "Food & Dining",
    change: formatCurrency(5520),
    trend: "down",
    icon: PieChart,
    color: "text-warning",
  },
  {
    title: "Financial Health",
    value: "Good",
    change: "Score: 78/100",
    trend: "up",
    icon: Brain,
    color: "text-primary",
  },
];

export default function DashboardHome() {
  const recentExpenses = mockExpenses.slice(0, 5);
  const budgetPercentage = ((mockBudget.spent / mockBudget.total) * 100).toFixed(0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back! 👋</h2>
          <p className="text-muted-foreground">Here's your financial overview for December 2024</p>
        </div>
        <Link to="/dashboard/add">
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            variant="stat"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    ) : null}
                    <span className={stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-destructive" : "text-muted-foreground"}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending Trend */}
        <Card variant="default" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Spending Trend
              <span className="text-sm font-normal text-muted-foreground">Last 6 months</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => `₹${value/1000}k`} 
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Spending"]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSpending)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categorySpending.filter(c => c.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categorySpending.filter(c => c.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categorySpending.filter(c => c.value > 0).slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Budget */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Transactions
              <Link to="/dashboard/expenses" className="text-sm font-normal text-primary hover:underline">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense) => {
                const category = getCategoryById(expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                        {category?.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-destructive">-{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-muted-foreground">{expense.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Budget Overview
              <Link to="/dashboard/budget" className="text-sm font-normal text-primary hover:underline">
                Manage
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Budget</span>
                <span className="font-medium">{budgetPercentage}% used</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{formatCurrency(mockBudget.spent)} spent</span>
                <span className="text-primary font-medium">{formatCurrency(mockBudget.total - mockBudget.spent)} left</span>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">AI Insight</p>
                  <p className="text-xs text-muted-foreground">
                    You're on track to save ₹8,500 this month. Consider reducing dining out to save an extra ₹2,000.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Top Spending Categories</p>
              {categorySpending.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="font-medium">{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(cat.value / mockBudget.total) * 100}%`,
                          backgroundColor: cat.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
