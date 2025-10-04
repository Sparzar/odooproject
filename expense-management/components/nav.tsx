"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className={active ? "underline underline-offset-4" : ""}>
      {label}
    </Link>
  )
}

export function TopNav() {
  const { user, hasRole, logout } = useAuth()
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Expense Mgmt
          </Link>
          {user && (
            <>
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/expenses" label="My Expenses" />
              <NavLink href="/expenses/new" label="New Expense" />
              {(hasRole("MANAGER") || hasRole("ADMIN")) && <NavLink href="/approvals" label="Approvals" />}
              {hasRole("ADMIN") && (
                <>
                  <NavLink href="/admin/users" label="Users" />
                  <NavLink href="/admin/rules" label="Rules" />
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
