"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Zap, MessageCircle, Star } from "lucide-react"
import { toast } from "sonner"

type Egg = { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean; personalitySeeds: { id: string }[] }
type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number }
type DashData = { eggs: Egg[]; pets: Pet[]; user: { plan: string; messagesUsedToday: number; name: string | null; email: string } }

// Unique egg SVG per species
function EggCard({ egg }: { egg: Egg }) {
  const s = egg.species.toLowerCase()

  const styles: Record<string, { top: string; mid: string; bot: string; glow: string; deco?: string }> = {
    dragon:  { top: "#fca5a5", mid: "#ef4444", bot: "#991b1b", glow: "#ef4444", deco: "scales" },
    cat:     { top: "#fef9c3", mid: "#fbbf24", bot: "#d97706", glow: "#fbbf24", deco: "dots" },
    phoenix: { top: "#fef3c7", mid: "#f97316", bot: "#c2410c", glow: "#f97316", deco: "flames" },
    unicorn: { top: "#f5d0fe", mid: "#d946ef", bot: "#7c3aed", glow: "#d946ef", deco: "stars" },
    wolf:    { top: "#e2e8f0", mid: "#94a3b8", bot: "#475569", glow: "#94a3b8", deco: "moon" },
    fox:     { top: "#fed7aa", mid: "#f97316", bot: "#9a3412", glow: "#f97316", deco: "leaf" },
    bunny:   { top: "#fce7f3", mid: "#f472b6", bot: "#9d174d", glow: "#f472b6", deco: "dots" },
    panda:   { top: "#f1f5f9", mid: "#cbd5e1", bot: "#64748b", glow: "#cbd5e1", deco: "none" },
  }
  const tierStyles: Record<string, { top: string; mid: string; bot: string; glow: string }> = {
    common:  { top: "#fde68a", mid: "#f59e0b", bot: "#d97706", glow: "#f59e0b" },
    rare:    { top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8" },
    epic:    { top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7" },
    mythic:  { top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899" },
  }

  const c = styles[s] ?? tierStyles[egg.tier] ?? tierStyles.common
  const id = `e-${egg.id.slice(0,6)}`

  return (
    <div className="float" style={{ filter: `drop-shadow(0 0 14px ${c.glow}88)` }}>
      <svg width="44" height="53" viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`g-${id}`} cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor={c.top}/>
            <stop offset="55%" stopColor={c.mid}/>
            <stop offset="100%" stopColor={c.bot}/>
          </radialGradient>
          <radialGradient id={`s-${id}`} cx="32%" cy="22%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#g-${id})`}/>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#s-${id})`}/>
        {/* Species decorations */}
        {c.deco === "scales" && <>
          <line x1="38" y1="55" x2="62" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
          <line x1="34" y1="68" x2="66" y2="68" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
          <line x1="38" y1="81" x2="62" y2="81" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
        </>}
        {c.deco === "stars" && <>
          <text x="28" y="52" fontSize="12" fill="rgba(255,255,255,0.6)">✦</text>
          <text x="60" y="72" fontSize="8" fill="rgba(255,255,255,0.5)">✦</text>
          <text x="40" y="88" fontSize="10" fill="rgba(255,255,255,0.4)">✦</text>
        </>}
        {c.deco === "flames" && <>
          <ellipse cx="40" cy="22" rx="5" ry="10" fill={c.top} opacity="0.6" transform="rotate(-15,40,22)"/>
          <ellipse cx="55" cy="19" rx="4" ry="9" fill={c.top} opacity="0.5" transform="rotate(10,55,19)"/>
        </>}
        {c.deco === "moon" && <>
          <path d="M 55 35 A 12 12 0 1 1 55 59 A 8 8 0 1 0 55 35" fill="rgba(255,255,255,0.2)"/>
        </>}
        {c.deco === "dots" && <>
          <circle cx="38" cy="60" r="3" fill="rgba(255,255,255,0.2)"/>
          <circle cx="62" cy="70" r="2" fill="rgba(255,255,255,0.2)"/>
          <circle cx="45" cy="80" r="2.5" fill="rgba(255,255,255,0.15)"/>
        </>}
        {c.deco === "leaf" && <>
          <path d="M50 40 Q60 55 50 70 Q40 55 50 40" fill="rgba(255,255,255,0.15)"/>
        </>}
        <ellipse cx="38" cy="42" rx="7" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20,38,42)"/>
      </svg>
    </div>
  )
}

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(2, value)}%`, background: color }} />
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
  const tip = TIPS[new Date().getDate() % TIPS.length]

  const load = useCallback(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false) })
      .catch(() => { toast.error("Failed to load"); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
  if (!data) return null

  const pendingEggs = data.eggs.filter(e => !e.isHatched)
  const readyEggs = pendingEggs.filter(e => new Date(e.hatchesAt) <= new Date())
  const incubating = pendingEggs.filter(e => new Date(e.hatchesAt) > new Date())
  const totalBond = data.pets.reduce((s, p) => s + p.bond, 0)
  const isAdmin = data.user.email === "mikeronny18@gmail.com"

  return (
    <div className="space-y-6">
      {/* Welcome + stats */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey{data.user.name ? `, ${data.user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5 capitalize">{data.user.plan} plan</p>
          </div>
          <div className="flex gap-2">
            {data.user.plan === "free" && (
              <Link href="/pricing" className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7C3AED,#F59E0B)", color: "#fff" }}>
                ⚡ Upgrade
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B" }}>
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Eggs", value: pendingEggs.length, icon: "🥚" },
            { label: "Pets", value: data.pets.length, icon: "🐾" },
            { label: "Bond", value: totalBond, icon: "💜" },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-2xl"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages used */}
      {data.user.plan === "free" && (
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Messages today</span>
            <span>{data.user.messagesUsedToday}/30</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(data.user.messagesUsedToday / 30) * 100}%`, background: data.user.messagesUsedToday > 25 ? "#EF4444" : "#8B5CF6" }} />
          </div>
        </div>
      )}

      {/* Ready to hatch */}
      {readyEggs.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">✨ Ready to Hatch!</h2>
          <div className="space-y-2">
            {readyEggs.map(egg => (
              <Link key={egg.id} href={`/incubator/${egg.id}`}
                className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.4)" }}>
                <div className="wiggle"><EggCard egg={egg} /></div>
                <div className="flex-1">
                  <p className="font-semibold text-white capitalize">{egg.species} Egg</p>
                  <p className="text-xs text-amber-400">Tap to hatch! 🎉</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full capitalize font-medium" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>{egg.tier}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Incubating */}
      {incubating.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">🥚 Incubating</h2>
          <div className="space-y-2">
            {incubating.map(egg => (
              <Link key={egg.id} href={`/incubator/${egg.id}`}
                className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <EggCard egg={egg} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white capitalize">{egg.species} Egg</p>
                  <p className="text-xs text-gray-400">Hatches in <EggCountdown hatchesAt={egg.hatchesAt} /></p>
                  <p className="text-xs text-gray-500">{egg.personalitySeeds.length} whispers · Tap to whisper</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                  style={{ color: "#a78bfa", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>{egg.tier}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pets */}
      {data.pets.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">💜 Your Companions</h2>
          <div className="space-y-3">
            {data.pets.map(pet => (
              <Link key={pet.id} href={`/pet/${pet.id}`}
                className="block p-4 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stageEmoji[pet.stage] ?? "🐣"}</span>
                    <div>
                      <p className="font-bold text-white">{pet.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{pet.species} · {pet.stage} · Lv.{pet.level}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                    style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <MessageCircle className="w-3 h-3" /> Talk
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Hunger", value: pet.hunger, color: "#F59E0B" },
                    { label: "Energy", value: pet.energy, color: "#10B981" },
                    { label: "Happy", value: pet.happiness, color: "#8B5CF6" },
                    { label: "Bond", value: pet.bond, color: "#EC4899" },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{s.label}</span><span>{s.value}</span></div>
                      <StatBar value={s.value} color={s.color} />
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* What's next guide */}
      {data.pets.length === 0 && incubating.length > 0 && (
        <div className="p-5 rounded-2xl space-y-3" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <p className="font-semibold text-white text-sm">🗺️ While you wait...</p>
          <div className="space-y-2">
            {[
              { step: "1", text: "Tap your egg and whisper something sweet", link: `/incubator/${incubating[0]?.id}`, cta: "Whisper →" },
              { step: "2", text: "Your words shape its personality forever", link: null, cta: null },
              { step: "3", text: "When the timer ends, hatch and name your pet!", link: null, cta: null },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.3)", color: "#a78bfa" }}>{s.step}</span>
                <span className="text-sm text-gray-300 flex-1">{s.text}</span>
                {s.link && <Link href={s.link} className="text-xs text-purple-400 font-medium">{s.cta}</Link>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pendingEggs.length === 0 && data.pets.length === 0 && (
        <div className="text-center py-10">
          <p className="text-5xl mb-4">🥚</p>
          <p className="font-semibold text-white">No eggs yet</p>
          <p className="text-sm text-gray-400 mt-1">Something is waiting to be born.</p>
          <Link href="/pricing" className="inline-block mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)" }}>Get more eggs</Link>
        </div>
      )}

      {/* Daily tip */}
      <div className="p-4 rounded-2xl flex gap-3 items-start"
        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <Star className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-green-400 mb-1">Daily Tip</p>
          <p className="text-xs text-gray-400 leading-relaxed">{tip}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/pricing" className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.02]"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Zap className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-medium text-gray-300">Upgrade Plan</span>
          <span className="text-xs text-gray-500">Get more eggs</span>
        </Link>
        <Link href="/about" className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.02]"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <span className="text-xl">📖</span>
          <span className="text-xs font-medium text-gray-300">Our Story</span>
          <span className="text-xs text-gray-500">Why we built this</span>
        </Link>
      </div>
    </div>
  )
}
