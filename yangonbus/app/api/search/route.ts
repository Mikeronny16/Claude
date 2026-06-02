import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q") ?? ""
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50)

  if (q.length < 2) {
    return Response.json({ error: "Query must be at least 2 characters" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from("stops")
    .select("id, name_en, name_mm, township_en, township_mm, lat, lng")
    .or(`name_en.ilike.%${q}%,name_mm.ilike.%${q}%,township_en.ilike.%${q}%`)
    .limit(limit)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
