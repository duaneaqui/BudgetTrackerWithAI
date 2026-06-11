import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAuth } from "../components/AuthContext";

function AuthShell({ mode }: { mode: "login" | "register" }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "demo@budgetai.ph" : "");
  const [password, setPassword] = useState(mode === "login" ? "password123" : "");
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
    <div className="grid min-h-screen bg-shell lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-black text-brand shadow-soft">
            <LockKeyhole size={17} /> BudgetAI PH
          </div>
          <h1 className="mb-2 text-3xl font-black text-ink">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mb-8 text-sm font-medium text-muted">A portfolio-ready personal finance tracker for manual budgeting, bills, loans, savings, and OCR-assisted loan screenshots.</p>
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
          {["Manual entries", "Rule-based AI", "OCR fallback", "Peso-first"].map((item) => (
            <div key={item} className="rounded-md border border-white/15 bg-white/10 p-5">
              <div className="text-2xl font-black text-mango">0</div>
              <div className="text-sm font-bold">{item}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-4 h-2 w-24 rounded-full bg-mango" />
          <h2 className="max-w-lg text-4xl font-black">Built for Filipino cash flow, without paid bank integrations.</h2>
        </div>
      </section>
    </div>
  );
}

export const Login = () => <AuthShell mode="login" />;
export const Register = () => <AuthShell mode="register" />;
