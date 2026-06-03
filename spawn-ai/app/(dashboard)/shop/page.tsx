"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const ADMIN_EMAIL = "mikeronny18@gmail.com"

const EGGS = [
  {
    tier: "common", species: "cat", label: "Common",
    price: "Free", coins: 0,
    desc: "A warm little creature. Perfect first companion.",
    top: "#fef9c3", mid: "#fbbf24", bot: "#d97706", glow: "#fbbf24",
    priceColor: "#10B981", borderColor: "rgba(245,158,11,0.35)",
    glowClass: "glow-common",
    stars: 1,
  },
  {
    tier: "rare", species: "dragon", label: "Rare",
    price: "$3", coins: 1000,
    desc: "A proud dragon spirit. Fierce and loyal.",
    top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8",
    priceColor: "#818CF8", borderColor: "rgba(129,140,248,0.35)",
    glowClass: "glow-rare",
    stars: 3,
  },
  {
    tier: "epic", species: "phoenix", label: "Epic",
    price: "$7", coins: 3000,
    desc: "Born from flame. Rises with every bond.",
    top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7",
    priceColor: "#A855F7", borderColor: "rgba(168,85,247,0.4)",
    glowClass: "glow-epic",
    stars: 4,
  },
  {
    tier: "mythic", species: "unicorn", label: "Mythic",
    price: "$15", coins: 7500,
    desc: "Rarest of all. A once-in-a-lifetime creature.",
    top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899",
    priceColor: "#F59E0B", borderColor: "rgba(236,72,153,0.4)",
    glowClass: "glow-mythic",
    stars: 5,
  },
]

function StarRow({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < count ? color : "rgba(255,255,255,0.15)", fontSize: 10 }}>★</span>
      ))}
    </div>
  )
}

function EggSVG({ egg, size = 80 }: { egg: typeof EGGS[0]; size?: number }) {
  const uid = `shop-${egg.tier}`
  return (
    <div className="float" style={{ filter: `drop-shadow(0 0 18px ${egg.glow}77)` }}>
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
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-3xl font-black text-white tracking-tight">SHOP</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Discover magical eggs!</p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {EGGS.map((egg, i) => (
          <motion.div
            key={egg.tier}
            className={`clay-card ${egg.glowClass} rounded-2xl p-4 flex flex-col items-center text-center gap-2`}
            style={{ border: `1px solid ${egg.borderColor}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Stars + rarity */}
            <div className="flex flex-col items-center gap-1 self-stretch">
              <StarRow count={egg.stars} color={egg.priceColor} />
              <span className="text-xs font-bold"
                style={{ color: egg.priceColor }}>
                {egg.label}
              </span>
            </div>

            {/* Egg */}
            <EggSVG egg={egg} size={72} />

            {/* Description */}
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{egg.desc}</p>

            {/* Coin price button */}
            <motion.button
              onClick={() => buyEgg(egg)}
              disabled={loading === egg.tier}
              className="w-full py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50"
              style={egg.tier === "common"
                ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981" }
                : { background: "linear-gradient(135deg,#92400E,#D97706,#F59E0B)", color: "#FFF8E7", border: "1px solid rgba(245,158,11,0.5)" }
              }
              whileTap={{ scale: 0.94 }}
            >
              {loading === egg.tier
                ? <Loader2 className="w-4 h-4 animate-spin inline" />
                : egg.tier === "common"
                  ? "Get Free"
                  : `🪙 ${egg.coins.toLocaleString()}`
              }
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Legend tier card */}
      <motion.div
        className="clay-card rounded-2xl p-4 flex flex-col items-center text-center gap-3"
        style={{ border: "1px solid rgba(236,72,153,0.3)", background: "rgba(15,10,35,0.9)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
      >
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: "#F59E0B", fontSize: 14 }}>★</span>
          ))}
        </div>
        <div className="float text-5xl">🌟</div>
        <div>
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#EC4899" }}>Legend</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Exclusive. Beyond rarity.</p>
        </div>
        <Link href="/pricing"
          className="w-full py-2.5 rounded-full text-sm font-bold text-center"
          style={{ background: "linear-gradient(135deg,#6D28D9,#EC4899)", color: "#fff" }}>
          🪙 15,000 — View Plans
        </Link>
      </motion.div>

      {/* Payment note */}
      <div className="p-4 rounded-2xl text-center clay-card">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          🪙 Coins = real currency equivalent · Admin confirms orders manually
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(167,139,250,0.7)" }}>
          1,000 coins ≈ $1 USD
        </p>
      </div>
    </div>
  )
}
