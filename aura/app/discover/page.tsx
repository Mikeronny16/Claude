"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Camera, X, ChevronDown } from "lucide-react"

const STYLE_PREFS = ["No preference", "Streetwear", "Minimalist", "Romantic / Soft", "Dark / Edgy", "Business Chic", "Y2K / Retro", "Boho / Free Spirit"]
const OCCASIONS = ["Everyday Casual", "Night Out", "Work / Office", "Date Night", "Festival", "Formal Event"]

export default function DiscoverPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [style, setStyle] = useState("No preference")
  const [occasion, setOccasion] = useState("Everyday Casual")
  const [showStyle, setShowStyle] = useState(false)
  const [showOccasion, setShowOccasion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [dragging, setDragging] = useState(false)

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onSubmit = async () => {
    if (!file) return
    setLoading(true)

    const texts = [
      "Reading your facial aura... ✨",
      "Analyzing your color season... 🎨",
      "Building your style DNA... 👗",
      "Generating your looks... 🔥",
    ]
    let i = 0
    setLoadingText(texts[0])
    const interval = setInterval(() => {
      i = (i + 1) % texts.length
      setLoadingText(texts[i])
    }, 2000)

    try {
      const form = new FormData()
      form.append("image", file)
      form.append("style", style)
      form.append("occasion", occasion)
      const res = await fetch("/api/discover", { method: "POST", body: form })
      const data = await res.json()
      clearInterval(interval)
      if (data.id) router.push(`/looks/${data.id}`)
      else setLoading(false)
    } catch {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20">
      <nav className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </Link>
          <Link href="/pricing" className="text-white/40 text-sm hover:text-white transition-colors">Pricing</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Upload Your <span className="gradient-text">Selfie</span>
          </h1>
          <p className="text-white/40">AI reads your face aura → generates 6 outfit looks made for YOU</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`upload-zone rounded-3xl p-14 text-center cursor-pointer flex flex-col items-center gap-4 ${dragging ? "dragging" : ""}`}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF00FF]/20 to-[#00E5FF]/20 border border-[#FF00FF]/30 flex items-center justify-center">
                <Camera size={36} className="text-[#FF00FF]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Drop your selfie here</p>
                <p className="text-white/40 text-sm mt-1">or tap to take / choose photo</p>
              </div>
              <p className="text-white/20 text-xs">Clear face photo works best ✨</p>
              <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-[#FF00FF]/30 glow-pink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="your face" className="w-full max-h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => { setFile(null); setPreview(null) }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF00FF] animate-pulse" />
                <span className="text-white text-sm font-semibold">Ready to analyze ✨</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Style preference */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 space-y-4">
          <div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Your Style Vibe (optional)</p>
            <div className="relative">
              <button onClick={() => { setShowStyle(!showStyle); setShowOccasion(false) }}
                className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between hover:border-white/20 transition-colors">
                <span className="text-white/80">{style}</span>
                <ChevronDown size={16} className={`text-white/40 transition-transform ${showStyle ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showStyle && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 left-0 right-0 rounded-2xl border border-white/10 bg-[#1a1a1a] z-20 overflow-hidden">
                    {STYLE_PREFS.map(s => (
                      <button key={s} onClick={() => { setStyle(s); setShowStyle(false) }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors ${style === s ? "text-[#FF00FF]" : "text-white/60"}`}>
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Occasion</p>
            <div className="relative">
              <button onClick={() => { setShowOccasion(!showOccasion); setShowStyle(false) }}
                className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between hover:border-white/20 transition-colors">
                <span className="text-white/80">{occasion}</span>
                <ChevronDown size={16} className={`text-white/40 transition-transform ${showOccasion ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showOccasion && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 left-0 right-0 rounded-2xl border border-white/10 bg-[#1a1a1a] z-20 overflow-hidden">
                    {OCCASIONS.map(o => (
                      <button key={o} onClick={() => { setOccasion(o); setShowOccasion(false) }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors ${occasion === o ? "text-[#FF00FF]" : "text-white/60"}`}>
                        {o}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <button
            onClick={onSubmit}
            disabled={!file || loading}
            className="w-full py-5 rounded-full font-black text-lg bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles size={22} />
                </motion.div>
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <Sparkles size={22} />
                Generate My Looks
              </>
            )}
          </button>
          <p className="text-center text-white/25 text-xs mt-3">Free · 3 sessions · No account needed</p>
        </motion.div>
      </div>
    </div>
  )
}
