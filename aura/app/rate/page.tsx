"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Upload, X, ChevronDown, Zap, Crown } from "lucide-react"

const FREE_LIMIT = 3
const OCCASIONS = ["Casual", "Night Out", "Formal", "Street Style", "Date Night", "Work/Office", "Festival", "Wedding Guest"]
const MODES = [
  { id: "standard", label: "✨ Standard", desc: "Balanced scoring" },
  { id: "roast", label: "🔥 Roast Me", desc: "Brutal honest feedback" },
  { id: "glam", label: "👑 Glam Check", desc: "Red carpet ready?" },
]

function getCredits(): number {
  if (typeof window === "undefined") return FREE_LIMIT
  const paid = parseInt(localStorage.getItem("aura_credits") ?? "0")
  const used = parseInt(localStorage.getItem("aura_free_used") ?? "0")
  const freeLeft = Math.max(0, FREE_LIMIT - used)
  return paid + freeLeft
}

function useCredit() {
  const used = parseInt(localStorage.getItem("aura_free_used") ?? "0")
  const paid = parseInt(localStorage.getItem("aura_credits") ?? "0")
  if (paid > 0) {
    localStorage.setItem("aura_credits", String(paid - 1))
  } else {
    localStorage.setItem("aura_free_used", String(used + 1))
  }
}

export default function RatePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [credits, setCredits] = useState(FREE_LIMIT)

  useEffect(() => { setCredits(getCredits()) }, [])
  const [occasion, setOccasion] = useState("Casual")
  const [mode, setMode] = useState("standard")
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showOccasions, setShowOccasions] = useState(false)

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onSubmit = async () => {
    if (!file) return
    if (credits <= 0) { router.push("/pricing"); return }
    setLoading(true)
    try {
      useCredit()
      const form = new FormData()
      form.append("image", file)
      form.append("occasion", occasion)
      form.append("mode", mode)
      const res = await fetch("/api/analyze", { method: "POST", body: form })
      const data = await res.json()
      if (data.id) router.push(`/result/${data.id}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Rate Your <span className="gradient-text">Outfit</span>
          </h1>
          <p className="text-white/50 mb-4">Upload a photo and get your aura score in seconds — no login needed.</p>
          {/* Credit indicator */}
          {credits > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <Zap size={12} className="text-[#FFD700]" />
              <span className="text-white/60">{credits} rating{credits !== 1 ? "s" : ""} remaining</span>
              {credits <= 1 && (
                <Link href="/pricing" className="text-[#FF00FF] text-xs font-bold hover:underline">Get more →</Link>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF00FF]/10 border border-[#FF00FF]/30 text-sm">
              <Crown size={12} className="text-[#FF00FF]" />
              <span className="text-white/70">No credits left —</span>
              <Link href="/pricing" className="text-[#FF00FF] font-bold hover:underline">Unlock more</Link>
            </div>
          )}
        </motion.div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {!preview ? (
            <div
              className={`upload-zone rounded-2xl p-12 text-center cursor-pointer ${dragging ? "dragging" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-[#00E5FF]" />
              </div>
              <p className="text-white font-semibold mb-1">Drop your outfit photo here</p>
              <p className="text-white/40 text-sm">or tap to browse — JPG, PNG, WEBP</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="outfit" className="w-full max-h-80 object-cover" />
              <button
                onClick={() => { setFile(null); setPreview(null) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={14} className="text-white" />
              </button>
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-white/70 flex items-center gap-1">
                <Sparkles size={10} className="text-[#FF00FF]" /> Ready to analyze
              </div>
            </div>
          )}
        </motion.div>

        {/* Mode Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <p className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Rating Mode</p>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === m.id
                    ? "border-[#FF00FF]/60 bg-[#FF00FF]/10 glow-pink"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="text-sm font-bold mb-1">{m.label}</div>
                <div className="text-white/40 text-xs">{m.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Occasion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6">
          <p className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Occasion</p>
          <div className="relative">
            <button
              onClick={() => setShowOccasions(!showOccasions)}
              className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors text-left flex items-center justify-between"
            >
              <span>{occasion}</span>
              <ChevronDown size={16} className={`text-white/40 transition-transform ${showOccasions ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showOccasions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#161616] z-10 overflow-hidden"
                >
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => { setOccasion(o); setShowOccasions(false) }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors ${occasion === o ? "text-[#FF00FF]" : "text-white/70"}`}
                    >
                      {o}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <button
            onClick={onSubmit}
            disabled={!file || loading}
            className="w-full py-4 rounded-full font-bold text-lg bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles size={20} />
                </motion.div>
                Analyzing your aura...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Get My Aura Score
              </>
            )}
          </button>
          <p className="text-center text-white/30 text-xs mt-3">Free • No login required • Results in ~5 seconds</p>
        </motion.div>
      </div>
    </div>
  )
}
