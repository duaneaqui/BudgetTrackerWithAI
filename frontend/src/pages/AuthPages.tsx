import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clipboard, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../components/AuthContext";

const demoEmail = "demo@budgetai.ph";
const demoPassword = "password123";

function AuthShell({ mode }: { mode: "login" | "register" }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? demoEmail : "");
  const [password, setPassword] = useState(mode === "login" ? demoPassword : "");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <div className="grid min-h-screen bg-shell lg:grid-cols-[1.02fr_0.98fr]">
      <section className="flex items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-black text-brand shadow-soft">
            <LockKeyhole size={17} /> BudgetAI PH
          </div>
          <h1 className="mb-2 text-3xl font-black text-ink">{mode === "login" ? "Explore the live demo" : "Create your account"}</h1>
          <p className="mb-5 text-sm font-medium leading-6 text-muted">A portfolio-ready finance tracker for manual budgeting, bills, loans, savings, local costs, and OCR-assisted loan screenshots.</p>
          {mode === "login" && (
            <div className="mb-6 rounded-md border border-brand/25 bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
                <Sparkles size={17} className="text-mango" /> Employer demo access
              </div>
              <div className="grid gap-2 text-sm">
                <button
                  type="button"
                  className="flex items-center justify-between rounded-md border border-line bg-shell px-3 py-2 text-left font-bold text-ink hover:border-brand"
                  onClick={() => setEmail(demoEmail)}
                >
                  <span>Email: {demoEmail}</span>
                  <Clipboard size={15} className="text-muted" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between rounded-md border border-line bg-shell px-3 py-2 text-left font-bold text-ink hover:border-brand"
                  onClick={() => setPassword(demoPassword)}
                >
                  <span>Password: {demoPassword}</span>
                  <Clipboard size={15} className="text-muted" />
                </button>
              </div>
              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-black text-brand hover:bg-brand hover:text-white"
                onClick={() => {
                  setEmail(demoEmail);
                  setPassword(demoPassword);
                }}
              >
                <CheckCircle2 size={16} /> Fill demo credentials
              </button>
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase text-muted">Name</span>
                <input className="w-full rounded-md border border-line px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-muted">Email</span>
              <input className="w-full rounded-md border border-line px-4 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-muted">Password</span>
              <input className="w-full rounded-md border border-line px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 font-black text-white shadow-soft">
              {mode === "login" ? "Log in" : "Register"} <ArrowRight size={18} />
            </button>
          </form>
          <p className="mt-5 text-sm font-medium text-muted">
            {mode === "login" ? "Need an account? " : "Already registered? "}
            <Link className="font-black text-brand" to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Register" : "Log in"}</Link>
          </p>
        </div>
      </section>
      <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="grid grid-cols-2 gap-4">
          {[
            ["10+", "Tracker pages"],
            ["0", "Paid API keys"],
            ["100%", "Manual control"],
            ["PHP", "Peso-first"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-md border border-white/15 bg-white/10 p-5">
              <div className="text-2xl font-black text-mango">{value}</div>
              <div className="text-sm font-bold">{label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-4 h-2 w-24 rounded-full bg-mango" />
          <h2 className="max-w-lg text-4xl font-black">Built for Filipino cash flow, without paid bank integrations.</h2>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-white/80">
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-mango" /> No GCash, Maya, BPI, or bank auto-sync.</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-mango" /> OCR uploads require user confirmation before saving.</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-mango" /> Rule-based insights work without AI API keys.</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Login = () => <AuthShell mode="login" />;
export const Register = () => <AuthShell mode="register" />;
