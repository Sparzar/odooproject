"use client"

import type React from "react"

import { createContext, useContext, useMemo, useState, useEffect } from "react"
import useSWR from "swr"
import { apiLogin, apiMe, apiSignup, setToken, apiGetCompanyMine } from "@/lib/api"
import type { AuthMe, Role, User, Company } from "@/lib/types"

type AuthContextValue = {
  user: User | null
  company: Company | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState<string | null>(null)

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    setTok(t)
  }, [])

  const { data, isLoading, mutate } = useSWR<AuthMe>(
    token ? ["/auth/me", token] : null,
    async () => {
      const me = await apiMe()
      const company = await apiGetCompanyMine().catch(() => null)
      return {
        token,
        user: me?.user || me,
        company,
      }
    },
    { revalidateOnFocus: false },
  )

  async function login(email: string, password: string) {
    const res = await apiLogin({ email, password })
    setToken(res.token)
    setTok(res.token)
    await mutate()
  }

  async function signup(email: string, password: string, name?: string) {
    const res = await apiSignup({ email, password, name })
    setToken(res.token)
    setTok(res.token)
    await mutate()
  }

  function logout() {
    setToken(null)
    setTok(null)
    mutate(undefined, { revalidate: false })
  }

  function hasRole(...roles: Role[]) {
    if (!data?.user) return false
    return roles.includes((data.user.role as Role) || "EMPLOYEE")
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user: (data?.user as User) || null,
      company: (data?.company as Company) || null,
      token,
      loading: isLoading,
      login,
      signup,
      refresh: async () => {
        await mutate()
      },
      logout,
      hasRole,
    }),
    [data, token, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
