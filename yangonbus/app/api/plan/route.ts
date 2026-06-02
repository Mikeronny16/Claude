import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

type RouteInfo = { id: string; name_mm: string; color: string }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fromId = parseInt(searchParams.get("from") ?? "", 10)
  const toId = parseInt(searchParams.get("to") ?? "", 10)

  if (isNaN(fromId) || isNaN(toId)) {
    return Response.json({ error: "from and to stop IDs required" }, { status: 400 })
  }
  if (fromId === toId) {
    return Response.json({ error: "From and to stops are the same" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Step 1: Get all routes serving fromId
  const { data: fromRoutes, error: fromError } = await supabase
    .from("route_stops")
    .select("route_id, sequence, routes(id, name_mm, color)")
    .eq("stop_id", fromId)

  if (fromError) {
    return Response.json({ error: fromError.message }, { status: 500 })
  }

  // Step 2: Get all routes serving toId
  const { data: toRoutes, error: toError } = await supabase
    .from("route_stops")
    .select("route_id, sequence, routes(id, name_mm, color)")
    .eq("stop_id", toId)

  if (toError) {
    return Response.json({ error: toError.message }, { status: 500 })
  }

  // Step 3: Build fromMap and find direct routes
  const fromMap = new Map<string, { seq: number; route: RouteInfo }>()
  for (const r of fromRoutes ?? []) {
    fromMap.set(r.route_id, { seq: r.sequence, route: r.routes as unknown as RouteInfo })
  }

  const direct = []
  for (const r of toRoutes ?? []) {
    const fromEntry = fromMap.get(r.route_id)
    if (fromEntry && fromEntry.seq < r.sequence) {
      direct.push({
        route_id: r.route_id,
        name_mm: fromEntry.route.name_mm,
        color: fromEntry.route.color,
        from_seq: fromEntry.seq,
        to_seq: r.sequence,
        stops_count: r.sequence - fromEntry.seq + 1,
      })
    }
  }
  direct.sort((a, b) => a.stops_count - b.stops_count)

  // Step 4: Find 1-transfer routes (only if fewer than 2 direct options)
  let transfers: Array<{
    route1: { id: string; name_mm: string; color: string }
    transfer_stop: { id: number; name_en: string; name_mm: string }
    route2: { id: string; name_mm: string; color: string }
  }> = []

  if (direct.length < 2) {
    const fromRouteIds = [...fromMap.keys()]

    const { data: allStopsOnFromRoutes } = await supabase
      .from("route_stops")
      .select("stop_id, sequence, route_id")
      .in("route_id", fromRouteIds)

    // Build reachable stops: stops that come AFTER from_stop on from-routes
    const reachableStops = new Map<number, Array<{ route_id: string; seq: number }>>()
    for (const rs of allStopsOnFromRoutes ?? []) {
      const fromSeq = fromMap.get(rs.route_id)?.seq ?? Infinity
      if (rs.sequence > fromSeq && rs.stop_id !== fromId) {
        const existing = reachableStops.get(rs.stop_id) ?? []
        existing.push({ route_id: rs.route_id, seq: rs.sequence })
        reachableStops.set(rs.stop_id, existing)
      }
    }

    // Build toMap
    const toMap = new Map<string, { seq: number; route: RouteInfo }>()
    for (const r of toRoutes ?? []) {
      toMap.set(r.route_id, { seq: r.sequence, route: r.routes as unknown as RouteInfo })
    }

    const toRouteIds = [...toMap.keys()]

    const { data: allStopsOnToRoutes } = await supabase
      .from("route_stops")
      .select("stop_id, sequence, route_id")
      .in("route_id", toRouteIds)

    // Find transfer stops: reachable from "from" AND on a route before "to"
    const transferMap = new Map<number, Array<{ route2_id: string; seq2: number }>>()
    for (const rs of allStopsOnToRoutes ?? []) {
      const toEntry = toMap.get(rs.route_id)
      if (toEntry && rs.sequence < toEntry.seq && rs.stop_id !== toId) {
        if (reachableStops.has(rs.stop_id)) {
          const existing = transferMap.get(rs.stop_id) ?? []
          existing.push({ route2_id: rs.route_id, seq2: rs.sequence })
          transferMap.set(rs.stop_id, existing)
        }
      }
    }

    const transferStopIds = [...transferMap.keys()].slice(0, 10)

    if (transferStopIds.length > 0) {
      const { data: transferStops } = await supabase
        .from("stops")
        .select("id, name_en, name_mm")
        .in("id", transferStopIds)

      const stopInfoMap = new Map((transferStops ?? []).map((s) => [s.id, s]))

      for (const stopId of transferStopIds.slice(0, 5)) {
        const via1 = reachableStops.get(stopId)?.[0]
        const via2 = transferMap.get(stopId)?.[0]
        if (!via1 || !via2) continue

        const r1 = fromMap.get(via1.route_id)?.route
        const r2 = toMap.get(via2.route2_id)?.route
        const transferStop = stopInfoMap.get(stopId)
        if (!r1 || !r2 || !transferStop) continue

        transfers.push({
          route1: { id: via1.route_id, name_mm: r1.name_mm, color: r1.color },
          transfer_stop: { id: stopId, name_en: transferStop.name_en, name_mm: transferStop.name_mm },
          route2: { id: via2.route2_id, name_mm: r2.name_mm, color: r2.color },
        })
      }
    }
  }

  return Response.json({ direct, transfers })
}
