// Run with: npx tsx scripts/import-data.ts
import * as fs from "fs"
import * as path from "path"
import * as https from "https"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const DATA_DIR = path.join(__dirname, "../../ybs-data/data")

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars")
  process.exit(1)
}

// Use raw HTTP to bypass Supabase JS client host validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const agent = new https.Agent({ rejectUnauthorized: false })

// ─── Types ─────────────────────────────────────────────────────────────────

interface StopRow {
  id: number
  lat: number
  lng: number
  name_en: string
  name_mm: string | null
  road_en: string | null
  road_mm: string | null
  township_en: string | null
  township_mm: string | null
}

interface RouteRow {
  id: string
  name_mm: string
  color: string
  stop_ids: number[]
  shape_coords: [number, number][] | null
}

interface RouteStopRow {
  route_id: string
  stop_id: number
  sequence: number
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function batchUpsert(
  table: string,
  rows: Record<string, unknown>[],
  batchSize = 500,
  label = table
): Promise<void> {
  let inserted = 0
  const url = `${SUPABASE_URL}/rest/v1/${table}`
  const headers: Record<string, string> = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(batch),
      // @ts-expect-error node-fetch agent
      agent,
    })
    if (!res.ok) {
      const text = await res.text()
      console.error(`\nError upserting into ${table} at offset ${i}: ${res.status} ${text}`)
      throw new Error(`HTTP ${res.status}: ${text}`)
    }
    inserted += batch.length
    process.stdout.write(`\r  ${label}: ${inserted}/${rows.length}`)
  }
  console.log(`\r  ${label}: ${inserted}/${rows.length} — done`)
}

// ─── Import stops ──────────────────────────────────────────────────────────

function parseStops(): StopRow[] {
  const tsvPath = path.join(DATA_DIR, "stops.tsv")
  const content = fs.readFileSync(tsvPath, "utf-8")
  const lines = content.split("\n").filter((l) => l.trim() !== "")

  // First line is headers: id lat lng name_en name_mm road_en road_mm township_en township_mm
  const [_header, ...dataLines] = lines

  return dataLines.map((line) => {
    const [id, lat, lng, name_en, name_mm, road_en, road_mm, township_en, township_mm] =
      line.split("\t")

    return {
      id: parseInt(id, 10),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name_en: name_en ?? "",
      name_mm: name_mm || null,
      road_en: road_en || null,
      road_mm: road_mm || null,
      township_en: township_en || null,
      township_mm: township_mm ? township_mm.trim() : null,
    }
  })
}

async function importStops(): Promise<void> {
  const stops = parseStops()
  console.log(`Importing ${stops.length} stops...`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await batchUpsert("stops", stops as any[], 500, "stops")
}

// ─── Import routes ─────────────────────────────────────────────────────────

interface RouteJson {
  route_id: string
  name: string
  color?: string
  stops: number[]
  shape?: {
    geometry?: {
      coordinates?: [number, number][]
    }
  }
}

function parseRoutes(): { routes: RouteRow[]; routeStops: RouteStopRow[] } {
  const routesDir = path.join(DATA_DIR, "routes")
  const files = fs
    .readdirSync(routesDir)
    .filter((f) => f.startsWith("route") && f.endsWith(".json"))

  const routes: RouteRow[] = []
  const routeStops: RouteStopRow[] = []

  for (const file of files) {
    const filePath = path.join(routesDir, file)
    let json: RouteJson

    try {
      json = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch (e) {
      console.warn(`  Skipping ${file}: parse error`)
      continue
    }

    const routeId = json.route_id
    if (!routeId) {
      console.warn(`  Skipping ${file}: no route_id`)
      continue
    }

    const shapeCoords = json.shape?.geometry?.coordinates ?? null

    routes.push({
      id: routeId,
      name_mm: json.name ?? "",
      color: json.color ?? "E42313",
      stop_ids: json.stops ?? [],
      shape_coords: shapeCoords,
    })

    // Build junction rows
    const stopList = json.stops ?? []
    for (let seq = 0; seq < stopList.length; seq++) {
      routeStops.push({
        route_id: routeId,
        stop_id: stopList[seq],
        sequence: seq,
      })
    }
  }

  return { routes, routeStops }
}

async function importRoutes(): Promise<void> {
  const { routes, routeStops } = parseRoutes()

  console.log(`Importing ${routes.length} routes...`)
  await batchUpsert("routes", routes as unknown as Record<string, unknown>[], 100, "routes")

  console.log(`Importing ${routeStops.length} route_stops junction rows...`)
  await batchUpsert(
    "route_stops",
    routeStops as unknown as Record<string, unknown>[],
    500,
    "route_stops"
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("YBS Data Import")
  console.log("===============")
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log(`Data directory: ${DATA_DIR}`)
  console.log()

  await importStops()
  await importRoutes()

  console.log()
  console.log("Done!")
}

main().catch((err) => {
  console.error("Import failed:", err)
  process.exit(1)
})
