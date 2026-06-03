"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Share2, RotateCcw, Star, Heart, Check } from "lucide-react"

interface Look {
  name: string
  style_tag: string
  description: string
  key_pieces: string[]
  why_it_suits_you: string
  image_url: string
}

interface StyleProfile {
  aura_type: string
  color_season: string
  vibe_summary: string
}

interface Session {
  id: string
  style_profile: StyleProfile
  looks: Look[]
  occasion: string
  created_at: string
}

const TAG_STYLES: Record<string, { bg: string; text: string; accent: string }> = {
  streetwear:  { bg: "rgba(0,229,255,0.12)",    text: "#00E5FF",  accent: "#00E5FF" },
  minimalist:  { bg: "rgba(255,255,255,0.08)",  text: "#e5e5e5",  accent: "#ffffff" },
  romantic:    { bg: "rgba(255,0,255,0.12)",    text: "#FF00FF",  accent: "#FF00FF" },
  dark:        { bg: "rgba(168,85,247,0.12)",   text: "#c084fc",  accent: "#a855f7" },
  business:    { bg: "rgba(255,215,0,0.12)",    text: "#FFD700",  accent: "#FFD700" },
  y2k:         { bg: "rgba(250,204,21,0.12)",   text: "#facc15",  accent: "#facc15" },
  boho:        { bg: "rgba(251,146,60,0.12)",   text: "#fb923c",  accent: "#fb923c" },
}

function getTagStyle(tag: string) {
  return TAG_STYLES[tag?.toLowerCase()] ?? TAG_STYLES.streetwear
}

function getSeasonColor(season: string) {
  const s = season?.toLowerCase() ?? ""
  if (s.includes("autumn") || s.includes("fall")) return "#FF8C42"
  if (s.includes("winter")) return "#00E5FF"
  if (s.includes("summer")) return "#FF6BA3"
  if (s.includes("spring")) return "#A8FF3E"
  return "#FF00FF"
}

const LOADING_TEXTS = [
  "Fetching your looks...",
  "Loading style profile...",
  "Almost ready...",
]

export default function LooksPage() {
  const { id } = useParams()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [likedLooks, setLikedLooks] = useState<Set<number>>(new Set())
  const [activeLook, setActiveLook] = useState<number | null>(null)
  const [shared, setShared] = useState(false)
  const [loadingTextIdx, setLoadingTextIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setLoadingTextIdx(i => (i + 1) % LOADING_TEXTS.length), 1500)
    fetch(`/api/looks/${id}`)
      .then(r => r.json())
      .then(d => {
        clearInterval(interval)
        if (d.session) setSession(d.session)
        else setError(true)
        setLoading(false)
      })
      .catch(() => { clearInterval(interval); setError(true); setLoading(false) })
    return () => clearInterval(interval)
  }, [id])

  const toggleLike = (e: React.MouseEvent, i: number) => {
    e.stopPropagation()
    setLikedLooks(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleShare = async () => {
    if (!session) return
    const text = `✨ My AURA Style Profile!\n\nStyle Aura: ${session.style_profile.aura_type}\nColor Season: ${session.style_profile.color_season}\n\nGet yours free → aura.style 💅`
    if (navigator.share) {
      await navigator.share({ title: "My AURA Style", text, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-t-[#FF00FF] border-r-[#00E5FF] border-b-[#FF00FF]/30 border-l-[#00E5FF]/30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={20} className="text-[#FF00FF]" />
          </div>
        </div>
        <motion.p
          key={loadingTextIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-white/40 text-sm"
        >
          {LOADING_TEXTS[loadingTextIdx]}
        </motion.p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <Sparkles size={28} className="text-white/20" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white mb-2">Session not found</h2>
          <p className="text-white/40 text-sm">This style session may have expired.</p>
        </div>
        <Link href="/discover"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white font-bold text-sm glow-pink hover:opacity-90 transition-opacity">
          Create New Session
        </Link>
      </div>
    )
  }

  const { style_profile, looks, occasion } = session
  const seasonColor = getSeasonColor(style_profile.color_season)

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-24">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0D0D0D]/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </Link>
          <Link href="/discover"
            className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-white transition-colors border border-white/10 rounded-full px-3 py-1.5 hover:border-white/20">
            <RotateCcw size={12} /> New Reading
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4">

        {/* ── Style Profile Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mt-8 mb-10"
        >
          {/* Occasion chip */}
          <div className="flex justify-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/25 border border-white/8 rounded-full px-3 py-1">
              {occasion}
            </span>
          </div>

          {/* Profile card */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,0,255,0.15) 0%, transparent 50%, rgba(0,229,255,0.15) 100%)", padding: "1px" }}>
            <div className="rounded-3xl px-6 py-8 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(160deg, #1a0820 0%, #0D0D0D 55%, #080f1a 100%)" }}>

              {/* Bg blobs */}
              <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[#FF00FF]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-[#00E5FF]/10 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#FFD700]/5 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Label */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Sparkles size={11} className="text-[#FF00FF]" />
                  <span className="text-[#FF00FF] text-[10px] font-bold uppercase tracking-[0.2em]">Your Style Aura</span>
                  <Sparkles size={11} className="text-[#FF00FF]" />
                </div>

                {/* Aura type — hero text */}
                <h1 className="text-5xl md:text-6xl font-black gradient-text text-glow-pink mb-4 leading-[1.05]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {style_profile.aura_type}
                </h1>

                {/* Color season badge */}
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-xs font-bold"
                  style={{ background: `${seasonColor}18`, color: seasonColor, border: `1px solid ${seasonColor}35` }}>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: seasonColor, boxShadow: `0 0 6px ${seasonColor}` }}
                  />
                  {style_profile.color_season}
                </div>

                {/* Vibe summary */}
                <p className="text-white/55 text-sm leading-relaxed max-w-sm mx-auto">
                  {style_profile.vibe_summary}
                </p>
              </div>
            </div>
          </div>

          {/* Section divider */}
          <div className="mt-10 mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em]">✦ 6 Curated Looks ✦</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        </motion.section>

        {/* ── Look Cards Grid ── */}
        <div className="grid grid-cols-2 gap-3">
          {looks.map((look, i) => {
            const ts = getTagStyle(look.style_tag)
            const isLiked = likedLooks.has(i)
            const isOpen = activeLook === i

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                onClick={() => setActiveLook(isOpen ? null : i)}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  border: `1px solid ${isOpen ? ts.accent + "50" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isOpen ? `0 0 25px ${ts.accent}20` : "none",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  background: "#111111",
                }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={look.image_url}
                    alt={look.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transform: isOpen ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s ease" }}
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent" />

                  {/* Style tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{ background: ts.bg, color: ts.text }}>
                      {look.style_tag}
                    </span>
                  </div>

                  {/* Like btn */}
                  <button
                    onClick={e => toggleLike(e, i)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90"
                    style={{ border: `1px solid ${isLiked ? "#FF00FF50" : "rgba(255,255,255,0.1)"}` }}
                  >
                    <Heart size={11} style={{ color: isLiked ? "#FF00FF" : "rgba(255,255,255,0.5)", fill: isLiked ? "#FF00FF" : "none" }} />
                  </button>

                  {/* Look number */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
                    <span className="text-[9px] text-white/25 font-bold">#{i + 1}</span>
                  </div>

                  {/* Look name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-black text-[13px] leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {look.name}
                    </p>
                  </div>
                </div>

                {/* Expandable details */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        {/* Description */}
                        <p className="text-white/55 text-[11px] leading-relaxed">{look.description}</p>

                        {/* Key pieces */}
                        <div>
                          <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest mb-1.5">Key Pieces</p>
                          <div className="flex flex-wrap gap-1">
                            {look.key_pieces.map((piece, pi) => (
                              <span key={pi}
                                className="text-[9px] font-medium rounded-full px-2 py-0.5"
                                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {piece}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Why it suits */}
                        <div className="flex items-start gap-1.5 rounded-xl p-2.5"
                          style={{ background: ts.bg, border: `1px solid ${ts.accent}20` }}>
                          <Star size={9} style={{ color: ts.accent, flexShrink: 0, marginTop: 1 }} />
                          <p className="text-[10px] leading-relaxed" style={{ color: ts.text }}>
                            {look.why_it_suits_you}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/18 text-xs mt-4"
        >
          Tap any look to reveal details ✨
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-3"
        >
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-full font-black text-base bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow-pink"
          >
            {shared
              ? <><Check size={20} /> Link Copied!</>
              : <><Share2 size={20} /> Share My Aura</>
            }
          </button>

          <Link href="/discover"
            className="w-full py-4 rounded-full font-bold text-base border border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            New Style Reading
          </Link>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/12 text-xs mt-10 mb-4">
          ✦ Powered by <span className="text-white/25 font-bold">AURA</span> AI Personal Stylist ✦
        </p>
      </div>
    </div>
  )
}
