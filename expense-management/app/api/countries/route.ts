import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,cca2", { cache: "force-cache" })
  const data = await res.json()
  const list = (data || [])
    .map((c: any) => {
      const currency = c?.currencies ? Object.keys(c.currencies)[0] : undefined
      return currency ? { name: c?.name?.common, code: c?.cca2, currency } : null
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
  return NextResponse.json(list)
}
