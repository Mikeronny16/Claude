"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

const ADMIN_EMAIL = "mikeronny18@gmail.com"

const EGGS = [
  {
    tier: "common", species: "cat", label: "Common Egg", price: "Free",
    amount: 0, desc: "A warm little creature. Perfect first companion.",
    top: "#fef9c3", mid: "#fbbf24", bot: "#d97706", glow: "#fbbf24",
    emoji: "🐱", planRequired: "free",
  },
  {
    tier: "rare", species: "dragon", label: "Rare Egg", price: "$3",
    amount: 3, desc: "A proud dragon spirit. Fierce and loyal.",
    top: "#fca5a5", mid: "#ef4444", bot: "#991b1b", glow: "#ef4444",
    emoji: "🐉", planRequired: "free",
  },
  {
    tier: "epic", species: "phoenix", label: "Epic Egg", price: "$7",
    amount: 7, desc: "Born from flame. Rises with every bond.",
    top: "#fef3c7", mid: "#f97316", bot: "#c2410c", glow: "#f97316",
    emoji: "🔥", planRequired: "free",
  },
  {
    tier: "mythic", species: "unicorn", label: "Mythic Egg", price: "$15",
    amount: 15, desc: "Rarest of all. A once-in-a-lifetime creature.",
    top: "#f5d0fe", mid: "#d946ef", bot: "#7c3aed", glow: "#d946ef",
    emoji: "🦄", planRequired: "free",
  },
]

function EggSVG({ egg }: { egg: typeof EGGS[0] }) {
  const id = `shop-${egg.tier}`
  return (
    <div className="float" style={{ filter: `drop-shadow(0 0 20px ${egg.glow}66)` }}>
      <svg width="80" height="96" viewBox="0 0 100 120">
        <defs>
          <radialGradient id={`g-${id}`} cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor={egg.top}/><stop offset="55%" stopColor={egg.mid}/><stop offset="100%" stopColor={egg.bot}/>
          </radialGradient>
          <radialGradient id={`s-${id}`} cx="32%" cy="22%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#g-${id})`}/>
        <ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#s-${id})`}/>
        {egg.tier === "rare"   && <><line x1="38" y1="55" x2="62" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/><line x1="34" y1="68" x2="66" y2="68" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/></>}
        {egg.tier === "mythic" && <><text x="28" y="52" fontSize="12" fill="rgba(255,255,255,0.6)">✦</text><text x="60" y="72" fontSize="8" fill="rgba(255,255,255,0.5)">✦</text></>}
        {egg.tier === "epic"   && <><ellipse cx="40" cy="22" rx="5" ry="10" fill={egg.top} opacity="0.6" transform="rotate(-15,40,22)"/><ellipse cx="55" cy="19" rx="4" ry="9" fill={egg.top} opacity="0.5" transform="rotate(10,55,19)"/></>}
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
        toast.success(`🥚 ${egg.label} added to your nest!`)
        router.push("/dashboard")
        return
      }

      if (data.requiresPayment) {
        const userEmail = session.user.email ?? ""
        const subject = encodeURIComponent(`Spawn AI — ${egg.label} Purchase Request`)
        const body = encodeURIComponent(
          `Hi Mike,\n\nI want to buy a ${egg.label} (${egg.price}).\n\nMy account email: ${userEmail}\n\nPlease let me know the payment method.\n\nThank you!`
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
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-xl font-bold text-white">Egg Shop</h1>
          <p className="text-xs text-gray-400 mt-0.5">Each egg carries a unique soul</p>
        </div>
      </div>

      <div className="space-y-4">
        {EGGS.map(egg => (
          <div key={egg.tier} className="p-5 rounded-2xl flex items-center gap-4"
            style={{ background: "rgba(26,19,48,0.8)", border: `1px solid ${egg.glow}33` }}>
            <EggSVG egg={egg} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{egg.emoji}</span>
                <p className="font-bold text-white">{egg.label}</p>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                  style={{ background: `${egg.glow}22`, color: egg.glow, border: `1px solid ${egg.glow}44` }}>
                  {egg.tier}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{egg.desc}</p>
              <button onClick={() => buyEgg(egg)} disabled={loading === egg.tier}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: egg.tier === "common" ? "rgba(16,185,129,0.2)" : `${egg.glow}22`, border: `1px solid ${egg.tier === "common" ? "#10B981" : egg.glow}66`, color: egg.tier === "common" ? "#10B981" : egg.glow }}>
                {loading === egg.tier
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : egg.tier === "common" ? "Get Free" : `Buy ${egg.price}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl text-center" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
        <p className="text-xs text-gray-400">
          Paid eggs → Gmail opens → Admin confirms payment → Egg appears in your nest 🥚
        </p>
        <Link href="/pricing" className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-block">
          View plans for bulk eggs →
        </Link>
      </div>
    </div>
  )
}
