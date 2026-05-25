import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"

const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function POST(req: NextRequest) {
  const { payment_id, secret } = await req.json()

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createSupabaseServer()

  const { data: payment } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("id", payment_id)
    .eq("status", "pending")
    .single()

  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, plan")
    .eq("id", payment.user_id)
    .single()

  if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 })

  await supabase
    .from("profiles")
    .update({
      credits: profile.credits + payment.credits_to_add,
      // Always upgrade from free when credits are purchased
      plan: payment.plan_to_set ?? (profile.plan === "free" ? "starter" : profile.plan),
    })
    .eq("id", payment.user_id)

  await supabase
    .from("payment_requests")
    .update({ status: "approved" })
    .eq("id", payment_id)

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { payment_id, secret } = await req.json()

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createSupabaseServer()

  await supabase
    .from("payment_requests")
    .update({ status: "rejected" })
    .eq("id", payment_id)

  return NextResponse.json({ success: true })
}
