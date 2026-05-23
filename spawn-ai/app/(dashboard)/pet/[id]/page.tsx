"use client"
import { useEffect, useRef, useState, use, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; xp: number; hunger: number; energy: number; happiness: number; bond: number; personality: string }
type Message = { id: string; role: string; content: string; createdAt: string }
type FloatEmoji = { id: number; emoji: string; x: number }

const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between text-xs mb-1" style={{ color: "#9CA3AF" }}>
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, value)}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
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
    const id = ++floatIdRef.current
    setFloatEmojis(prev => [...prev, { id, emoji, x: 30 + Math.random() * 40 }])
    setTimeout(() => setFloatEmojis(prev => prev.filter(f => f.id !== id)), 1500)
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
            <motion.div
              key={f.id}
              className="absolute text-3xl"
              style={{ left: `${f.x}%`, bottom: "20%" }}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -120, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            >
              {f.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Level-up banner */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-x-0 top-20 z-50 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="px-6 py-3 rounded-2xl text-white font-black text-lg shadow-xl"
              style={{ background: "linear-gradient(135deg, #7c3aed, #f59e0b)", boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}>
              ⭐ LEVEL {showLevelUp}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 flex-shrink-0">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-3xl">{stageEmoji[pet.stage] ?? "🐣"}</div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white text-lg leading-tight">{pet.name}</h1>
          <p className="text-xs text-gray-400 capitalize">{pet.species} · {pet.stage} · Level {pet.level}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">XP</p>
          <p className="text-sm font-semibold text-purple-400">{pet.xp}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pb-3 flex-shrink-0">
        <StatBar label="Hunger" value={pet.hunger} color="#F59E0B" />
        <StatBar label="Energy" value={pet.energy} color="#10B981" />
        <StatBar label="Happy" value={pet.happiness} color="#8B5CF6" />
        <StatBar label="Bond" value={pet.bond} color="#EC4899" />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-2 pb-4 flex-shrink-0">
        {[
          { action: "feed", label: "Feed", emoji: "🍖" },
          { action: "play", label: "Play", emoji: "🎮" },
          { action: "sleep", label: "Sleep", emoji: "💤" },
          { action: "pet", label: "Pet", emoji: "💜" },
        ].map(btn => (
          <motion.button
            key={btn.action}
            onClick={() => doAction(btn.action)}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06, background: "rgba(139,92,246,0.18)" }}
          >
            <span className="text-lg">{btn.emoji}</span>
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">{stageEmoji[pet.stage] ?? "🐣"}</p>
            <p className="text-gray-400 text-sm">Say hello to {pet.name}!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id + i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role !== "user" && (
              <span className="text-xl mr-2 flex-shrink-0 mt-1">{stageEmoji[pet.stage] ?? "🐣"}</span>
            )}
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm"
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", color: "white", borderBottomRightRadius: "0.25rem" }
                : { background: "rgba(26,19,48,0.9)", border: "1px solid rgba(139,92,246,0.3)", color: "#F3F0FF", borderBottomLeftRadius: "0.25rem" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <span className="text-xl mr-2 flex-shrink-0 mt-1">{stageEmoji[pet.stage] ?? "🐣"}</span>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(26,19,48,0.9)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={pet.energy < 5 ? `${pet.name} is too tired...` : `Talk to ${pet.name}...`}
          disabled={sending || pet.energy < 5}
          className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.25)" }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || pet.energy < 5}
          className="px-4 py-3 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </form>
    </div>
  )
}
