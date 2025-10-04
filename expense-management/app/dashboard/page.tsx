"use client"

import useSWR from "swr"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user, company, hasRole } = useAuth()
  const { data: myExpenses } = useSWR<any[]>(user ? ["/expenses/mine"] : null, () =>
    fetch("/api/_proxy/expenses?mine=true").then((r) => r.json()),
  )

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
        {company && <p className="text-muted-foreground text-sm">Company currency: {company.currency}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Submit Expense</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p className="text-muted-foreground text-sm">Create and submit new expense claims.</p>
            <Link href="/expenses/new">
              <Button size="sm">New</Button>
            </Link>
          </CardContent>
        </Card>

        {(hasRole("MANAGER") || hasRole("ADMIN")) && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-muted-foreground text-sm">Review and approve expenses.</p>
              <Link href="/approvals">
                <Button size="sm">Open</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {hasRole("ADMIN") && (
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  Users
                </Button>
              </Link>
              <Link href="/admin/rules">
                <Button variant="outline" size="sm">
                  Rules
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent My Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {(myExpenses || []).slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span>
                  {e.category} • {e.amount} {e.currency}
                </span>
                <span className="text-xs">{new Date(e.date).toLocaleDateString()}</span>
              </div>
            ))}
            {!myExpenses?.length && <p>No expenses yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
