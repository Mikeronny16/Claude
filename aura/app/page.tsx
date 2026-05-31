"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Users, Star, Zap, Trophy, Clock, ArrowRight, ChevronRight } from "lucide-react"

const EXAMPLE_SCORES = [
  { label: "Style", score: 92, color: "#FF00FF" },
  { label: "Color Harmony", score: 87, color: "#00E5FF" },
  { label: "Originality", score: 95, color: "#FFD700" },
  { label: "Overall Impact", score: 91, color: "#FF00FF" },
]

const VIBES = ["Cyberpunk Icon", "Soft Aesthetic", "Streetwear God", "Dark Academia", "Y2K Royalty"]

const STATS = [
  { value: "50K+", label: "Happy Users" },
  { value: "1M+", label: "Outfits Rated" },
  { value: "Top 1%", label: "Top Rated Looks" },
  { value: "98%", label: "Accuracy Rate" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              AURA
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="#how" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-white/70 hover:text-white transition-colors hidden md:block">
              Sign In
            </Link>
            <Link href="/rate" className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white glow-pink hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Sparkles size={14} />
              Rate My Outfit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF00FF]/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[#00E5FF]/8 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF00FF]/30 bg-[#FF00FF]/10 text-[#FF00FF] text-xs font-semibold mb-6">
              <Sparkles size={12} />
              AI-POWERED FASHION ANALYSIS
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              AI Outfit Rater.<br />
              <span className="gradient-text text-glow-pink">Your Aura, Scored.</span>
            </h1>

            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Upload your outfit. Get instant AI scores, style insights, and personalized tips to level up your fashion game.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/rate" className="px-6 py-3.5 rounded-full font-bold bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white glow-pink hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Sparkles size={18} />
                Rate My Outfit — Free
              </Link>
              <Link href="/leaderboard" className="px-6 py-3.5 rounded-full font-bold border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors flex items-center justify-center gap-2">
                <Users size={18} />
                Join the Community
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["F", "S", "M", "A"].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0D0D0D] bg-gradient-to-br from-[#FF00FF]/60 to-[#00E5FF]/60 flex items-center justify-center text-xs font-bold">
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-white/50 text-sm">
                <span className="text-white font-semibold">50K+</span> users already glowing 🤍
              </span>
            </div>
          </motion.div>

          {/* Score card preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="neon-border-pink rounded-2xl p-6 card-glass"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-xs font-bold uppercase tracking-widest">AI Score</span>
            </div>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-7xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>9.5</span>
              <span className="text-white/40 text-2xl mb-3">/10</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#FF00FF]/20 to-[#00E5FF]/20 border border-[#FF00FF]/30 mb-6">
              <span className="gradient-text font-bold text-sm">Cyberpunk Vibe ✦</span>
            </div>

            <div className="space-y-4">
              {EXAMPLE_SCORES.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/60">{s.label}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.score}</span>
                  </div>
                  <div className="score-bar">
                    <motion.div
                      className="score-bar-fill"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
                <Zap size={12} className="text-[#00E5FF]" />
              </div>
              <p className="text-white/50 text-xs">
                <span className="text-[#00E5FF] font-semibold">AI Tip:</span> Try a silver chain to push this to a 10 🔥
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02] py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-black gradient-text" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.value}</div>
              <div className="text-white/40 text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Everything you need to <span className="gradient-text">slay</span>
            </h2>
            <p className="text-white/40">Powered by AI. Built for fashion lovers.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-2 card-glass rounded-2xl p-6 neon-border-pink group hover:bg-[#FF00FF]/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF00FF]/20 flex items-center justify-center text-[#FF00FF]">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-bold text-lg">AI Outfit Scoring</h3>
              </div>
              <p className="text-white/50 mb-6">Advanced AI analyzes your outfit across Style, Color Harmony, Originality, and Overall Impact.</p>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-black gradient-text" style={{ fontFamily: "Montserrat, sans-serif" }}>9.5</div>
                <div className="flex-1 space-y-3">
                  {EXAMPLE_SCORES.slice(0, 3).map(s => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-white/40 text-xs w-20">{s.label}</span>
                      <div className="flex-1 score-bar">
                        <div className="score-bar-fill" style={{ background: s.color, width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="card-glass rounded-2xl p-6 neon-border-cyan group hover:bg-[#00E5FF]/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold">Style Insights</h3>
              </div>
              <p className="text-white/50 text-sm mb-4">Personalized feedback and tips to improve your look instantly.</p>
              <div className="p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-xs text-white/70">
                ✦ Try adding a statement accessory to elevate your look!
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="card-glass rounded-2xl p-6 group hover:bg-[#FF00FF]/5 transition-colors border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF00FF]/20 flex items-center justify-center text-[#FF00FF]">
                  <Users size={20} />
                </div>
                <h3 className="font-bold">Community</h3>
              </div>
              <p className="text-white/50 text-sm mb-3">Join 10K+ fashion lovers. Share, Glow, and grow together.</p>
              <div className="flex -space-x-2">
                {["K","L","M","S","A","R"].map((l,i) => (
                  <div key={i} className="w-7 h-7 rounded-full border border-[#0D0D0D] bg-gradient-to-br from-[#FF00FF]/60 to-[#00E5FF]/60 flex items-center justify-center text-xs font-bold">
                    {l}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="card-glass rounded-2xl p-6 group hover:bg-[#FFD700]/5 transition-colors border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                  <Star size={20} />
                </div>
                <h3 className="font-bold">Style DNA</h3>
              </div>
              <p className="text-white/50 text-sm mb-3">After 5 ratings, unlock your unique style personality.</p>
              <div className="flex flex-wrap gap-1.5">
                {VIBES.slice(0,3).map(v => (
                  <span key={v} className="px-2 py-0.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs">{v}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="card-glass rounded-2xl p-6 group hover:bg-[#00E5FF]/5 transition-colors border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                    <Trophy size={20} />
                  </div>
                  <h3 className="font-bold">Leaderboard</h3>
                </div>
                <p className="text-white/50 text-sm">Compete with top stylers and climb the ranks.</p>
              </div>
              <Link href="/leaderboard" className="mt-4 flex items-center gap-1 text-[#00E5FF] text-sm font-semibold group-hover:gap-2 transition-all">
                View Rankings <ChevronRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="card-glass rounded-2xl p-6 group hover:bg-white/5 transition-colors border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold">Outfit History</h3>
              </div>
              <p className="text-white/50 text-sm">Track your past looks and see your style evolution over time.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-12" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Get your <span className="gradient-text">aura score</span> in 3 steps
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Fit", desc: "Drag & drop or tap to upload your outfit photo. Pick your occasion.", icon: "📸" },
              { step: "02", title: "AI Analyzes", desc: "Our AI scores your Style, Color Harmony, Originality, and Overall Impact.", icon: "✨" },
              { step: "03", title: "Share Your Aura", desc: "Get a stunning result card ready for Instagram, TikTok, or Facebook.", icon: "🔥" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-glass rounded-2xl p-6 border border-white/5"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-[#FF00FF] text-xs font-bold mb-2">{s.step}</div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.title}</h3>
                <p className="text-white/50 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
            <Link href="/rate" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity">
              <Sparkles size={20} />
              Rate My Outfit — It&apos;s Free
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-black" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </div>
          <div className="flex gap-6 text-white/40 text-sm">
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-white/20 text-xs">© 2025 AURA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
