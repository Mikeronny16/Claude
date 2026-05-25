import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { CREDIT_PACKS } from "@/lib/credits"

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { pack_id, wave_number, wave_screenshot_url } = await req.json()

  const pack = CREDIT_PACKS.find(p => p.id === pack_id)
  if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 })

  if (!wave_number) return NextResponse.json({ error: "Wave number လိုသည်" }, { status: 400 })

  const { error } = await supabase.from("payment_requests").insert({
    user_id: user.id,
    amount_mmk: pack.price_mmk,
    credits_to_add: pack.credits,
    plan_to_set: "plan_to_set" in pack ? pack.plan_to_set : null,
    wave_number,
    wave_screenshot_url: wave_screenshot_url ?? null,
    status: "pending",
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
