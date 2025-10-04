"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function RulesAdminPage() {
  const { data: rules, mutate } = useSWR<any[]>("/api/_proxy/rules", (u) => fetch(u).then((r) => r.json()))

  const [name, setName] = useState("")
  const [sequence, setSequence] = useState<{ label: string; userId?: string; role?: string }[]>([])
  const [conditionalType, setConditionalType] = useState<"percentage" | "specific" | "hybrid" | "">("none")
  const [percentage, setPercentage] = useState("60")
  const [specificUserId, setSpecificUserId] = useState("")
  const [managerFirst, setManagerFirst] = useState(true)

  const { data: users } = useSWR<any[]>("/api/_proxy/users", (u) => fetch(u).then((r) => r.json()))

  async function saveRule() {
    const payload: any = {
      name,
      managerMustApproveFirst: managerFirst,
      sequence,
      conditional:
        conditionalType === "percentage"
          ? { type: "percentage", threshold: Number(percentage) }
          : conditionalType === "specific"
            ? { type: "specific", approverUserId: specificUserId }
            : conditionalType === "hybrid"
              ? { type: "hybrid", percentage: Number(percentage), specificUserId }
              : undefined,
    }
    await fetch("/api/_proxy/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setName("")
    setSequence([])
    setConditionalType("none")
    setPercentage("60")
    setSpecificUserId("")
    setManagerFirst(true)
    await mutate()
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Create Approval Rule</h2>
        <div className="grid gap-3">
          <Input placeholder="Rule name" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="grid gap-2">
            <div className="text-sm font-medium">Sequence Approvers</div>
            {sequence.map((s, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Label (e.g., Manager)"
                  value={s.label}
                  onChange={(e) => {
                    const cp = [...sequence]
                    cp[idx].label = e.target.value
                    setSequence(cp)
                  }}
                />
                <Select
                  value={s.role || ""}
                  onValueChange={(v) => {
                    const cp = [...sequence]
                    cp[idx].role = v || undefined
                    setSequence(cp)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                    <SelectItem value="FINANCE">FINANCE</SelectItem>
                    <SelectItem value="DIRECTOR">DIRECTOR</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={s.userId || ""}
                  onValueChange={(v) => {
                    const cp = [...sequence]
                    cp[idx].userId = v || undefined
                    setSequence(cp)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Specific user (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {(users || []).map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button variant="outline" onClick={() => setSequence([...sequence, { label: "" }])}>
              Add Step
            </Button>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Conditional Rule</div>
            <Select value={conditionalType} onValueChange={(v) => setConditionalType(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select conditional type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="specific">Specific approver</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {(conditionalType === "percentage" || conditionalType === "hybrid") && (
              <Input
                type="number"
                min={1}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Threshold %"
              />
            )}
            {(conditionalType === "specific" || conditionalType === "hybrid") && (
              <Select value={specificUserId} onValueChange={setSpecificUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select required approver" />
                </SelectTrigger>
                <SelectContent>
                  {(users || []).map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={managerFirst} onChange={(e) => setManagerFirst(e.target.checked)} />
            Manager must approve first
          </label>

          <Button onClick={saveRule}>Save Rule</Button>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Existing Rules</h2>
        <div className="space-y-3 text-sm">
          {(rules || []).map((r) => (
            <div key={r.id} className="rounded border p-3">
              <div className="font-medium">{r.name}</div>
              <div className="text-muted-foreground">Manager first: {r.managerMustApproveFirst ? "Yes" : "No"}</div>
              {r.sequence?.length ? (
                <div>Sequence: {r.sequence.map((s: any) => s.label || s.role || s.userId).join(" → ")}</div>
              ) : null}
              {r.conditional?.type && <div>Conditional: {JSON.stringify(r.conditional)}</div>}
            </div>
          ))}
          {!rules?.length && <p>No rules yet.</p>}
        </div>
      </div>
    </div>
  )
}
