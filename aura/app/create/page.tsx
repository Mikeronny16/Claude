"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Upload, Camera, ArrowRight, X, Check } from "lucide-react"

const STYLE_VIBES = [
  "Streetwear",
  "Minimalist",
  "Romantic",
  "Dark Academia",
  "Business Chic",
  "Y2K",
  "Boho",
] as const

const OCCASIONS = [
  "Everyday",
  "Night Out",
  "Work",
  "Date Night",
  "Festival",
  "Formal",
] as const

const LOADING_LINES = [
  "Reading your coloring…",
  "Mapping your aura…",
  "Tailoring look 1 of 6…",
  "Tailoring look 2 of 6…",
  "Tailoring look 3 of 6…",
  "Tailoring look 4 of 6…",
  "Tailoring look 5 of 6…",
  "Finishing look 6 of 6…",
  "Styling your aura…",
  "Almost there…",
]

export default function CreatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selfie, setSelfie] = useState<string | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)

  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [selectedOccasion, setSelectedOccasion] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [loadingLine, setLoadingLine] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // On mount, pull selfie from sessionStorage if present
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("aura_pending_selfie")
      if (stored) {
        setSelfie(stored)
        // Convert dataURL to File for submission
        fetch(stored)
          .then((r) => r.blob())
          .then((blob) => {
            const file = new File([blob], "selfie.jpg", { type: blob.type || "image/jpeg" })
            setSelfieFile(file)
          })
          .catch(() => {})
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [])

  // Cycle loading text
  useEffect(() => {
    if (!loading) return
    const id = setInterval(() => {
      setLoadingLine((prev) => (prev + 1) % LOADING_LINES.length)
    }, 1400)
    return () => clearInterval(id)
  }, [loading])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    setSelfieFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setSelfie(dataUrl)
      try {
        sessionStorage.setItem("aura_pending_selfie", dataUrl)
      } catch {
        // storage full
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) => {
      if (prev.includes(vibe)) return prev.filter((v) => v !== vibe)
      if (prev.length >= 2) return [prev[1], vibe]
      return [...prev, vibe]
    })
  }

  const handleSubmit = async () => {
    if (!selfieFile) {
      setError("Please upload a selfie first.")
      return
    }
    if (!selectedOccasion) {
      setError("Please select an occasion.")
      return
    }
    setError(null)
    setLoading(true)
    setLoadingLine(0)

    try {
      const form = new FormData()
      form.append("image", selfieFile)
      form.append("style", selectedVibes.join(", ") || "No preference")
      form.append("occasion", selectedOccasion)

      const res = await fetch("/api/session", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok || !data.sessionId) {
        throw new Error(data.error || "Generation failed. Please try again.")
      }

      try { sessionStorage.removeItem("aura_pending_selfie") } catch { /* ok */ }
      router.push(`/result/${data.sessionId}`)
    } catch (err) {
      setLoading(false)
      setError((err as Error).message)
    }
  }

  const clearSelfie = () => {
    setSelfie(null)
    setSelfieFile(null)
    try { sessionStorage.removeItem("aura_pending_selfie") } catch { /* ok */ }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D]">

      {/* NAV */}
      <nav className="border-b border-[#26262B] bg-[#0B0B0D]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-widest text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.18em" }}
          >
            AURA
          </Link>
          <span className="text-[#9A9A92] text-xs tracking-[0.1em] uppercase">Style Studio</span>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {loading ? (
          /* ── LOADING STATE ── */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-5 py-16"
          >
            {/* Skeleton grid */}
            <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="shimmer rounded-xl"
                  style={{ aspectRatio: "3/4" }}
                />
              ))}
            </div>

            {/* Status text */}
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingLine}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-[#C8A24B] text-sm font-medium tracking-wide mb-2"
                >
                  {LOADING_LINES[loadingLine]}
                </motion.p>
              </AnimatePresence>
              <p className="text-[#9A9A92] text-xs">This takes about 30 seconds</p>
            </div>
          </motion.div>
        ) : (
          /* ── FORM STATE ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto px-5 py-10 pb-24"
          >

            {/* Step indicator */}
            <p className="text-[#9A9A92] text-xs tracking-[0.15em] uppercase mb-2">Create Your Look</p>
            <h1
              className="font-display text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-[#F5F5F0] mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let&apos;s Build Your<br /><em className="text-[#C8A24B]">Style Profile.</em>
            </h1>

            {/* ── SELFIE SECTION ── */}
            <div className="mb-10">
              <label className="text-[#F5F5F0] text-sm font-semibold mb-3 block">
                1 — Your Selfie
              </label>

              {!selfie ? (
                <div
                  className={`upload-zone rounded-2xl cursor-pointer ${dragging ? "dragging" : ""}`}
                  style={{ padding: "2.5rem 1.5rem" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full border border-[#C8A24B]/30 flex items-center justify-center">
                      <Upload size={22} className="text-[#C8A24B]" />
                    </div>
                    <div>
                      <p className="text-[#F5F5F0] font-medium text-sm">Drop your selfie here</p>
                      <p className="text-[#9A9A92] text-xs mt-1">or tap to open camera / gallery</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera size={13} className="text-[#9A9A92]" />
                      <span className="text-[#9A9A92] text-xs">Mobile camera supported</span>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border border-[#C8A24B]/25 gold-glow"
                  style={{ maxHeight: 340 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selfie}
                    alt="Your selfie"
                    className="w-full object-cover"
                    style={{ maxHeight: 340 }}
                  />
                  <button
                    onClick={clearSelfie}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0B0B0D]/70 border border-white/10 flex items-center justify-center text-[#9A9A92] hover:text-[#F5F5F0] transition-colors"
                    aria-label="Remove selfie"
                  >
                    <X size={15} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0B0B0D]/70 rounded-full px-3 py-1">
                    <Check size={12} className="text-[#C8A24B]" />
                    <span className="text-[#C8A24B] text-xs font-medium">Photo ready</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── STYLE VIBES ── */}
            <div className="mb-10">
              <label className="text-[#F5F5F0] text-sm font-semibold mb-1 block">
                2 — Your Style Vibe
              </label>
              <p className="text-[#9A9A92] text-xs mb-4">Pick up to 2 that speak to you</p>

              <div className="flex flex-wrap gap-2.5">
                {STYLE_VIBES.map((vibe) => {
                  const active = selectedVibes.includes(vibe)
                  return (
                    <motion.button
                      key={vibe}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleVibe(vibe)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                      style={{
                        background: active ? "linear-gradient(135deg, #C8A24B, #A8843B)" : "transparent",
                        color: active ? "#000" : "rgba(245,245,240,0.65)",
                        borderColor: active ? "#C8A24B" : "rgba(255,255,255,0.12)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {vibe}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* ── OCCASION ── */}
            <div className="mb-10">
              <label className="text-[#F5F5F0] text-sm font-semibold mb-1 block">
                3 — Occasion
              </label>
              <p className="text-[#9A9A92] text-xs mb-4">Where are these looks for?</p>

              <div className="flex flex-wrap gap-2.5">
                {OCCASIONS.map((occ) => {
                  const active = selectedOccasion === occ
                  return (
                    <motion.button
                      key={occ}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedOccasion(occ)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                      style={{
                        background: active ? "linear-gradient(135deg, #C8A24B, #A8843B)" : "transparent",
                        color: active ? "#000" : "rgba(245,245,240,0.65)",
                        borderColor: active ? "#C8A24B" : "rgba(255,255,255,0.12)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {occ}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* ── ERROR ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SUBMIT ── */}
            <motion.button
              onClick={handleSubmit}
              disabled={!selfie || !selectedOccasion}
              whileHover={selfie && selectedOccasion ? { scale: 1.02 } : {}}
              whileTap={selfie && selectedOccasion ? { scale: 0.98 } : {}}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate My Looks
              <ArrowRight size={18} />
            </motion.button>

            <p className="text-[#9A9A92]/50 text-xs text-center mt-4">
              Free · No login · ~30 seconds
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
