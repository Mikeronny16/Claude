"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Share2, Copy, TrendingUp } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import type { Profile } from "@/lib/supabase"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const TOOLS = [
  {
    href: "/tools/caption", icon: <Sparkles className="w-6 h-6" />,
    title: "Caption Generator", mm: "Caption ရေးပေးသည်",
    hint: "30 မိနစ် → 5 စက္ကန့် · Engagement တက်မည်",
    color: "var(--yellow)", border: "var(--border-y)", glow: "var(--glow-y)",
  },
  {
    href: "/tools/reply", icon: <MessageSquare className="w-6 h-6" />,
    title: "Reply Helper", mm: "Customer Reply အမြန်ရ",
    hint: "Professional reply → Customer ယုံကြည်မှုတက်မည်",
    color: "var(--green-xl)", border: "var(--border-g)", glow: "var(--glow-g)",
  },
  {
    href: "/tools/description", icon: <FileText className="w-6 h-6" />,
    title: "Product Description", mm: "ကုန်ဖော်ပြချက် Pro",
    hint: "ဝယ်ချင်စိတ် ဖြစ်အောင် → Orders ပိုများမည်",
    color: "#6EE7B7", border: "rgba(110,231,183,0.25)", glow: "rgba(110,231,183,0.3)",
  },
]

const FADE = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DashboardClient({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const dailyLeft = profile?.plan === "free" ? Math.max(0, 3 - (profile?.daily_count || 0)) : null
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = profile ? `${origin}/auth?ref=${profile.referral_code}` : ""

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 500, height: 300, borderRadius: "50%", opacity: 0.12,
          background: "radial-gradient(ellipse, var(--green), transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Top header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.85)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 18, fontWeight: 900 }} className="grad-yg">RONNIX</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
            background: "rgba(254,203,0,0.08)", border: "1px solid var(--border-y)", color: "var(--yellow)"
          }}>
            <Zap style={{ width: 12, height: 12 }} />
            {profile?.plan === "free" ? `${dailyLeft}/day` : `${profile?.credits} cr`}
          </div>
          <button onClick={handleLogout} style={{
            fontSize: 12, color: "var(--muted2)", background: "none", border: "none", cursor: "pointer"
          }}>Logout</button>
        </div>
      </div>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px", paddingBottom: 100 }}>

        {/* Welcome */}
        <motion.div variants={FADE} initial="hidden" animate="show" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>
            ဘာ generate မလဲ? ⚡
          </p>
          <p className="font-mm" style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>
            {profile?.email} · AI က 5 စက္ကန့်ပဲ ကြာမည်
          </p>
        </motion.div>

        {/* Credits card */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.05 }}
          style={{ marginBottom: 28 }}>
          <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <TrendingUp style={{ width: 16, height: 16, color: "var(--yellow)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>
                  {profile?.plan === "free" ? "Free Plan" : `${profile?.plan} Plan`}
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }} className="grad-yg">
                {profile?.plan === "free"
                  ? `${dailyLeft} / 3 ကြိမ် ကျန်သည်`
                  : `${profile?.credits || 0} Credits`}
              </div>
              {profile?.plan === "free" && (
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4 }}>
                  ယနေ့ limit · Credits ဝယ်ရင် unlimited
                </p>
              )}
            </div>
            {profile?.plan === "free" && (
              <Link href="/pricing" className="btn-yellow" style={{ padding: "10px 18px", fontSize: 13, borderRadius: 12, flexShrink: 0 }}>
                Credits ဝယ်
              </Link>
            )}
          </div>
        </motion.div>

        {/* Tools */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", marginBottom: 14, textTransform: "uppercase" }}>Tools</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {TOOLS.map((tool, i) => (
            <motion.div key={tool.href}
              variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.1 + i * 0.08 }}>
              <Link href={tool.href} style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                  padding: "20px 22px",
                  borderRadius: 18,
                  background: `${tool.color}08`,
                  border: `1px solid ${tool.border}`,
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${tool.color}18`, color: tool.color,
                    border: `1px solid ${tool.border}`,
                  }}>
                    {tool.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{tool.title}</p>
                    <p className="font-mm" style={{ fontSize: 12, color: tool.color, marginTop: 2 }}>{tool.mm}</p>
                  </div>
                  <ArrowRight style={{ width: 18, height: 18, color: tool.color, opacity: 0.7, flexShrink: 0 }} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Referral */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.4 }}>
          <div className="glass" style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(254,203,0,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--yellow)", flexShrink: 0 }}>
                <Share2 style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Friend ကို ဖိတ်ပါ → Free Credits</p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>Friend တစ်ယောက် join → နှစ်ဦးစလုံး +10 credits ချက်ချင်းရ</p>
              </div>
            </div>
            <button onClick={copyReferral} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
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
