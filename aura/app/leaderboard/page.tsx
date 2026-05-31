"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Trophy, Heart, Crown } from "lucide-react"
import { supabase, type Rating } from "@/lib/supabase"

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"]
const TABS = ["Daily", "Weekly", "All Time"]

export default function LeaderboardPage() {
  const [tab, setTab] = useState("Daily")
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const now = new Date()
      let from: string | null = null

      if (tab === "Daily") {
        const d = new Date(now); d.setHours(0,0,0,0)
        from = d.toISOString()
      } else if (tab === "Weekly") {
        const d = new Date(now); d.setDate(d.getDate() - 7)
        from = d.toISOString()
      }

      let query = supabase
        .from("ratings")
        .select("*")
        .order("total_score", { ascending: false })
        .limit(10)

      if (from) query = query.gte("created_at", from)

      const { data } = await query
      setRatings(data ?? [])
      setLoading(false)
    }
    load()
  }, [tab])

  const list = ratings.length > 0 ? ratings : []

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
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white" : "text-white/40 hover:text-white/70"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block mb-3">
              <Sparkles size={24} className="text-[#FF00FF]" />
            </motion.div>
            <p>Loading top auras...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 mb-4">No ratings yet — be the first!</p>
            <Link href="/rate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink">
              <Sparkles size={16} /> Rate My Outfit
            </Link>
          </div>
        ) : (
          <>
            {/* Top 3 spotlight */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {list.slice(0, 3).map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`card-glass rounded-2xl p-4 text-center border ${i === 0 ? "border-[#FFD700]/40" : i === 1 ? "border-[#C0C0C0]/30" : "border-[#CD7F32]/30"}`}>
                  <div className="text-2xl mb-1">{i === 0 ? "👑" : i === 1 ? "🥈" : "🥉"}</div>
                  {u.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.image_url} alt="outfit" className="w-10 h-10 rounded-full object-cover mx-auto mb-2" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF00FF]/60 to-[#00E5FF]/60 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      {i + 1}
                    </div>
                  )}
                  <p className="text-[#FF00FF] font-black text-lg">{u.total_score}</p>
                  <p className="text-white/30 text-xs truncate">{u.vibe_label}</p>
                </motion.div>
              ))}
            </div>

            {/* Full list */}
            <div className="space-y-3">
              {list.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.2 }}
                  className="card-glass rounded-xl px-4 py-3 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-8 text-center">
                    {i < 3 ? <Crown size={16} style={{ color: RANK_COLORS[i] }} /> : <span className="text-white/30 font-bold text-sm">#{i + 1}</span>}
                  </div>
                  {u.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.image_url} alt="outfit" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF00FF]/40 to-[#00E5FF]/40 flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{u.vibe_label}</p>
                    <p className="text-white/40 text-xs">{u.occasion}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg" style={{ color: i < 3 ? RANK_COLORS[i] : "#FF00FF" }}>{u.total_score}</div>
                    <div className="flex items-center gap-1 text-white/30 text-xs justify-end">
                      <Heart size={10} /> 0
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-center">
          <p className="text-white/30 text-sm mb-4">Think you can top the leaderboard?</p>
          <Link href="/rate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity">
            <Sparkles size={16} /> Rate My Outfit Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
