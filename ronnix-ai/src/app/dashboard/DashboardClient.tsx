"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Share2, Copy, ChevronRight, Video, Flame, Layers, Star, Hash, TrendingUp, Play, Calendar, Lock } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import ThemeToggle from "@/components/ThemeToggle"
import type { Profile } from "@/lib/supabase"
import { FREE_TOOLS, TOOL_COST } from "@/lib/credits"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"

const TOOLS = [
  { href: "/tools/caption",     icon: Sparkles,      title: "Caption Generator",   mm: "Caption AI ရေးပေးသည်",            hint_en: "30 min → 5 sec",            hint_mm: "30 မိနစ် → 5 စက္ကန့်",       color: "var(--yellow)",  border: "rgba(254,203,0,0.3)",    glow: "rgba(254,203,0,0.09)"    },
  { href: "/tools/reply",       icon: MessageSquare, title: "Reply Helper",         mm: "Customer reply အမြန်ရ",             hint_en: "Professional replies",       hint_mm: "Professional · Trust တက်မည်",color: "var(--green-xl)",border: "rgba(109,201,58,0.3)",   glow: "rgba(109,201,58,0.08)"   },
  { href: "/tools/hashtags",    icon: Hash,          title: "Hashtag Generator",    mm: "Hashtag pack အမြန်ရ",               hint_en: "15-20 targeted hashtags",    hint_mm: "15-20 hashtags",             color: "#47C8FF",        border: "rgba(71,200,255,0.30)", glow: "rgba(71,200,255,0.06)"   },
  { href: "/tools/reel",        icon: Play,          title: "Reel Caption",         mm: "Short video caption",               hint_en: "TikTok · Reels · Viral",     hint_mm: "TikTok · Viral",             color: "#BF5FFF",        border: "rgba(191,95,255,0.30)", glow: "rgba(191,95,255,0.07)"   },
  { href: "/tools/promo",       icon: Flame,         title: "Promo Post",           mm: "ပရိုမိုး post ရေးပေး",             hint_en: "Urgency-driven · Converts", hint_mm: "Flash sale · Urgency",       color: "#FF3B6F",        border: "rgba(255,59,111,0.30)", glow: "rgba(255,59,111,0.07)"   },
  { href: "/tools/testimonial", icon: Star,          title: "Testimonial",          mm: "Review ကို post ဖြစ်အောင်",        hint_en: "Trust building · Shareable",hint_mm: "Trust · Shareable",          color: "#00D2B8",        border: "rgba(0,210,184,0.30)",  glow: "rgba(0,210,184,0.06)"    },
  { href: "/tools/description", icon: FileText,      title: "Product Description",  mm: "ကုန်ဖော်ပြချက် Pro",               hint_en: "Boosts conversion rate",     hint_mm: "Conversion မြင့်တက်မည်",   color: "#6EE7B7",        border: "rgba(110,231,183,0.3)", glow: "rgba(110,231,183,0.06)"  },
  { href: "/tools/comparison",  icon: TrendingUp,    title: "Comparison Post",      mm: "ဘာကြောင့် ငါ့ဆိုင် ရွေးမလဲ",     hint_en: "Persuasive · Converts",     hint_mm: "Persuasive · Converts",      color: "#FB923C",        border: "rgba(251,146,60,0.30)", glow: "rgba(251,146,60,0.06)"   },
  { href: "/tools/seasonal",    icon: Calendar,      title: "Seasonal Campaign",    mm: "ပွဲတော် special post",              hint_en: "Thingyan · Eid · Xmas",     hint_mm: "Thingyan · Eid · Xmas",      color: "#FFD166",        border: "rgba(255,209,102,0.35)",glow: "rgba(255,209,102,0.06)"  },
  { href: "/tools/variants",    icon: Layers,        title: "Caption Variants",     mm: "Caption 3 မျိုး တစ်ချက်ထုတ်",    hint_en: "3 tones at once · A/B test",hint_mm: "3 versions · A/B test",      color: "#A3FF47",        border: "rgba(163,255,71,0.30)", glow: "rgba(163,255,71,0.06)"   },
  { href: "/tools/live",        icon: Video,         title: "FB Live Script",       mm: "Live ရောင်းချ script အပြည့်",      hint_en: "Full script · Most powerful",hint_mm: "Full script · Powerful",     color: "#FF6B35",        border: "rgba(255,107,53,0.30)", glow: "rgba(255,107,53,0.06)"   },
]

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" })
    return controls.stop
  }, [value, count])
  return <motion.span ref={ref}>{rounded}</motion.span>
}

export default function DashboardClient({ profile }: { profile: Profile | null }) {
  const isFreeUser = !profile?.plan || profile.plan === "free"
  const dailyLeft = isFreeUser ? Math.max(0, 3 - (profile?.daily_count || 0)) : null
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = profile ? `${origin}/auth?ref=${profile.referral_code}` : ""
  const [lang, setLang] = useState<"mm" | "en">("mm")

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -80, left: "30%", width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, var(--green), transparent 70%)", filter: "blur(70px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", top: 100, right: "-10%", width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, var(--yellow), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--header-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 20, fontWeight: 900 }} className="grad-yg">
          RONNIX
        </motion.span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* MM/EN Toggle */}
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
            {(["mm", "en"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "6px 12px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
                background: lang === l ? "var(--yellow)" : "transparent",
                color: lang === l ? "#020704" : "var(--muted)",
                transition: "all 0.15s",
              }}>
                {l === "mm" ? "မြန်မာ" : "EN"}
              </button>
            ))}
          </div>

          <ThemeToggle />

          {/* Credits badge */}
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(254,203,0,0)", "0 0 12px rgba(254,203,0,0.25)", "0 0 0px rgba(254,203,0,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
              background: "rgba(254,203,0,0.08)", border: "1px solid var(--border-y)", color: "var(--yellow)",
            }}>
            <Zap style={{ width: 11, height: 11 }} />
            {isFreeUser
              ? `${dailyLeft}/day`
              : <><AnimatedNumber value={profile?.credits ?? 0} /> cr</>
            }
          </motion.div>
        </div>
      </div>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 100px", position: "relative", zIndex: 1 }}>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 22, fontWeight: 900 }}>
            {lang === "mm" ? "မင်္ဂလာပါ 👋" : "Welcome back 👋"}
          </p>
          <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", marginTop: 4 }}>
            {profile?.email} · {lang === "mm" ? "ဘာ generate မလဲ?" : "What are we making today?"}
          </p>
        </motion.div>

        {/* Credits card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }} style={{ marginBottom: 28 }}>

          {isFreeUser ? (
            <div style={{ padding: "20px 22px", borderRadius: 18,
              background: "rgba(254,203,0,0.05)", border: "1px solid rgba(254,203,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 6 }}>FREE PLAN</p>
                <p style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">
                  {dailyLeft} <span style={{ fontSize: 14, fontWeight: 600 }}>/ 3 {lang === "mm" ? "ကြိမ်" : "uses"}</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4 }}>
                  {lang === "mm" ? "ယနေ့ ကျန်ကြိမ် · Credits ဝယ်ရင် unlimited" : "Uses left today · Buy credits for unlimited"}
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "11px 18px", borderRadius: 12, fontSize: 13, fontWeight: 800,
                background: "var(--yellow)", color: "#020704", textDecoration: "none", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {lang === "mm" ? "Credits ဝယ်" : "Buy Credits"} <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          ) : (
            <div style={{ padding: "20px 22px", borderRadius: 18,
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-g)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 6 }}>
                  {profile?.plan?.toUpperCase()} PLAN
                </p>
                <p style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">
                  <AnimatedNumber value={profile?.credits ?? 0} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}> credits</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4 }}>
                  {lang === "mm" ? "Tool သုံးတိုင်း credits ကျသည်" : "Credits deducted per tool use"}
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: "rgba(254,203,0,0.1)", color: "var(--yellow)",
                border: "1px solid var(--border-y)", textDecoration: "none", flexShrink: 0,
              }}>
                Top Up
              </Link>
            </div>
          )}
        </motion.div>

        {/* Tools grid */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", marginBottom: 12, textTransform: "uppercase" }}>
          AI Tools
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            const toolSlug = tool.href.split("/").pop() as string
            const isFree = (FREE_TOOLS as readonly string[]).includes(toolSlug)
            const isLocked = isFreeUser && !isFree
            const cost = TOOL_COST[toolSlug as keyof typeof TOOL_COST]

            return (
              <motion.div key={tool.href}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 320, damping: 30 }}>
                <Link href={isLocked ? "/pricing" : tool.href} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileTap={{ scale: 0.975 }}
                    style={{
                      padding: "16px 18px", borderRadius: 16,
                      background: isLocked ? "rgba(255,255,255,0.02)" : tool.glow,
                      border: isLocked ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${tool.border}`,
                      display: "flex", alignItems: "center", gap: 14,
                      opacity: isLocked ? 0.65 : 1,
                      position: "relative", overflow: "hidden",
                    }}>
                    {/* Icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isLocked ? "rgba(255,255,255,0.04)" : `${tool.color}18`,
                      border: isLocked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${tool.border}`,
                      color: isLocked ? "var(--muted2)" : tool.color,
                    }}>
                      <Icon style={{ width: 20, height: 20 }} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: 14, color: isLocked ? "var(--muted)" : "var(--text)", marginBottom: 2 }}>
                        {lang === "en" ? tool.title : tool.mm}
                      </p>
                      <p style={{ fontSize: 11, color: isLocked ? "var(--muted2)" : "var(--muted2)" }}>
                        {lang === "mm" ? tool.hint_mm : tool.hint_en}
                      </p>
                    </div>

                    {/* Credit cost badge */}
                    <div style={{
                      flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4,
                    }}>
                      {isLocked ? (
                        <Lock style={{ width: 14, height: 14, color: "var(--yellow)", opacity: 0.7 }} />
                      ) : (
                        <ArrowRight style={{ width: 15, height: 15, color: tool.color, opacity: 0.5 }} />
                      )}
                      {/* Cost tag */}
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 100,
                        background: isFreeUser && isFree
                          ? "rgba(109,201,58,0.15)"
                          : `${tool.color}15`,
                        border: isFreeUser && isFree
                          ? "1px solid rgba(109,201,58,0.3)"
                          : `1px solid ${tool.color}35`,
                        color: isFreeUser && isFree ? "var(--green-xl)" : tool.color,
                        letterSpacing: 0.3,
                      }}>
                        {isFreeUser && isFree ? "Free" : `${cost} cr`}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Referral */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="glass" style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "rgba(254,203,0,0.10)", border: "1px solid var(--border-y)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--yellow)" }}>
                <Share2 style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13 }}>
                  {lang === "mm" ? "Friend ဖိတ်ပါ → Credits ရမည်" : "Invite friends → Earn credits"}
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>
                  {lang === "mm" ? "Join → နှစ်ဦးစလုံး +10 credits" : "They join → both get +10 credits"}
                </p>
              </div>
            </div>
            <button onClick={copyReferral} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
              borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: "rgba(254,203,0,0.1)", color: "var(--yellow)",
              border: "1px solid var(--border-y)", flexShrink: 0,
            }}>
              <Copy style={{ width: 13, height: 13 }} /> Copy
            </button>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
