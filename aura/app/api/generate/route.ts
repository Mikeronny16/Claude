import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { fal } from "@fal-ai/client"

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&h=1200&fit=crop",
]

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string
      lookIndex: number
      promptText: string
      selfieB64: string
    }

    const { sessionId, lookIndex, promptText, selfieB64 } = body

    if (!sessionId || lookIndex === undefined || !promptText || !selfieB64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY

    // Return fallback image if FAL_KEY is not set (dev mode)
    if (!falKey) {
      console.warn("FAL_KEY not set — returning fallback image")
      const imageUrl = FALLBACK_IMAGES[lookIndex % FALLBACK_IMAGES.length]
      return NextResponse.json({ imageUrl, lookIndex, isMock: true })
    }

    fal.config({ credentials: falKey })

    const result = await fal.subscribe("fal-ai/gemini-25-flash-image/edit", {
      input: {
        prompt: promptText,
        image_urls: [`data:image/jpeg;base64,${selfieB64}`],
      },
      logs: false,
    })

    const imageUrl: string | undefined =
      (result.data as Record<string, unknown> & {
        images?: Array<{ url: string }>
        image?: { url: string }
      })?.images?.[0]?.url ??
      (result.data as Record<string, unknown> & {
        image?: { url: string }
      })?.image?.url

    if (!imageUrl) {
      console.error("fal.ai returned no image URL:", JSON.stringify(result.data))
      return NextResponse.json({ error: "Image generation returned no URL" }, { status: 502 })
    }

    // Persist imageUrl to Supabase looks_generated jsonb
    const supabase = getSupabase()

    // Fetch current looks_generated array first
    const { data: session } = await supabase
      .from("style_sessions")
      .select("looks_generated")
      .eq("id", sessionId)
      .single()

    const looksGenerated: (string | null)[] = Array.isArray(session?.looks_generated)
      ? [...session.looks_generated]
      : []

    // Ensure array is long enough
    while (looksGenerated.length <= lookIndex) {
      looksGenerated.push(null)
    }
    looksGenerated[lookIndex] = imageUrl

    await supabase
      .from("style_sessions")
      .update({ looks_generated: looksGenerated })
      .eq("id", sessionId)

    return NextResponse.json({ imageUrl, lookIndex })
  } catch (err) {
    console.error("Generate POST error:", (err as Error).message)
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 })
  }
}
