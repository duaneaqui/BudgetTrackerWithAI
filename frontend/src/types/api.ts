export type User = { id: number; name: string; email: string; created_at: string };
export type Income = { id: number; source: string; amount: number; date: string; notes?: string };
export type Expense = { id: number; name: string; category: string; amount: number; date: string; payment_method?: string; notes?: string };
export type RecurringExpense = { id: number; name: string; amount: number; category: string; frequency: string; due_day: number; next_due_date: string; is_active: boolean };
export type Loan = { id: number; provider: string; loan_type?: string; original_amount?: number; remaining_balance: number; monthly_payment: number; interest_or_fees?: number; due_date: string; status: string; notes?: string };
export type SavingsGoal = { id: number; goal_name: string; target_amount: number; current_amount: number; target_date?: string; notes?: string };
export type LocalCost = { id: number; item_name: string; category: string; unit: string; price: number; location_note?: string };

export type Dashboard = {
  monthly_income: number;
  monthly_expenses: number;
  remaining_balance: number;
  total_savings: number;
  total_loan_balance: number;
  upcoming_bills: RecurringExpense[];
  upcoming_loans: Loan[];
  category_spending: { category: string; amount: number }[];
  monthly_trend: { month: number; expenses: number }[];
  savings_progress: { goal: string; current: number; target: number; percent: number }[];
};

export type InsightResponse = {
  summary: string[];
  warnings: string[];
  recommendations: string[];
  forecast: Record<string, number>;
};
