import { useState } from "react";
import { ScanLine, Upload } from "lucide-react";
import { PageHeader } from "../components/Layout";
import { api } from "../lib/api";
import { today } from "../lib/format";

type OcrResult = {
  raw_text: string;
  provider?: string;
  amount_due?: number;
  remaining_balance?: number;
  original_amount?: number;
  monthly_payment?: number;
  due_date?: string;
  interest_or_fees?: number;
  status: string;
};

export function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<OcrResult | null>(null);
  const [message, setMessage] = useState("");

  async function scan() {
    if (!file) return;
    setResult(await api.scanLoan<OcrResult>(file));
  }

  async function saveLoan() {
    if (!result) return;
    await api.create("/loans", {
      provider: result.provider || "Other",
      loan_type: "OCR confirmed",
      original_amount: result.original_amount || result.remaining_balance || 0,
      remaining_balance: result.remaining_balance || 0,
      monthly_payment: result.monthly_payment || result.amount_due || 0,
      interest_or_fees: result.interest_or_fees || 0,
      due_date: result.due_date || today(),
      status: result.status || "active",
      notes: `Confirmed from OCR. Raw text: ${result.raw_text}`,
    });
    setMessage("Loan saved after confirmation.");
  }

  return (
    <>
      <PageHeader title="Loan Screenshot Scanner" subtitle="Upload a user-provided screenshot, review extracted fields, edit if needed, then save manually." />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-line bg-shell p-6 text-center">
            <Upload className="mb-3 text-brand" size={32} />
            <span className="font-black text-ink">Upload loan screenshot</span>
            <span className="text-sm font-medium text-muted">PNG, JPG, or WEBP. OCR falls back to mock parsing if Tesseract is unavailable.</span>
            <input className="hidden" type="file" accept="image/*" onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              setFile(selected);
              setPreview(selected ? URL.createObjectURL(selected) : "");
              setResult(null);
            }} />
          </label>
          {preview && <img className="mt-4 max-h-80 w-full rounded-md object-contain" src={preview} alt="Uploaded screenshot preview" />}
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 font-black text-white" onClick={scan} disabled={!file}>
            <ScanLine size={18} /> Scan Loan
          </button>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-black text-ink">Confirmation form</h2>
          {!result ? <p className="text-sm font-medium text-muted">Scanned fields will appear here. Nothing is auto-saved.</p> : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(["provider", "amount_due", "remaining_balance", "original_amount", "monthly_payment", "due_date", "interest_or_fees", "status"] as const).map((key) => (
                <label key={key}>
                  <span className="mb-1 block text-xs font-black uppercase text-muted">{key.replaceAll("_", " ")}</span>
                  <input className="w-full rounded-md border border-line px-3 py-2" value={String(result[key] ?? "")} onChange={(e) => setResult({ ...result, [key]: key.includes("amount") || key.includes("balance") || key.includes("payment") || key.includes("fees") ? Number(e.target.value) : e.target.value })} />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="mb-1 block text-xs font-black uppercase text-muted">Raw OCR text</span>
                <textarea className="min-h-32 w-full rounded-md border border-line px-3 py-2" value={result.raw_text} onChange={(e) => setResult({ ...result, raw_text: e.target.value })} />
              </label>
              <button className="rounded-md bg-brand px-4 py-3 font-black text-white sm:col-span-2" onClick={saveLoan}>Save Loan</button>
              {message && <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 sm:col-span-2">{message}</div>}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
