"use client"

import { ExpenseForm } from "@/components/expense-form"

export default function NewExpensePage() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border p-6">
      <h1 className="mb-4 text-xl font-semibold">New Expense</h1>
      <ExpenseForm />
    </div>
  )
}
