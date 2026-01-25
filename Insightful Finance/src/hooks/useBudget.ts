import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Budget {
  id: string;
  user_id: string;
  total_budget: number;
  month: number;
  year: number;
}

export interface CategoryLimit {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
}

export const CATEGORIES = [
  { id: "Food & Dining", name: "Food & Dining", icon: "🍔" },
  { id: "Transport", name: "Transport", icon: "🚗" },
  { id: "Shopping", name: "Shopping", icon: "🛍️" },
  { id: "Entertainment", name: "Entertainment", icon: "🎬" },
  { id: "Bills & Utilities", name: "Bills & Utilities", icon: "💡" },
  { id: "Healthcare", name: "Healthcare", icon: "🏥" },
  { id: "Education", name: "Education", icon: "📚" },
  { id: "Other", name: "Other", icon: "📦" },
];

export function useBudget() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchBudget = async () => {
    if (!user) return;

    try {
      // Fetch monthly budget
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .maybeSingle();

      if (budgetError) throw budgetError;
      setBudget(budgetData);

      // Fetch category limits
      const { data: limitsData, error: limitsError } = await supabase
        .from("category_limits")
        .select("*")
        .eq("user_id", user.id);

      if (limitsError) throw limitsError;
      setCategoryLimits(limitsData || []);
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [user]);

  const updateBudget = async (totalBudget: number) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("budgets")
        .upsert({
          user_id: user.id,
          total_budget: totalBudget,
          month: currentMonth,
          year: currentYear,
        }, {
          onConflict: "user_id,month,year",
        })
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error setting budget:", error);
      return { data: null, error };
    }
  };

  const updateCategoryLimit = async (category: string, limitAmount: number) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("category_limits")
        .upsert({
          user_id: user.id,
          category,
          limit_amount: limitAmount,
        }, {
          onConflict: "user_id,category",
        })
        .select()
        .single();

      if (error) throw error;
      
      setCategoryLimits(prev => {
        const existing = prev.findIndex(l => l.category === category);
        if (existing >= 0) {
          return prev.map((l, i) => i === existing ? data : l);
        }
        return [...prev, data];
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error setting category limit:", error);
      return { data: null, error };
    }
  };

  const getCategoryLimit = (category: string) => {
    return categoryLimits.find(l => l.category === category)?.limit_amount || 0;
  };

  return {
    budget,
    categoryLimits,
    loading,
    updateBudget,
    updateCategoryLimit,
    setMonthlyBudget: updateBudget,
    setCategoryLimit: updateCategoryLimit,
    getCategoryLimit,
    refetch: fetchBudget,
    totalBudget: budget?.total_budget || 50000,
  };
}