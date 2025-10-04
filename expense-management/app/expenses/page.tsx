"use client"

import useSWR from "swr"

export default function MyExpensesPage() {
  const { data, isLoading, error, mutate } = useSWR<any[]>("/api/_proxy/expenses?mine=true", (u) =>
    fetch(u).then((r) => r.json()),
  )

  return (
    <div className="rounded-lg border p-6">
      <h1 className="mb-4 text-xl font-semibold">My Expenses</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load</p>}
      <div className="divide-y">
        {(data || []).map((e) => (
          <div key={e.id} className="flex items-center justify-between py-3">
            <div className="text-sm">
              <div className="font-medium">
                {e.category} — {e.amount} {e.currency}
              </div>
              <div className="text-muted-foreground">
                {new Date(e.date).toLocaleDateString()} • {e.status}
              </div>
            </div>
            {e.receiptUrl && (
              <a className="text-xs underline" href={e.receiptUrl} target="_blank" rel="noreferrer">
                Receipt
              </a>
            )}
          </div>
        ))}
        {!isLoading && !data?.length && <p>No expenses found.</p>}
      </div>
    </div>
  )
}
