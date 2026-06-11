const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "budgetai_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = tokenStore.get();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) => request<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<{ access_token: string }>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: <T>() => request<T>("/auth/me"),
  list: <T>(path: string) => request<T[]>(path),
  create: <T>(path: string, payload: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(payload) }),
  update: <T>(path: string, id: number, payload: unknown) => request<T>(`${path}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (path: string, id: number) => request<{ ok: boolean }>(`${path}/${id}`, { method: "DELETE" }),
  dashboard: <T>(params = "") => request<T>(`/dashboard${params}`),
  insights: <T>() => request<T>("/insights/monthly"),
  scanLoan: <T>(file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<T>("/ocr/loan-screenshot", { method: "POST", body: form });
  },
};
