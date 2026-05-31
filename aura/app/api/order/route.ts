import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// POST — log a manual payment order
// Body: { pack, amount, currency, method, txnRef, sessionId? }
export async function POST(req: NextRequest) {
  const supabase = getSupabase()

  try {
    const body = await req.json() as {
      pack?: string
      amount?: number
      currency?: string
      method?: string
      txnRef?: string
      sessionId?: string
    }

    const { pack, amount, currency, method, txnRef, sessionId } = body

    if (!pack || amount === undefined || !currency || !method || !txnRef) {
      return NextResponse.json(
        { error: "Missing required fields: pack, amount, currency, method, txnRef" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("orders").insert({
      id: nanoid(),
      pack,
      amount,
      currency,
      method,
      txn_ref: txnRef,
      status: "pending",
      session_id: sessionId ?? null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase order insert error:", error.message)
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Order received. Credits will be added within 1 hour.",
    })
  } catch (err) {
    console.error("Order POST error:", (err as Error).message)
    return NextResponse.json({ error: "Order submission failed" }, { status: 500 })
  }
}
