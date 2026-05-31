import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export interface Rating {
  id: string
  image_url: string
  total_score: number
  vibe_label: string
  style_score: number
  color_score: number
  originality_score: number
  impact_score: number
  ai_tip: string
  occasion: string
  created_at?: string
}
