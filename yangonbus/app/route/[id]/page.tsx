"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const YBSMap = dynamic(() => import("../../../components/YBSMap"), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteData {
  id: string
  name_mm: string
  color: string
  stop_ids: number[]
  shape_coords: [number, number][] | null
  stop_count: number
}

interface StopData {
  id: number
  name_en: string
  name_mm: string | null
  township_en: string | null
  lat: number
  lng: number
  sequence: number
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RouteSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
      {/* Route header skeleton */}
      <div className="flex items-center gap-3 mt-2">
        <div className="shimmer rounded-full" style={{ width: "3rem", height: "3rem", flexShrink: 0 }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="shimmer h-7 w-1/2 rounded-lg" />
          <div className="shimmer h-4 w-3/4 rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="shimmer h-5 w-24 rounded-lg" />

      {/* Map skeleton */}
      <div className="shimmer h-56 rounded-2xl mt-1" />

      {/* Stop list skeleton */}
      <div className="shimmer h-5 w-1/4 rounded-lg mt-2" />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="shimmer rounded-full" style={{ width: "1.5rem", height: "1.5rem", flexShrink: 0 }} />
          <div className="shimmer h-10 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

// ─── Stop List Item ───────────────────────────────────────────────────────────

function StopListItem({
  stop,
  index,
  isLast,
  accentColor,
  onClick,
}: {
  stop: StopData
  index: number
  isLast: boolean
  accentColor: string
  onClick: () => void
}) {
  return (
    <div className="flex items-stretch gap-3">
      {/* Sequence indicator + connector line */}
      <div className="flex flex-col items-center" style={{ width: "1.5rem", flexShrink: 0 }}>
        <div
          className="flex items-center justify-center rounded-full text-white font-bold z-10"
          style={{
            width: "1.5rem",
            height: "1.5rem",
            background: accentColor,
            fontSize: "0.6rem",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        {!isLast && (
          <div
            className="flex-1 mt-0.5"
            style={{ width: "2px", background: `color-mix(in srgb, ${accentColor} 25%, var(--border))`, minHeight: "1.25rem" }}
          />
        )}
      </div>

      {/* Stop card */}
      <button
        onClick={onClick}
        className="flex flex-col gap-0.5 flex-1 text-left rounded-xl px-3 py-2.5 mb-1 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = accentColor
          el.style.background = `color-mix(in srgb, ${accentColor} 6%, var(--surface))`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "var(--border)"
          el.style.background = "var(--surface)"
        }}
      >
        {stop.name_mm && (
          <span
            className="font-myanmar font-semibold leading-tight"
            style={{ color: "var(--text)", fontSize: "0.875rem" }}
          >
            {stop.name_mm}
          </span>
        )}
        <span
          className="leading-tight"
          style={{
            color: stop.name_mm ? "var(--muted)" : "var(--text)",
            fontSize: stop.name_mm ? "0.75rem" : "0.875rem",
          }}
        >
          {stop.name_en}
          {stop.township_en ? (
            <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
              {" "}
              · {stop.township_en}
            </span>
          ) : null}
        </span>
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoutePage() {
  const params = useParams()
  const router = useRouter()
  const routeId = params?.id as string

  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [stops, setStops] = useState<StopData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!routeId) return
    setLoading(true)
    setError(null)

    fetch(`/api/route/${encodeURIComponent(routeId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setRouteData(data.route)
          setStops(data.stops ?? [])
        }
      })
      .catch(() => setError("Failed to load route"))
      .finally(() => setLoading(false))
  }, [routeId])

  const handleShare = useCallback(() => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: routeData?.name_mm ?? `Route ${routeId}`, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [routeData, routeId])

  if (loading) return <RouteSkeleton />

  if (error || !routeData) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4"
        style={{ color: "var(--muted)" }}
      >
        <span style={{ fontSize: "3rem" }}>🚌</span>
        <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Route not found
        </p>
        <p className="text-sm text-center">{error ?? "This route doesn't exist."}</p>
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

  const accentColor = `#${routeData.color || "E42313"}`
  const mapStops = stops.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    name_en: s.name_en,
    name_mm: s.name_mm,
  }))

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
          className="font-semibold text-sm truncate flex-1"
          style={{ color: "var(--muted)" }}
        >
          Bus Route
        </span>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: "var(--surface2)",
            color: copied ? accentColor : "var(--text)",
            border: `1px solid ${copied ? accentColor : "var(--border)"}`,
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </>
          )}
        </button>
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="flex flex-col gap-5 px-4 pt-5 pb-10 max-w-lg mx-auto w-full">
        {/* Route header */}
        <div className="flex items-center gap-4">
          {/* Big colored circle with route number */}
          <div
            className="flex items-center justify-center rounded-full font-bold text-white shadow-lg flex-shrink-0"
            style={{
              background: accentColor,
              width: "3.5rem",
              height: "3.5rem",
              fontSize: routeData.id.length > 3 ? "0.8rem" : "1.1rem",
              textShadow: "0 1px 3px rgba(0,0,0,.4)",
              boxShadow: `0 4px 16px color-mix(in srgb, ${accentColor} 40%, transparent)`,
            }}
          >
            {routeData.id}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <h1
              className="font-myanmar font-bold leading-tight truncate"
              style={{ color: "var(--text)", fontSize: "1.25rem" }}
            >
              {routeData.name_mm}
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Route {routeData.id}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          <span
            className="chip"
            style={{ borderColor: `color-mix(in srgb, ${accentColor} 40%, var(--border))` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {stops.length} stops
          </span>
        </div>

        {/* Map — full route line + all stops */}
        <YBSMap
          stops={mapStops}
          routeLine={routeData.shape_coords ?? undefined}
          routeColor={routeData.color || "E42313"}
          heightClass="h-56"
          onStopClick={(id) => router.push(`/stop/${id}`)}
        />
        <p className="text-xs text-center -mt-3" style={{ color: "var(--muted)" }}>
          Tap a stop on the map to see its details
        </p>

        {/* Stop sequence list */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: "var(--muted)" }}
          >
            Stop sequence
          </h3>

          {stops.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No stops found for this route.
            </p>
          ) : (
            <div className="flex flex-col">
              {stops.map((stop, idx) => (
                <StopListItem
                  key={`${stop.id}-${stop.sequence}`}
                  stop={stop}
                  index={idx}
                  isLast={idx === stops.length - 1}
                  accentColor={accentColor}
                  onClick={() => router.push(`/stop/${stop.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
