import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "../components/Layout";
import { api } from "../lib/api";
import { peso } from "../lib/format";
import type { Dashboard } from "../types/api";

export function ReportsPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));

  useEffect(() => {
    api.dashboard<Dashboard>(`?month=${month}&year=${year}`).then(setData);
  }, [month, year]);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeader title="Monthly Reports" subtitle="Review income, expenses, loan payments, savings progress, and AI-ready summaries." />
        <div className="flex gap-2">
          <input className="w-24 rounded-md border border-line px-3 py-2" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" />
          <input className="w-28 rounded-md border border-line px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year" />
        </div>
      </div>
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total income", data.monthly_income],
              ["Total expenses", data.monthly_expenses],
              ["Remaining balance", data.remaining_balance],
              ["Loan balance", data.total_loan_balance],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-md border border-line bg-white p-5 shadow-soft">
                <div className="text-sm font-bold text-muted">{label}</div>
                <div className="mt-1 text-2xl font-black text-ink">{peso(Number(value))}</div>
              </div>
            ))}
          </div>
          <section className="mt-4 rounded-md border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-lg font-black text-ink">Category spending</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.category_spending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde3ec" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(v) => peso(Number(v))} />
                  <Bar dataKey="amount" fill="#0f8b8d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="mt-4 rounded-md border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-lg font-black text-ink">Savings progress</h2>
            <div className="space-y-3">
              {data.savings_progress.map((goal) => (
                <div key={goal.goal}>
                  <div className="mb-1 flex justify-between text-sm font-bold text-muted"><span>{goal.goal}</span><span>{goal.percent}%</span></div>
                  <div className="h-3 rounded-full bg-shell"><div className="h-3 rounded-full bg-mango" style={{ width: `${Math.min(goal.percent, 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
