import { NextRequest, NextResponse } from "next/server"
import { generatePersonality } from "@/lib/claude"

export async function POST(req: NextRequest) {
  const { name, lang } = await req.json()

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "နာမည် ထည့်ပါ" }, { status: 400 })
  }
  if (name.trim().length > 60) {
    return NextResponse.json({ error: "နာမည် တိုပါ (60 chars max)" }, { status: 400 })
  }
  if (!["mm", "en"].includes(lang)) {
    return NextResponse.json({ error: "Language invalid" }, { status: 400 })
  }

  try {
    const result = await generatePersonality(name.trim(), lang)
    return NextResponse.json({ result, name: name.trim(), lang })
  } catch (err) {
    console.error("Personality API error:", (err as Error).message)
    return NextResponse.json({ error: "AI error ဖြစ်သွားသည်၊ ထပ်ကြိုးစားပါ" }, { status: 500 })
  }
}
