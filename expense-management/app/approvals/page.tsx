"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function ApprovalsPage() {
  const { data, isLoading, error, mutate } = useSWR<any[]>("/api/_proxy/approvals/pending", (u) =>
    fetch(u).then((r) => r.json()),
  )
  const [comments, setComments] = useState<Record<string, string>>({})

  async function act(expenseId: string, action: "approve" | "reject") {
    const res = await fetch(`/api/_proxy/approvals/${expenseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comment: comments[expenseId] || "" }),
    })
    if (!res.ok) {
      alert("Action failed")
      return
    }
    await mutate()
  }

  return (
    <div className="rounded-lg border p-6">
      <h1 className="mb-4 text-xl font-semibold">Pending Approvals</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load</p>}
      <div className="space-y-4">
        {(data || []).map((e) => (
          <div key={e.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {e.category} • {e.amount} {e.currency}
                </div>
                <div className="text-xs text-muted-foreground">
                  By {e.user?.email || e.userId} • {new Date(e.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-xs">
                Step {e.step} / {e.totalSteps}
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              <Textarea
                placeholder="Optional comment"
                value={comments[e.id] || ""}
                onChange={(ev) => setComments((s) => ({ ...s, [e.id]: ev.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={() => act(e.id, "approve")}>Approve</Button>
                <Button variant="destructive" onClick={() => act(e.id, "reject")}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && !data?.length && <p>No pending approvals.</p>}
      </div>
    </div>
  )
}
