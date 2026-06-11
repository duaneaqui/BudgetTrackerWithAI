import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Bot, Coins, Database, Home, LogOut, PiggyBank, Receipt, Repeat, ScanLine, Settings, WalletCards } from "lucide-react";
import { useAuth } from "./AuthContext";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/income", label: "Income", icon: WalletCards },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/recurring", label: "Bills", icon: Repeat },
  { to: "/loans", label: "Loans", icon: Coins },
  { to: "/scanner", label: "Scanner", icon: ScanLine },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/local-costs", label: "Prices", icon: Database },
  { to: "/insights", label: "AI Insights", icon: Bot },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Profile", icon: Settings },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-shell lg:flex">
      <aside className="border-b border-line bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <div>
            <div className="text-xl font-black text-ink">BudgetAI PH</div>
            <div className="text-xs font-medium text-muted">Manual finance tracker</div>
          </div>
          <button
            className="rounded-md p-2 text-muted hover:bg-shell hover:text-coral lg:hidden"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-brand text-white" : "text-muted hover:bg-shell hover:text-ink"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-line p-4 lg:block">
          <div className="mb-3 rounded-md bg-shell p-3">
            <div className="text-sm font-bold text-ink">{user?.name}</div>
            <div className="truncate text-xs text-muted">{user?.email}</div>
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-muted hover:border-coral hover:text-coral"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">{title}</h1>
      {subtitle && <p className="max-w-3xl text-sm font-medium text-muted">{subtitle}</p>}
    </div>
  );
}
