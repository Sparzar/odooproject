"use client"

import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const roles = ["ADMIN", "MANAGER", "EMPLOYEE"] as const

export default function UsersAdminPage() {
  const { data: users, mutate } = useSWR<any[]>("/api/_proxy/users", (u) => fetch(u).then((r) => r.json()))
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "EMPLOYEE", password: "" })

  async function updateUser(id: string, payload: any) {
    await fetch(`/api/_proxy/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    await mutate()
  }

  async function createUser() {
    await fetch(`/api/_proxy/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
    setNewUser({ email: "", name: "", role: "EMPLOYEE", password: "" })
    await mutate()
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Create User</h2>
        <div className="grid grid-cols-4 gap-2">
          <Input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Input
            placeholder="Temp Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <Button onClick={createUser}>Create</Button>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Users</h2>
        <div className="space-y-3">
          {(users || []).map((u) => (
            <div key={u.id} className="grid grid-cols-5 items-center gap-2">
              <div className="col-span-2">
                <div className="font-medium">{u.email}</div>
                <div className="text-xs text-muted-foreground">{u.name || "-"}</div>
              </div>
              <Select value={u.role} onValueChange={(v) => updateUser(u.id, { role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={u.managerId || "none"}
                onValueChange={(v) => updateUser(u.id, { managerId: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {(users || [])
                    .filter((x) => x.role === "MANAGER")
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="text-muted-foreground text-xs">Company: {u.companyId || "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
