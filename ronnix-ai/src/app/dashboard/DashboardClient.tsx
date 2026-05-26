"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Share2, Copy, ChevronRight, Video, Flame, Layers, Star, Hash, TrendingUp, Play, Calendar, Lock } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import ThemeToggle from "@/components/ThemeToggle"
import type { Profile } from "@/lib/supabase"
import { FREE_TOOLS, TOOL_COST } from "@/lib/credits"
import { toast } from "sonner"
import { useEffect, useRef } from "react"

const TOOLS = [
  { href: "/tools/caption",     icon: Sparkles,      title: "Caption Generator",   mm: "Post caption AI ရေးပေးသည်",        hint: "30 မိနစ် → 5 စက္ကန့်",         color: "var(--yellow)",  border: "rgba(254,203,0,0.3)",    glow: "rgba(254,203,0,0.12)"    },
  { href: "/tools/reply",       icon: MessageSquare, title: "Reply Helper",         mm: "Customer reply အမြန်ရ",             hint: "Professional · Trust တက်မည်",  color: "var(--green-xl)",border: "rgba(109,201,58,0.3)",   glow: "rgba(109,201,58,0.10)"   },
  { href: "/tools/hashtags",    icon: Hash,          title: "Hashtag Generator",    mm: "Myanmar seller hashtag pack",        hint: "15-20 targeted hashtags",       color: "#47C8FF",        border: "rgba(71,200,255,0.30)", glow: "rgba(71,200,255,0.07)"   },
  { href: "/tools/reel",        icon: Play,          title: "Reel Caption",         mm: "Short video punchy caption",         hint: "TikTok · Reels · Viral",        color: "#BF5FFF",        border: "rgba(191,95,255,0.30)", glow: "rgba(191,95,255,0.08)"   },
  { href: "/tools/promo",       icon: Flame,         title: "Promo Post",           mm: "Flash sale / ပရိုမိုး post",        hint: "Urgency-driven · Viral",        color: "#FF3B6F",        border: "rgba(255,59,111,0.30)", glow: "rgba(255,59,111,0.08)"   },
  { href: "/tools/testimonial", icon: Star,          title: "Testimonial",          mm: "Customer review ကို post ဖြစ်အောင်", hint: "Trust building · Shareable",   color: "#00D2B8",        border: "rgba(0,210,184,0.30)",  glow: "rgba(0,210,184,0.08)"    },
  { href: "/tools/description", icon: FileText,      title: "Product Description",  mm: "ကုန်ဖော်ပြချက် Pro level",          hint: "Conversion rate မြင့်တက်မည်", color: "#6EE7B7",        border: "rgba(110,231,183,0.3)", glow: "rgba(110,231,183,0.08)"  },
  { href: "/tools/comparison",  icon: TrendingUp,    title: "Comparison Post",      mm: "ဘာကြောင့် ငါ့ဆိုင်ကိုရွေးသင့်လဲ", hint: "Persuasive · Converts",         color: "#FB923C",        border: "rgba(251,146,60,0.30)", glow: "rgba(251,146,60,0.08)"   },
  { href: "/tools/seasonal",    icon: Calendar,      title: "Seasonal Campaign",    mm: "ပွဲတော် special post",               hint: "Thingyan · Eid · Xmas",         color: "#FFD166",        border: "rgba(255,209,102,0.35)",glow: "rgba(255,209,102,0.08)"  },
  { href: "/tools/variants",    icon: Layers,        title: "Caption Variants",     mm: "Caption 3 မျိုး တစ်ချက်တည်းရ",     hint: "A/B test ဖို့ · 3 versions",   color: "#A3FF47",        border: "rgba(163,255,71,0.30)", glow: "rgba(163,255,71,0.07)"   },
  { href: "/tools/live",        icon: Video,         title: "FB Live Script",       mm: "Live ရောင်းချ script အပြည့်အစုံ",   hint: "Full script · Most powerful",   color: "#FF6B35",        border: "rgba(255,107,53,0.30)", glow: "rgba(255,107,53,0.08)"   },
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

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Animated ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: -80, left: "30%",
            width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, var(--green), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", top: 100, right: "-10%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, var(--yellow), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.10, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", bottom: 200, left: "-5%",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, #6EE7B7, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--header-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <motion.span
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 20, fontWeight: 900 }} className="grad-yg">
          RONNIX
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(254,203,0,0)", "0 0 12px rgba(254,203,0,0.25)", "0 0 0px rgba(254,203,0,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
              background: "rgba(254,203,0,0.08)", border: "1px solid var(--border-y)", color: "var(--yellow)",
            }}>
            <Zap style={{ width: 12, height: 12 }} />
            {isFreeUser
              ? `${dailyLeft}/day`
              : <><AnimatedNumber value={profile?.credits ?? 0} /> cr</>}
          </motion.div>
        </motion.div>
      </div>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 100px", position: "relative", zIndex: 1 }}>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.3 }}>
            မင်္ဂလာပါ{profile?.email ? ` 👋` : ""}
          </p>
          <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", marginTop: 6 }}>
            {profile?.email} · ဘာ generate မလဲ?
          </p>
        </motion.div>

        {/* Credits / upgrade card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          style={{ marginBottom: 28 }}>
          {isFreeUser ? (
            <motion.div
              animate={{ borderColor: ["rgba(254,203,0,0.15)", "rgba(254,203,0,0.35)", "rgba(254,203,0,0.15)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                padding: "20px 22px", borderRadius: 18,
                background: "rgba(254,203,0,0.05)",
                border: "1px solid rgba(254,203,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 6 }}>FREE PLAN</p>
                <p style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">
                  {dailyLeft} <span style={{ fontSize: 14, fontWeight: 600 }}>/ 3 ကြိမ်</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4 }}>
                  ယနေ့ ကျန်ကြိမ် · Credits ဝယ်ရင် unlimited
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "11px 18px", borderRadius: 12, fontSize: 13, fontWeight: 800,
                background: "var(--yellow)", color: "#020704", textDecoration: "none", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                Credits ဝယ် <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </motion.div>
          ) : (
            <div className="glass" style={{ padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 6 }}>
                  {profile?.plan?.toUpperCase()} PLAN
                </p>
                <p style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">
                  <AnimatedNumber value={profile?.credits ?? 0} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}> credits</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--green-xl)", marginTop: 4 }}>
                  ✓ Unlimited generate — credit တစ်ခုတစ်ကြိမ်
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

        {/* Tools */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", marginBottom: 14, textTransform: "uppercase" }}>
          AI Tools
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            const toolSlug = tool.href.split("/").pop() as string
            const isFree = (FREE_TOOLS as readonly string[]).includes(toolSlug)
            const isLocked = isFreeUser && !isFree
            const cost = TOOL_COST[toolSlug as keyof typeof TOOL_COST]
            return (
              <motion.div key={tool.href}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.1, type: "spring", stiffness: 300, damping: 28 }}>
                <Link href={isLocked ? "/pricing" : tool.href} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileTap={{ scale: 0.975 }}
                    whileHover={{ scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    style={{
                      padding: "20px 20px",
                      borderRadius: 18,
                      background: isLocked ? "rgba(255,255,255,0.02)" : tool.glow,
                      border: isLocked ? "1px solid rgba(255,255,255,0.07)" : `1px solid ${tool.border}`,
                      display: "flex", alignItems: "center", gap: 16,
                      position: "relative", overflow: "hidden",
                      opacity: isLocked ? 0.6 : 1,
                    }}>
                    {/* Sweep shimmer — only for unlocked */}
                    {!isLocked && (
                      <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "200%", opacity: [0, 0.08, 0] }}
                        transition={{ delay: 0.5 + i * 0.3, duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
                        style={{
                          position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
                          background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isLocked ? "rgba(255,255,255,0.04)" : tool.glow,
                      border: isLocked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${tool.border}`,
                      color: isLocked ? "var(--muted2)" : tool.color,
                    }}>
                      <Icon style={{ width: 22, height: 22 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <p style={{ fontWeight: 800, fontSize: 15, color: isLocked ? "var(--muted)" : "var(--text)" }}>{tool.title}</p>
                        {isLocked && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                            background: "rgba(254,203,0,0.12)", border: "1px solid rgba(254,203,0,0.25)",
                            color: "var(--yellow)", letterSpacing: 0.5,
                          }}>PRO</span>
                        )}
                      </div>
                      <p className="font-mm" style={{ fontSize: 12, color: isLocked ? "var(--muted2)" : tool.color, opacity: 0.85 }}>{tool.mm}</p>
                      <p style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>
                        {isLocked ? `${cost} credits · Unlock လုပ်ရန်` : tool.hint}
                      </p>
                    </div>
                    {isLocked
                      ? <Lock style={{ width: 16, height: 16, color: "var(--yellow)", opacity: 0.7, flexShrink: 0 }} />
                      : <ArrowRight style={{ width: 18, height: 18, color: tool.color, opacity: 0.6, flexShrink: 0 }} />
                    }
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}>
          <div className="glass" style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "rgba(254,203,0,0.10)", border: "1px solid var(--border-y)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--yellow)",
              }}>
                <Share2 style={{ width: 16, height: 16 }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13 }}>Friend ဖိတ်ပါ → Credits ရမည်</p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>
                  Join → နှစ်ဦးစလုံး +10 credits
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
