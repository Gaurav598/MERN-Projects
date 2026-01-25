export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  total: number;
  spent: number;
  categoryLimits: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'anomaly';
  title: string;
  description: string;
  potentialSavings?: number;
  createdAt: string;
}
