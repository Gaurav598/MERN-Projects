import { Expense, Category, Budget } from "@/types/expense";

export const categories: Category[] = [
  { id: "food", name: "Food & Dining", icon: "🍽️", color: "hsl(var(--chart-1))" },
  { id: "transport", name: "Transport", icon: "🚗", color: "hsl(var(--chart-2))" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "hsl(var(--chart-3))" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "hsl(var(--chart-4))" },
  { id: "utilities", name: "Utilities", icon: "💡", color: "hsl(var(--chart-5))" },
  { id: "health", name: "Health", icon: "🏥", color: "hsl(160, 84%, 39%)" },
  { id: "education", name: "Education", icon: "📚", color: "hsl(200, 80%, 50%)" },
  { id: "other", name: "Other", icon: "📦", color: "hsl(220, 14%, 50%)" },
];

export const mockExpenses: Expense[] = [
  { id: "1", amount: 450, category: "food", description: "Swiggy order - dinner", date: "2024-12-15", createdAt: new Date().toISOString() },
  { id: "2", amount: 1200, category: "transport", description: "Uber to office", date: "2024-12-14", createdAt: new Date().toISOString() },
  { id: "3", amount: 3500, category: "shopping", description: "Amazon - electronics", date: "2024-12-13", createdAt: new Date().toISOString() },
  { id: "4", amount: 800, category: "entertainment", description: "Netflix subscription", date: "2024-12-12", createdAt: new Date().toISOString() },
  { id: "5", amount: 2500, category: "utilities", description: "Electricity bill", date: "2024-12-11", createdAt: new Date().toISOString() },
  { id: "6", amount: 320, category: "food", description: "Zomato lunch", date: "2024-12-10", createdAt: new Date().toISOString() },
  { id: "7", amount: 5000, category: "health", description: "Doctor consultation", date: "2024-12-09", createdAt: new Date().toISOString() },
  { id: "8", amount: 1500, category: "education", description: "Udemy course", date: "2024-12-08", createdAt: new Date().toISOString() },
  { id: "9", amount: 750, category: "food", description: "Groceries", date: "2024-12-07", createdAt: new Date().toISOString() },
  { id: "10", amount: 400, category: "transport", description: "Metro recharge", date: "2024-12-06", createdAt: new Date().toISOString() },
];

export const mockBudget: Budget = {
  total: 50000,
  spent: 16420,
  categoryLimits: {
    food: 8000,
    transport: 5000,
    shopping: 10000,
    entertainment: 3000,
    utilities: 8000,
    health: 5000,
    education: 5000,
    other: 6000,
  },
};

export const monthlyData = [
  { month: "Jul", spending: 42000 },
  { month: "Aug", spending: 38000 },
  { month: "Sep", spending: 45000 },
  { month: "Oct", spending: 41000 },
  { month: "Nov", spending: 48000 },
  { month: "Dec", spending: 16420 },
];

export const categorySpending = categories.map((cat, index) => ({
  name: cat.name,
  value: [5520, 3100, 3500, 800, 2500, 5000, 1500, 500][index] || 0,
  color: cat.color,
  icon: cat.icon,
}));

export const getCategoryById = (id: string) => categories.find(c => c.id === id);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
