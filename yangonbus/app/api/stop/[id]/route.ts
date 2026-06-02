import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const stopId = parseInt(id, 10)

  if (isNaN(stopId)) {
    return Response.json({ error: "Invalid stop id" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch stop details
  const { data: stop, error: stopError } = await supabase
    .from("stops")
    .select("id, name_en, name_mm, road_en, road_mm, township_en, township_mm, lat, lng")
    .eq("id", stopId)
    .single()

  if (stopError || !stop) {
    return Response.json({ error: "Stop not found" }, { status: 404 })
  }

  // Fetch all routes serving this stop via junction table
  const { data: routeStops, error: routesError } = await supabase
    .from("route_stops")
    .select("sequence, routes(id, name_mm, color)")
    .eq("stop_id", stopId)
    .order("route_id")

  if (routesError) {
    return Response.json({ error: routesError.message }, { status: 500 })
  }

  // Flatten the nested routes relation
  type RouteShape = { id: string; name_mm: string; color: string }
  const routes = (routeStops ?? []).map((rs) => ({
    ...(rs.routes as unknown as RouteShape),
    sequence: rs.sequence,
  }))

  return Response.json({ stop, routes })
}
