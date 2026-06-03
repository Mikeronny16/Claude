"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Camera, Wand2, Share2 } from "lucide-react"

const STYLE_VIBES = [
  { label: "Cyberpunk Icon", color: "#FF00FF", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop" },
  { label: "Soft Aesthetic", color: "#FFB3D9", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop" },
  { label: "Streetwear God", color: "#00E5FF", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=400&fit=crop" },
  { label: "Dark Academia", color: "#8B6914", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop" },
  { label: "Y2K Royalty", color: "#FFD700", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop" },
]

const STEPS = [
  { icon: <Camera size={28} />, title: "Upload Your Selfie", desc: "A clear face photo is all we need — no styling required", num: "01" },
  { icon: <Wand2 size={28} />, title: "AI Reads Your Aura", desc: "Our AI analyzes your features, tone, and vibe to build your style DNA", num: "02" },
  { icon: <Share2 size={28} />, title: "Get Your Looks", desc: "Receive 6 personalized outfit looks generated just for you", num: "03" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-white/50 text-sm hover:text-white transition-colors hidden md:block">Pricing</Link>
            <Link href="/discover" className="px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white glow-pink hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Sparkles size={14} /> Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* BG blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-[#FF00FF]/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-[#00E5FF]/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#FFD700]/5 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF00FF]/30 bg-[#FF00FF]/10 text-[#FF00FF] text-xs font-bold mb-8 tracking-widest">
              <Sparkles size={12} /> AI PERSONAL STYLIST
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6 tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              DISCOVER<br />
              <span className="gradient-text text-glow-pink">YOUR STYLE</span><br />
              AURA
            </h1>

            <p className="text-white/50 text-xl md:text-2xl max-w-xl mx-auto mb-10 leading-relaxed">
              Upload your selfie. AI reads your vibe.<br />
              Get 6 outfit looks made <em>just for you.</em>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/discover"
                className="group px-8 py-4 rounded-full font-black text-lg bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white glow-pink hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                <Camera size={22} />
                Upload Your Selfie
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
              <Link href="/pricing"
                className="px-8 py-4 rounded-full font-bold text-lg border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Pricing
              </Link>
            </div>

            <p className="text-white/25 text-sm mt-5">Free · No login needed · Results in 10 seconds</p>
          </motion.div>

          {/* Floating style cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="flex gap-4 overflow-x-auto pb-4 md:justify-center snap-x snap-mandatory scrollbar-hide">
              {STYLE_VIBES.map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="flex-shrink-0 snap-center w-44 rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
                  style={{ boxShadow: `0 0 30px ${v.color}20` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.img} alt={v.label} className="w-full h-64 object-cover" />
                  <div className="p-3 bg-[#161616]">
                    <div className="text-xs font-bold" style={{ color: v.color }}>{v.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-white/20 text-xs mt-4 text-center">← Scroll to see style vibes →</p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-white/40 text-lg">3 steps to your perfect wardrobe</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative card-glass rounded-3xl p-8 border border-white/5 text-center group hover:border-[#FF00FF]/20 transition-colors"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.num}</div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF00FF]/20 to-[#00E5FF]/20 flex items-center justify-center text-[#FF00FF] mx-auto mb-5 group-hover:from-[#FF00FF]/30 group-hover:to-[#00E5FF]/30 transition-all">
                  {s.icon}
                </div>
                <h3 className="font-black text-xl mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.title}</h3>
                <p className="text-white/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link href="/discover"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-xl bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-black glow-pink hover:opacity-90 transition-opacity"
            >
              <Camera size={24} />
              Discover My Style — Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { val: "50K+", label: "Style Profiles Generated" },
            { val: "98%", label: "Love Their Results" },
            { val: "6", label: "Unique Looks Per Session" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-black gradient-text mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.val}</div>
              <div className="text-white/40 text-sm">{s.label}</div>
            </div>
          ))}
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
          <div className="flex gap-6 text-white/30 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-white/20 text-xs">© 2025 AURA. AI Personal Stylist.</p>
        </div>
      </footer>
    </div>
  )
}
