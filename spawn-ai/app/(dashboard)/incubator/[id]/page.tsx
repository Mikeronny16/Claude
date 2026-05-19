"use client"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

type Egg = { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean }

function Countdown({ hatchesAt, onReady }: { hatchesAt: string; onReady: () => void }) {
  const [remaining, setRemaining] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function update() {
      const diff = new Date(hatchesAt).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining("")
        if (!ready) { setReady(true); onReady() }
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [hatchesAt, onReady, ready])

  return (
    <div className="text-center">
      {ready ? (
        <p className="text-xl font-bold text-amber-400">✨ Ready to hatch!</p>
      ) : (
        <>
          <p className="text-sm text-gray-400">Hatching in</p>
          <p className="text-2xl font-bold text-white mt-1">{remaining}</p>
        </>
      )}
    </div>
  )
}

export default function IncubatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [egg, setEgg] = useState<Egg | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [whisper, setWhisper] = useState("")
  const [whisperCount, setWhisperCount] = useState(0)
  const [lastReaction, setLastReaction] = useState("")
  const [sending, setSending] = useState(false)
  const [hatching, setHatching] = useState(false)
  const [petName, setPetName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    async function loadEgg() {
      const res = await fetch("/api/dashboard")
      const data = await res.json()
      const found = data.eggs?.find((e: Egg) => e.id === id)
      if (!found) { toast.error("Egg not found"); router.push("/dashboard"); return }
      if (found.isHatched) { router.push("/dashboard"); return }
      setEgg(found)
      setIsReady(new Date(found.hatchesAt) <= new Date())
      setLoading(false)
    }
    loadEgg()
  }, [id, router])

  async function sendWhisper(e: React.FormEvent) {
    e.preventDefault()
    if (!whisper.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/egg/${id}/whisper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: whisper.trim() }),
      })
      const data = await res.json()
      if (data.reaction) {
        setLastReaction(data.reaction)
        setWhisperCount(prev => prev + 1)
        setWhisper("")
        setTimeout(() => setLastReaction(""), 3000)
      }
    } catch {
      toast.error("Failed to whisper")
    } finally {
      setSending(false)
    }
  }

  async function hatchEgg() {
    if (!petName.trim()) { setShowNameInput(true); return }
    setHatching(true)
    try {
      const res = await fetch(`/api/egg/${id}/hatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: petName.trim() }),
      })
      const data = await res.json()
      if (data.pet) {
        toast.success(`🎉 ${data.pet.name} has hatched!`)
        router.push(`/pet/${data.pet.id}`)
      } else {
        toast.error(data.error ?? "Couldn't hatch egg")
        setHatching(false)
      }
    } catch {
      toast.error("Failed to hatch")
      setHatching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: "60vh" }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!egg) return null

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full flex items-center gap-2">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-white capitalize">{egg.species} Egg</h1>
        <span className="ml-auto text-xs px-2 py-1 rounded-full capitalize"
          style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
          {egg.tier}
        </span>
      </div>

      {/* Egg visual */}
      <div className={isReady ? "wiggle" : "float"}>
        <svg width="120" height="144" viewBox="0 0 100 120" style={{ filter: isReady ? "drop-shadow(0 0 30px rgba(245,158,11,0.7))" : "drop-shadow(0 0 20px rgba(139,92,246,0.5))" }}>
          <defs>
            <radialGradient id="egg-main" cx="40%" cy="30%" r="65%">
              {isReady
                ? <><stop offset="0%" stopColor="#fef3c7"/><stop offset="60%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/></>
                : <><stop offset="0%" stopColor="#f5d0fe"/><stop offset="60%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></>
              }
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#egg-main)"/>
          {isReady && <>
            <ellipse cx="35" cy="45" rx="6" ry="8" fill="rgba(255,255,255,0.15)"/>
            <line x1="48" y1="30" x2="42" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <line x1="55" y1="28" x2="55" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          </>}
        </svg>
      </div>

      {/* Countdown */}
      <Countdown hatchesAt={egg.hatchesAt} onReady={() => setIsReady(true)} />

      {/* Whisper reaction */}
      {lastReaction && (
        <div className="text-center">
          <p className="text-sm text-purple-300 italic fade-up">{lastReaction}</p>
        </div>
      )}

      {/* Whisper count */}
      {whisperCount > 0 && (
        <p className="text-xs text-gray-500">{whisperCount} whisper{whisperCount !== 1 ? "s" : ""} sent today</p>
      )}

      {/* Hatch section */}
      {isReady ? (
        <div className="w-full space-y-3">
          {showNameInput ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-300 text-center">Give your pet a name</p>
              <input
                type="text"
                value={petName}
                onChange={e => setPetName(e.target.value)}
                placeholder="What's their name?"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-amber-500"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,158,11,0.4)" }}
              />
              <button
                onClick={hatchEgg}
                disabled={hatching || !petName.trim()}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}
              >
                {hatching ? <Loader2 className="w-5 h-5 animate-spin" /> : "✨ Hatch!"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNameInput(true)}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
            >
              🥚 Hatch Now!
            </button>
          )}
        </div>
      ) : (
        <div className="w-full space-y-3">
          <p className="text-sm text-gray-400 text-center">
            Whisper to your egg while it incubates.<br/>
            <span className="text-purple-400">Your words shape its personality.</span>
          </p>
          <form onSubmit={sendWhisper} className="flex gap-2">
            <input
              value={whisper}
              onChange={e => setWhisper(e.target.value)}
              placeholder="Whisper something sweet..."
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.25)" }}
            />
            <button
              type="submit"
              disabled={sending || !whisper.trim()}
              className="px-4 py-3 rounded-xl disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
