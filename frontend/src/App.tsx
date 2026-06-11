import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Layout } from "./components/Layout";
import { Login, Register } from "./pages/AuthPages";
import { Dashboard } from "./pages/Dashboard";
import { ExpensesPage, IncomePage, LoansPage, LocalCostsPage, RecurringPage, SavingsPage } from "./pages/Trackers";
import { ScannerPage } from "./pages/Scanner";
import { InsightsPage } from "./pages/Insights";
import { ReportsPage } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";

function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-shell font-black text-brand">Loading BudgetAI PH...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Protected />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/local-costs" element={<LocalCostsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
