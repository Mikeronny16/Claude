import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

function getMidnightSeconds() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function FlashSaleBanner() {
  const [secs, setSecs] = useState(getMidnightSeconds)

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) return getMidnightSeconds()
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-pink via-[#e0185f] to-pink bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] rounded-2xl px-5 py-4 mb-10 flex items-center justify-between gap-4 overflow-hidden relative"
    >
      {/* Background sparkle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight">⚡ Flash Sale ယနေ့တင်သာ!</p>
          <p className="font-mm text-white/80 text-[11px] mt-0.5 truncate">
            Sale ပစ္စည်းများ — ယနေ့ midnight မတိုင်ခင် order ပေးပါ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {[pad(h), pad(m), pad(s)].map((unit, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="bg-white/20 backdrop-blur rounded-lg px-2.5 py-1.5 text-center min-w-[38px]">
              <span className="text-white font-bold text-base tabular-nums leading-none">{unit}</span>
              <p className="text-white/60 text-[8px] uppercase tracking-wider mt-0.5">
                {["hr", "min", "sec"][i]}
              </p>
            </div>
            {i < 2 && <span className="text-white/60 font-bold text-sm">:</span>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
