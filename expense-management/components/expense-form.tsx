"use client"

import type React from "react"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { extractTextFromImage, parseExpenseFromText } from "@/lib/ocr"
import { apiCreateExpense } from "@/lib/api"
import { useAuth } from "./auth-provider"

type Country = { name: string; code: string; currency: string }

export function ExpenseForm() {
  const { company } = useAuth()
  const { data: countries } = useSWR<Country[]>("/api/countries", (u) => fetch(u).then((r) => r.json()))
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    amount: "",
    currency: company?.currency || "USD",
    category: "",
    description: "",
    date: "",
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { data: rates } = useSWR(form.currency ? `/api/rates?base=${form.currency}` : null, (u) =>
    fetch(u).then((r) => r.json()),
  )

  const convertedToCompany = useMemo(() => {
    if (!company?.currency || !rates?.rates) return null
    const rate = rates.rates[company.currency]
    const amt = Number.parseFloat(form.amount)
    if (!rate || isNaN(amt)) return null
    return (amt * rate).toFixed(2)
  }, [form.amount, rates, company?.currency])

  async function onOCR() {
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const text = await extractTextFromImage(file)
      const parsed = parseExpenseFromText(text)
      setForm((f) => ({
        ...f,
        amount: parsed.amount ? String(parsed.amount) : f.amount,
        description: parsed.description || f.description,
        date: parsed.date || f.date,
      }))
      setMessage("OCR extracted details. Please review and submit.")
    } catch (e: any) {
      setMessage(e.message || "OCR failed")
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const fd = new FormData()
      fd.append("amount", form.amount)
      fd.append("currency", form.currency)
      fd.append("category", form.category)
      fd.append("description", form.description)
      fd.append("date", form.date)
      if (file) fd.append("receipt", file)
      await apiCreateExpense(fd)
      setMessage("Expense submitted!")
      setForm({ amount: "", currency: company?.currency || "USD", category: "", description: "", date: "" })
      setFile(null)
    } catch (e: any) {
      setMessage(e.message || "Submit failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm">Amount</label>
          <Input
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 45.99"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Currency</label>
          <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {/* prefer unique currencies from countries list */}
              {Array.from(new Set((countries || []).map((c) => c.currency))).map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {convertedToCompany && (
        <p className="text-xs text-muted-foreground">
          Company currency ({company?.currency}): ~{convertedToCompany}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm">Category</label>
          <Input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Travel, Meals"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Date</label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Add details"
        />
      </div>

      <div className="grid gap-2">
        <label className="mb-1 block text-sm">Receipt (optional)</label>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onOCR} disabled={!file || busy}>
            OCR Auto-fill
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Submitting..." : "Submit Expense"}
          </Button>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </form>
  )
}
