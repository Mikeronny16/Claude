import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { SIGNUP_BONUS } from "@/lib/credits"
import { nanoid } from "nanoid"

function nanoidSimple() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const ref = searchParams.get("ref")

  if (code) {
    const supabase = await createSupabaseServer()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Check if profile exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (!existing) {
        // New user — create profile with signup bonus
        const referralCode = nanoidSimple()
        let referredBy = null

        if (ref) {
          const { data: refUser } = await supabase
            .from("profiles")
            .select("id, credits")
            .eq("referral_code", ref)
            .single()

          if (refUser) {
            referredBy = refUser.id
            // Give referrer bonus
            await supabase
              .from("profiles")
              .update({ credits: refUser.credits + 10 })
              .eq("id", refUser.id)
          }
        }

        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          plan: "free",
          credits: SIGNUP_BONUS,
          daily_count: 0,
          daily_reset: new Date().toISOString(),
          referral_code: referralCode,
          referred_by: referredBy,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback`)
}
