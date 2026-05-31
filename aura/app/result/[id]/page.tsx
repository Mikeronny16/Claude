"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Share2, Heart, Download, RotateCcw, Zap } from "lucide-react"

interface Rating {
  id: string
  image_url: string
  total_score: number
  vibe_label: string
  style_score: number
  color_score: number
  originality_score: number
  impact_score: number
  ai_tip: string
  occasion: string
}

const MOCK: Rating = {
  id: "demo",
  image_url: "",
  total_score: 88,
  vibe_label: "Streetwear Icon",
  style_score: 90,
  color_score: 85,
  originality_score: 89,
  impact_score: 88,
  ai_tip: "Try layering silver accessories or a beanie for an even stronger street edge.",
  occasion: "Street Style",
}

const SCORE_BARS = [
  { key: "style_score", label: "Style", color: "#FF00FF" },
  { key: "color_score", label: "Color Harmony", color: "#FFD700" },
  { key: "originality_score", label: "Occasion Fit", color: "#00E5FF" },
]

export default function ResultPage() {
  const { id } = useParams()
  const [rating, setRating] = useState<Rating | null>(null)
  const [glowed, setGlowed] = useState(false)

  useEffect(() => {
    if (id === "demo") { setRating(MOCK); return }
    fetch(`/api/analyze/${id}`)
      .then(r => r.json())
      .then(d => setRating(d.rating))
      .catch(() => setRating(MOCK))
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "My AURA Score", text: `I just got ${rating?.total_score}/100 on AURA! My vibe: ${rating?.vibe_label}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (!rating) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Sparkles size={32} className="text-[#FF00FF]" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20">
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

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Result Card — this is the shareable card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl overflow-hidden neon-border-pink relative"
          style={{ background: "linear-gradient(160deg, #1a0a1a 0%, #0D0D0D 50%, #0a0f1a 100%)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-60" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-[#FF00FF]" />
              <span className="text-[#FF00FF] text-xs font-bold uppercase tracking-widest">AURA</span>
              <Sparkles size={12} className="text-[#FF00FF]" />
            </div>
            <span className="text-white/30 text-xs">aura.style</span>
          </div>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-6 items-start">
              {/* Left: photo */}
              <div className="relative rounded-2xl overflow-hidden neon-border-pink" style={{ minHeight: 220 }}>
                {rating.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rating.image_url} alt="outfit" className="w-full h-full object-cover" style={{ minHeight: 220 }} />
                ) : (
                  <div className="w-full flex items-center justify-center bg-gradient-to-br from-[#FF00FF]/20 to-[#00E5FF]/20" style={{ minHeight: 220 }}>
                    <div className="text-center text-white/30">
                      <Sparkles size={32} className="mx-auto mb-2" />
                      <p className="text-xs">Your photo</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-[#FF00FF] text-xs font-bold italic">Slay All Day ✨</span>
                </div>
              </div>

              {/* Right: scores */}
              <div>
                <div className="text-white/50 text-xs mb-1 uppercase tracking-widest">✦ TOTAL SCORE ✦</div>
                <div className="flex items-end gap-2 mb-1">
                  <motion.span
                    className="text-6xl font-black text-white"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    {rating.total_score}
                  </motion.span>
                  <span className="text-white/30 text-xl mb-2">/100</span>
                </div>
                <p className="text-white/40 text-xs mb-4">Great style! You nailed the look.</p>

                <div className="space-y-3">
                  {SCORE_BARS.map(({ key, label, color }) => {
                    const score = rating[key as keyof Rating] as number
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/50">{label}</span>
                          <span className="font-bold" style={{ color }}>{score}/100</span>
                        </div>
                        <div className="score-bar">
                          <motion.div
                            className="score-bar-fill"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4">
                  <div className="text-white/30 text-xs mb-1">✦ YOUR VIBE ✦</div>
                  <div className="text-xl font-black gradient-text" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {rating.vibe_label} 👑
                  </div>
                  <p className="text-white/40 text-xs mt-1">Bold. Effortless. Unapologetically you.</p>
                </div>
              </div>
            </div>

            {/* AI Tip */}
            <div className="mt-5 p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#00E5FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap size={14} className="text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-[#00E5FF] text-xs font-bold mb-0.5">AI STYLE TIP</p>
                <p className="text-white/70 text-sm">{rating.ai_tip}</p>
              </div>
            </div>

            {/* Powered by */}
            <div className="text-center mt-4 text-white/20 text-xs">
              ✦ Powered by <span className="text-white/40 font-bold">AURA</span> ✦
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mt-6"
        >
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white font-bold hover:opacity-90 transition-opacity glow-pink"
          >
            <Share2 size={20} />
            <span className="text-xs">Share</span>
          </button>
          <button
            onClick={() => setGlowed(!glowed)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all font-bold ${glowed ? "border-[#FF00FF]/60 bg-[#FF00FF]/15 text-[#FF00FF]" : "border-white/10 bg-white/5 text-white/60"}`}
          >
            <Heart size={20} fill={glowed ? "#FF00FF" : "none"} />
            <span className="text-xs">{glowed ? "Glowed!" : "Glow"}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 text-white/60 font-bold hover:border-white/20 transition-colors">
            <Download size={20} />
            <span className="text-xs">Save Card</span>
          </button>
        </motion.div>

        {/* Rate again */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4 text-center">
          <Link href="/rate" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
            <RotateCcw size={14} />
            Rate another outfit
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
