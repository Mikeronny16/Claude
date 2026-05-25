import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"

export const supabase = createBrowserClient(url, key)

export type Profile = {
  id: string
  email: string
  full_name: string | null
  plan: "free" | "starter" | "pro"
  credits: number
  daily_count: number
  daily_reset: string
  referral_code: string
  referred_by: string | null
  wave_number: string | null
  created_at: string
}

export type Generation = {
  id: string
  user_id: string
  tool: "caption" | "reply" | "description"
  input_text: string
  output_text: string
  credits_used: number
  created_at: string
}

export type PaymentRequest = {
  id: string
  user_id: string
  amount_mmk: number
  credits_to_add: number
  plan_to_set: string | null
  wave_screenshot_url: string | null
  wave_number: string
  status: "pending" | "approved" | "rejected"
  notes: string | null
  created_at: string
}
