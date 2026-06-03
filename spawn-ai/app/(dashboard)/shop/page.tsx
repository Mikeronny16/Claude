"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const ADMIN_EMAIL = "mikeronny18@gmail.com"

const EGGS = [
  {
    tier: "common", species: "cat", label: "Common",
    price: "Free", amount: 0,
    desc: "A warm little creature. Perfect first companion.",
    top: "#fef9c3", mid: "#fbbf24", bot: "#d97706", glow: "#fbbf24",
    priceColor: "#10B981", borderColor: "rgba(245,158,11,0.3)",
    glowClass: "glow-common",
  },
  {
    tier: "rare", species: "dragon", label: "Rare",
    price: "$3", amount: 3,
    desc: "A proud dragon spirit. Fierce and loyal.",
    top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8",
    priceColor: "#818CF8", borderColor: "rgba(129,140,248,0.3)",
    glowClass: "glow-rare",
  },
  {
    tier: "epic", species: "phoenix", label: "Epic",
    price: "$7", amount: 7,
    desc: "Born from flame. Rises with every bond.",
    top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7",
    priceColor: "#A855F7", borderColor: "rgba(168,85,247,0.35)",
    glowClass: "glow-epic",
  },
  {
    tier: "mythic", species: "unicorn", label: "Mythic",
    price: "$15", amount: 15,
    desc: "Rarest of all. A once-in-a-lifetime creature.",
    top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899",
    priceColor: "#F59E0B", borderColor: "rgba(236,72,153,0.35)",
    glowClass: "glow-mythic",
  },
]

function EggSVG({ egg, size = 80 }: { egg: typeof EGGS[0]; size?: number }) {
  const uid = `shop-${egg.tier}`
  return (
    <div className="float" style={{ filter: `drop-shadow(0 0 16px ${egg.glow}66)` }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`g-${uid}`} cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor={egg.top}/><stop offset="55%" stopColor={egg.mid}/><stop offset="100%" stopColor={egg.bot}/>
          </radialGradient>
          <radialGradient id={`s-${uid}`} cx="32%" cy="22%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#g-${uid})`}/>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#s-${uid})`}/>
        {egg.tier === "rare"   && <><line x1="36" y1="54" x2="64" y2="54" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/><line x1="33" y1="67" x2="67" y2="67" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/></>}
        {egg.tier === "mythic" && <><text x="28" y="52" fontSize="14" fill="rgba(255,255,255,0.6)">✦</text><text x="58" y="74" fontSize="9" fill="rgba(255,255,255,0.5)">✦</text><text x="40" y="90" fontSize="11" fill="rgba(255,255,255,0.4)">✦</text></>}
        {egg.tier === "epic"   && <><ellipse cx="40" cy="22" rx="5" ry="10" fill={egg.top} opacity="0.5" transform="rotate(-15,40,22)"/><ellipse cx="55" cy="19" rx="4" ry="9" fill={egg.top} opacity="0.4" transform="rotate(10,55,19)"/></>}
        <ellipse cx="38" cy="42" rx="7" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20,38,42)"/>
      </svg>
    </div>
  )
}

export default function ShopPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function buyEgg(egg: typeof EGGS[0]) {
    if (!session?.user) { toast.error("Sign in first"); return }
    setLoading(egg.tier)

    try {
      const res = await fetch("/api/shop/egg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: egg.tier }),
      })
      const data = await res.json()

      if (data.error) { toast.error(data.error); setLoading(null); return }

      if (data.egg) {
        toast.success(`🥚 ${egg.label} Egg added to your nest!`)
        router.push("/dashboard")
        return
      }

      if (data.requiresPayment) {
        const userEmail = session.user.email ?? ""
        const subject = encodeURIComponent(`Spawn AI — ${egg.label} Egg Purchase`)
        const body = encodeURIComponent(
          `Hi Mike,\n\nI want to buy a ${egg.label} Egg (${egg.price}).\n\nMy account email: ${userEmail}\n\nPlease let me know the payment method.\n\nThank you!`
        )
        window.open(`https://mail.google.com/mail/?view=cm&to=${ADMIN_EMAIL}&su=${subject}&body=${body}`, "_blank")
        toast.success("Gmail opened! Send the email to complete your order.", { duration: 6000 })
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Egg Shop</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Each egg carries a unique soul</p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {EGGS.map((egg, i) => (
          <motion.div
            key={egg.tier}
            className={`clay-card ${egg.glowClass} rounded-2xl p-4 flex flex-col items-center text-center gap-3`}
            style={{ border: `1px solid ${egg.borderColor}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Rarity badge */}
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold self-end"
              style={{ background: `${egg.glow}22`, color: egg.priceColor, border: `1px solid ${egg.glow}44` }}>
              {egg.label}
            </span>

            {/* Egg */}
            <EggSVG egg={egg} size={76} />

            {/* Description */}
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{egg.desc}</p>

            {/* Gold pill price button */}
            <motion.button
              onClick={() => buyEgg(egg)}
              disabled={loading === egg.tier}
              className="w-full py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50"
              style={egg.tier === "common"
                ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981" }
                : { background: "linear-gradient(135deg,#D97706,#F59E0B)", color: "#1A0800" }
              }
              whileTap={{ scale: 0.94 }}
            >
              {loading === egg.tier
                ? <Loader2 className="w-4 h-4 animate-spin inline" />
                : egg.tier === "common" ? "Get Free" : egg.price
              }
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Payment note */}
      <div className="p-4 rounded-2xl text-center clay-card">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Paid eggs → Gmail opens → Admin confirms → Egg appears in your nest 🥚
        </p>
        <Link href="/pricing" className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-block">
          View plans for bulk eggs →
        </Link>
      </div>
    </div>
  )
}
