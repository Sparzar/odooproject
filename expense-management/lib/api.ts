// Update NEXT_PUBLIC_API_BASE to your backend base URL (e.g., https://api.example.com or http://localhost:4000)

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

const BASE = process.env.NEXT_PUBLIC_API_BASE || ""

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

async function request<T>(path: string, opts: { method?: HttpMethod; body?: any; formData?: FormData } = {}) {
  const headers: HeadersInit = {}
  const token = getToken()
  if (!opts.formData) headers["Content-Type"] = "application/json"
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers: opts.formData ? { Authorization: headers["Authorization"] as string } : headers,
    body: opts.formData ? opts.formData : opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: "include",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}

// Auth
export async function apiSignup(payload: { email: string; password: string; name?: string }) {
  // Adjust to your backend: e.g., POST /auth/signup
  return request<{ token: string; user: any }>("/auth/signup", { method: "POST", body: payload })
}
export async function apiLogin(payload: { email: string; password: string }) {
  // Adjust to your backend: e.g., POST /auth/login
  return request<{ token: string; user: any }>("/auth/login", { method: "POST", body: payload })
}
export async function apiMe() {
  // Adjust to your backend: e.g., GET /auth/me
  return request<any>("/auth/me")
}
export function setToken(token?: string | null) {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem("auth_token", token)
  else localStorage.removeItem("auth_token")
}

// Company
export async function apiCreateCompany(payload: { name: string; countryCode: string; currency: string }) {
  // Adjust to your backend: e.g., POST /companies
  return request<any>("/companies", { method: "POST", body: payload })
}
export async function apiGetCompanyMine() {
  // Adjust to your backend: e.g., GET /companies/me
  return request<any>("/companies/me")
}

// Users & Roles
export async function apiListUsers() {
  // Adjust: GET /users
  return request<any[]>("/users")
}
export async function apiUpdateUser(id: string, payload: { role?: string; managerId?: string | null }) {
  // Adjust: PATCH /users/:id
  return request<any>(`/users/${id}`, { method: "PATCH", body: payload })
}
export async function apiCreateUser(payload: {
  email: string
  name?: string
  role?: string
  managerId?: string | null
  password?: string
}) {
  // Adjust: POST /users
  return request<any>("/users", { method: "POST", body: payload })
}

// Expenses
export async function apiCreateExpense(form: FormData) {
  // Adjust: POST /expenses (multipart/form-data supported)
  return request<any>("/expenses", { method: "POST", formData: form })
}
export async function apiListMyExpenses() {
  // Adjust: GET /expenses?mine=true
  return request<any[]>("/expenses?mine=true")
}
export async function apiListPendingApprovals() {
  // Adjust: GET /approvals/pending
  return request<any[]>("/approvals/pending")
}
export async function apiApprovalAction(
  expenseId: string,
  payload: { action: "approve" | "reject"; comment?: string },
) {
  // Adjust: POST /approvals/:expenseId
  return request<any>(`/approvals/${expenseId}`, { method: "POST", body: payload })
}

// Rules
export async function apiListRules() {
  // Adjust: GET /rules
  return request<any[]>("/rules")
}
export async function apiCreateOrUpdateRule(payload: any) {
  // Adjust: POST /rules or PUT /rules/:id
  const method = payload?.id ? "PUT" : "POST"
  const path = payload?.id ? `/rules/${payload.id}` : "/rules"
  return request<any>(path, { method, body: payload })
}
