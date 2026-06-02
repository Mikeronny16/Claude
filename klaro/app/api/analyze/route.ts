import { NextRequest, NextResponse } from "next/server"
import { analyzeDocument } from "@/lib/claude"
import { insertDocument } from "@/lib/supabase"
import { randomUUID } from "crypto"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const lang = (formData.get("lang") as "en" | "mm") || "en"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // For PDFs: convert first page to image (via canvas on client)
    // For now: only support images directly
    if (file.type === "application/pdf") {
      return NextResponse.json(
        { error: "PDF support coming soon. Please take a photo or screenshot." },
        { status: 400 }
      )
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mediaType = file.type

    // Run Claude analysis
    const analysis = await analyzeDocument(base64, mediaType, lang)

    // Save to Supabase
    const id = randomUUID()
    await insertDocument({
      id,
      lang,
      filename: file.name || "document",
      analysis: analysis as unknown as Record<string, unknown>,
    })

    return NextResponse.json({ id })
  } catch (err) {
    console.error("Analyze error:", err)
    const msg = (err as Error).message || "Analysis failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
