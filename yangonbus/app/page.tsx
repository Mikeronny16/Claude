'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X, Bus, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const YBSMap = dynamic(() => import('@/components/YBSMap'), {
  ssr: false,
  loading: () => <div className="map-container h-64 md:h-96 shimmer" />,
})

// ── Types ──────────────────────────────────────────────────────────────────

interface Stop {
  id: number
  name_en: string
  name_mm: string
  township_en: string
  township_mm: string
  lat: number
  lng: number
}

type Lang = 'en' | 'mm'

// ── Copy ───────────────────────────────────────────────────────────────────

const copy = {
  en: {
    logoSub: 'Yangon Bus Finder',
    langToggle: 'မြန်မာ',
    h1a: 'Find Your Bus',
    h1b: 'Anywhere in Yangon',
    placeholder: 'Search stop name…',
    nearMe: 'Near Me',
    popularTitle: 'Popular Stops',
    noResults: 'No stops found',
    loading: 'Searching…',
    typeHint: 'Type at least 2 characters',
    footer: 'Data: thantthet/YBS-Data (CC-BY-SA 4.0) · Not official YRTC data',
  },
  mm: {
    logoSub: 'ဘတ်စ်ကားရှာဖွေရန်',
    langToggle: 'English',
    h1a: 'ဘတ်စ်ကားရှာရန်',
    h1b: 'ရန်ကုန်မြို့တစ်ဝှမ်း',
    placeholder: 'မှတ်တိုင်အမည်ရိုက်ထည့်ပါ…',
    nearMe: 'ကျွန်ုပ်အနီး',
    popularTitle: 'လူကြိုက်များသောမှတ်တိုင်များ',
    noResults: 'မှတ်တိုင်မတွေ့ပါ',
    loading: 'ရှာဖွေနေသည်…',
    typeHint: 'အနည်းဆုံး ၂ လုံး ရိုက်ထည့်ပါ',
    footer: 'ဒေတာ: thantthet/YBS-Data (CC-BY-SA 4.0) · YRTC ၏ တရားဝင်ဒေတာမဟုတ်ပါ',
  },
} as const

// ── Popular stops ──────────────────────────────────────────────────────────

const POPULAR = [
  { id: 1031, en: 'Sule Pagoda', mm: 'သူလေဘုရား' },
  { id: 412,  en: 'Hledan', mm: 'လှည်းတန်း' },
  { id: 209,  en: 'Kyauktada', mm: 'ကျောက်တံတား' },
  { id: 788,  en: 'Insein Rd', mm: 'အင်းစိန်လမ်း' },
  { id: 653,  en: 'Mingalar Market', mm: 'မင်္ဂလာဒုံ' },
  { id: 310,  en: 'Dagon Centre', mm: 'ဒဂုံစင်တာ' },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()

  // language
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => {
    const saved = localStorage.getItem('ybs-lang') as Lang | null
    if (saved === 'en' || saved === 'mm') setLang(saved)
  }, [])
  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'mm' : 'en'
    setLang(next)
    localStorage.setItem('ybs-lang', next)
  }

  const t = copy[lang]

  // search
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Stop[]>([])
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // geo
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'error'>('idle')

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setSearchState('idle')
      setDropdownOpen(false)
      return
    }
    setSearchState('loading')
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
      if (!res.ok) throw new Error('search failed')
      const data: Stop[] = await res.json()
      setResults(data)
      setSearchState('done')
      setDropdownOpen(true)
    } catch {
      setResults([])
      setSearchState('done')
      setDropdownOpen(true)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, doSearch])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id: number) => {
    setDropdownOpen(false)
    setQuery('')
    router.push(`/stop/${id}`)
  }

  const handleNearMe = () => {
    if (!navigator.geolocation) return
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState('idle')
        const { latitude, longitude } = pos.coords
        router.push(`/nearby?lat=${latitude}&lng=${longitude}`)
      },
      () => setGeoState('error'),
      { timeout: 8000 }
    )
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--base)', color: 'var(--text)' }}>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--base)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white text-sm"
            style={{ background: 'var(--red)' }}
          >
            <Bus size={16} />
          </div>
          <div>
            <span className="font-semibold text-sm leading-none" style={{ color: 'var(--text)' }}>
              YBS Guide
            </span>
            <p
              className={`text-xs leading-none mt-0.5 ${lang === 'mm' ? 'font-myanmar' : ''}`}
              style={{ color: 'var(--muted)' }}
            >
              {t.logoSub}
            </p>
          </div>
        </div>
        <button
          onClick={toggleLang}
          className="chip text-xs px-3 py-1.5"
          aria-label="Toggle language"
        >
          {t.langToggle}
        </button>
      </nav>

      <main className="flex-1 flex flex-col">

        {/* ── HERO ── */}
        <section className="px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1
              className={`text-3xl font-bold leading-tight mb-1 ${lang === 'mm' ? 'font-myanmar' : ''}`}
              style={{ color: 'var(--text)' }}
            >
              {t.h1a}
            </h1>
            <p
              className={`text-base mb-6 ${lang === 'mm' ? 'font-myanmar' : ''}`}
              style={{ color: 'var(--muted)' }}
            >
              {t.h1b}
            </p>

            {/* ── Search bar ── */}
            <div ref={searchRef} className="relative">
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <Search size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { if (results.length > 0) setDropdownOpen(true) }}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-transparent outline-none text-sm ${lang === 'mm' ? 'font-myanmar' : ''}`}
                  style={{ color: 'var(--text)' }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {query.length > 0 && (
                  <button
                    onClick={() => { setQuery(''); setResults([]); setDropdownOpen(false) }}
                    style={{ color: 'var(--muted)' }}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* ── Dropdown ── */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                    }}
                  >
                    {searchState === 'loading' && (
                      <div className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>
                        <span className={lang === 'mm' ? 'font-myanmar' : ''}>{t.loading}</span>
                      </div>
                    )}
                    {searchState === 'done' && results.length === 0 && (
                      <div className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>
                        <span className={lang === 'mm' ? 'font-myanmar' : ''}>{t.noResults}</span>
                      </div>
                    )}
                    {results.map((stop, i) => (
                      <button
                        key={stop.id}
                        onClick={() => handleSelect(stop.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        style={{
                          borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = ''
                        }}
                      >
                        <MapPin size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                            {stop.name_en}
                          </div>
                          <div className="text-xs font-myanmar truncate" style={{ color: 'var(--muted)' }}>
                            {stop.name_mm} · {stop.township_en}
                          </div>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Near Me ── */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleNearMe}
                disabled={geoState === 'loading'}
                className="btn-red flex-1 text-sm py-2.5"
              >
                {geoState === 'loading' ? (
                  <span className="opacity-70">…</span>
                ) : (
                  <>
                    <MapPin size={16} />
                    <span className={lang === 'mm' ? 'font-myanmar' : ''}>{t.nearMe}</span>
                  </>
                )}
              </button>
            </div>
            {geoState === 'error' && (
              <p className="mt-2 text-xs" style={{ color: 'var(--amber)' }}>
                Location access denied. Please enable in browser settings.
              </p>
            )}
          </motion.div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="px-4 pb-6">
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-3 ${lang === 'mm' ? 'font-myanmar' : ''}`}
            style={{ color: 'var(--muted)' }}
          >
            {t.popularTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((stop) => (
              <button
                key={stop.id}
                onClick={() => router.push(`/stop/${stop.id}`)}
                className={`chip ${lang === 'mm' ? 'font-myanmar' : ''}`}
              >
                {lang === 'en' ? stop.en : stop.mm}
              </button>
            ))}
          </div>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="px-4 pb-6 flex-1">
          <div className="map-container h-64 md:h-96">
            <YBSMap
              center={[96.1735, 16.8409]}
              zoom={11}
            />
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer
        className="px-4 py-4 text-center text-xs"
        style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}
      >
        <span className={lang === 'mm' ? 'font-myanmar' : ''}>{t.footer}</span>
      </footer>

    </div>
  )
}
