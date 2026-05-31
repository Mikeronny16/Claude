import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const STYLE_IMAGES: Record<string, string[]> = {
  streetwear: [
    "photo-1552374196-1ab2a1c593e8","photo-1523398002811-999ca8dec234",
    "photo-1556906781-9a412961a28c","photo-1542291026-7eec264c27ff",
  ],
  minimalist: [
    "photo-1515886657613-9f3515b0c78f","photo-1539109136881-3be0616acf4b",
    "photo-1490481651871-ab68de25d43d","photo-1509631179647-0177331693ae",
  ],
  romantic: [
    "photo-1483985988355-763728e1935b","photo-1469334031218-e382a71b716b",
    "photo-1558618666-fcd25c85cd64","photo-1496747611176-843222e1e57c",
  ],
  dark: [
    "photo-1509631179647-0177331693ae","photo-1529139574466-a303027c1d8b",
    "photo-1517841905240-472988babdf9","photo-1516762689617-e1cffcef479d",
  ],
  business: [
    "photo-1594938298603-c8148c4b4d94","photo-1573496359142-b8d87734a5a2",
    "photo-1548142813-c348350df52b","photo-1536766768583-38fadb6db6e8",
  ],
  y2k: [
    "photo-1485518882345-15568b007407","photo-1496747611176-843222e1e57c",
    "photo-1539109136881-3be0616acf4b","photo-1583744946564-b52ac1c389c8",
  ],
  boho: [
    "photo-1469334031218-e382a71b716b","photo-1558618666-fcd25c85cd64",
    "photo-1496747611176-843222e1e57c","photo-1515886657613-9f3515b0c78f",
  ],
  default: [
    "photo-1552374196-1ab2a1c593e8","photo-1515886657613-9f3515b0c78f",
    "photo-1483985988355-763728e1935b","photo-1509631179647-0177331693ae",
    "photo-1539109136881-3be0616acf4b","photo-1556906781-9a412961a28c",
  ],
}

function getImages(styleType: string): string[] {
  const key = styleType.toLowerCase()
  const match = Object.keys(STYLE_IMAGES).find(k => key.includes(k))
  const imgs = STYLE_IMAGES[match ?? "default"]
  const shuffled = [...imgs].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6).map(id => `https://images.unsplash.com/${id}?w=400&h=600&fit=crop&crop=faces`)
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
    const style = (form.get("style") as string) || "No preference"
    const occasion = (form.get("occasion") as string) || "Everyday Casual"

    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 })

    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = image.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif"

    const systemPrompt = `You are AURA, an elite AI fashion stylist and personal image consultant.
You analyze faces and create personalized outfit recommendations.
Return ONLY valid JSON — no markdown, no extra text.`

    const userPrompt = `Analyze this person's face and create 6 personalized outfit looks for them.

Consider their: facial features, skin tone, apparent vibe/energy.
Style preference: "${style}"
Occasion: "${occasion}"

Return ONLY valid JSON:
{
  "style_profile": {
    "aura_type": "<their overall style aura — e.g. 'Effortless Cool', 'Romantic Dreamer', 'Power Icon'>",
    "color_season": "<their color season — e.g. 'Warm Autumn', 'Cool Winter', 'Soft Summer'>",
    "vibe_summary": "<2 sentence description of their style energy>"
  },
  "looks": [
    {
      "name": "<outfit name — e.g. 'The Night Ruler'>",
      "style_tag": "<one word style tag — streetwear/minimalist/romantic/dark/business/y2k/boho>",
      "description": "<2 sentence description of the full outfit>",
      "key_pieces": ["<piece 1>", "<piece 2>", "<piece 3>"],
      "why_it_suits_you": "<1 sentence why this works for their face/vibe>"
    }
  ]
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
        max_tokens: 2000,
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

    const result = JSON.parse(jsonMatch[0])
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Add image URLs to each look
    const looksWithImages = result.looks.map((look: Record<string, unknown>) => ({
      ...look,
      image_url: getImages(look.style_tag as string)[Math.floor(Math.random() * 6)],
    }))

    const sessionData = {
      id,
      style_profile: result.style_profile,
      looks: looksWithImages,
      occasion,
      created_at: new Date().toISOString(),
    }

    await supabase.from("style_sessions").insert({
      id,
      aura_type: result.style_profile.aura_type,
      color_season: result.style_profile.color_season,
      vibe_summary: result.style_profile.vibe_summary,
      looks: looksWithImages,
      occasion,
    }).single()

    return NextResponse.json({ id, session: sessionData })
  } catch (err) {
    console.error("Discover error:", (err as Error).message)
    return NextResponse.json({ error: "Style generation failed" }, { status: 500 })
  }
}
