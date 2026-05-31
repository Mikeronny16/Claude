"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Star, TrendingUp, Activity, RefreshCw, Circle, LayoutDashboard, Settings, Flag, ChevronRight } from "lucide-react"

const METRICS = [
  { label: "Total Ratings", value: "128,457", change: "+12.6%", color: "#FFD700", icon: <Star size={20} /> },
  { label: "Active Users", value: "24,892", change: "+8.3%", color: "#FF00FF", icon: <Users size={20} /> },
  { label: "Revenue (MMK)", value: "12.45M", change: "+14.7%", color: "#00E5FF", icon: <TrendingUp size={20} /> },
]

const ACTIVITY = [
  { time: "10:40 AM", user: "Pyae Wai", action: "New Rating", detail: "Rated look with 5 stars", type: "rating" },
  { time: "10:38 AM", user: "Su Thiri", action: "User Login", detail: "Logged in successfully", type: "login" },
  { time: "10:35 AM", user: "Moe Gyi", action: "Promotion", detail: "Created ShweGlow Summer Offer", type: "promo" },
  { time: "10:28 AM", user: "Aye Chan", action: "New Rating", detail: "Score 94/100 — Cyberpunk Vibe", type: "rating" },
  { time: "10:15 AM", user: "Ko Zaw", action: "Purchase", detail: "Bought 50 credits — 5,000 MMK", type: "purchase" },
]

const TOP_STYLES = [
  { rank: 1, name: "Golden Glow Makeup", ratings: 2543, avg: 4.9 },
  { rank: 2, name: "Soft Glam Look", ratings: 2341, avg: 4.8 },
  { rank: 3, name: "Street Icon", ratings: 1987, avg: 4.8 },
  { rank: 4, name: "Natural Radiance", ratings: 1672, avg: 4.7 },
  { rank: 5, name: "Evening Elegance", ratings: 1512, avg: 4.6 },
]

const NAV_ITEMS = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} />, active: true },
  { label: "Users", icon: <Users size={16} />, active: false },
  { label: "Ratings", icon: <Star size={16} />, active: false },
  { label: "Promotions", icon: <Flag size={16} />, active: false },
  { label: "Settings", icon: <Settings size={16} />, active: false },
]

function MiniChart({ color }: { color: string }) {
  const points = [20, 35, 28, 45, 38, 52, 42, 58, 48, 65, 55, 70]
  const max = Math.max(...points)
  const w = 100
  const h = 40
  const pts = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-10" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  )
}

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("Dashboard")

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
            <span className="text-yellow-400 text-xs">✦</span>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <p className="text-white/20 text-xs uppercase tracking-wider px-3 mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                activeNav === item.label
                  ? "bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
            <Circle size={8} className="text-green-400 fill-green-400" />
            <span className="text-[#FFD700] text-xs font-semibold">All Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0D0D0D]/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-black" style={{ fontFamily: "Montserrat, sans-serif" }}>Dashboard</h1>
            <p className="text-white/40 text-xs">Real-time performance and key metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <Circle size={8} className="fill-green-400" /> Live
            </div>
            <span className="text-white/30 text-xs">May 31, 2025 — 10:42 AM</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors text-xs text-white/60">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-glass rounded-2xl p-5 border border-white/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/40 text-xs mb-1">{m.label}</p>
                    <p className="text-2xl font-black" style={{ fontFamily: "Montserrat, sans-serif", color: m.color }}>{m.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}20`, color: m.color }}>
                    {m.icon}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-xs font-semibold">↑ {m.change} vs yesterday</span>
                  <MiniChart color={m.color} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Traffic + Top Styles */}
          <div className="grid grid-cols-3 gap-4">
            {/* Traffic chart placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-2 card-glass rounded-2xl p-5 border border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold">Daily Traffic</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF00FF] inline-block" /> Visitors</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00E5FF] inline-block" /> Page Views</span>
                  </div>
                </div>
                <span className="text-white/40 text-xs border border-white/10 px-2 py-1 rounded-lg">7 Days ▾</span>
              </div>

              {/* Simple SVG chart */}
              <div className="h-32 relative">
                <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF00FF" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,70 57,55 114,60 171,40 228,50 285,35 342,42 400,30 400,100 0,100" fill="url(#cyanGrad)" />
                  <polyline points="0,70 57,55 114,60 171,40 228,50 285,35 342,42 400,30" fill="none" stroke="#00E5FF" strokeWidth="2" />
                  <polygon points="0,85 57,75 114,80 171,60 228,70 285,55 342,62 400,50 400,100 0,100" fill="url(#pinkGrad)" />
                  <polyline points="0,85 57,75 114,80 171,60 228,70 285,55 342,62 400,50" fill="none" stroke="#FF00FF" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white/20 text-xs">
                  {["May 25","May 26","May 27","May 28","May 29","May 30","May 31"].map(d => <span key={d}>{d.split(" ")[1]}</span>)}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Visitors", val: "168,254", up: true },
                  { label: "Page Views", val: "392,771", up: true },
                  { label: "Avg. Session", val: "02:45", up: true },
                  { label: "Bounce Rate", val: "42.3%", up: false },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-bold text-sm">{s.val}</p>
                    <p className={`text-xs ${s.up ? "text-green-400" : "text-red-400"}`}>{s.up ? "↑" : "↓"} today</p>
                    <p className="text-white/30 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-glass rounded-2xl p-5 border border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Top Rated Styles</h3>
                <button className="text-[#00E5FF] text-xs">View All</button>
              </div>
              <div className="space-y-3">
                {TOP_STYLES.map((s) => (
                  <div key={s.rank} className="flex items-center gap-3">
                    <span className="text-white/30 text-sm w-4">#{s.rank}</span>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF00FF]/30 to-[#00E5FF]/30 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{s.name}</p>
                      <p className="text-white/30 text-xs">{s.ratings.toLocaleString()} ratings</p>
                    </div>
                    <span className="text-[#FFD700] text-xs font-bold">★ {s.avg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity + System Status */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-2 card-glass rounded-2xl p-5 border border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Recent Activity</h3>
                <button className="text-[#00E5FF] text-xs flex items-center gap-1">View All <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-3">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/30 text-xs w-16">{a.time}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF00FF]/40 to-[#00E5FF]/40 flex items-center justify-center text-xs font-bold">
                      {a.user[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{a.user}</p>
                      <p className="text-white/40 text-xs truncate">{a.detail}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      a.type === "rating" ? "bg-[#FF00FF]/15 text-[#FF00FF]" :
                      a.type === "login" ? "bg-[#00E5FF]/15 text-[#00E5FF]" :
                      a.type === "promo" ? "bg-[#FFD700]/15 text-[#FFD700]" :
                      "bg-green-500/15 text-green-400"
                    }`}>
                      {a.action}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card-glass rounded-2xl p-5 border border-white/5"
            >
              <h3 className="font-bold mb-4">System Status</h3>
              <div className="space-y-4">
                {["Web Server", "Database", "API Services", "Storage"].map(s => (
                  <div key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-white/30" />
                      <span className="text-sm text-white/70">{s}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                      <Circle size={6} className="fill-green-400" />
                      Operational
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-green-400 text-xs font-bold">All systems nominal</p>
                <p className="text-white/30 text-xs mt-1">Version 1.0.0</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
