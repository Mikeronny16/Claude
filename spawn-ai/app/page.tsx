"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Egg, Heart, Sparkles, Zap, Star, ArrowRight, ChevronDown } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7,  } }),
}

function EggSVG({ tier = "common", size = 120, animate = true }: { tier?: string; size?: number; animate?: boolean }) {
  const colors: Record<string, { top: string; mid: string; bot: string; glow: string }> = {
    common:    { top: "#fde68a", mid: "#f59e0b", bot: "#d97706", glow: "#f59e0b" },
    rare:      { top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8" },
    epic:      { top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7" },
    mythic:    { top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899" },
    legendary: { top: "#fef3c7", mid: "#fbbf24", bot: "#d97706", glow: "#ffffff" },
  }
  const c = colors[tier] ?? colors.common
  return (
    <div className={animate ? "float" : ""} style={{ display: "inline-block", filter: `drop-shadow(0 0 24px ${c.glow}88)` }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`eg-${tier}-${size}`} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={c.top} />
            <stop offset="60%" stopColor={c.mid} />
            <stop offset="100%" stopColor={c.bot} />
          </radialGradient>
          <radialGradient id={`shine-${tier}-${size}`} cx="35%" cy="25%" r="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#eg-${tier}-${size})`} />
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#shine-${tier}-${size})`} />
        <ellipse cx="38" cy="42" rx="8" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,38,42)" />
      </svg>
    </div>
  )
}

const EGGS = [
  { tier: "common",    label: "Common",    color: "#F59E0B", plan: "Free" },
  { tier: "rare",      label: "Rare",      color: "#818CF8", plan: "Collector" },
  { tier: "epic",      label: "Epic",      color: "#A855F7", plan: "Pet Master" },
  { tier: "mythic",    label: "Mythic",    color: "#EC4899", plan: "Legendary" },
]

const STAGES = [
  { icon: "🥚", label: "Egg",   sub: "24–72hrs" },
  { icon: "🐣", label: "Baby",  sub: "Lv 1–10" },
  { icon: "🐥", label: "Child", sub: "Lv 11–25" },
  { icon: "🦊", label: "Teen",  sub: "Lv 26–50" },
  { icon: "✨", label: "Adult", sub: "Lv 51+" },
]

const PLANS = [
  { name: "Egg Finder",    price: "Free",   eggs: "1 egg/month",  pets: "1 active pet",  highlight: false },
  { name: "Egg Collector", price: "$9/mo",  eggs: "5 eggs/month", pets: "3 active pets", highlight: false },
  { name: "Pet Master",    price: "$19/mo", eggs: "15/month",     pets: "10 pets",        highlight: true  },
  { name: "Legendary",     price: "$39/mo", eggs: "Unlimited",    pets: "∞ pets",         highlight: false },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              left: `${(i * 5.3) % 100}%`, top: `${(i * 7.7) % 100}%`,
              background: ["#8B5CF6","#F59E0B","#10B981"][i % 3], opacity: 0.35,
            }}
            animate={{ y: [-20, 20, -20], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EggSVG tier="epic" size={28} animate={false} />
            <span className="font-bold text-lg text-white">Spawn AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#eggs" className="hover:text-white transition-colors">Eggs</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/auth/signup" className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-colors font-medium">
              Get your egg
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div custom={0} variants={fadeUp} className="mb-6">
            <EggSVG tier="epic" size={140} />
          </motion.div>
          <motion.p custom={1} variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4 font-medium">AI Companion Platform</motion.p>
          <motion.h1 custom={2} variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
            <span className="text-white">Something small is</span><br />
            <span className="text-gradient">waiting for you</span><br />
            <span className="text-white">to notice.</span>
          </motion.h1>
          <motion.p custom={3} variants={fadeUp} className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Buy an AI egg. Hatch it. Raise your unique AI creature from baby to adult.<br/>
            It remembers you. It grows because of you.
          </motion.p>
          <motion.div custom={4} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/auth/signup"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105"
              style={{ boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
            >
              <Egg className="w-5 h-5" /> Hatch your first egg — Free
            </Link>
            <a href="#how" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              How does it work? <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-gray-600 float" />
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-6 overflow-hidden border-y border-purple-900/30" style={{ background: "rgba(139,92,246,0.05)" }}>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
        <div className="flex gap-14 whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
          {[...Array(2)].flatMap(() => ["Hatch. Raise. Bond.", "An egg. A choice. A quiet little life.", "How much do you still care?", "Your pet. Your story.", "Real AI personality. Real bond.", "No two pets are the same."]).map((t, i) => (
            <span key={i} className="text-purple-400/50 text-sm font-medium">✦ {t}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm uppercase tracking-widest mb-3">The Journey</p>
            <h2 className="text-4xl font-bold text-white">From egg to companion</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
            {STAGES.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-light rounded-2xl p-5 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="font-semibold text-white text-sm">{s.label}</div>
                <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="w-6 h-6 text-pink-400" />, title: "Unique Personality", desc: "Talk to your egg before it hatches. Your words shape its personality. No two pets are ever the same." },
              { icon: <Sparkles className="w-6 h-6 text-amber-400" />, title: "Real AI Conversations", desc: "Powered by AI. Your pet remembers you, has opinions, and grows wiser as your bond deepens." },
              { icon: <Zap className="w-6 h-6 text-purple-400" />, title: "It Needs You", desc: "Feed it. Play with it. Check in. Neglect it and it gets sad. Care for it and watch it thrive." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(139,92,246,0.15)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eggs */}
      <section id="eggs" className="py-24 px-4" style={{ background: "rgba(139,92,246,0.04)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-3">Egg Rarity</p>
          <h2 className="text-4xl font-bold text-white mb-16">Which egg will you hatch?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {EGGS.map((e, i) => (
              <motion.div key={e.tier} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <EggSVG tier={e.tier} size={80} />
                <h3 className="font-bold mt-3 text-sm" style={{ color: e.color }}>{e.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{e.plan} plan</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-3">Plans</p>
          <h2 className="text-4xl font-bold text-white mb-4">Start free. Grow your collection.</h2>
          <p className="text-gray-400 mb-16">Your first egg is free. No credit card needed.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 text-left relative ${p.highlight ? "" : "glass"}`}
                style={p.highlight ? { background: "rgba(139,92,246,0.18)", border: "2px solid #8B5CF6", borderRadius: "1rem" } : {}}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <div className="font-semibold text-white mb-1 text-sm">{p.name}</div>
                <div className="text-2xl font-bold mb-4" style={{ color: p.highlight ? "#A78BFA" : "#F3F0FF" }}>{p.price}</div>
                <ul className="space-y-2 text-xs text-gray-400 mb-6">
                  <li className="flex items-center gap-2"><Egg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> {p.eggs}</li>
                  <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" /> {p.pets}</li>
                </ul>
                <Link href="/auth/signup"
                  className={`block text-center py-2 rounded-full text-xs font-medium transition-colors ${p.highlight ? "bg-purple-600 hover:bg-purple-500 text-white" : "glass-light text-gray-300 hover:text-white"}`}>
                  {p.price === "Free" ? "Get started" : "Upgrade"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <EggSVG tier="mythic" size={100} />
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-6 mb-4">An egg. A choice.</h2>
          <p className="text-xl text-gray-400 mb-2 italic">&ldquo;A quiet little life.&rdquo;</p>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">Your pet is waiting. It doesn&apos;t know your name yet. But it will.</p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            style={{ boxShadow: "0 0 40px rgba(139,92,246,0.5)" }}>
            <Egg className="w-5 h-5" /> Start for free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 text-center text-sm" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <EggSVG tier="common" size={20} animate={false} />
            <span className="font-medium text-gray-500">Spawn AI</span>
          </div>
          <div className="flex gap-6 text-xs">
            <Link href="/about" className="hover:text-purple-400 transition-colors">the story</Link>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
            <Link href="/auth/signin" className="hover:text-purple-400 transition-colors">Sign in</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Spawn AI</p>
        </div>
      </footer>
    </div>
  )
}
