"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, Share2, Copy, Zap, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import type { Profile } from "@/lib/supabase"
import { toast } from "sonner"

const TOOLS = [
  {
    href: "/tools/caption",
    icon: <Sparkles className="w-7 h-7" />,
    title: "Caption Generator",
    mm: "Caption ရေးပေးသည်",
    desc: "Facebook · TikTok · Instagram",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    href: "/tools/reply",
    icon: <MessageSquare className="w-7 h-7" />,
    title: "Reply Helper",
    mm: "Customer Reply အမြန်ရ",
    desc: "Comment တိုင်းကို professional ဖြေ",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    href: "/tools/description",
    icon: <FileText className="w-7 h-7" />,
    title: "Product Description",
    mm: "ကုန်ဖော်ပြချက် Pro ဆန်ဆန်",
    desc: "Shop listing အတွက် perfect",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    glow: "rgba(16,185,129,0.3)",
  },
]

export default function DashboardClient({ profile }: { profile: Profile | null }) {
  const dailyLeft = profile?.plan === "free" ? Math.max(0, 3 - (profile?.daily_count || 0)) : null
  const referralLink = profile
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/auth?ref=${profile.referral_code}`
    : ""

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copy လုပ်ပြီ!")
  }

  return (
    <div className="min-h-screen" style={{ background: "#08080F" }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #8B5CF6, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <Navbar profile={profile} />

      <main className="relative z-10 max-w-5xl mx-auto px-5 py-8">

        {/* Credits banner */}
        <motion.div
          className="rounded-2xl p-5 mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(245,158,11,0.08))",
            border: "1px solid rgba(139,92,246,0.25)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(#8B5CF6, transparent 70%)", filter: "blur(40px)", transform: "translate(30%, -30%)" }} />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {profile?.plan === "free" ? "Free Plan" : `${profile?.plan} Plan`}
              </p>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "#A78BFA" }} />
                <span className="text-xl font-black" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {profile?.plan === "free"
                    ? `${dailyLeft} / 3 ကြိမ် ကျန်သည်`
                    : `${profile?.credits || 0} Credits`}
                </span>
              </div>
              {profile?.plan === "free" && (
                <p className="text-xs font-mm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  ယနေ့ limit · Credits ဝယ်ရင် unlimited ဖြစ်မည်
                </p>
              )}
            </div>

            {profile?.plan === "free" && (
              <Link href="/pricing"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
                Credits ဝယ်
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Tools */}
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
          TOOLS
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
            >
              <Link href={tool.href}
                className="block p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.02]"
                style={{
                  background: tool.bg,
                  border: `1px solid ${tool.border}`,
                }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity"
                  style={{ background: tool.glow, filter: "blur(30px)", transform: "translate(30%,-30%)" }} />

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}25` }}>
                  {tool.icon}
                </div>

                <h3 className="font-bold text-base mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{tool.title}</h3>
                <p className="text-xs font-mm mb-1" style={{ color: tool.color }}>{tool.mm}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{tool.desc}</p>

                <div className="flex items-center gap-1 mt-4 text-xs font-semibold"
                  style={{ color: tool.color }}>
                  Use now <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Referral */}
        <motion.div
          className="p-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Refer a Friend
                </h3>
                <p className="text-xs font-mm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Friend invite လုပ်ရင် နှစ်ဦးစလုံး +10 credits ရသည်
                </p>
              </div>
            </div>
            <button onClick={copyReferral}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all hover:opacity-80"
              style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
