import { PageHeader } from "../components/Layout";
import { useAuth } from "../components/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings/Profile" subtitle="Basic account details and project constraints." />
      <section className="rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-black uppercase text-muted">Name</div>
            <div className="text-lg font-black text-ink">{user?.name}</div>
          </div>
          <div>
            <div className="text-xs font-black uppercase text-muted">Email</div>
            <div className="text-lg font-black text-ink">{user?.email}</div>
          </div>
        </div>
        <div className="mt-6 rounded-md bg-shell p-4 text-sm font-semibold leading-6 text-muted">
          BudgetAI PH uses manual input and user-provided OCR uploads only. It does not connect to GCash, Maya, BPI, bank APIs, or scraping workflows.
        </div>
      </section>
    </>
  );
}
