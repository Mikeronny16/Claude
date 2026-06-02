'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, ChevronRight, MapPin, Search, X } from 'lucide-react'
import dynamic from 'next/dynamic'

const YBSMap = dynamic(() => import('@/components/YBSMap'), {
  ssr: false,
  loading: () => <div className="map-container h-72 shimmer" />,
})

// ── Types ──────────────────────────────────────────────────────────────────

interface Stop {
  id: number
  name_en: string
  name_mm: string | null
  township_en: string | null
}

interface DirectRoute {
  route_id: string
  name_mm: string
  color: string
  stops_count: number
  from_seq: number
  to_seq: number
}

interface TransferRoute {
  route1: { id: string; name_mm: string; color: string }
  transfer_stop: { id: number; name_en: string; name_mm: string | null }
  route2: { id: string; name_mm: string; color: string }
}

interface PlanResult {
  direct: DirectRoute[]
  transfers: TransferRoute[]
}

// ── Back button ────────────────────────────────────────────────────────────

function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center rounded-full w-8 h-8 transition-colors flex-shrink-0"
      style={{ background: 'var(--surface2)' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--border)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--surface2)')}
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
  )
}

// ── Route badge pill ───────────────────────────────────────────────────────

function RoutePill({
  id,
  color,
  onClick,
}: {
  id: string
  color: string
  onClick?: () => void
}) {
  const bg = `#${color || 'E42313'}`
  return (
    <button
      onClick={onClick}
      className="route-badge text-xs flex-shrink-0"
      style={{ background: bg, width: '2rem', height: '2rem', fontSize: '0.7rem' }}
    >
      {id}
    </button>
  )
}

// ── Stop autocomplete input ────────────────────────────────────────────────

interface StopInputProps {
  label: string
  placeholder: string
  value: Stop | null
  query: string
  results: Stop[]
  onQueryChange: (q: string) => void
  onSelect: (stop: Stop) => void
  onClear: () => void
}

function StopInput({
  label,
  placeholder,
  value,
  query,
  results,
  onQueryChange,
  onSelect,
  onClear,
}: StopInputProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (q: string) => {
    onQueryChange(q)
    setOpen(q.length >= 2)
  }

  const handleSelect = (stop: Stop) => {
    onSelect(stop)
    setOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl p-3 relative"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold mb-2 font-myanmar" style={{ color: 'var(--muted)' }}>
        {label}
      </p>

      {value ? (
        /* Selected chip */
        <div className="flex items-center gap-2">
          <MapPin size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {value.name_en}
            </p>
            {value.name_mm && (
              <p className="text-xs font-myanmar truncate" style={{ color: 'var(--muted)' }}>
                {value.name_mm}
                {value.township_en ? ` · ${value.township_en}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClear}
            style={{ color: 'var(--muted)' }}
            aria-label="Clear selection"
            className="flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <div className="flex items-center gap-2">
            <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => { if (results.length > 0) setOpen(true) }}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text)' }}
              autoComplete="off"
              spellCheck={false}
            />
            {query.length > 0 && (
              <button
                onClick={() => { onQueryChange(''); setOpen(false) }}
                style={{ color: 'var(--muted)' }}
                aria-label="Clear"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {open && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.13 }}
                className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                  top: '100%',
                }}
              >
                {results.map((stop, i) => (
                  <button
                    key={stop.id}
                    onClick={() => handleSelect(stop)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = ''
                    }}
                  >
                    <MapPin size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {stop.name_en}
                      </p>
                      {stop.name_mm && (
                        <p className="text-xs font-myanmar truncate" style={{ color: 'var(--muted)' }}>
                          {stop.name_mm}
                          {stop.township_en ? ` · ${stop.township_en}` : ''}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PlanPage() {
  const router = useRouter()

  const [fromStop, setFromStop] = useState<Stop | null>(null)
  const [toStop, setToStop] = useState<Stop | null>(null)
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [fromResults, setFromResults] = useState<Stop[]>([])
  const [toResults, setToResults] = useState<Stop[]>([])
  const [plan, setPlan] = useState<PlanResult | null>(null)
  const [planning, setPlanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fromDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Search helpers ─────────────────────────────────────────────────────

  const searchStops = useCallback(async (q: string): Promise<Stop[]> => {
    if (q.length < 2) return []
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
      if (!res.ok) return []
      return res.json()
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current)
    fromDebounceRef.current = setTimeout(async () => {
      setFromResults(await searchStops(fromQuery))
    }, 300)
    return () => { if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current) }
  }, [fromQuery, searchStops])

  useEffect(() => {
    if (toDebounceRef.current) clearTimeout(toDebounceRef.current)
    toDebounceRef.current = setTimeout(async () => {
      setToResults(await searchStops(toQuery))
    }, 300)
    return () => { if (toDebounceRef.current) clearTimeout(toDebounceRef.current) }
  }, [toQuery, searchStops])

  // ── Swap ───────────────────────────────────────────────────────────────

  const handleSwap = () => {
    setFromStop(toStop)
    setToStop(fromStop)
    setFromQuery(toQuery)
    setToQuery(fromQuery)
    setFromResults(toResults)
    setToResults(fromResults)
    setPlan(null)
    setError(null)
  }

  // ── Find route ─────────────────────────────────────────────────────────

  const handleFindRoute = async () => {
    if (!fromStop || !toStop) return
    setPlanning(true)
    setError(null)
    setPlan(null)
    try {
      const res = await fetch(`/api/plan?from=${fromStop.id}&to=${toStop.id}`)
      if (!res.ok) throw new Error('Failed to fetch plan')
      const data: PlanResult = await res.json()
      setPlan(data)
    } catch {
      setError('Could not find routes. Please try again.')
    } finally {
      setPlanning(false)
    }
  }

  const hasResults = plan && (plan.direct.length > 0 || plan.transfers.length > 0)

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--base)', color: 'var(--text)' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <BackButton />
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>
            Journey Planner
          </h1>
          <p className="text-xs font-myanmar leading-tight" style={{ color: 'var(--muted)' }}>
            ခရီးစဉ်ရှာရန်
          </p>
        </div>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-5 pb-10 max-w-lg mx-auto w-full">

        {/* ── FROM ── */}
        <StopInput
          label="From / မှ"
          placeholder="Search departure stop…"
          value={fromStop}
          query={fromQuery}
          results={fromResults}
          onQueryChange={setFromQuery}
          onSelect={(s) => { setFromStop(s); setFromQuery(''); setPlan(null) }}
          onClear={() => { setFromStop(null); setPlan(null) }}
        />

        {/* ── Swap button ── */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            className="flex items-center justify-center rounded-full w-9 h-9 transition-all active:scale-90"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
            aria-label="Swap stops"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* ── TO ── */}
        <StopInput
          label="To / သို့"
          placeholder="Search destination stop…"
          value={toStop}
          query={toQuery}
          results={toResults}
          onQueryChange={setToQuery}
          onSelect={(s) => { setToStop(s); setToQuery(''); setPlan(null) }}
          onClear={() => { setToStop(null); setPlan(null) }}
        />

        {/* ── Find route button ── */}
        <AnimatePresence>
          {fromStop && toStop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              <button
                onClick={handleFindRoute}
                disabled={planning}
                className="btn-red w-full py-3 text-base"
              >
                {planning ? (
                  <span className="opacity-70">Searching…</span>
                ) : (
                  'Find Route'
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error ── */}
        {error && (
          <p className="text-sm text-center" style={{ color: 'var(--amber)' }}>
            {error}
          </p>
        )}

        {/* ── Results ── */}
        <AnimatePresence>
          {plan && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              {/* ── DIRECT ROUTES ── */}
              {plan.direct.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    Direct Routes
                  </h2>
                  {plan.direct.map((route) => (
                    <button
                      key={route.route_id}
                      onClick={() => router.push(`/route/${route.route_id}`)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `#${route.color || 'E42313'}`
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                      }}
                    >
                      <RoutePill id={route.route_id} color={route.color} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-myanmar font-semibold text-sm leading-tight truncate"
                          style={{ color: 'var(--text)' }}
                        >
                          {route.name_mm}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="chip" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                            {route.stops_count} stops
                          </span>
                          <span
                            className="chip"
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.5rem',
                              color: '#22c55e',
                              borderColor: 'rgba(34,197,94,0.3)',
                              background: 'rgba(34,197,94,0.08)',
                            }}
                          >
                            No transfer
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                    </button>
                  ))}
                </section>
              )}

              {/* ── TRANSFER ROUTES ── */}
              {plan.transfers.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    With Transfer
                  </h2>
                  {plan.transfers.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-2xl px-4 py-3 flex flex-col gap-2"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {/* Route 1 */}
                      <button
                        onClick={() => router.push(`/route/${t.route1.id}`)}
                        className="flex items-center gap-2 transition-opacity active:opacity-70"
                      >
                        <RoutePill id={t.route1.id} color={t.route1.color} />
                        <span
                          className="font-myanmar text-sm truncate flex-1 text-left"
                          style={{ color: 'var(--text)' }}
                        >
                          {t.route1.name_mm}
                        </span>
                        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
                      </button>

                      {/* Transfer stop */}
                      <div className="flex items-center gap-2 pl-1">
                        <div
                          className="w-6 h-px flex-shrink-0"
                          style={{ background: 'var(--border)' }}
                        />
                        <span className="chip" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                          <MapPin size={10} style={{ color: 'var(--amber)' }} />
                          Change at{' '}
                          {t.transfer_stop.name_mm
                            ? `${t.transfer_stop.name_mm} · `
                            : ''}
                          {t.transfer_stop.name_en}
                        </span>
                      </div>

                      {/* Route 2 */}
                      <button
                        onClick={() => router.push(`/route/${t.route2.id}`)}
                        className="flex items-center gap-2 transition-opacity active:opacity-70"
                      >
                        <RoutePill id={t.route2.id} color={t.route2.color} />
                        <span
                          className="font-myanmar text-sm truncate flex-1 text-left"
                          style={{ color: 'var(--text)' }}
                        >
                          {t.route2.name_mm}
                        </span>
                        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
                      </button>
                    </div>
                  ))}
                </section>
              )}

              {/* ── NO RESULTS ── */}
              {!hasResults && (
                <div
                  className="rounded-2xl px-5 py-8 flex flex-col items-center gap-3 text-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span style={{ fontSize: '2.5rem' }}>🚌</span>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    No direct route found
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Try nearby stops — you may need to walk to a connecting stop.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Map placeholder when both stops selected ── */}
        {fromStop && toStop && !plan && !planning && (
          <div className="map-container h-52 mt-2">
            <YBSMap
              center={[
                (fromStop.id === toStop.id ? 96.1735 : 96.1735),
                16.8409,
              ]}
              zoom={11}
            />
          </div>
        )}
      </main>
    </div>
  )
}
