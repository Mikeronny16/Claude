"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Share2, Download, RotateCcw, Lock, Check, ChevronLeft } from "lucide-react"

interface LookMeta {
  name: string
  style_tag: string
  caption: string
  key_pieces: string[]
  why_it_suits_you: string
  image_prompt: string
}

interface StyleProfile {
  aura_type: string
  color_season: string
  vibe: string
}

interface GeneratedLook {
  meta: LookMeta
  imageUrl: string | null
  loading: boolean
  error: boolean
  isMock?: boolean
}

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=900&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=900&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=900&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=900&fit=crop&crop=faces",
]

const TAG_COLORS: Record<string, string> = {
  streetwear: "#00E5FF", minimalist: "#9A9A92", romantic: "#FFB3D9",
  dark: "#a855f7", business: "#C8A24B", y2k: "#facc15", boho: "#fb923c",
}

function hasCredits(): boolean {
  if (typeof window === "undefined") return false
  const credits = parseInt(localStorage.getItem("aura_credits") || "0", 10)
  return credits > 0
}

function deductCredit() {
  if (typeof window === "undefined") return
  const credits = parseInt(localStorage.getItem("aura_credits") || "0", 10)
  if (credits > 0) localStorage.setItem("aura_credits", String(credits - 1))
}

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()

  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null)
  const [looks, setLooks] = useState<GeneratedLook[]>([])
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [selfieB64, setSelfieB64] = useState<string | null>(null)
  const [shared, setShared] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [activeLook, setActiveLook] = useState<number | null>(null)

  // Load session + selfie from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("aura_session")
    if (!raw) {
      // Fallback: fetch from API
      fetch(`/api/session?id=${sessionId}`)
        .then(r => r.json())
        .then(d => {
          if (d.style_profile) {
            setStyleProfile(d.style_profile)
            const initialLooks: GeneratedLook[] = (d.looks_meta || []).map((m: LookMeta) => ({
              meta: m, imageUrl: null, loading: false, error: false
            }))
            setLooks(initialLooks)
            setSessionLoaded(true)
          }
        })
        .catch(() => router.push("/create"))
      return
    }
    const session = JSON.parse(raw)
    setStyleProfile(session.style_profile)
    setSelfieB64(session.selfie_b64 || null)
    const initialLooks: GeneratedLook[] = (session.looks_meta || []).map((m: LookMeta) => ({
      meta: m, imageUrl: null, loading: false, error: false
    }))
    setLooks(initialLooks)
    setSessionLoaded(true)
    setUnlocked(hasCredits())
  }, [sessionId, router])

  const generateLook = useCallback(async (index: number, looksSnapshot: GeneratedLook[]) => {
    const look = looksSnapshot[index]
    if (!look || look.imageUrl || look.loading) return

    setLooks(prev => {
      const next = [...prev]
      next[index] = { ...next[index], loading: true }
      return next
    })

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lookIndex: index,
          promptText: look.meta.image_prompt,
          selfieB64: selfieB64 || "",
        }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        setLooks(prev => {
          const next = [...prev]
          next[index] = { ...next[index], imageUrl: data.imageUrl, loading: false, isMock: data.isMock }
          return next
        })
      } else throw new Error("no url")
    } catch {
      setLooks(prev => {
        const next = [...prev]
        next[index] = { ...next[index], loading: false, error: true, imageUrl: FALLBACK_IMGS[index] }
        return next
      })
    }
  }, [sessionId, selfieB64])

  // Auto-generate look #0 (free), then others if unlocked
  useEffect(() => {
    if (!sessionLoaded || looks.length === 0) return

    // Always generate first look (free)
    generateLook(0, looks)

    // If unlocked, generate all
    if (unlocked) {
      for (let i = 1; i < looks.length; i++) {
        generateLook(i, looks)
      }
    }
  }, [sessionLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnlock = () => {
    if (hasCredits()) {
      deductCredit()
      setUnlocked(true)
      // Generate remaining looks
      for (let i = 1; i < looks.length; i++) {
        generateLook(i, looks)
      }
    } else {
      router.push("/pricing")
    }
  }

  const handleShare = async () => {
    const text = `✨ My AURA Style Profile\n\n${styleProfile?.aura_type} · ${styleProfile?.color_season}\n\nGet yours at aura.style`
    if (navigator.share) {
      await navigator.share({ title: "My AURA", text, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2500)
    }
  }

  if (!sessionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B0B0D" }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 mx-auto mb-4"
            style={{ borderColor: "#C8A24B transparent transparent transparent" }}
          />
          <p style={{ color: "#9A9A92" }} className="text-sm">Loading your style session...</p>
        </div>
      </div>
    )
  }

  const completedCount = looks.filter(l => l.imageUrl).length
  const isGenerating = looks.some(l => l.loading)

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0B0B0D" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #26262B", background: "rgba(11,11,13,0.9)" }}
        className="sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#C8A24B" }} />
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#F5F5F0" }}>
              AURA
            </span>
          </Link>
          <Link href="/create"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "#9A9A92" }}>
            <RotateCcw size={12} /> New Session
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-8">

        {/* Style Profile Hero */}
        {styleProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#C8A24B" }}>
              ✦ Your Style Aura ✦
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: "#F5F5F0" }}>
              {styleProfile.aura_type}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{ background: "rgba(200,162,75,0.12)", color: "#C8A24B", border: "1px solid rgba(200,162,75,0.25)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C8A24B" }} />
              {styleProfile.color_season}
            </div>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "#9A9A92" }}>
              {styleProfile.vibe}
            </p>

            {/* Progress indicator */}
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: "#C8A24B transparent transparent transparent" }}
                  />
                  <span className="text-xs" style={{ color: "#9A9A92" }}>
                    Styling look {completedCount + 1} of {looks.length}...
                  </span>
                </div>
                <div className="max-w-xs mx-auto rounded-full overflow-hidden h-1"
                  style={{ background: "#26262B" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #C8A24B, #A8843B)" }}
                    animate={{ width: `${(completedCount / looks.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "#26262B" }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#9A9A92" }}>
            Your 6 Curated Looks
          </span>
          <div className="flex-1 h-px" style={{ background: "#26262B" }} />
        </div>

        {/* Looks Grid */}
        <div className="grid grid-cols-2 gap-3">
          {looks.map((look, i) => {
            const isFree = i === 0
            const isPaywalled = !isFree && !unlocked
            const tagColor = TAG_COLORS[look.meta.style_tag?.toLowerCase()] ?? "#C8A24B"
            const isOpen = activeLook === i

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                onClick={() => !isPaywalled && setActiveLook(isOpen ? null : i)}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: "#16161A",
                  border: `1px solid ${isOpen ? tagColor + "40" : "#26262B"}`,
                  boxShadow: isOpen ? `0 0 20px ${tagColor}15` : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Skeleton loader */}
                  {look.loading && (
                    <div className="absolute inset-0 shimmer" style={{ background: "#16161A" }}>
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 rounded-full border-2"
                          style={{ borderColor: "#C8A24B transparent transparent transparent" }}
                        />
                        <p className="text-xs" style={{ color: "#9A9A92" }}>Styling...</p>
                      </div>
                    </div>
                  )}

                  {/* Generated image */}
                  {look.imageUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={look.imageUrl}
                        alt={look.meta.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: isOpen ? "scale(1.04)" : "scale(1)" }}
                      />
                      {/* Paywall blur */}
                      {isPaywalled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                          style={{ backdropFilter: "blur(12px)", background: "rgba(11,11,13,0.7)" }}>
                          <Lock size={20} style={{ color: "#C8A24B" }} />
                          <p className="text-xs font-semibold" style={{ color: "#F5F5F0" }}>Unlock</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Empty state */}
                  {!look.loading && !look.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "#16161A" }}>
                      <Sparkles size={20} style={{ color: "#26262B" }} />
                    </div>
                  )}

                  {/* Overlays */}
                  {look.imageUrl && !isPaywalled && (
                    <>
                      <div className="absolute inset-0" style={{
                        background: "linear-gradient(to top, rgba(11,11,13,0.9) 0%, transparent 50%)"
                      }} />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                          style={{ background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}30` }}>
                          {look.meta.style_tag}
                        </span>
                      </div>
                      {isFree && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(200,162,75,0.2)", color: "#C8A24B" }}>
                            FREE
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-bold text-[13px] leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif", color: "#F5F5F0" }}>
                          {look.meta.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Expandable detail panel */}
                <AnimatePresence initial={false}>
                  {isOpen && look.imageUrl && !isPaywalled && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-2.5">
                        <p className="text-[11px] leading-relaxed" style={{ color: "#9A9A92" }}>
                          {look.meta.caption}
                        </p>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "#9A9A92" }}>
                            Key Pieces
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {look.meta.key_pieces?.map((p, pi) => (
                              <span key={pi} className="text-[9px] px-2 py-0.5 rounded-full"
                                style={{ background: "#26262B", color: "#9A9A92", border: "1px solid #26262B" }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5 p-2 rounded-xl"
                          style={{ background: `${tagColor}0F`, border: `1px solid ${tagColor}20` }}>
                          <Sparkles size={9} style={{ color: tagColor, flexShrink: 0, marginTop: 1 }} />
                          <p className="text-[10px] leading-relaxed" style={{ color: tagColor }}>
                            {look.meta.why_it_suits_you}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Tap hint */}
        {!unlocked && completedCount > 0 && (
          <p className="text-center text-xs mt-3" style={{ color: "#9A9A92" }}>
            Tap Look 1 for details
          </p>
        )}

        {/* Paywall CTA */}
        <AnimatePresence>
          {!unlocked && looks.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 rounded-2xl p-5 text-center"
              style={{ background: "#16161A", border: "1px solid #26262B" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C8A24B" }}>
                5 More Looks Waiting
              </div>
              <p className="text-sm mb-1" style={{ color: "#F5F5F0" }}>
                Get all 6 looks in HD, downloadable
              </p>
              <p className="text-xs mb-5" style={{ color: "#9A9A92" }}>
                5,000 MMK · $3 · One-time unlock
              </p>
              <button
                onClick={handleUnlock}
                className="w-full py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C8A24B, #A8843B)", color: "#0B0B0D" }}
              >
                <Download size={16} className="inline mr-2" />
                Unlock Full Glow-Up
              </button>
              <Link href="/pricing"
                className="block mt-2 text-xs transition-colors"
                style={{ color: "#9A9A92" }}>
                See payment options →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 flex gap-3"
        >
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C8A24B, #A8843B)", color: "#0B0B0D" }}
          >
            {shared ? <><Check size={16} /> Copied!</> : <><Share2 size={16} /> Share My Aura</>}
          </button>
          <Link href="/create"
            className="px-5 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors"
            style={{ border: "1px solid #26262B", color: "#9A9A92" }}>
            <RotateCcw size={16} />
          </Link>
        </motion.div>

        <p className="text-center text-xs mt-8" style={{ color: "#26262B" }}>
          ✦ AURA AI Personal Stylist ✦
        </p>
      </div>
    </div>
  )
}
