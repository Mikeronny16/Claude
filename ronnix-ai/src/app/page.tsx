"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, Zap, ChevronRight, Star } from "lucide-react"

const TOOLS = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Caption Generator",
    mm: "Caption ရေးပေးသည်",
    desc: "Facebook, TikTok, Instagram captions — မြန်မာ/English",
    color: "#8B5CF6",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Reply Helper",
    mm: "Comment Reply လုပ်ပေးသည်",
    desc: "Customer comment တွေကို professional reply",
    color: "#F59E0B",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Product Description",
    mm: "ပစ္စည်းဖော်ပြချက် ရေးပေးသည်",
    desc: "ကုန်ပစ္စည်းဖော်ပြချက် ကောင်းကောင်းရေးပေးသည်",
    color: "#10B981",
  },
]

const TESTIMONIALS = [
  { name: "Aye Thandar", note: "ညတစ်ညမှာ caption ၅ မျိုးရေးနိုင်တယ်", platform: "Facebook Seller" },
  { name: "Ko Zaw", note: "Customer reply လုပ်ရတာ ၅x မြန်သွားတယ်", platform: "TikTok Shop" },
  { name: "Ma Su", note: "Description ရေးရတာ ပိုမြန်တယ်၊ ပိုကောင်းတယ်", platform: "Telegram Shop" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-black gradient-text tracking-tight">RONNIX</span>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
            Log in
          </Link>
          <Link
            href="/auth"
            className="text-sm font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: "var(--purple)" }}
          >
            စတင်ပါ
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#8B5CF6" }}
          >
            <Zap className="w-3 h-3" />
            Myanmar Online Sellers အတွက် AI Tools
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
            <span className="gradient-text">AI နဲ့</span>{" "}
            <span style={{ color: "var(--text)" }}>ရောင်းချမှု</span>
            <br />
            <span style={{ color: "var(--text)" }}>ပိုမြန်ပါ</span>
          </h1>

          <p className="font-mm text-base sm:text-lg max-w-lg mx-auto mb-8" style={{ color: "var(--muted)" }}>
            Caption ရေးခြင်း၊ Comment ကိုပြန်ဖြေခြင်း၊ ကုန်ပစ္စည်းဖော်ပြချက် ရေးခြင်း —
            AI က ၅ စက္ကန့်အတွင်း လုပ်ပေးသည်
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 glow-purple"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
            >
              အခမဲ့ စမ်းကြည့်ပါ
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-xs font-mm" style={{ color: "var(--muted)" }}>
              Credit card မလိုပါ · 3 ကြိမ်/နေ့ အခမဲ့
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { n: "5s", label: "Generate time" },
            { n: "3", label: "Tools included" },
            { n: "Free", label: "to start" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black gradient-text">{s.n}</div>
              <div className="text-xs mt-1 font-mm" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Tools */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl font-black text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Tools 3 ခု
        </motion.h2>
        <p className="text-center font-mm text-sm mb-10" style={{ color: "var(--muted)" }}>
          Online ရောင်းချသူများ daily သုံးနေတဲ့ tools
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              className="tool-card p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${tool.color}20`, color: tool.color }}
              >
                {tool.icon}
              </div>
              <h3 className="font-bold text-base mb-1" style={{ color: "var(--text)" }}>{tool.title}</h3>
              <p className="text-xs font-mm mb-2" style={{ color: tool.color }}>{tool.mm}</p>
              <p className="text-xs font-mm" style={{ color: "var(--muted)" }}>{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-10">Sellers တွေ ဘာပြောကြသလဲ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-5 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm font-mm mb-3" style={{ color: "var(--text)" }}>&ldquo;{t.note}&rdquo;</p>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{t.platform}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-5 py-16 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-black mb-3">ဈေးနှုန်း</h2>
        <p className="font-mm text-sm mb-8" style={{ color: "var(--muted)" }}>Wave Money နဲ့ ပေးချေနိုင်သည်</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <div className="flex-1 p-6 rounded-2xl text-left" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--purple)" }}>FREE</p>
            <p className="text-3xl font-black mb-1" style={{ color: "var(--text)" }}>0 MMK</p>
            <p className="text-xs font-mm mb-4" style={{ color: "var(--muted)" }}>3 ကြိမ်/နေ့ + Signup bonus 10 credits</p>
            <Link href="/auth" className="block text-center text-sm font-semibold py-2.5 rounded-xl border transition-colors hover:border-purple-500"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              စတင်ရန်
            </Link>
          </div>
          <div className="flex-1 p-6 rounded-2xl text-left relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(245,158,11,0.1))", border: "1px solid rgba(139,92,246,0.4)" }}>
            <div className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--amber)", color: "#000" }}>Popular</div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--purple)" }}>CREDITS</p>
            <p className="text-3xl font-black mb-1" style={{ color: "var(--text)" }}>3,900 MMK</p>
            <p className="text-xs font-mm mb-4" style={{ color: "var(--muted)" }}>500 credits · Expire မဖြစ်</p>
            <Link href="/pricing" className="block text-center text-sm font-semibold py-2.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: "var(--purple)" }}>
              ဝယ်ယူရန်
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto p-10 rounded-3xl"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(245,158,11,0.08))", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--purple)" }} />
          <h2 className="text-2xl font-black mb-3">အခုပဲ စတင်ပါ</h2>
          <p className="font-mm text-sm mb-6" style={{ color: "var(--muted)" }}>
            Credit card မလိုပါ · Sign up ချက်ချင်း 10 credits ရသည်
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 glow-purple"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
          >
            အခမဲ့ Register လုပ်ပါ
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 text-center text-xs border-t" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <p className="font-mm">© 2025 Ronnix AI · Myanmar Online Sellers အတွက်</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <Link href="/pricing" className="hover:text-[var(--text)] transition-colors">Pricing</Link>
          <Link href="/dashboard" className="hover:text-[var(--text)] transition-colors">Dashboard</Link>
        </div>
      </footer>
    </div>
  )
}
