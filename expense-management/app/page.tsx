"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace("/dashboard")
  }, [user, router])

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border p-5">
        <h1 className="text-2xl font-semibold text-balance">Expense Management</h1>
        <p className="text-muted-foreground text-pretty">
          Submit expenses, define multi-level approvals, and manage flexible approval rules.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign up</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-lg border p-5">
        <h2 className="text-lg font-medium">Spec (from your image)</h2>
        <Image
          src="/images/problem-statement.png"
          alt="Expense Management spec"
          width={1024}
          height={2700}
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  )
}
