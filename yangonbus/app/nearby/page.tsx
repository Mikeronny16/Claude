"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import type { MapStop } from "../../components/YBSMap"

const YBSMap = dynamic(() => import("../../components/YBSMap"), {
  ssr: false,
  loading: () => <div className="shimmer h-64 rounded-2xl" />,
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface NearbyStop {
  id: number
  name_en: string
  name_mm: string | null
  township_en: string | null
  lat: number
  lng: number
  distance_meters: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDist(m: number): string {
  if (m < 1000) return `~${Math.round(m)}m`
  return `~${(m / 1000).toFixed(1)}km`
}

// ─── Inner component (needs useSearchParams) ──────────────────────────────────

function NearbyInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [stops, setStops] = useState<NearbyStop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [center, setCenter] = useState<[number, number]>([96.1735, 16.8409])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const fetchNearby = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)
    setCenter([lng, lat])
    try {
      const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=800`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setStops(data ?? [])
      }
    } catch {
      setError("Failed to load nearby stops")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const lat = parseFloat(searchParams.get("lat") ?? "")
    const lng = parseFloat(searchParams.get("lng") ?? "")

    if (!isNaN(lat) && !isNaN(lng)) {
      fetchNearby(lat, lng)
    } else {
      // Request geolocation
      if (!navigator.geolocation) {
        setError("Geolocation not supported")
        setLoading(false)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchNearby(pos.coords.latitude, pos.coords.longitude),
        () => {
          setError("Location access denied. Please allow location or search for a stop manually.")
          setLoading(false)
        },
        { timeout: 8000 }
      )
    }
  }, [searchParams, fetchNearby])

  const mapStops: MapStop[] = stops.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    name_en: s.name_en,
    name_mm: s.name_mm,
  }))

  const selectedStop = stops.find((s) => s.id === selectedId)

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--base)" }}>
      {/* Nav */}
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            Nearby Stops
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            အနီးဆုံးဂိတ်များ · 800m radius
          </p>
        </div>
        <button
          onClick={() => {
            if (navigator.geolocation) {
              setLoading(true)
              navigator.geolocation.getCurrentPosition(
                (pos) => fetchNearby(pos.coords.latitude, pos.coords.longitude),
                () => setLoading(false)
              )
            }
          }}
          className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
          style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}
        >
          📍 Refresh
        </button>
      </header>

      <main className="flex flex-col" style={{ flex: 1 }}>
        {/* Map */}
        <div className="px-4 pt-4">
          <YBSMap
            stops={loading ? [] : mapStops}
            center={center}
            zoom={15}
            heightClass="h-64"
            selectedStopId={selectedId ?? undefined}
            onStopClick={(id) => setSelectedId(prev => prev === id ? null : id)}
          />
        </div>

        {/* Selected stop panel */}
        {selectedStop && (
          <div
            className="mx-4 mt-3 p-4 rounded-2xl flex items-center justify-between gap-3"
            style={{ background: "var(--surface)", border: "1px solid #E42313" + "40" }}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              {selectedStop.name_mm && (
                <p className="font-myanmar font-bold text-sm truncate" style={{ color: "var(--text)" }}>
                  {selectedStop.name_mm}
                </p>
              )}
              <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                {selectedStop.name_en}
              </p>
              <span
                className="text-xs font-semibold mt-0.5"
                style={{ color: "#E42313" }}
              >
                {fmtDist(selectedStop.distance_meters)} away
              </span>
            </div>
            <button
              onClick={() => router.push(`/stop/${selectedStop.id}`)}
              className="flex-shrink-0 btn-red text-xs px-4 py-2"
            >
              See buses →
            </button>
          </div>
        )}

        {/* Stop list */}
        <div className="px-4 pt-4 pb-10">
          {loading && (
            <div className="flex flex-col gap-3">
              <div className="shimmer h-4 w-1/3 rounded-lg" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="shimmer rounded-full" style={{ width: 36, height: 36, flexShrink: 0 }} />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="shimmer h-4 rounded w-3/4" />
                    <div className="shimmer h-3 rounded w-1/2" />
                  </div>
                  <div className="shimmer rounded-full" style={{ width: 40, height: 20 }} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div
              className="flex flex-col items-center gap-3 py-8 text-center"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ fontSize: "2.5rem" }}>📍</span>
              <p style={{ color: "var(--text)" }} className="font-semibold">Location needed</p>
              <p className="text-sm px-4">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="btn-red text-sm mt-2"
                style={{ padding: "0.5rem 1.25rem" }}
              >
                Search manually
              </button>
            </div>
          )}

          {!loading && !error && stops.length === 0 && (
            <div className="text-center py-8" style={{ color: "var(--muted)" }}>
              <p style={{ fontSize: "2.5rem" }}>🚏</p>
              <p className="mt-2 font-semibold" style={{ color: "var(--text)" }}>No stops nearby</p>
              <p className="text-sm mt-1">Try a wider radius or different location</p>
            </div>
          )}

          {!loading && !error && stops.length > 0 && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
                {stops.length} stops within 800m
              </p>
              <div className="flex flex-col gap-2">
                {stops.map((stop) => {
                  const isSelected = stop.id === selectedId
                  return (
                    <button
                      key={stop.id}
                      onClick={() => {
                        setSelectedId(prev => prev === stop.id ? null : stop.id)
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                      style={{
                        background: isSelected ? "rgba(228,35,19,0.08)" : "var(--surface)",
                        border: `1px solid ${isSelected ? "rgba(228,35,19,0.4)" : "var(--border)"}`,
                      }}
                    >
                      {/* Distance circle */}
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: isSelected ? "rgba(228,35,19,0.15)" : "var(--surface2)",
                          color: isSelected ? "#E42313" : "var(--muted)",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          textAlign: "center",
                          padding: "4px",
                        }}
                      >
                        {fmtDist(stop.distance_meters)}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        {stop.name_mm && (
                          <span
                            className="font-myanmar font-semibold text-sm truncate"
                            style={{ color: "var(--text)" }}
                          >
                            {stop.name_mm}
                          </span>
                        )}
                        <span
                          className="text-xs truncate"
                          style={{ color: stop.name_mm ? "var(--muted)" : "var(--text)" }}
                        >
                          {stop.name_en}
                        </span>
                        {stop.township_en && (
                          <span className="text-xs" style={{ color: "var(--muted)", opacity: 0.7 }}>
                            {stop.township_en}
                          </span>
                        )}
                      </div>

                      {/* Arrow */}
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/stop/${stop.id}`) }}
                        className="flex-shrink-0 rounded-full p-1.5 transition-colors"
                        style={{ background: "var(--surface2)", color: "var(--muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Page wrapper (Suspense for useSearchParams) ───────────────────────────────

export default function NearbyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--base)" }}>
        <div className="text-center">
          <div className="shimmer rounded-full mx-auto mb-4" style={{ width: 48, height: 48 }} />
          <p style={{ color: "var(--muted)" }} className="text-sm">Finding stops near you...</p>
        </div>
      </div>
    }>
      <NearbyInner />
    </Suspense>
  )
}
