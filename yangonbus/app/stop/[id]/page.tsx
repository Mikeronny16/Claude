"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import the map to avoid SSR issues with maplibre-gl
const YBSMap = dynamic(() => import("../../../components/YBSMap"), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────

interface StopData {
  id: number
  name_en: string
  name_mm: string | null
  road_en: string | null
  road_mm: string | null
  township_en: string | null
  township_mm: string | null
  lat: number
  lng: number
}

interface RouteInfo {
  id: string
  name_mm: string
  color: string
  sequence: number
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StopSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8 max-w-lg mx-auto w-full animate-pulse">
      {/* Header skeleton */}
      <div className="shimmer h-8 w-2/3 rounded-lg mt-2" />
      <div className="shimmer h-5 w-1/2 rounded-lg" />
      <div className="shimmer h-4 w-1/3 rounded-lg" />

      {/* Map skeleton */}
      <div className="shimmer h-48 rounded-2xl mt-2" />

      {/* Route badges skeleton */}
      <div className="shimmer h-5 w-1/4 rounded-lg mt-2" />
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="shimmer h-16 w-28 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// ─── Route Badge ──────────────────────────────────────────────────────────────

function RouteBadge({ route, onClick }: { route: RouteInfo; onClick: () => void }) {
  const color = `#${route.color || "E42313"}`
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 active:scale-95 focus-visible:outline-none"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        minWidth: "5.5rem",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = color
        el.style.background = `color-mix(in srgb, ${color} 10%, var(--surface))`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "var(--border)"
        el.style.background = "var(--surface)"
      }}
    >
      {/* Colored circle with route number */}
      <div
        className="route-badge text-sm"
        style={{ background: color, width: "2.5rem", height: "2.5rem", fontSize: "0.8rem" }}
      >
        {route.id}
      </div>
      {/* Myanmar name — truncated */}
      <span
        className="font-myanmar text-center leading-tight"
        style={{ color: "var(--muted)", fontSize: "0.65rem", maxWidth: "5rem" }}
      >
        <span
          className="block overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {route.name_mm}
        </span>
      </span>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StopPage() {
  const params = useParams()
  const router = useRouter()
  const stopId = params?.id as string

  const [stop, setStop] = useState<StopData | null>(null)
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stopId) return
    setLoading(true)
    setError(null)

    fetch(`/api/stop/${stopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setStop(data.stop)
          setRoutes(data.routes ?? [])
        }
      })
      .catch(() => setError("Failed to load stop"))
      .finally(() => setLoading(false))
  }, [stopId])

  if (loading) return <StopSkeleton />

  if (error || !stop) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4"
        style={{ color: "var(--muted)" }}
      >
        <span style={{ fontSize: "3rem" }}>🚏</span>
        <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Stop not found
        </p>
        <p className="text-sm text-center">{error ?? "This stop doesn't exist."}</p>
        <button
          onClick={() => router.back()}
          className="btn-red mt-2"
          style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
        >
          ← Go Back
        </button>
      </div>
    )
  }

  const mapStop = { id: stop.id, lat: stop.lat, lng: stop.lng, name_en: stop.name_en, name_mm: stop.name_mm }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--base)" }}>
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-full w-8 h-8 transition-colors"
          style={{ background: "var(--surface2)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--border)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")}
          aria-label="Go back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span
          className="font-semibold text-sm truncate"
          style={{ color: "var(--muted)" }}
        >
          Bus Stop
        </span>
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="flex flex-col gap-5 px-4 pt-5 pb-10 max-w-lg mx-auto w-full">
        {/* Stop name — bilingual */}
        <div className="flex flex-col gap-1">
          {stop.name_mm && (
            <h1
              className="font-myanmar font-bold leading-tight"
              style={{ color: "var(--text)", fontSize: "1.5rem" }}
            >
              {stop.name_mm}
            </h1>
          )}
          <h2
            className="font-semibold leading-snug"
            style={{
              color: stop.name_mm ? "var(--muted)" : "var(--text)",
              fontSize: stop.name_mm ? "1rem" : "1.5rem",
            }}
          >
            {stop.name_en}
          </h2>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2">
          {stop.township_en && (
            <span className="chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {stop.township_en}
              {stop.township_mm ? ` · ${stop.township_mm}` : ""}
            </span>
          )}
          {stop.road_en && (
            <span className="chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              {stop.road_en}
              {stop.road_mm ? ` · ${stop.road_mm}` : ""}
            </span>
          )}
          <span className="chip" style={{ color: "var(--muted)" }}>
            Stop #{stop.id}
          </span>
        </div>

        {/* Map */}
        <YBSMap
          stops={[mapStop]}
          heightClass="h-48"
          routeColor="E42313"
          center={[stop.lng, stop.lat]}
          zoom={15}
          selectedStopId={stop.id}
        />

        {/* Routes from this stop */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: "var(--muted)" }}
          >
            Buses from here
            {routes.length > 0 && (
              <span
                className="ml-2 px-1.5 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: "var(--surface2)", color: "var(--text)" }}
              >
                {routes.length}
              </span>
            )}
          </h3>

          {routes.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No routes found for this stop.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {routes.map((route) => (
                <RouteBadge
                  key={`${route.id}-${route.sequence}`}
                  route={route}
                  onClick={() => router.push(`/route/${route.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
