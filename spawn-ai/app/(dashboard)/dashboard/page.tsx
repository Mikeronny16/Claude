"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type Egg = { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean; personalitySeeds: { id: string }[] }
type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number }
type DashData = { eggs: Egg[]; pets: Pet[]; user: { plan: string; messagesUsedToday: number; name: string | null; email: string } }

const tierColor: Record<string, string> = {
  common: "#9CA3AF", rare: "#3B82F6", epic: "#8B5CF6", mythic: "#F59E0B",
}
const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function EggCountdown({ hatchesAt }: { hatchesAt: string }) {
  const [remaining, setRemaining] = useState("")
  useEffect(() => {
    function update() {
      const diff = new Date(hatchesAt).getTime() - Date.now()
      if (diff <= 0) { setRemaining("Ready!"); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [hatchesAt])
  return <span>{remaining}</span>
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { toast.error("Failed to load"); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!data) return null

  const pendingEggs = data.eggs.filter(e => !e.isHatched)
  const readyEggs = pendingEggs.filter(e => new Date(e.hatchesAt) <= new Date())
  const incubating = pendingEggs.filter(e => new Date(e.hatchesAt) > new Date())

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{data.user.name ? `, ${data.user.name}` : ""} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {data.user.plan === "free" ? `${data.user.messagesUsedToday}/30 messages today` : "Unlimited messages"} · {data.user.plan} plan
        </p>
      </div>

      {/* Ready to hatch */}
      {readyEggs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">✨ Ready to Hatch!</h2>
          <div className="grid gap-3">
            {readyEggs.map(egg => (
              <Link key={egg.id} href={`/incubator/${egg.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.4)" }}>
                <div className="wiggle">
                  <svg width="48" height="58" viewBox="0 0 100 120">
                    <defs><radialGradient id={`eg-${egg.id}`} cx="40%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fef3c7"/><stop offset="60%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/>
                    </radialGradient></defs>
                    <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#eg-${egg.id})`}/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white capitalize">{egg.species} Egg</p>
                  <p className="text-xs text-amber-400 mt-0.5">Tap to hatch now! 🎉</p>
                  <p className="text-xs text-gray-500 mt-0.5">{egg.personalitySeeds.length} whispers</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium capitalize" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                  {egg.tier}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Incubating eggs */}
      {incubating.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">🥚 Incubating</h2>
          <div className="grid gap-3">
            {incubating.map(egg => (
              <Link key={egg.id} href={`/incubator/${egg.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <div className="float">
                  <svg width="40" height="48" viewBox="0 0 100 120">
                    <defs><radialGradient id={`ei-${egg.id}`} cx="40%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#f5d0fe"/><stop offset="60%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/>
                    </radialGradient></defs>
                    <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#ei-${egg.id})`} opacity="0.8"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white capitalize">{egg.species} Egg</p>
                  <p className="text-xs text-gray-400 mt-0.5">Hatches in <EggCountdown hatchesAt={egg.hatchesAt} /></p>
                  <p className="text-xs text-gray-500 mt-0.5">{egg.personalitySeeds.length} whispers · Tap to whisper</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ color: tierColor[egg.tier] ?? "#9CA3AF", background: "rgba(255,255,255,0.05)", border: `1px solid ${tierColor[egg.tier] ?? "#9CA3AF"}40` }}>
                  {egg.tier}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pets */}
      {data.pets.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">💜 Your Companions</h2>
          <div className="grid gap-3">
            {data.pets.map(pet => (
              <Link key={pet.id} href={`/pet/${pet.id}`}
                className="block p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stageEmoji[pet.stage] ?? "🐣"}</span>
                    <div>
                      <p className="font-bold text-white">{pet.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{pet.species} · {pet.stage} · Lv.{pet.level}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full capitalize font-medium"
                    style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
                    Talk →
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
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{s.label}</span><span>{s.value}</span>
                      </div>
                      <StatBar value={s.value} color={s.color} />
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : pendingEggs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🥚</p>
          <p className="text-white font-semibold">No eggs yet</p>
          <p className="text-gray-400 text-sm mt-1">Something is waiting to be born.</p>
          <Link href="/shop" className="inline-block mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
            Visit the Shop
          </Link>
        </div>
      ) : null}

      {pendingEggs.length === 0 && data.pets.length > 0 && (
        <div className="text-center pt-2">
          <Link href="/shop" className="text-sm text-purple-400 hover:text-purple-300">+ Get another egg</Link>
        </div>
      )}
    </div>
  )
}
