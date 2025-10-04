import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}

async function proxy(req: NextRequest, params: { path: string[] }) {
  const base = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE
  if (!base) return new NextResponse("API base not configured", { status: 500 })
  const url = new URL(base.replace(/\/+$/, "") + "/" + params.path.join("/"))
  url.search = new URL(req.url).search

  const headers = new Headers(req.headers)
  headers.set("host", new URL(base).host)
  // Forward bearer token if present in "Authorization" cookie-like header is not available; clients send in local fetch
  const res = await fetch(url.toString(), {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    redirect: "manual",
  })
  const body = await res.arrayBuffer()
  const out = new NextResponse(body, { status: res.status })
  res.headers.forEach((v, k) => out.headers.set(k, v))
  return out
}
