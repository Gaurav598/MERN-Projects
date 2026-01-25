import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudget } from "@/hooks/useBudget";
import { TrendingUp, TrendingDown, Calendar, Target, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, subMonths, startOfMonth, endOfMonth } from "date-fns";

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

export default function Analytics() {
  const { expenses, loading, totalSpent, spendingByCategory } = useExpenses();
  const { budget } = useBudget();

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const key = format(date, "MMM");
      months[key] = 0;
    }
    
    // Sum expenses by month
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const key = format(date, "MMM");
      if (months[key] !== undefined) {
        months[key] += Number(expense.amount);
      }
    });
    
    return Object.entries(months).map(([month, spending]) => ({ month, spending }));
  }, [expenses]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return days.map(day => {
      const dayExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return format(expenseDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });
      const amount = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        day: format(day, "EEE"),
        amount,
      };
    });
  }, [expenses]);

  const categoryData = useMemo(() => {
    return Object.entries(spendingByCategory).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Other"],
    }));
  }, [spendingByCategory]);

  const radarData = useMemo(() => {
    return Object.entries(spendingByCategory)
      .filter(([_, value]) => value > 0)
      .map(([category, value]) => ({
        category: category.split(" ")[0],
        value,
        fullMark: Math.max(...Object.values(spendingByCategory), 10000),
      }));
  }, [spendingByCategory]);

  // Calculate stats
  const currentMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  
  const lastMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    const lastMonth = subMonths(new Date(), 1);
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const monthChange = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth * 100).toFixed(1) : "0";
  
  const daysInMonth = new Date().getDate();
  const avgDaily = daysInMonth > 0 ? Math.round(totalThisMonth / daysInMonth) : 0;
  
  const highestDay = weeklyData.reduce((max, day) => day.amount > max.amount ? day : max, { day: "-", amount: 0 });
  
  const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - daysInMonth;
  const forecast = totalThisMonth + (avgDaily * daysRemaining);
  const budgetTotal = budget?.total_budget || 50000;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="stat">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(totalThisMonth)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {parseFloat(monthChange) < 0 ? (
                    <TrendingDown className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-destructive" />
                  )}
                  <span className={parseFloat(monthChange) < 0 ? "text-success text-sm" : "text-destructive text-sm"}>
                    {monthChange}% vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="stat">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">{formatCurrency(avgDaily)}</p>
                <p className="text-sm text-muted-foreground mt-1">Per day spending</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-2/10">
                <Target className="w-5 h-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="stat">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Day</p>
                <p className="text-2xl font-bold">{formatCurrency(highestDay.amount)}</p>
                <p className="text-sm text-muted-foreground mt-1">{highestDay.day}</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="stat">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Forecast</p>
                <p className="text-2xl font-bold">{formatCurrency(forecast)}</p>
                <p className={`text-sm mt-1 ${forecast <= budgetTotal ? "text-success" : "text-destructive"}`}>
                  {forecast <= budgetTotal 
                    ? `${formatCurrency(budgetTotal - forecast)} under budget`
                    : `${formatCurrency(forecast - budgetTotal)} over budget`
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorSpending2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${v/1000}k`} className="text-xs" />
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
                    fill="url(#colorSpending2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Breakdown */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>This Week's Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${v/1000}k`} className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Spent"]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
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
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expense data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spending Radar */}
        <Card variant="default" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="category" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} className="text-xs" />
                    <Radar
                      name="Spending"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Add expenses to see your spending profile
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}