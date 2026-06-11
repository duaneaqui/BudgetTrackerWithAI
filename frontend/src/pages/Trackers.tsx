import { ResourcePage } from "../components/ResourcePage";
import { today } from "../lib/format";
import type { Expense, Income, Loan, LocalCost, RecurringExpense, SavingsGoal } from "../types/api";

const categories = ["Food", "Rent", "Utilities", "Transport", "Laundry", "Pets", "Loans", "Subscriptions", "Emergency", "Entertainment", "Other"];

export function IncomePage() {
  return <ResourcePage<Income> title="Income" subtitle="Add, edit, and review salary, freelance, side project, or allowance income." path="/incomes" initial={{ source: "", amount: 0, date: today(), notes: "" }} fields={[
    { name: "source", label: "Source" }, { name: "amount", label: "Amount", type: "number" }, { name: "date", label: "Date", type: "date" }, { name: "notes", label: "Notes", type: "textarea" },
  ]} columns={[
    { key: "source", label: "Source" }, { key: "amount", label: "Amount", money: true }, { key: "date", label: "Date" }, { key: "notes", label: "Notes" },
  ]} />;
}

export function ExpensesPage() {
  return <ResourcePage<Expense> title="Expenses" subtitle="Track spending by category and payment method." path="/expenses" initial={{ name: "", category: "Food", amount: 0, date: today(), payment_method: "Cash", notes: "" }} fields={[
    { name: "name", label: "Name" }, { name: "category", label: "Category", type: "select", options: categories }, { name: "amount", label: "Amount", type: "number" }, { name: "date", label: "Date", type: "date" }, { name: "payment_method", label: "Payment method" }, { name: "notes", label: "Notes", type: "textarea" },
  ]} columns={[
    { key: "name", label: "Name" }, { key: "category", label: "Category" }, { key: "amount", label: "Amount", money: true }, { key: "date", label: "Date" }, { key: "payment_method", label: "Method" },
  ]} />;
}

export function RecurringPage() {
  return <ResourcePage<RecurringExpense> title="Recurring Bills" subtitle="Plan weekly, every-15-days, and monthly bills before they surprise the budget." path="/recurring-expenses" initial={{ name: "", amount: 0, category: "Utilities", frequency: "monthly", due_day: 1, next_due_date: today(), is_active: true }} fields={[
    { name: "name", label: "Name" }, { name: "amount", label: "Amount", type: "number" }, { name: "category", label: "Category", type: "select", options: categories }, { name: "frequency", label: "Frequency", type: "select", options: ["weekly", "every_15_days", "monthly"] }, { name: "due_day", label: "Due day", type: "number" }, { name: "next_due_date", label: "Next due date", type: "date" }, { name: "is_active", label: "Active", type: "checkbox" },
  ]} columns={[
    { key: "name", label: "Bill" }, { key: "amount", label: "Amount", money: true }, { key: "category", label: "Category" }, { key: "frequency", label: "Frequency" }, { key: "next_due_date", label: "Next due" },
  ]} />;
}

export function LoansPage() {
  return <ResourcePage<Loan> title="Loans" subtitle="Monitor providers, due dates, balances, and payment progress without unsafe auto-syncing." path="/loans" initial={{ provider: "SLoan", loan_type: "Cash loan", original_amount: 0, remaining_balance: 0, monthly_payment: 0, interest_or_fees: 0, due_date: today(), status: "active", notes: "" }} fields={[
    { name: "provider", label: "Provider", type: "select", options: ["GCash", "SLoan", "Maya Credit", "BPI", "Personal Loan", "Other"] }, { name: "loan_type", label: "Loan type" }, { name: "original_amount", label: "Original amount", type: "number" }, { name: "remaining_balance", label: "Remaining balance", type: "number" }, { name: "monthly_payment", label: "Monthly payment", type: "number" }, { name: "interest_or_fees", label: "Interest or fees", type: "number" }, { name: "due_date", label: "Due date", type: "date" }, { name: "status", label: "Status", type: "select", options: ["active", "paid", "overdue"] }, { name: "notes", label: "Notes", type: "textarea" },
  ]} columns={[
    { key: "provider", label: "Provider" }, { key: "remaining_balance", label: "Balance", money: true }, { key: "monthly_payment", label: "Payment", money: true }, { key: "due_date", label: "Due" }, { key: "status", label: "Status" },
  ]} />;
}

export function SavingsPage() {
  return <ResourcePage<SavingsGoal> title="Savings Goals" subtitle="Set targets and watch progress toward emergency funds, purchases, or debt buffers." path="/savings-goals" initial={{ goal_name: "", target_amount: 0, current_amount: 0, target_date: today(), notes: "" }} fields={[
    { name: "goal_name", label: "Goal name" }, { name: "target_amount", label: "Target amount", type: "number" }, { name: "current_amount", label: "Current amount", type: "number" }, { name: "target_date", label: "Target date", type: "date" }, { name: "notes", label: "Notes", type: "textarea" },
  ]} columns={[
    { key: "goal_name", label: "Goal" }, { key: "current_amount", label: "Current", money: true }, { key: "target_amount", label: "Target", money: true }, { key: "target_date", label: "Target date" }, { key: "progress", label: "Progress", render: (item) => `${Math.round((item.current_amount / item.target_amount) * 100 || 0)}%` },
  ]} />;
}

export function LocalCostsPage() {
  return <ResourcePage<LocalCost> title="Local Costs" subtitle="Record neighborhood prices so the advisor can make more grounded budget suggestions." path="/local-costs" initial={{ item_name: "", category: "Food", unit: "kg", price: 0, location_note: "" }} fields={[
    { name: "item_name", label: "Item name" }, { name: "category", label: "Category" }, { name: "unit", label: "Unit" }, { name: "price", label: "Price", type: "number" }, { name: "location_note", label: "Location note" },
  ]} columns={[
    { key: "item_name", label: "Item" }, { key: "category", label: "Category" }, { key: "unit", label: "Unit" }, { key: "price", label: "Price", money: true }, { key: "location_note", label: "Location" },
  ]} />;
}
