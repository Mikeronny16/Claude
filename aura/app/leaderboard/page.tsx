"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Trophy, Heart, Crown } from "lucide-react"

const MOCK_LEADERBOARD = [
  { rank: 1, username: "maya_styles", vibe: "Cyberpunk Royalty", score: 98, glows: 2341, color: "#FFD700" },
  { rank: 2, username: "sofiavibes", vibe: "Soft Aesthetic Queen", score: 96, glows: 1987, color: "#C0C0C0" },
  { rank: 3, username: "khai_fits", vibe: "Streetwear Icon", score: 95, glows: 1654, color: "#CD7F32" },
  { rank: 4, username: "zara_looks", vibe: "Y2K Legend", score: 93, glows: 1432, color: "#FF00FF" },
  { rank: 5, username: "leo_drip", vibe: "Dark Academia", score: 91, glows: 1201, color: "#00E5FF" },
  { rank: 6, username: "mia_glow", vibe: "Clean Girl Era", score: 90, glows: 987, color: "#FF00FF" },
  { rank: 7, username: "neon_kai", vibe: "Festival Goddess", score: 89, glows: 876, color: "#00E5FF" },
  { rank: 8, username: "thiri_mm", vibe: "Business Baddie", score: 88, glows: 765, color: "#FF00FF" },
  { rank: 9, username: "alex_fits", vibe: "Minimalist Slayer", score: 87, glows: 654, color: "#00E5FF" },
  { rank: 10, username: "luna_style", vibe: "Cottagecore Soul", score: 86, glows: 543, color: "#FFD700" },
]

const TABS = ["Daily", "Weekly", "All Time"]

export default function LeaderboardPage() {
  const [tab, setTab] = useState("Daily")

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20">
      <nav className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </Link>
          <Link href="/rate" className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white">
            Rate My Fit
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy size={28} className="text-[#FFD700]" />
            <h1 className="text-4xl font-black" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <span className="gradient-text">Top Auras</span>
            </h1>
          </div>
          <p className="text-white/40">The most stylish fits in the community</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 mb-8">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white" : "text-white/40 hover:text-white/70"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Top 3 spotlight */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {MOCK_LEADERBOARD.slice(0, 3).map((u, i) => (
            <motion.div
              key={u.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card-glass rounded-2xl p-4 text-center border ${i === 0 ? "border-[#FFD700]/40" : i === 1 ? "border-[#C0C0C0]/30" : "border-[#CD7F32]/30"} ${i === 0 ? "md:-translate-y-2" : ""}`}
            >
              <div className="text-2xl mb-1">
                {i === 0 ? "👑" : i === 1 ? "🥈" : "🥉"}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF00FF]/60 to-[#00E5FF]/60 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                {u.username[0].toUpperCase()}
              </div>
              <p className="text-xs font-bold truncate">{u.username}</p>
              <p className="text-[#FF00FF] font-black text-lg mt-1">{u.score}</p>
              <p className="text-white/30 text-xs">{u.vibe}</p>
            </motion.div>
          ))}
        </div>

        {/* Full list */}
        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((u, i) => (
            <motion.div
              key={u.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              className="card-glass rounded-xl px-4 py-3 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="w-8 text-center">
                {u.rank <= 3 ? (
                  <Crown size={16} style={{ color: u.color }} />
                ) : (
                  <span className="text-white/30 font-bold text-sm">#{u.rank}</span>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF00FF]/40 to-[#00E5FF]/40 flex items-center justify-center font-bold">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{u.username}</p>
                <p className="text-white/40 text-xs truncate">{u.vibe}</p>
              </div>
              <div className="text-right">
                <div className="font-black text-lg" style={{ color: u.color }}>{u.score}</div>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Heart size={10} /> {u.glows.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-center">
          <p className="text-white/30 text-sm mb-4">Think you can top the leaderboard?</p>
          <Link href="/rate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity">
            <Sparkles size={16} />
            Rate My Outfit Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
