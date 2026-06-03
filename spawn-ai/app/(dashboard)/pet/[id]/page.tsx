"use client"
import { useEffect, useRef, useState, use, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Send, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; xp: number; hunger: number; energy: number; happiness: number; bond: number; personality: string }
type Message = { id: string; role: string; content: string; createdAt: string }
type FloatEmoji = { id: number; emoji: string; x: number }

const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }
const stageCreature: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "🌟" }

// ─── Surrounding Arc Stats ─────────────────────────────────────────────────────

function PetArcs({ hunger, energy, happiness, stage, name, level, bond }: {
  hunger: number; energy: number; happiness: number
  stage: string; name: string; level: number; bond: number
}) {
  const W = 320, H = 280
  const cx = 160, cy = 148
  const R = 108
  const C = 2 * Math.PI * R // ≈ 678.6

  const energySpan = C * 0.5   // top 180°
  const sideSpan   = C * 0.25  // each side 90°

  const energyFill = (Math.max(0, Math.min(100, energy))   / 100) * energySpan
  const hungerFill = (Math.max(0, Math.min(100, hunger))   / 100) * sideSpan
  const happyFill  = (Math.max(0, Math.min(100, happiness)) / 100) * sideSpan

  // Offsets: energy starts at 9-o'clock (−C/2), hunger at 6-o'clock (−C/4), happiness at 3-o'clock (0)
  const energyOff = -(C * 0.5)
  const hungerOff = -(C * 0.25)
  const happyOff  = 0

  const track = "rgba(255,255,255,0.06)"
  const creature = stageCreature[stage] ?? "🐣"

  return (
    <div style={{ position: "relative", width: W, height: H, margin: "0 auto", flexShrink: 0 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        <defs>
          {/* Warm amber glow behind pet */}
          <radialGradient id="petglow" cx="50%" cy="58%" r="38%">
            <stop offset="0%"   stopColor="rgba(245,158,11,0.28)" />
            <stop offset="60%"  stopColor="rgba(245,158,11,0.08)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </radialGradient>
          <radialGradient id="platglow" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="rgba(245,158,11,0.35)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </radialGradient>
        </defs>

        {/* Glow layers */}
        <ellipse cx={cx} cy={cy + 40} rx={120} ry={70} fill="url(#petglow)" />
        <ellipse cx={cx} cy={cy + 82} rx={75} ry={22} fill="url(#platglow)" />

        {/* ── Track arcs ── */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={track} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${energySpan} ${C - energySpan}`} strokeDashoffset={energyOff} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={track} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${sideSpan} ${C - sideSpan}`} strokeDashoffset={hungerOff} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={track} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${sideSpan} ${C - sideSpan}`} strokeDashoffset={happyOff} />

        {/* ── Filled arcs ── */}
        {/* Energy — teal, top */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#10B981" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${energyFill} ${C - energyFill}`} strokeDashoffset={energyOff}
          style={{ transition: "stroke-dasharray 0.9s ease-out" }} />
        {/* Hunger — gold, lower-left */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${hungerFill} ${C - hungerFill}`} strokeDashoffset={hungerOff}
          style={{ transition: "stroke-dasharray 0.9s ease-out" }} />
        {/* Happiness — pink, lower-right */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#EC4899" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${happyFill} ${C - happyFill}`} strokeDashoffset={happyOff}
          style={{ transition: "stroke-dasharray 0.9s ease-out" }} />

        {/* ── Stat labels ── */}
        {/* Energy (top) */}
        <text x={cx} y={cy - R - 16} textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="700">Energy ⚡</text>
        <text x={cx} y={cy - R - 3}  textAnchor="middle" fill="#10B981" fontSize="24" fontWeight="900">{energy}</text>

        {/* Hunger (lower-left) */}
        <text x={cx - R - 10} y={cy + 32} textAnchor="end" fill="#F59E0B" fontSize="11" fontWeight="700">Hunger</text>
        <text x={cx - R - 10} y={cy + 52} textAnchor="end" fill="#F59E0B" fontSize="24" fontWeight="900">{hunger}</text>

        {/* Happiness (lower-right) */}
        <text x={cx + R + 10} y={cy + 32} textAnchor="start" fill="#EC4899" fontSize="11" fontWeight="700">Happy</text>
        <text x={cx + R + 10} y={cy + 52} textAnchor="start" fill="#EC4899" fontSize="24" fontWeight="900">{happiness}</text>
      </svg>

      {/* Creature centered */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
        <motion.div
          style={{ fontSize: 96, lineHeight: 1, filter: "drop-shadow(0 0 24px rgba(245,158,11,0.6))" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {creature}
        </motion.div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <p style={{ color: "#F0EDFF", fontWeight: 900, fontSize: 16 }}>{name}</p>
          <p style={{ color: "#A78BFA", fontSize: 12, marginTop: 2 }}>
            Lv. {level} · Bond {bond}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [floatEmojis, setFloatEmojis] = useState<FloatEmoji[]>([])
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null)
  const floatIdRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const spawnFloat = useCallback((emoji: string) => {
    const fid = ++floatIdRef.current
    setFloatEmojis(prev => [...prev, { id: fid, emoji, x: 30 + Math.random() * 40 }])
    setTimeout(() => setFloatEmojis(prev => prev.filter(f => f.id !== fid)), 1500)
  }, [])

  useEffect(() => {
    fetch(`/api/pet/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { toast.error(d.error); router.push("/dashboard"); return }
        setPet(d.pet); setMessages(d.messages); setLoading(false)
      })
      .catch(() => { toast.error("Failed to load"); setLoading(false) })
  }, [id, router])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending || !pet) return
    if (pet.energy < 5) { toast.error(`${pet.name} is too tired to talk right now... 💤`); return }

    const text = input.trim()
    setInput(""); setSending(true)
    setMessages(prev => [...prev, { id: "tmp", role: "user", content: text, createdAt: new Date().toISOString() }])

    try {
      const res = await fetch(`/api/pet/${id}/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        setMessages(prev => prev.filter(m => m.id !== "tmp"))
      } else {
        setMessages(prev => [
          ...prev.filter(m => m.id !== "tmp"),
          { id: "u" + Date.now(), role: "user",  content: text,       createdAt: new Date().toISOString() },
          { id: "p" + Date.now(), role: "pet",   content: data.reply, createdAt: new Date().toISOString() },
        ])
        if (data.newLevel > pet.level) {
          setShowLevelUp(data.newLevel)
          setTimeout(() => setShowLevelUp(null), 2500)
        }
        setPet(prev => prev ? { ...prev, level: data.newLevel, stage: data.newStage, bond: Math.min(100, prev.bond + 1), happiness: Math.min(100, prev.happiness + 3) } : prev)
      }
    } catch {
      toast.error("Connection error")
      setMessages(prev => prev.filter(m => m.id !== "tmp"))
    } finally { setSending(false) }
  }

  async function doAction(action: string) {
    if (!pet) return
    const res = await fetch(`/api/pet/${id}/action`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    if (data.pet) {
      setPet(prev => prev ? { ...prev, ...data.pet } : prev)
      const emojis: Record<string, string> = { feed: "😋", play: "🎮", sleep: "💤", pet: "🥰" }
      spawnFloat(emojis[action] ?? "✨"); spawnFloat(emojis[action] ?? "✨")
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center" style={{ height: "60vh" }}>
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )
  if (!pet) return null

  const msgTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px - 72px)" }}>

      {/* Float emojis */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <AnimatePresence>
          {floatEmojis.map(f => (
            <motion.div key={f.id} className="absolute text-3xl"
              style={{ left: `${f.x}%`, bottom: "20%" }}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -120, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}>
              {f.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Level-up banner */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div className="fixed inset-x-0 top-20 z-50 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.5 }}>
            <div className="px-6 py-3 rounded-2xl text-white font-black text-lg"
              style={{ background: "linear-gradient(135deg,#7c3aed,#f59e0b)", boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}>
              ⭐ LEVEL {showLevelUp}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back header */}
      <div className="flex items-center gap-3 pb-1 flex-shrink-0">
        <Link href="/dashboard" style={{ color: "#8B85A0" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-black text-white text-base leading-tight">{pet.name}</h1>
          <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
            {pet.species} · {pet.stage}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <Zap className="w-3 h-3 text-green-400" />
          <span className="text-xs font-bold text-green-400">{pet.energy}/100</span>
        </div>
      </div>

      {/* ── Arc stats + creature ── */}
      <div className="flex-shrink-0 clay-card rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(26,21,51,0.95) 0%, rgba(12,8,28,0.98) 100%)" }}>
        <PetArcs
          hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness}
          stage={pet.stage} name={pet.name} level={pet.level} bond={pet.bond}
        />

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          {[
            { action: "feed",  label: "Feed",  emoji: "🍖" },
            { action: "play",  label: "Play",  emoji: "🎮" },
            { action: "sleep", label: "Sleep", emoji: "💤" },
            { action: "pet",   label: "Pet",   emoji: "💜" },
          ].map(btn => (
            <motion.button key={btn.action} onClick={() => doAction(btn.action)}
              className="flex flex-col items-center gap-0.5 py-2.5 rounded-2xl text-xs font-semibold"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#A78BFA" }}
              whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
              <span className="text-lg">{btn.emoji}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>

        {/* Status message */}
        <div className="mx-4 mb-3 px-4 py-2.5 rounded-xl flex items-center justify-between"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">💜</span>
            <span className="text-xs" style={{ color: "rgba(240,237,255,0.7)" }}>
              {pet.happiness > 70 ? `${pet.name} is feeling great!`
                : pet.hunger < 30 ? `${pet.name} is hungry...`
                : pet.energy < 20 ? `${pet.name} needs rest...`
                : `${pet.name} wants to talk!`}
            </span>
          </div>
          <span className="text-xs text-purple-400">›</span>
        </div>
      </div>

      {/* ── Chat ── */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <motion.div className="text-5xl mb-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}>
              {stageEmoji[pet.stage] ?? "🐣"}
            </motion.div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Say hello to {pet.name}!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={msg.id + i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role !== "user" && (
              <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mb-1">
                <span className="text-purple-400" style={{ fontSize: 10 }}>✦</span>
                <motion.span className="text-xl"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity }}>
                  {stageEmoji[pet.stage] ?? "🐣"}
                </motion.span>
              </div>
            )}
            <div className="flex flex-col gap-0.5" style={{ maxWidth: "78%" }}>
              <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bubble-user rounded-2xl rounded-br-sm" : "bubble-pet rounded-2xl rounded-bl-sm"}`}>
                {msg.content}
              </div>
              <span className="text-xs px-1" style={{ color: "rgba(255,255,255,0.2)", textAlign: msg.role === "user" ? "right" : "left" }}>
                {msgTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-end gap-2 justify-start">
            <span className="text-xl flex-shrink-0 mb-4">{stageEmoji[pet.stage] ?? "🐣"}</span>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bubble-pet">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-2 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}>
        <span className="text-purple-400 self-center text-lg flex-shrink-0">✦</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={pet.energy < 5 ? `${pet.name} is too tired...` : `Type a message...`}
          disabled={sending || pet.energy < 5}
          className="flex-1 px-4 py-3 rounded-full text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.22)" }}
        />
        <motion.button type="submit"
          disabled={sending || !input.trim() || pet.energy < 5}
          className="w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)", flexShrink: 0 }}
          whileTap={{ scale: 0.9 }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
        </motion.button>
      </form>
    </div>
  )
}
