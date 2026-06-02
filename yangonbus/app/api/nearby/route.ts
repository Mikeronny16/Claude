import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lat = parseFloat(searchParams.get("lat") ?? "")
  const lng = parseFloat(searchParams.get("lng") ?? "")
  const radius = Math.min(parseInt(searchParams.get("radius") ?? "500", 10), 2000)

  if (isNaN(lat) || isNaN(lng)) {
    return Response.json({ error: "lat and lng query params are required" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.rpc("nearby_stops", {
    user_lat: lat,
    user_lng: lng,
    radius_meters: radius,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
