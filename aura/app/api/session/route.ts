import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// POST — create a new style session
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 })
  }

  const supabase = getSupabase()

  try {
    const form = await req.formData()
    const image = form.get("image") as File | null
    const style = (form.get("style") as string) || "No preference"
    const occasion = (form.get("occasion") as string) || "Everyday Casual"

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const sessionId = nanoid()

    // Convert image to base64
    const buffer = await image.arrayBuffer()
    const selfie_b64 = Buffer.from(buffer).toString("base64")
    const mimeType = (image.type || "image/jpeg") as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif"

    // Save initial session with status "analyzing"
    await supabase.from("style_sessions").insert({
      id: sessionId,
      status: "analyzing",
      occasion,
    })

    // Call Claude Haiku vision
    const systemPrompt = `You are AURA, an elite AI fashion stylist. Analyze this person's face, skin tone, coloring, and energy.
Return ONLY valid JSON — no markdown, no extra text.`

    const userPrompt = `Analyze this person and create 6 outfit styling prompts for AI image generation.

Style preferences: "${style}"
Occasion: "${occasion}"

Return ONLY valid JSON:
{
  "style_profile": {
    "aura_type": "<2-3 word style identity, e.g. 'Effortless Minimalist', 'Dark Romantic'>",
    "color_season": "<color season, e.g. 'Warm Autumn', 'Cool Winter'>",
    "vibe": "<1 sentence vibe description>"
  },
  "looks": [
    {
      "name": "<look name, e.g. 'The Night Editor'>",
      "style_tag": "<one of: streetwear/minimalist/romantic/dark/business/y2k/boho>",
      "image_prompt": "Dress this exact person in <detailed outfit description>. Keep their exact face, skin tone, and identity unchanged. Full-body editorial fashion photo, studio lighting, clean background.",
      "caption": "<2-sentence outfit description>",
      "key_pieces": ["<piece 1>", "<piece 2>", "<piece 3>"],
      "why_it_suits_you": "<1 sentence why this works for them>"
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
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: selfie_b64 },
              },
              { type: "text", text: userPrompt },
            ],
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      const errBody = await aiResponse.text()
      console.error("Anthropic API error:", errBody)
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 })
    }

    const aiData = await aiResponse.json()
    const raw: string = aiData.content?.[0]?.text ?? ""

    // Strip markdown fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim()

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("Could not extract JSON from AI response:", raw)
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0]) as {
      style_profile: { aura_type: string; color_season: string; vibe: string }
      looks: Array<{
        name: string
        style_tag: string
        image_prompt: string
        caption: string
        key_pieces: string[]
        why_it_suits_you: string
      }>
    }

    // Update session to ready with full data
    await supabase
      .from("style_sessions")
      .update({
        aura_type: result.style_profile.aura_type,
        color_season: result.style_profile.color_season,
        vibe_summary: result.style_profile.vibe,
        prompts: result.looks.map((l) => l.image_prompt),
        looks_meta: result.looks,
        status: "ready",
      })
      .eq("id", sessionId)

    return NextResponse.json({
      sessionId,
      style_profile: result.style_profile,
      looks_meta: result.looks,
      selfie_b64,
    })
  } catch (err) {
    console.error("Session POST error:", (err as Error).message)
    return NextResponse.json({ error: "Style session creation failed" }, { status: 500 })
  }
}

// GET — fetch session by ID (/api/session?id=XXX)
export async function GET(req: NextRequest) {
  const supabase = getSupabase()

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing session id" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("style_sessions")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({
      sessionId: data.id,
      style_profile: {
        aura_type: data.aura_type,
        color_season: data.color_season,
        vibe: data.vibe_summary,
      },
      looks_meta: data.looks_meta,
      prompts: data.prompts,
      looks_generated: data.looks_generated,
      occasion: data.occasion,
      status: data.status,
      created_at: data.created_at,
    })
  } catch (err) {
    console.error("Session GET error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
