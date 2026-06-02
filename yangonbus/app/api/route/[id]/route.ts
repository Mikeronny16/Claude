import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: "Invalid route id" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch route details
  const { data: route, error: routeError } = await supabase
    .from("routes")
    .select("id, name_mm, color, stop_ids, shape_coords, stop_count")
    .eq("id", id)
    .single()

  if (routeError || !route) {
    return Response.json({ error: "Route not found" }, { status: 404 })
  }

  // Fetch all stops for this route in sequence order
  const { data: routeStops, error: stopsError } = await supabase
    .from("route_stops")
    .select("sequence, stops(id, name_en, name_mm, township_en, lat, lng)")
    .eq("route_id", id)
    .order("sequence")

  if (stopsError) {
    return Response.json({ error: stopsError.message }, { status: 500 })
  }

  // Flatten the nested stops relation
  type StopShape = { id: number; name_en: string; name_mm: string | null; township_en: string | null; lat: number; lng: number }
  const stops = (routeStops ?? []).map((rs) => ({
    ...(rs.stops as unknown as StopShape),
    sequence: rs.sequence,
  }))

  return Response.json({ route, stops })
}
