"use client"
import { useEffect, useState, use, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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

// ─── Hatching Overlay ─────────────────────────────────────────────────────────

const PARTICLE_COLORS = ["#F59E0B","#EF4444","#8B5CF6","#10B981","#F97316","#EC4899","#FBBF24","#A78BFA"]
const STAGES_EMOJI: Record<string, string> = { dragon: "🐉", cat: "🐱", phoenix: "🦅", unicorn: "🦄", wolf: "🐺", fox: "🦊", bunny: "🐰", panda: "🐼" }

function Particle({ angle, color, delay }: { angle: number; color: string; delay: number }) {
  const rad = (angle * Math.PI) / 180
  const dist = 120 + Math.random() * 80
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: 8 + Math.random() * 8, height: 8 + Math.random() * 8, background: color, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 1 }}
      animate={{
        x: `calc(-50% + ${dist * Math.cos(rad)}px)`,
        y: `calc(-50% + ${dist * Math.sin(rad)}px)`,
        scale: [0, 1.5, 0.8, 0],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    />
  )
}

function HatchingOverlay({ species, onDone }: { species: string; onDone: () => void }) {
  const [phase, setPhase] = useState<"shake" | "crack" | "flash" | "reveal">("shake")
  const doneRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("crack"),  700)
    const t2 = setTimeout(() => setPhase("flash"),  1600)
    const t3 = setTimeout(() => setPhase("reveal"), 2000)
    const t4 = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDone() } }, 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone])

  const petEmoji = STAGES_EMOJI[species.toLowerCase()] ?? "🐣"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,10,30,0.95)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            className="absolute inset-0"
            style={{ background: "white" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center gap-6">
        {/* Particles (appear at crack phase) */}
        {(phase === "crack" || phase === "flash" || phase === "reveal") && (
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            {[...Array(18)].map((_, i) => (
              <Particle
                key={i}
                angle={(i / 18) * 360 + Math.random() * 20}
                color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
                delay={i * 0.03}
              />
            ))}
          </div>
        )}

        {/* Egg + cracks */}
        <AnimatePresence>
          {phase !== "reveal" && (
            <motion.div
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                animate={
                  phase === "shake"
                    ? { rotate: [-4, 4, -6, 6, -4, 4, -3, 3, 0], x: [-3, 3, -4, 4, -2, 2, 0] }
                    : phase === "crack"
                    ? { rotate: [-8, 8, -10, 10, -8, 8, -6, 6, 0], x: [-5, 5, -6, 6, -4, 4, 0], scale: [1, 1.08, 1, 1.1, 1] }
                    : { scale: [1, 1.2, 0.1], rotate: 0 }
                }
                transition={{ duration: phase === "crack" ? 0.9 : 0.7, ease: "easeInOut" }}
              >
                <svg width="140" height="168" viewBox="0 0 100 120" style={{ filter: "drop-shadow(0 0 40px rgba(245,158,11,0.8))" }}>
                  <defs>
                    <radialGradient id="hatch-egg" cx="40%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fef3c7"/>
                      <stop offset="60%" stopColor="#f59e0b"/>
                      <stop offset="100%" stopColor="#d97706"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#hatch-egg)"/>
                  <ellipse cx="38" cy="42" rx="8" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,38,42)"/>
                  {/* Crack lines */}
                  {(phase === "crack" || phase === "flash") && (
                    <g stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none">
                      <motion.path
                        d="M50 30 L44 46 L52 52 L46 68"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.path
                        d="M50 30 L57 47 L63 58"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      />
                      <motion.path
                        d="M44 46 L36 55"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      />
                    </g>
                  )}
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet reveal */}
        <AnimatePresence>
          {phase === "reveal" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: 1 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="text-8xl"
                animate={{ rotate: [-8, 8, -4, 4, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {petEmoji}
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-2xl font-black text-white">It&apos;s hatching!</p>
                <p className="text-amber-400 text-sm mt-1">Your new companion is here ✨</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow rings */}
        {(phase === "crack" || phase === "reveal") && [...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-amber-400"
            style={{ width: 80 + i * 60, height: 80 + i * 60, top: "50%", left: "50%", x: "-50%", y: "-50%", opacity: 0 }}
            animate={{ scale: [0.5, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: phase === "crack" ? Infinity : 0, repeatDelay: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
  const [showAnimation, setShowAnimation] = useState(false)
  const [petId, setPetId] = useState<string | null>(null)
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
    if (hatching) return
    setHatching(true)
    try {
      const res = await fetch(`/api/egg/${id}/hatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: petName.trim() }),
      })
      const data = await res.json()
      if (data.pet) {
        setPetId(data.pet.id)
        setShowAnimation(true)
      } else {
        toast.error(data.error ?? "Couldn't hatch egg")
        setHatching(false)
      }
    } catch {
      toast.error("Failed to hatch")
      setHatching(false)
    }
  }

  function handleAnimationDone() {
    if (petId) router.push(`/pet/${petId}`)
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
    <>
      <AnimatePresence>
        {showAnimation && (
          <HatchingOverlay species={egg.species} onDone={handleAnimationDone} />
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col items-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        <motion.div
          className={isReady ? "wiggle" : "float"}
          whileHover={{ scale: 1.05 }}
        >
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
        </motion.div>

        {/* Countdown */}
        <Countdown hatchesAt={egg.hatchesAt} onReady={() => setIsReady(true)} />

        {/* Whisper reaction */}
        <AnimatePresence>
          {lastReaction && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-purple-300 italic">{lastReaction}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Whisper count */}
        {whisperCount > 0 && (
          <p className="text-xs text-gray-500">{whisperCount} whisper{whisperCount !== 1 ? "s" : ""} sent today</p>
        )}

        {/* Hatch section */}
        {isReady ? (
          <motion.div
            className="w-full space-y-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            {showNameInput ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-300 text-center">Give your pet a name</p>
                <input
                  type="text"
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && hatchEgg()}
                  placeholder="What's their name?"
                  maxLength={20}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-amber-500"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,158,11,0.4)" }}
                />
                <motion.button
                  onClick={hatchEgg}
                  disabled={hatching || !petName.trim()}
                  className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ opacity: 0.92 }}
                >
                  {hatching ? <Loader2 className="w-5 h-5 animate-spin" /> : "✨ Hatch!"}
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowNameInput(true)}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg"
                style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ boxShadow: "0 0 50px rgba(245,158,11,0.6)" }}
                animate={{ boxShadow: ["0 0 30px rgba(245,158,11,0.4)", "0 0 50px rgba(245,158,11,0.7)", "0 0 30px rgba(245,158,11,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🥚 Hatch Now!
              </motion.button>
            )}
          </motion.div>
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
      </motion.div>
    </>
  )
}
