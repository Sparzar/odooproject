import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const base = searchParams.get("base") || "USD"
  const url = `https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(base)}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return new NextResponse("Failed to fetch rates", { status: 500 })
  const data = await res.json()
  return NextResponse.json(data)
}
