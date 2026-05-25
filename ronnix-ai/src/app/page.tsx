"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, Zap, ArrowRight, Play } from "lucide-react"

const TOOLS = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Caption Generator",
    mm: "Caption အလိုအလျောက် ရေးပေး",
    example: "\"ဒီဝတ်စုံလေးနဲ့ မင်းရဲ့ personality ကို ဖော်ထုတ်လိုက်...\" ✨",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.4)",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Reply Helper",
    mm: "Customer Reply ချက်ချင်းရ",
    example: "\"မင်္ဂလာပါ ရှင်၊ Size S ရှိပါတယ်၊ Inbox ဆက်သွယ်နိုင်ပါတယ်...\"",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Product Description",
    mm: "ကုန်ဖော်ပြချက် Pro ဆန်ဆန်",
    example: "\"Premium quality, လက်ဆောင်အတွက် perfect choice...\" 🎁",
    color: "#10B981",
    glow: "rgba(16,185,129,0.4)",
  },
]

const STATS = [
  { n: "< 5s", label: "Generate time" },
  { n: "3", label: "Powerful tools" },
  { n: "Free", label: "To get started" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#08080F" }}>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #8B5CF6, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #F59E0B, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #10B981, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #F59E0B)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight" style={{
            background: "linear-gradient(135deg, #C4B5FD, #FDE68A)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>RONNIX</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:text-white"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Log in
          </Link>
          <Link href="/auth" className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
            စတင်ပါ →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-5 pt-12 pb-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.35)",
              color: "#C4B5FD"
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Myanmar Online Sellers အတွက် တည်ဆောက်ထားသည်
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Caption တွေ</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>AI က ရေးပေးမည်</span>
          </h1>

          <p className="font-mm text-lg max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            Facebook post, customer reply, product description —
            <br />5 စက္ကန့်အတွင်း professional ဆန်ဆန် ထွက်မည်
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth"
              className="flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 0 40px rgba(139,92,246,0.5)"
              }}>
              <Play className="w-4 h-4 fill-white" />
              အခမဲ့ စမ်းကြည့်ပါ
            </Link>
            <div className="text-sm font-mm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Credit card မလိုပါ · Sign up မှာ 10 credits ရသည်
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10">
            {STATS.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center">
                <div className="text-3xl font-black mb-1" style={{
                  background: "linear-gradient(135deg, #C4B5FD, #FDE68A)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{s.n}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tools */}
      <section className="relative z-10 px-5 py-16 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "#8B5CF6" }}>TOOLS 3 ခု</p>
          <h2 className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.9)" }}>
            Daily သုံးမယ့် tools
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-6 rounded-3xl overflow-hidden group cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              whileHover={{ scale: 1.02, borderColor: `${tool.color}40` }}
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: tool.color, filter: "blur(40px)", transform: "translate(30%, -30%)" }} />

              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}30` }}>
                {tool.icon}
              </div>

              <h3 className="font-bold text-base mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{tool.title}</h3>
              <p className="text-xs font-mm mb-4" style={{ color: tool.color }}>{tool.mm}</p>

              <div className="p-3 rounded-xl text-xs font-mm leading-relaxed"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>
                {tool.example}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-5 py-16 max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(245,158,11,0.06))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15), transparent 60%)" }} />

          <p className="text-xs font-semibold tracking-widest mb-3 relative z-10" style={{ color: "#8B5CF6" }}>HOW IT WORKS</p>
          <h2 className="text-3xl font-black mb-10 relative z-10" style={{ color: "rgba(255,255,255,0.9)" }}>
            3 ဆင့်သာ
          </h2>

          <div className="grid grid-cols-3 gap-6 relative z-10">
            {[
              { n: "01", title: "Type ထည့်", desc: "ကုန်ပစ္စည်း သို့မဟုတ် comment ကို ထည့်ပါ" },
              { n: "02", title: "Generate", desc: "AI က 5 စက္ကန့်အတွင်း ရေးပေးမည်" },
              { n: "03", title: "Copy & Post", desc: "Copy ပြီး Facebook/TikTok မှာ paste" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="text-3xl font-black mb-2" style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(245,158,11,0.6))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{step.n}</div>
                <p className="font-bold text-sm mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>{step.title}</p>
                <p className="text-xs font-mm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-5 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "#8B5CF6" }}>PRICING</p>
          <h2 className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.9)" }}>Wave Money နဲ့ ပေးချေ</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { name: "Free", price: "0", unit: "MMK", desc: "3 ကြိမ်/နေ့ + 10 signup credits", cta: "စတင်ပါ", href: "/auth", highlight: false },
            { name: "500 Credits", price: "3,900", unit: "MMK", desc: "Expire မဖြစ်ပါ", cta: "ဝယ်ယူပါ", href: "/pricing", highlight: true },
            { name: "1,500 Credits", price: "9,900", unit: "MMK", desc: "Best value · Save 15%", cta: "ဝယ်ယူပါ", href: "/pricing", highlight: false },
          ].map((plan) => (
            <div key={plan.name}
              className="p-6 rounded-2xl relative"
              style={{
                background: plan.highlight ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(124,58,237,0.1))" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: plan.highlight ? "0 0 40px rgba(139,92,246,0.2)" : "none",
              }}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#F59E0B", color: "#000" }}>Popular</div>
              )}
              <p className="text-xs font-semibold mb-2" style={{ color: plan.highlight ? "#A78BFA" : "rgba(255,255,255,0.4)" }}>{plan.name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.9)" }}>{plan.price}</span>
                <span className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.unit}</span>
              </div>
              <p className="text-xs font-mm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.desc}</p>
              <Link href={plan.href}
                className="block text-center text-sm font-semibold py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{
                  background: plan.highlight ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.9)"
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>
            အခုပဲ စမ်းကြည့်ပါ
          </h2>
          <p className="font-mm text-base mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sign up လုပ်ချင်း 10 credits အခမဲ့ ရသည် · Credit card မလိုပါ
          </p>
          <Link href="/auth"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              boxShadow: "0 0 60px rgba(139,92,246,0.5)"
            }}>
            အခမဲ့ Register လုပ်ပါ
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-8 text-center border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
        <p className="text-sm font-mm">© 2025 Ronnix AI · Myanmar Online Sellers အတွက်</p>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs">
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
      </footer>
    </div>
  )
}
