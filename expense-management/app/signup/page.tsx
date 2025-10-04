"use client"

import type React from "react"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { apiCreateCompany } from "@/lib/api"
import { useRouter } from "next/navigation"

type Country = { name: string; code: string; currency: string }

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const { data: countries } = useSWR<Country[]>("/api/countries", (url) => fetch(url).then((r) => r.json()))
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    countryCode: "",
    currency: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (countries && countries.length && !form.countryCode) {
      setForm((f) => ({ ...f, countryCode: countries[0].code, currency: countries[0].currency }))
    }
  }, [countries])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signup(form.email, form.password, form.name)
      // Auto-create company in selected country's currency
      await apiCreateCompany({
        name: form.companyName || `${form.name}'s Company`,
        countryCode: form.countryCode,
        currency: form.currency,
      })
      router.replace("/dashboard")
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border p-6">
      <h1 className="mb-4 text-xl font-semibold">Sign up</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          placeholder="Company name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm">Country</label>
            <Select
              value={form.countryCode}
              onValueChange={(v) => {
                const c = countries?.find((x) => x.code === v)
                setForm((f) => ({ ...f, countryCode: v, currency: c?.currency || f.currency }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {(countries || []).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Company currency</label>
            <Input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  )
}
