import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarClock, Coins, PiggyBank, Receipt, Wallet } from "lucide-react";
import { PageHeader } from "../components/Layout";
import { api } from "../lib/api";
import { monthName, peso } from "../lib/format";
import type { Dashboard as DashboardType } from "../types/api";

const colors = ["#0f8b8d", "#f25c54", "#f7b32b", "#4464ad", "#6a994e", "#8d6a9f"];

function Card({ label, value, icon: Icon }: { label: string; value: string; icon: ElementType }) {
  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-shell text-brand"><Icon size={20} /></div>
      <div className="text-sm font-bold text-muted">{label}</div>
      <div className="mt-1 text-2xl font-black text-ink">{value}</div>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState<DashboardType | null>(null);
  useEffect(() => {
    api.dashboard<DashboardType>().then(setData);
  }, []);

  if (!data) return <PageHeader title="Dashboard" subtitle="Loading your budget workspace..." />;
  const trend = data.monthly_trend.map((item) => ({ ...item, label: monthName(item.month) }));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Track income, expenses, recurring bills, loans, savings, and local prices in one place." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Monthly income" value={peso(data.monthly_income)} icon={Wallet} />
        <Card label="Expenses this month" value={peso(data.monthly_expenses)} icon={Receipt} />
        <Card label="Remaining balance" value={peso(data.remaining_balance)} icon={Coins} />
        <Card label="Total savings" value={peso(data.total_savings)} icon={PiggyBank} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-black text-ink">Monthly spending trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde3ec" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v) => peso(Number(v))} />
                <Area type="monotone" dataKey="expenses" stroke="#0f8b8d" fill="#0f8b8d33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-black text-ink">Expense breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.category_spending} dataKey="amount" nameKey="category" outerRadius={100} label>
                  {data.category_spending.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => peso(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="rounded-md border border-line bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="mb-4 text-lg font-black text-ink">Savings progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.savings_progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde3ec" />
                <XAxis dataKey="goal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percent" fill="#f7b32b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-ink"><CalendarClock size={20} /> Upcoming</h2>
          <div className="space-y-3">
            {[...data.upcoming_bills.map((b) => ({ label: b.name, amount: b.amount, date: b.next_due_date })), ...data.upcoming_loans.map((l) => ({ label: l.provider, amount: l.monthly_payment, date: l.due_date }))].map((item, index) => (
              <div key={index} className="rounded-md border border-line p-3">
                <div className="font-black text-ink">{item.label}</div>
                <div className="text-sm font-medium text-muted">{peso(item.amount)} due {item.date}</div>
              </div>
            ))}
            {data.total_loan_balance > 0 && <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800"><AlertTriangle size={18} /> Active loan balance: {peso(data.total_loan_balance)}</div>}
          </div>
        </section>
      </div>
    </>
  );
}
