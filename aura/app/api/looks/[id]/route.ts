import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data, error } = await supabase
      .from("style_sessions")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const session = {
      id: data.id,
      style_profile: {
        aura_type: data.aura_type,
        color_season: data.color_season,
        vibe_summary: data.vibe_summary,
      },
      looks: data.looks,
      occasion: data.occasion,
      created_at: data.created_at,
    }

    return NextResponse.json({ session })
  } catch (err) {
    console.error("Looks fetch error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
