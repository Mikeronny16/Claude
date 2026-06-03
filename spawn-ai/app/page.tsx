"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Egg, Heart, Sparkles, Zap, Star, ArrowRight, ChevronDown } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7 } }),
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
    <div className={animate ? "float" : ""} style={{ display: "inline-block", filter: `drop-shadow(0 0 28px ${c.glow}99)` }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`eg-${tier}-${size}`} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={c.top} />
            <stop offset="60%" stopColor={c.mid} />
            <stop offset="100%" stopColor={c.bot} />
          </radialGradient>
          <radialGradient id={`shine-${tier}-${size}`} cx="35%" cy="25%" r="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
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
  { tier: "common", label: "Common",  color: "#F59E0B",  glowClass: "glow-common" },
  { tier: "rare",   label: "Rare",    color: "#818CF8",  glowClass: "glow-rare" },
  { tier: "epic",   label: "Epic",    color: "#A855F7",  glowClass: "glow-epic" },
  { tier: "mythic", label: "Mythic",  color: "#EC4899",  glowClass: "glow-mythic" },
]

const STAGES = [
  { icon: "🥚", label: "Egg",   sub: "24–72hrs" },
  { icon: "🐣", label: "Baby",  sub: "Lv 1–10" },
  { icon: "🐥", label: "Child", sub: "Lv 11–25" },
  { icon: "🦋", label: "Teen",  sub: "Lv 26–50" },
  { icon: "✨", label: "Adult", sub: "Lv 51+" },
]

const PLANS = [
  { name: "Egg Finder",    price: "Free",   eggs: "1 egg/month",  pets: "1 active pet",  highlight: false },
  { name: "Egg Collector", price: "$9/mo",  eggs: "5 eggs/month", pets: "3 active pets", highlight: false },
  { name: "Pet Master",    price: "$19/mo", eggs: "15/month",     pets: "10 pets",        highlight: true  },
  { name: "Legendary",     price: "$39/mo", eggs: "Unlimited",    pets: "∞ pets",         highlight: false },
]

export default function LandingPage() {
  const { data: session } = useSession()
  return (
    <div className="relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              left: `${(i * 5.3) % 100}%`, top: `${(i * 7.7) % 100}%`,
              background: ["#7C3AED","#F59E0B","#10B981"][i % 3], opacity: 0.3,
            }}
            animate={{ y: [-20, 20, -20], opacity: [0.1, 0.45, 0.1] }}
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
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--muted)" }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#eggs" className="hover:text-white transition-colors">Eggs</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard"
                className="text-sm btn-gold px-4 py-2 rounded-full flex items-center gap-1.5">
                My Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/auth/signin"
                  className="text-sm px-3 py-1.5 transition-colors hover:text-white"
                  style={{ color: "var(--muted)" }}>
                  Sign in
                </Link>
                <Link href="/auth/signup"
                  className="text-sm btn-gold px-4 py-2 rounded-full">
                  Get your egg
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 40% 40% at 50% 55%, rgba(245,158,11,0.08) 0%, transparent 60%)" }} />

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div custom={0} variants={fadeUp} className="mb-8">
            <EggSVG tier="epic" size={150} />
          </motion.div>
          <motion.p custom={1} variants={fadeUp}
            className="text-sm uppercase tracking-[0.35em] text-purple-400 mb-4 font-semibold">
            AI Companion Platform
          </motion.p>
          <motion.h1 custom={2} variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 max-w-3xl mx-auto">
            <span className="text-white">Something small is</span><br />
            <span className="text-gradient">waiting for you</span><br />
            <span className="text-white">to notice.</span>
          </motion.h1>
          <motion.p custom={3} variants={fadeUp}
            className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--muted)" }}>
            Buy an AI egg. Hatch it. Raise your unique AI creature from baby to adult.<br />
            It remembers you. It grows because of you.
          </motion.p>
          <motion.div custom={4} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {session ? (
              <Link href="/dashboard"
                className="btn-gold flex items-center gap-2 px-8 py-4 rounded-full text-base">
                <Egg className="w-5 h-5" /> Go to my Dashboard →
              </Link>
            ) : (
              <Link href="/auth/signup"
                className="btn-gold flex items-center gap-2 px-8 py-4 rounded-full text-base">
                <Egg className="w-5 h-5" /> Hatch your first egg — Free
              </Link>
            )}
            <a href="#how" className="flex items-center gap-2 transition-colors text-sm hover:text-white"
              style={{ color: "var(--muted)" }}>
              How does it work? <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 float" style={{ color: "var(--muted)" }} />
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-5 overflow-hidden" style={{ borderTop: "1px solid rgba(124,58,237,0.2)", borderBottom: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }}>
        <div className="flex gap-14 whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
          {[...Array(2)].flatMap(() => ["Hatch. Raise. Bond.", "An egg. A choice. A quiet little life.", "How much do you still care?", "Your pet. Your story.", "Real AI personality. Real bond.", "No two pets are the same."]).map((t, i) => (
            <span key={i} className="text-sm font-medium" style={{ color: "rgba(167,139,250,0.45)" }}>✦ {t}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest mb-3 text-purple-400">The Journey</p>
            <h2 className="text-4xl font-black text-white">From egg to companion</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
            {STAGES.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-light rounded-2xl p-5 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="font-semibold text-white text-sm">{s.label}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{s.sub}</div>
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
                className="clay-card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(124,58,237,0.15)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eggs */}
      <section id="eggs" className="py-24 px-4" style={{ background: "rgba(124,58,237,0.03)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-3 text-purple-400">Egg Rarity</p>
          <h2 className="text-4xl font-black text-white mb-16">Which egg will you hatch?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {EGGS.map((e, i) => (
              <motion.div key={e.tier} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`clay-card ${e.glowClass} rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}>
                <EggSVG tier={e.tier} size={80} />
                <h3 className="font-bold mt-3 text-sm" style={{ color: e.color }}>{e.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-3 text-purple-400">Plans</p>
          <h2 className="text-4xl font-black text-white mb-4">Start free. Grow your collection.</h2>
          <p className="mb-16" style={{ color: "var(--muted)" }}>Your first egg is free. No credit card needed.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 text-left relative ${p.highlight ? "" : "clay-card"}`}
                style={p.highlight ? { background: "rgba(124,58,237,0.18)", border: "2px solid #7C3AED" } : {}}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <div className="font-semibold text-white mb-1 text-sm">{p.name}</div>
                <div className="text-2xl font-black mb-4" style={{ color: p.highlight ? "#A78BFA" : "#F0EDFF" }}>{p.price}</div>
                <ul className="space-y-2 text-xs mb-6" style={{ color: "var(--muted)" }}>
                  <li className="flex items-center gap-2"><Egg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> {p.eggs}</li>
                  <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" /> {p.pets}</li>
                </ul>
                <Link href="/auth/signup"
                  className={`block text-center py-2.5 rounded-full text-xs font-bold transition-colors ${p.highlight ? "btn-gold" : "glass-light text-gray-300 hover:text-white"}`}>
                  {p.price === "Free" ? "Get started" : "Upgrade"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4" style={{ background: "rgba(124,58,237,0.03)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-5xl mb-8">🌱</p>
            <blockquote className="text-2xl sm:text-3xl font-black text-white leading-relaxed mb-6">
              &ldquo;In a world that scrolls past everything —<br/>
              <span className="text-gradient">how much care do we still have left?&rdquo;</span>
            </blockquote>
            <p className="leading-relaxed max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
              Spawn AI is not just a game. It&apos;s a quiet experiment in caring. In patience.
              In choosing to invest your attention in something small that grows slowly —
              and means more because of it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section id="founder" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                MR
              </div>
            </div>
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">The founder</p>
              <h2 className="text-2xl font-black text-white mb-1">Mike Ronny</h2>
              <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>Myanmar · Founder of Spawn AI</p>
              <div className="space-y-3 leading-relaxed text-sm" style={{ color: "rgba(240,237,255,0.75)" }}>
                <p>
                  I built Spawn AI because I had a question I couldn&apos;t stop thinking about.
                  We live in a time when everything is instant, disposable, forgettable.
                </p>
                <p>
                  But the things that actually matter — the things we <span className="text-white font-medium">remember</span> — are the ones
                  we waited for. The ones we invested in.
                </p>
                <p>
                  This app is my answer to that. It&apos;s a small, quiet thing.
                  But it&apos;s built with all my care.
                </p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-1.5 mt-5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Read the full story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <EggSVG tier="mythic" size={110} />
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-6 mb-4">An egg. A choice.</h2>
          <p className="text-xl mb-2 italic" style={{ color: "var(--muted)" }}>&ldquo;A quiet little life.&rdquo;</p>
          <p className="mb-10 max-w-md mx-auto" style={{ color: "rgba(139,133,160,0.7)" }}>
            Your pet is waiting. It doesn&apos;t know your name yet. But it will.
          </p>
          {session ? (
            <Link href="/dashboard"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg">
              <Egg className="w-5 h-5" /> Back to my pets →
            </Link>
          ) : (
            <Link href="/auth/signup"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg">
              <Egg className="w-5 h-5" /> Start for free
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center text-sm"
        style={{ borderTop: "1px solid rgba(124,58,237,0.18)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ color: "var(--muted)" }}>
          <div className="flex items-center gap-2">
            <EggSVG tier="common" size={20} animate={false} />
            <span className="font-medium">Spawn AI</span>
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
