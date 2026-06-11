import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { AlertTriangle, Bot, Lightbulb, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/Layout";
import { api } from "../lib/api";
import { peso } from "../lib/format";
import type { InsightResponse } from "../types/api";

function Panel({ title, icon: Icon, items, tone = "default" }: { title: string; icon: ElementType; items: string[]; tone?: "default" | "warn" | "good" }) {
  const cls = tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-900" : tone === "good" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-line bg-white text-ink";
  return (
    <section className={`rounded-md border p-5 shadow-soft ${cls}`}>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-black"><Icon size={20} /> {title}</h2>
      <div className="space-y-3">
        {items.length ? items.map((item, index) => <p key={index} className="text-sm font-semibold leading-6">{item}</p>) : <p className="text-sm font-semibold">No items right now.</p>}
      </div>
    </section>
  );
}

export function InsightsPage() {
  const [data, setData] = useState<InsightResponse | null>(null);
  useEffect(() => {
    api.insights<InsightResponse>().then(setData);
  }, []);

  if (!data) return <PageHeader title="AI Insights" subtitle="Loading rule-based budget advice..." />;

  return (
    <>
      <PageHeader title="AI Budget Advisor" subtitle="Rule-based insights with no paid AI API keys required. Designed so OpenAI, Gemini, or Ollama can be added later." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Summary" icon={Bot} items={data.summary} />
        <Panel title="Warnings" icon={AlertTriangle} items={data.warnings} tone="warn" />
        <Panel title="Recommendations" icon={Lightbulb} items={data.recommendations} tone="good" />
      </div>
      <section className="mt-4 rounded-md border border-line bg-white p-5 shadow-soft">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-ink"><TrendingUp size={20} /> Forecast</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.forecast).map(([key, value]) => (
            <div key={key} className="rounded-md bg-shell p-4">
              <div className="text-xs font-black uppercase text-muted">{key.replaceAll("_", " ")}</div>
              <div className="mt-1 text-xl font-black text-ink">{peso(Number(value))}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
