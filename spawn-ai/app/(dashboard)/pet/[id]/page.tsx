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
const stageBigEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "🌟" }

function CircularEnergy({ value, max = 100 }: { value: number; max?: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = (Math.max(0, value) / max) * circ
  const gap = circ - dash
  const color = value < 20 ? "#EF4444" : value < 50 ? "#F59E0B" : "#10B981"
  return (
    <div className="relative" style={{ width: 44, height: 44 }}>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          transform="rotate(-90 22 22)"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${gap}` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{value}</span>
      </div>
    </div>
  )
}

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
        setPet(d.pet)
        setMessages(d.messages)
        setLoading(false)
      })
      .catch(() => { toast.error("Failed to load"); setLoading(false) })
  }, [id, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending || !pet) return
    if (pet.energy < 5) { toast.error(`${pet.name} is too tired to talk right now... 💤`); return }

    const text = input.trim()
    setInput("")
    setSending(true)
    setMessages(prev => [...prev, { id: "tmp", role: "user", content: text, createdAt: new Date().toISOString() }])

    try {
      const res = await fetch(`/api/pet/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        setMessages(prev => prev.filter(m => m.id !== "tmp"))
      } else {
        setMessages(prev => [
          ...prev.filter(m => m.id !== "tmp"),
          { id: "u" + Date.now(), role: "user", content: text, createdAt: new Date().toISOString() },
          { id: "p" + Date.now(), role: "pet", content: data.reply, createdAt: new Date().toISOString() },
        ])
        if (data.newLevel > (pet.level)) {
          setShowLevelUp(data.newLevel)
          setTimeout(() => setShowLevelUp(null), 2500)
        }
        setPet(prev => prev ? { ...prev, level: data.newLevel, stage: data.newStage, bond: Math.min(100, prev.bond + 1), happiness: Math.min(100, prev.happiness + 3) } : prev)
      }
    } catch {
      toast.error("Connection error")
      setMessages(prev => prev.filter(m => m.id !== "tmp"))
    } finally {
      setSending(false)
    }
  }

  async function doAction(action: string) {
    if (!pet) return
    const res = await fetch(`/api/pet/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    if (data.pet) {
      setPet(prev => prev ? { ...prev, ...data.pet } : prev)
      const emojis: Record<string, string> = { feed: "😋", play: "🎮", sleep: "💤", pet: "🥰" }
      const e = emojis[action] ?? "✨"
      spawnFloat(e)
      spawnFloat(e)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: "60vh" }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!pet) return null

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px - 72px)" }}>

      {/* Floating emoji reactions */}
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

      {/* Pet header — creature peeking */}
      <div className="clay-card rounded-2xl p-3 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {/* Pet avatar */}
          <motion.div
            className="text-4xl flex-shrink-0"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            {stageBigEmoji[pet.stage] ?? "🐣"}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-base leading-tight">{pet.name}</h1>
            <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
              {pet.species} · {pet.stage} · Lv.{pet.level}
            </p>
          </div>
          {/* Circular energy */}
          <div className="flex flex-col items-center flex-shrink-0">
            <CircularEnergy value={pet.energy} />
            <span className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Energy</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { action: "feed",  label: "Feed",  emoji: "🍖" },
            { action: "play",  label: "Play",  emoji: "🎮" },
            { action: "sleep", label: "Sleep", emoji: "💤" },
            { action: "pet",   label: "Pet",   emoji: "💜" },
          ].map(btn => (
            <motion.button key={btn.action} onClick={() => doAction(btn.action)}
              className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.22)", color: "#a78bfa" }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}>
              <span className="text-base">{btn.emoji}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Energy warning */}
      {pet.energy < 10 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2 flex-shrink-0"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <Zap className="w-3.5 h-3.5 text-red-400" />
          <p className="text-xs text-red-300">{pet.name} needs sleep before chatting!</p>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="text-center py-10">
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
              <motion.span className="text-xl flex-shrink-0 mb-1"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {stageEmoji[pet.stage] ?? "🐣"}
              </motion.span>
            )}
            <div className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bubble-user rounded-2xl rounded-br-sm" : "bubble-pet rounded-2xl rounded-bl-sm"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex items-end gap-2 justify-start">
            <span className="text-xl flex-shrink-0 mb-1">{stageEmoji[pet.stage] ?? "🐣"}</span>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bubble-pet">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={pet.energy < 5 ? `${pet.name} is too tired...` : `Talk to ${pet.name}...`}
          disabled={sending || pet.energy < 5}
          className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.22)" }}
        />
        <motion.button
          type="submit"
          disabled={sending || !input.trim() || pet.energy < 5}
          className="px-4 py-3 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
          style={{ background: "linear-gradient(135deg,#D97706,#F59E0B)" }}
          whileTap={{ scale: 0.92 }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
        </motion.button>
      </form>
    </div>
  )
}
