import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarClock, Coins, PiggyBank, Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "../components/Layout";
import { api } from "../lib/api";
import { monthName, peso } from "../lib/format";
import type { Dashboard as DashboardType } from "../types/api";

const colors = ["#0f8b8d", "#f25c54", "#f7b32b", "#4464ad", "#6a994e", "#8d6a9f"];

function Card({ label, value, icon: Icon, detail, tone = "brand" }: { label: string; value: string; icon: ElementType; detail?: string; tone?: "brand" | "good" | "warn" | "danger" }) {
  const toneClass = {
    brand: "bg-brand/10 text-brand",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-coral",
  }[tone];
  return (
    <div className="motion-card rounded-md border border-line bg-white p-5 shadow-soft">
      <div className={`motion-icon mb-4 flex h-10 w-10 items-center justify-center rounded-md ${toneClass}`}><Icon size={20} /></div>
      <div className="text-sm font-bold text-muted">{label}</div>
      <div className="mt-1 text-2xl font-black text-ink">{value}</div>
      {detail && <div className="mt-2 text-xs font-bold text-muted">{detail}</div>}
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
    <div className="motion-page">
      <div className="motion-rise mb-6 rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">Dashboard</h1>
            <p className="max-w-3xl text-sm font-medium text-muted">Track income, expenses, recurring bills, loans, savings, and local prices in one place.</p>
          </div>
          <div className="grid gap-2 text-sm font-bold text-muted sm:grid-cols-3 lg:min-w-[440px]">
            <div className="rounded-md bg-shell px-3 py-2">Bills due: <span className="text-ink">{data.upcoming_bills.length}</span></div>
            <div className="rounded-md bg-shell px-3 py-2">Loans due: <span className="text-ink">{data.upcoming_loans.length}</span></div>
            <div className="rounded-md bg-shell px-3 py-2">Savings goals: <span className="text-ink">{data.savings_progress.length}</span></div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Monthly income" value={peso(data.monthly_income)} icon={Wallet} detail="Seeded salary and added income records" />
        <Card label="Expenses this month" value={peso(data.monthly_expenses)} icon={Receipt} detail="Manual spending entries only" tone={data.monthly_expenses > data.monthly_income * 0.7 ? "warn" : "brand"} />
        <Card label="Remaining balance" value={peso(data.remaining_balance)} icon={data.remaining_balance >= 0 ? TrendingUp : TrendingDown} detail="Income minus recorded expenses" tone={data.remaining_balance >= 0 ? "good" : "danger"} />
        <Card label="Total savings" value={peso(data.total_savings)} icon={PiggyBank} detail="Across active savings goals" tone="good" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="motion-rise motion-delay-1 rounded-md border border-line bg-white p-5 shadow-soft">
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
        <section className="motion-rise motion-delay-2 rounded-md border border-line bg-white p-5 shadow-soft">
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
        <section className="motion-rise motion-delay-2 rounded-md border border-line bg-white p-5 shadow-soft lg:col-span-2">
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
        <section className="motion-rise motion-delay-3 rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-ink"><CalendarClock size={20} /> Upcoming</h2>
          <div className="space-y-3">
            {[...data.upcoming_bills.map((b) => ({ label: b.name, amount: b.amount, date: b.next_due_date })), ...data.upcoming_loans.map((l) => ({ label: l.provider, amount: l.monthly_payment, date: l.due_date }))].map((item, index) => (
              <div key={index} className="rounded-md border border-line p-3">
                <div className="font-black text-ink">{item.label}</div>
                <div className="text-sm font-medium text-muted">{peso(item.amount)} due {item.date}</div>
              </div>
            ))}
            {!data.upcoming_bills.length && !data.upcoming_loans.length && <div className="rounded-md border border-line bg-shell p-3 text-sm font-bold text-muted">No bills or loan payments due in the next 14 days.</div>}
            {data.total_loan_balance > 0 && <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800"><AlertTriangle size={18} /> Active loan balance: {peso(data.total_loan_balance)}</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
