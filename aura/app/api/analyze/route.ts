import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const VIBES = [
  "Streetwear Icon", "Cyberpunk Royalty", "Soft Aesthetic Queen",
  "Dark Academia", "Y2K Legend", "Clean Girl Era", "Cottagecore Soul",
  "Business Baddie", "Festival Goddess", "Minimalist Slayer",
]

function pickVibe(scores: number[]): string {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  if (avg >= 90) return VIBES[Math.floor(Math.random() * 3)]
  if (avg >= 75) return VIBES[3 + Math.floor(Math.random() * 4)]
  return VIBES[7 + Math.floor(Math.random() * 3)]
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: "API not configured" }, { status: 500 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const form = await req.formData()
    const image = form.get("image") as File
    const occasion = (form.get("occasion") as string) || "Casual"
    const mode = (form.get("mode") as string) || "standard"

    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 })

    // Upload image to Supabase Storage
    const ext = image.type.split("/")[1] || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
    const buffer = await image.arrayBuffer()
    const uint8 = new Uint8Array(buffer)

    const { data: uploadData } = await supabase.storage
      .from("outfit-images")
      .upload(filename, uint8, { contentType: image.type, upsert: false })

    const image_url = uploadData?.path
      ? supabase.storage.from("outfit-images").getPublicUrl(uploadData.path).data.publicUrl
      : ""

    // Call Claude Vision
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = image.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif"

    const modeInstructions = mode === "roast"
      ? "Be brutally honest and slightly savage but still helpful. Don't hold back on criticism."
      : mode === "glam"
      ? "Judge this as if it's a red carpet event. Apply very high fashion standards."
      : "Give a balanced, encouraging but honest assessment."

    const systemPrompt = `You are AURA, an elite AI fashion critic and style analyst. ${modeInstructions}
Return ONLY valid JSON — no markdown, no extra text.`

    const userPrompt = `Analyze this outfit for a "${occasion}" occasion.

Return ONLY valid JSON:
{
  "total_score": <0-100 integer>,
  "style_score": <0-100 integer>,
  "color_score": <0-100 integer>,
  "originality_score": <0-100 integer>,
  "impact_score": <0-100 integer>,
  "ai_tip": "<one specific, actionable style tip — 1 sentence>",
  "ai_review": "<2-3 sentence enthusiastic review — shareable, specific>"
}`

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text", text: userPrompt },
          ],
        }],
      }),
    })

    const aiData = await aiResponse.json()
    const raw = aiData.content?.[0]?.text ?? ""
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response")

    const scores = JSON.parse(jsonMatch[0])
    const vibeLabel = pickVibe([scores.style_score, scores.color_score, scores.originality_score, scores.impact_score])
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    const rating = {
      id,
      image_url,
      total_score: scores.total_score,
      vibe_label: vibeLabel,
      style_score: scores.style_score,
      color_score: scores.color_score,
      originality_score: scores.originality_score,
      impact_score: scores.impact_score,
      ai_tip: scores.ai_tip,
      occasion,
    }

    // Save to Supabase
    await supabase.from("ratings").insert(rating)

    return NextResponse.json({ id, rating })
  } catch (err) {
    console.error("Analyze error:", (err as Error).message)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ rating: data })
}
