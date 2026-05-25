import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { generateCaption, generateReply, generateDescription } from "@/lib/gemini"
import { TOOL_COST, FREE_DAILY_LIMIT } from "@/lib/credits"

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "ဝင်ရောက်ပါ" }, { status: 401 })
  }

  const { tool, ...input } = await req.json()

  if (!["caption", "reply", "description"].includes(tool)) {
    return NextResponse.json({ error: "Invalid tool" }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "Profile မတွေ့ပါ" }, { status: 404 })
  }

  // Check daily limit for free users
  const today = new Date().toISOString().split("T")[0]
  const resetDate = profile.daily_reset?.split("T")[0]

  let dailyCount = profile.daily_count || 0
  if (resetDate !== today) {
    dailyCount = 0
    await supabase
      .from("profiles")
      .update({ daily_count: 0, daily_reset: new Date().toISOString() })
      .eq("id", user.id)
  }

  if (profile.plan === "free" && dailyCount >= FREE_DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Daily limit ပြည့်သွားပြီ။ Credits ဝယ်ပါ သို့မဟုတ် မနက်ပြန်လာပါ။" },
      { status: 429 }
    )
  }

  if (profile.plan !== "free" && profile.credits < TOOL_COST[tool as keyof typeof TOOL_COST]) {
    return NextResponse.json(
      { error: "Credits မလုံလောက်ပါ" },
      { status: 402 }
    )
  }

  try {
    let output = ""
    if (tool === "caption") output = await generateCaption(input)
    else if (tool === "reply") output = await generateReply(input)
    else if (tool === "description") output = await generateDescription(input)

    // Deduct credits / increment daily count
    if (profile.plan === "free") {
      await supabase
        .from("profiles")
        .update({ daily_count: dailyCount + 1 })
        .eq("id", user.id)
    } else {
      await supabase
        .from("profiles")
        .update({ credits: profile.credits - TOOL_COST[tool as keyof typeof TOOL_COST] })
        .eq("id", user.id)
    }

    await supabase.from("generations").insert({
      user_id: user.id,
      tool,
      input_text: JSON.stringify(input),
      output_text: output,
      credits_used: profile.plan === "free" ? 0 : TOOL_COST[tool as keyof typeof TOOL_COST],
    })

    return NextResponse.json({ output })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: "AI error ဖြစ်သွားသည်" }, { status: 500 })
  }
}
