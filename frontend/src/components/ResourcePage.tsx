import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { api } from "../lib/api";
import { peso } from "../lib/format";
import { PageHeader } from "./Layout";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea" | "checkbox";
  options?: string[];
};

type ResourcePageProps<T extends { id: number }> = {
  title: string;
  subtitle: string;
  path: string;
  fields: Field[];
  columns: { key: keyof T | string; label: string; money?: boolean; render?: (item: T) => ReactNode }[];
  initial: Record<string, unknown>;
};

export function ResourcePage<T extends { id: number }>({ title, subtitle, path, fields, columns, initial }: ResourcePageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(initial);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await api.list<T>(path));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, [path]);

  const titleText = useMemo(() => (editing ? `Edit ${title}` : `Add ${title}`), [editing, title]);

  function startCreate() {
    setForm(initial);
    setEditing(null);
    setOpen(true);
  }

  function startEdit(item: T) {
    setForm(item as Record<string, unknown>);
    setEditing(item);
    setOpen(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    const payload = Object.fromEntries(Object.entries(form).filter(([key]) => key !== "id"));
    try {
      if (editing) await api.update<T>(path, editing.id, payload);
      else await api.create<T>(path, payload);
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save record");
    }
  }

  async function remove(id: number) {
    await api.remove(path, id);
    await load();
  }

  return (
    <div className="motion-page">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <PageHeader title={title} subtitle={subtitle} />
          <div className="mt-3 inline-flex rounded-md border border-line bg-white px-3 py-1.5 text-xs font-black uppercase text-muted shadow-soft">
            {loading ? "Loading records" : `${items.length} saved record${items.length === 1 ? "" : "s"}`}
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white shadow-soft" onClick={startCreate}>
          <Plus size={17} /> Add
        </button>
      </div>
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <div className="motion-rise overflow-hidden rounded-md border border-line bg-white shadow-soft">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-muted">
              <tr>
                {columns.map((col) => <th key={String(col.key)} className="px-4 py-3 font-black">{col.label}</th>)}
                <th className="w-28 px-4 py-3 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  {columns.map((col) => {
                    const value = col.render ? col.render(item) : (item as Record<string, unknown>)[String(col.key)];
                    return <td key={String(col.key)} className="px-4 py-3 font-medium text-ink">{col.money ? peso(Number(value || 0)) : String(value ?? "")}</td>;
                  })}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded-md p-2 text-muted hover:bg-shell hover:text-brand" onClick={() => startEdit(item)} title="Edit"><Edit2 size={16} /></button>
                      <button className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-coral" onClick={() => remove(item.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !items.length && (
                <tr><td className="px-4 py-10 text-center font-semibold text-muted" colSpan={columns.length + 1}>No records yet. Add one to make this page useful in the demo.</td></tr>
              )}
              {loading && (
                <tr><td className="px-4 py-10 text-center font-semibold text-muted" colSpan={columns.length + 1}><span className="mx-auto block h-3 w-40 rounded-full skeleton-shimmer" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/30 p-4">
          <form onSubmit={save} className="motion-rise w-full max-w-2xl rounded-md bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-black text-ink">{titleText}</h2>
              <button type="button" className="rounded-md p-2 text-muted hover:bg-shell" onClick={() => setOpen(false)} title="Close"><X size={18} /></button>
            </div>
            <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block text-xs font-black uppercase text-muted">{field.label}</span>
                  {field.type === "select" ? (
                    <select className="w-full rounded-md border border-line px-3 py-2" value={String(form[field.name] ?? "")} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                      {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea className="min-h-24 w-full rounded-md border border-line px-3 py-2" value={String(form[field.name] ?? "")} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
                  ) : field.type === "checkbox" ? (
                    <input className="h-5 w-5 rounded border-line" type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })} />
                  ) : (
                    <input className="w-full rounded-md border border-line px-3 py-2" type={field.type || "text"} value={String(form[field.name] ?? "")} onChange={(e) => setForm({ ...form, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })} required={field.name !== "notes"} />
                  )}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
              <button type="button" className="rounded-md border border-line px-4 py-2 text-sm font-bold text-muted" onClick={() => setOpen(false)}>Cancel</button>
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
