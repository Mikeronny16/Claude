"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MessageCircle, Zap, Gift } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

type Egg = { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean; personalitySeeds: { id: string }[] }
type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number }
type DashData = { eggs: Egg[]; pets: Pet[]; user: { plan: string; messagesUsedToday: number; name: string | null; email: string } }

function CircularStat({ value, color, label, size = 72 }: { value: number; color: string; label: string; size?: number }) {
  const r = 26
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, value / 100)) * circ
  const gap = circ - dash
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5.5" />
          <motion.circle
            cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            transform="rotate(-90 30 30)"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  )
}

function EggCountdown({ hatchesAt }: { hatchesAt: string }) {
  const [rem, setRem] = useState("")
  useEffect(() => {
    function upd() {
      const d = new Date(hatchesAt).getTime() - Date.now()
      if (d <= 0) { setRem("Ready!"); return }
      const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000)
      setRem(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`)
    }
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id)
  }, [hatchesAt])
  return <span>{rem}</span>
}

function EggSVG({ tier, species, size = 44 }: { tier: string; species: string; size?: number }) {
  const palettes: Record<string, { top: string; mid: string; bot: string; glow: string }> = {
    common:  { top: "#fef9c3", mid: "#fbbf24", bot: "#d97706", glow: "#fbbf24" },
    rare:    { top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8" },
    epic:    { top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7" },
    mythic:  { top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899" },
  }
  const speciesTints: Record<string, { top: string; mid: string; bot: string }> = {
    dragon: { top: "#fca5a5", mid: "#ef4444", bot: "#991b1b" },
    phoenix: { top: "#fef3c7", mid: "#f97316", bot: "#c2410c" },
    unicorn: { top: "#f5d0fe", mid: "#d946ef", bot: "#7c3aed" },
    wolf: { top: "#e2e8f0", mid: "#94a3b8", bot: "#475569" },
  }
  const p = palettes[tier] ?? palettes.common
  const s = speciesTints[species.toLowerCase()]
  const c = s ? { ...p, top: s.top, mid: s.mid, bot: s.bot } : p
  const uid = `e-${tier}-${species}`
  return (
    <div className="float" style={{ filter: `drop-shadow(0 0 10px ${c.glow}88)` }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`g-${uid}`} cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor={c.top}/><stop offset="55%" stopColor={c.mid}/><stop offset="100%" stopColor={c.bot}/>
          </radialGradient>
          <radialGradient id={`s-${uid}`} cx="32%" cy="22%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#g-${uid})`}/>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#s-${uid})`}/>
        <ellipse cx="38" cy="42" rx="7" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20,38,42)"/>
      </svg>
    </div>
  )
}

const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }

const TIPS = [
  "Whisper to your egg before it hatches — your words shape its personality forever.",
  "Feed your pet regularly to keep hunger above 50.",
  "Playing raises happiness AND bond. Bond unlocks deeper conversations.",
  "The more you chat, the faster your pet levels up.",
  "Sleep restores energy so your pet can talk more.",
  "Adult-stage pets can have deep, meaningful conversations.",
]

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const tip = TIPS[new Date().getDate() % TIPS.length]

  const load = useCallback(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false) })
      .catch(() => { toast.error("Failed to load"); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const key = `reward-${new Date().toDateString()}`
    setRewardClaimed(localStorage.getItem(key) === "1")
  }, [])

  function claimReward() {
    const key = `reward-${new Date().toDateString()}`
    localStorage.setItem(key, "1")
    setRewardClaimed(true)
    toast.success("🎁 Daily reward claimed! +5 XP for all pets")
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
  if (!data) return null

  const pendingEggs = data.eggs.filter(e => !e.isHatched)
  const readyEggs = pendingEggs.filter(e => new Date(e.hatchesAt) <= new Date())
  const incubating = pendingEggs.filter(e => new Date(e.hatchesAt) > new Date())
  const isAdmin = data.user.email === "mikeronny18@gmail.com"

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Hey{data.user.name ? `, ${data.user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--muted)" }}>{data.user.plan} plan</p>
        </div>
        <div className="flex gap-2">
          {data.user.plan === "free" && (
            <Link href="/pricing" className="text-xs px-3 py-1.5 rounded-full font-bold transition-all"
              style={{ background: "linear-gradient(135deg,#5B21B6,#F59E0B)", color: "#fff" }}>
              ⚡ Upgrade
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", color: "#F59E0B" }}>
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Top cards row: Daily Reward + Messages */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="gold-card rounded-2xl p-4 flex flex-col gap-2"
          whileTap={{ scale: 0.97 }}
        >
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4" style={{ color: "#F59E0B" }} />
            <span className="text-xs font-semibold" style={{ color: "#F59E0B" }}>Daily Reward</span>
          </div>
          {rewardClaimed ? (
            <p className="text-xs" style={{ color: "var(--muted)" }}>Claimed today ✓</p>
          ) : (
            <button onClick={claimReward}
              className="btn-gold text-xs py-1.5 rounded-xl w-full">
              Claim +5 XP
            </button>
          )}
        </motion.div>

        <div className="clay-card rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">Messages</span>
          </div>
          <div className="text-lg font-bold text-white">{data.user.messagesUsedToday}<span className="text-xs font-normal" style={{ color: "var(--muted)" }}>/30</span></div>
          <div className="h-1 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(data.user.messagesUsedToday / 30) * 100}%`, background: data.user.messagesUsedToday > 25 ? "#EF4444" : "#7C3AED" }} />
          </div>
        </div>
      </div>

      {/* Ready to hatch */}
      <AnimatePresence>
        {readyEggs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F59E0B" }}>✨ Ready to Hatch!</p>
            <div className="space-y-2">
              {readyEggs.map(egg => (
                <Link key={egg.id} href={`/incubator/${egg.id}`}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02] gold-card">
                  <div className="wiggle"><EggSVG tier={egg.tier} species={egg.species} /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-white capitalize">{egg.species} Egg</p>
                    <p className="text-xs" style={{ color: "#F59E0B" }}>Tap to hatch! 🎉</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full capitalize font-medium"
                    style={{ background: "rgba(245,158,11,0.18)", color: "#F59E0B" }}>{egg.tier}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incubating */}
      {incubating.length > 0 && (
        <div>
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">🥚 Incubating</p>
          <div className="space-y-2">
            {incubating.map(egg => (
              <Link key={egg.id} href={`/incubator/${egg.id}`}
                className="clay-card flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]">
                <EggSVG tier={egg.tier} species={egg.species} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white capitalize">{egg.species} Egg</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Hatches in <EggCountdown hatchesAt={egg.hatchesAt} />
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(167,139,250,0.7)" }}>
                    {egg.personalitySeeds.length} whispers · Tap to whisper
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                  style={{ color: "#a78bfa", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {egg.tier}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pets with circular stats */}
      {data.pets.length > 0 && (
        <div>
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">💜 Your Companions</p>
          <div className="space-y-4">
            {data.pets.map(pet => (
              <Link key={pet.id} href={`/pet/${pet.id}`}
                className="clay-card block p-4 rounded-2xl transition-all hover:scale-[1.01]">
                {/* Pet header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{stageEmoji[pet.stage] ?? "🐣"}</span>
                    <div>
                      <p className="font-bold text-white text-lg leading-tight">{pet.name}</p>
                      <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
                        {pet.species} · {pet.stage} · Lv.{pet.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
                      style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                      <MessageCircle className="w-3 h-3" /> Chat
                    </span>
                    <span className="text-xs" style={{ color: "#EC4899" }}>Bond {pet.bond}</span>
                  </div>
                </div>

                {/* Circular stats */}
                <div className="flex justify-around">
                  <CircularStat value={pet.hunger} color="#F59E0B" label="Hunger" />
                  <CircularStat value={pet.energy} color="#10B981" label="Energy" />
                  <CircularStat value={pet.happiness} color="#A78BFA" label="Happy" />
                  <CircularStat value={pet.bond} color="#EC4899" label="Bond" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* While you wait guide */}
      {data.pets.length === 0 && incubating.length > 0 && (
        <div className="p-5 rounded-2xl space-y-3 clay-card">
          <p className="font-semibold text-white text-sm">🗺️ While you wait...</p>
          <div className="space-y-2">
            {[
              { step: "1", text: "Tap your egg and whisper something sweet", link: `/incubator/${incubating[0]?.id}`, cta: "Whisper →" },
              { step: "2", text: "Your words shape its personality forever", link: null, cta: null },
              { step: "3", text: "When the timer ends, hatch and name your pet!", link: null, cta: null },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>{s.step}</span>
                <span className="text-sm flex-1" style={{ color: "rgba(240,237,255,0.75)" }}>{s.text}</span>
                {s.link && <Link href={s.link} className="text-xs text-purple-400 font-medium">{s.cta}</Link>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pendingEggs.length === 0 && data.pets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">🥚</p>
          <p className="font-semibold text-white">No eggs yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Something is waiting to be born.</p>
          <Link href="/shop" className="inline-block mt-4 px-6 py-2.5 rounded-full text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}>
            Visit the Egg Shop
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/shop" className="clay-card flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.02]">
          <span className="text-2xl">🥚</span>
          <span className="text-xs font-medium text-white">Egg Shop</span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Get more eggs</span>
        </Link>
        <Link href="/pricing" className="clay-card flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.02]">
          <Zap className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-medium text-white">Upgrade Plan</span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>More pets, more eggs</span>
        </Link>
      </div>

      {/* Daily tip */}
      <div className="p-4 rounded-2xl flex gap-3 items-start"
        style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
        <span className="text-green-400 text-sm flex-shrink-0 mt-0.5">💡</span>
        <div>
          <p className="text-xs font-semibold text-green-400 mb-1">Daily Tip</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{tip}</p>
        </div>
      </div>
    </div>
  )
}
