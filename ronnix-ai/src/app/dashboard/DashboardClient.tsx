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

// rgba = "R,G,B" string used for liquid glass tinting
const TOOLS = [
  { href: "/tools/caption",     icon: Sparkles,      title: "Caption Generator",   mm: "Caption AI ရေးပေးသည်",         hint_en: "30 min → 5 sec",             hint_mm: "30 မိနစ် → 5 စက္ကန့်",       rgba: "254,203,0",   color: "#FECB00" },
  { href: "/tools/reply",       icon: MessageSquare, title: "Reply Helper",         mm: "Customer reply အမြန်ရ",          hint_en: "Professional replies",        hint_mm: "Professional · Trust တက်",  rgba: "109,201,58",  color: "#6DC93A" },
  { href: "/tools/hashtags",    icon: Hash,          title: "Hashtag Generator",    mm: "Hashtag pack အမြန်ရ",            hint_en: "15-20 targeted hashtags",     hint_mm: "15-20 hashtags",             rgba: "71,200,255",  color: "#47C8FF" },
  { href: "/tools/reel",        icon: Play,          title: "Reel Caption",         mm: "Short video caption",            hint_en: "TikTok · Reels · Viral",      hint_mm: "TikTok · Viral",             rgba: "191,95,255",  color: "#BF5FFF" },
  { href: "/tools/promo",       icon: Flame,         title: "Promo Post",           mm: "ပရိုမိုး post ရေးပေး",          hint_en: "Flash sale · Converts",       hint_mm: "Flash sale · Urgency",       rgba: "255,59,111",  color: "#FF3B6F" },
  { href: "/tools/testimonial", icon: Star,          title: "Testimonial",          mm: "Review ကို post ဖြစ်အောင်",     hint_en: "Trust building · Shareable", hint_mm: "Trust · Shareable",          rgba: "0,210,184",   color: "#00D2B8" },
  { href: "/tools/description", icon: FileText,      title: "Product Description",  mm: "ကုန်ဖော်ပြချက် Pro",            hint_en: "Boosts conversion rate",      hint_mm: "Conversion မြင့်တက်",       rgba: "110,231,183", color: "#6EE7B7" },
  { href: "/tools/comparison",  icon: TrendingUp,    title: "Comparison Post",      mm: "ဘာကြောင့် ငါ့ဆိုင် ရွေးမလဲ",  hint_en: "Persuasive · Converts",       hint_mm: "Persuasive · Converts",      rgba: "251,146,60",  color: "#FB923C" },
  { href: "/tools/seasonal",    icon: Calendar,      title: "Seasonal Campaign",    mm: "ပွဲတော် special post",           hint_en: "Thingyan · Eid · Xmas",       hint_mm: "Thingyan · Eid · Xmas",     rgba: "255,209,102", color: "#FFD166" },
  { href: "/tools/variants",    icon: Layers,        title: "Caption Variants",     mm: "Caption 3 မျိုး တစ်ချက်ထုတ်", hint_en: "3 tones at once · A/B test",  hint_mm: "3 versions · A/B test",      rgba: "163,255,71",  color: "#A3FF47" },
  { href: "/tools/live",        icon: Video,         title: "FB Live Script",       mm: "Live ရောင်းချ script အပြည့်",   hint_en: "Full script · Most powerful", hint_mm: "Full script · Powerful",     rgba: "255,107,53",  color: "#FF6B35" },
]

// Generates liquid glass inline style tinted by the tool's color
function lgCard(rgba: string, locked = false): React.CSSProperties {
  if (locked) return {
    backdropFilter: "blur(20px) saturate(140%)",
    WebkitBackdropFilter: "blur(20px) saturate(140%)",
    background: "rgba(255,255,255,0.025)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    borderRight: "1px solid rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(0,0,0,0.18)",
    borderLeft: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  }
  return {
    backdropFilter: "blur(28px) saturate(165%) brightness(1.04)",
    WebkitBackdropFilter: "blur(28px) saturate(165%) brightness(1.04)",
    background: `linear-gradient(150deg, rgba(${rgba},0.20) 0%, rgba(${rgba},0.07) 55%, rgba(255,255,255,0.025) 100%)`,
    borderTop: "1px solid rgba(255,255,255,0.22)",
    borderRight: `1px solid rgba(${rgba},0.18)`,
    borderBottom: "1px solid rgba(0,0,0,0.22)",
    borderLeft: `1px solid rgba(${rgba},0.12)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.10) inset, 0 8px 28px rgba(0,0,0,0.38), 0 0 30px rgba(${rgba},0.12)`,
  }
}

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
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.20, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -100, left: "20%", width: 500, height: 500,
            borderRadius: "50%", background: "radial-gradient(circle, #3D7A1F, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", top: "40%", right: "-5%", width: 360, height: 360,
            borderRadius: "50%", background: "radial-gradient(circle, #FECB00, transparent 70%)", filter: "blur(90px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          style={{ position: "absolute", bottom: 180, left: "-8%", width: 300, height: 300,
            borderRadius: "50%", background: "radial-gradient(circle, #47C8FF, transparent 70%)", filter: "blur(90px)" }}
        />
        {/* Noise grain overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.018,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />
      </div>

      {/* Header — liquid glass */}
      <div className="lg" style={{
        position: "sticky", top: 0, zIndex: 50,
        borderRadius: 0,
        borderLeft: "none", borderRight: "none",
        padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 20, fontWeight: 900 }} className="grad-yg">
          RONNIX
        </motion.span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* MM/EN Toggle */}
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}>
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

          {/* Credits pill */}
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(254,203,0,0)", "0 0 14px rgba(254,203,0,0.28)", "0 0 0px rgba(254,203,0,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700,
              background: "rgba(254,203,0,0.10)", border: "1px solid rgba(254,203,0,0.28)", color: "var(--yellow)",
            }}>
            <Zap style={{ width: 11, height: 11 }} />
            {isFreeUser ? `${dailyLeft}/day` : <><AnimatedNumber value={profile?.credits ?? 0} /> cr</>}
          </motion.div>
        </div>
      </div>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 100px", position: "relative", zIndex: 1 }}>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 22, fontWeight: 900 }}>
            {lang === "mm" ? "မင်္ဂလာပါ 👋" : "Welcome back 👋"}
          </p>
          <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", marginTop: 4 }}>
            {profile?.email} · {lang === "mm" ? "ဘာ generate မလဲ?" : "What are we making today?"}
          </p>
        </motion.div>

        {/* Credits card — liquid glass */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }} style={{ marginBottom: 26 }}>
          {isFreeUser ? (
            <div className="lg" style={{
              ...lgCard("254,203,0"),
              borderRadius: 20, padding: "20px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1.5, marginBottom: 8 }}>FREE PLAN</p>
                <p style={{ fontSize: 28, fontWeight: 900 }} className="grad-yg">
                  {dailyLeft} <span style={{ fontSize: 14, fontWeight: 600 }}>/ 3 {lang === "mm" ? "ကြိမ်" : "uses"}</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 5 }}>
                  {lang === "mm" ? "ယနေ့ ကျန်ကြိမ် · Credits ဝယ်ရင် unlimited" : "Daily uses remaining · Credits = unlimited"}
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "11px 18px", borderRadius: 14, fontSize: 13, fontWeight: 800,
                background: "var(--yellow)", color: "#020704", textDecoration: "none", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {lang === "mm" ? "Credits ဝယ်" : "Buy Credits"} <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          ) : (
            <div className="lg" style={{
              ...lgCard("61,122,31"),
              borderRadius: 20, padding: "20px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1.5, marginBottom: 8 }}>
                  {profile?.plan?.toUpperCase()} PLAN
                </p>
                <p style={{ fontSize: 28, fontWeight: 900 }} className="grad-yg">
                  <AnimatedNumber value={profile?.credits ?? 0} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}> credits</span>
                </p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 5 }}>
                  {lang === "mm" ? "Tool သုံးတိုင်း credits ကျသည်" : "Credits deducted per tool use"}
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "9px 16px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                background: "rgba(254,203,0,0.12)", color: "var(--yellow)",
                border: "1px solid rgba(254,203,0,0.28)", textDecoration: "none", flexShrink: 0,
              }}>
                Top Up
              </Link>
            </div>
          )}
        </motion.div>

        {/* Tools */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: "var(--muted2)", marginBottom: 12, textTransform: "uppercase" }}>
          AI Tools
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            const toolSlug = tool.href.split("/").pop() as string
            const isFree = (FREE_TOOLS as readonly string[]).includes(toolSlug)
            const isLocked = isFreeUser && !isFree
            const cost = TOOL_COST[toolSlug as keyof typeof TOOL_COST]

            return (
              <motion.div key={tool.href}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10 + i * 0.04, type: "spring", stiffness: 340, damping: 32 }}>
                <Link href={isLocked ? "/pricing" : tool.href} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileTap={{ scale: 0.972 }}
                    style={{
                      ...lgCard(tool.rgba, isLocked),
                      borderRadius: 18, padding: "15px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      opacity: isLocked ? 0.60 : 1,
                      position: "relative",
                      transition: "opacity 0.2s",
                    }}>

                    {/* Top light-catch line (matches .lg::after but per-card) */}
                    <div style={{
                      position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 50%, transparent)`,
                      borderRadius: 1, pointerEvents: "none",
                    }} />

                    {/* Icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isLocked ? "rgba(255,255,255,0.05)" : `rgba(${tool.rgba},0.20)`,
                      border: isLocked ? "1px solid rgba(255,255,255,0.08)" : `1px solid rgba(${tool.rgba},0.30)`,
                      boxShadow: isLocked ? "none" : `0 0 16px rgba(${tool.rgba},0.15)`,
                      color: isLocked ? "var(--muted2)" : tool.color,
                    }}>
                      <Icon style={{ width: 20, height: 20 }} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: 14, color: isLocked ? "var(--muted)" : "var(--text)", marginBottom: 3, lineHeight: 1 }}>
                        {lang === "en" ? tool.title : tool.mm}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted2)", lineHeight: 1.3 }}>
                        {lang === "mm" ? tool.hint_mm : tool.hint_en}
                      </p>
                    </div>

                    {/* Cost + arrow */}
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                      {isLocked
                        ? <Lock style={{ width: 13, height: 13, color: "var(--yellow)", opacity: 0.8 }} />
                        : <ArrowRight style={{ width: 14, height: 14, color: tool.color, opacity: 0.6 }} />
                      }
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 100,
                        background: isFree && isFreeUser ? "rgba(109,201,58,0.18)" : `rgba(${tool.rgba},0.16)`,
                        border: isFree && isFreeUser ? "1px solid rgba(109,201,58,0.35)" : `1px solid rgba(${tool.rgba},0.30)`,
                        color: isFree && isFreeUser ? "#6DC93A" : tool.color,
                        letterSpacing: 0.2,
                      }}>
                        {isFree && isFreeUser ? "Free" : `${cost} cr`}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Referral — liquid glass */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="lg" style={{
            borderRadius: 18, padding: "18px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "rgba(254,203,0,0.14)", border: "1px solid rgba(254,203,0,0.30)",
                boxShadow: "0 0 14px rgba(254,203,0,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--yellow)",
              }}>
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
              background: "rgba(254,203,0,0.10)", color: "var(--yellow)",
              border: "1px solid rgba(254,203,0,0.28)", flexShrink: 0,
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
