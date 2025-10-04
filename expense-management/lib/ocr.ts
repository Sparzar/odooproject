"use client"

import Tesseract from "tesseract.js"

export async function extractTextFromImage(file: File): Promise<string> {
  const { data } = await Tesseract.recognize(file, "eng", { logger: () => {} })
  return data.text || ""
}

export function parseExpenseFromText(text: string) {
  // very naive parsing heuristics; adjust per your receipts format
  const amountMatch = text.match(/(\b|\$)(\d+[.,]\d{2})/)
  const dateMatch = text.match(/\b(\d{2}[/-]\d{2}[/-]\d{2,4})\b|\b(\d{4}[/-]\d{2}[/-]\d{2})\b/)
  const merchantMatch =
    text
      .split("\n")
      .map((s) => s.trim())
      .find((s) => /store|restaurant|market|shop|cafe|hotel/i.test(s)) || ""
  return {
    amount: amountMatch ? Number.parseFloat(amountMatch[2].replace(",", ".")) : undefined,
    date: dateMatch ? (dateMatch[0] || "").replace(/\./g, "-").replace(/\//g, "-") : undefined,
    merchant: merchantMatch || "",
    description: text.slice(0, 200),
  }
}
