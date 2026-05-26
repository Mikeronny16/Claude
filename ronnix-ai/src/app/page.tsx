"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Logo3D from "@/components/Logo3D"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Star, Quote, Check, X, ChevronDown, Mic, Megaphone, Heart, Layers, Hash, BarChart2, Film, Calendar } from "lucide-react"
import { useState } from "react"

const FADE = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

const TOOLS = [
  { icon: <Sparkles className="w-5 h-5" />, title: "Caption Generator", mm: "Caption ရေးပေးသည်", desc: "Facebook, TikTok, Instagram, Telegram အတွက် engaging captions", color: "var(--yellow)", border: "var(--border-y)" },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Reply Helper", mm: "Customer Reply အမြန်ရ", desc: "Customer comment တိုင်းကို friendly + professional reply", color: "var(--green-xl)", border: "var(--border-g)" },
  { icon: <FileText className="w-5 h-5" />, title: "Product Description", mm: "ကုန်ဖော်ပြချက် Pro", desc: "ဝယ်ယူချင်စိတ် ဖြစ်အောင် compelling descriptions", color: "#6EE7B7", border: "rgba(110,231,183,0.25)" },
  { icon: <Mic className="w-5 h-5" />, title: "Live Script", mm: "Live ရောင်းချ Script", desc: "Facebook/TikTok Live အတွက် structured selling script", color: "#FF6B35", border: "rgba(255,107,53,0.25)" },
  { icon: <Megaphone className="w-5 h-5" />, title: "Promo Writer", mm: "ပရိုမိုး Post ရေးပေး", desc: "Sale, discount, limited offer posts အတွက် promo copy", color: "#FF3B6F", border: "rgba(255,59,111,0.25)" },
  { icon: <Heart className="w-5 h-5" />, title: "Testimonial", mm: "Review Post ရေးပေး", desc: "Customer reviews ကို compelling post အဖြစ် ပြောင်းပေး", color: "#00D2B8", border: "rgba(0,210,184,0.25)" },
  { icon: <Layers className="w-5 h-5" />, title: "Caption Variants", mm: "Caption 3 မျိုးထုတ်ပေး", desc: "တစ်ကြိမ်နဲ့ tone ကွဲပြားသော versions 3 ခု", color: "#A3FF47", border: "rgba(163,255,71,0.25)" },
  { icon: <Hash className="w-5 h-5" />, title: "Hashtag Generator", mm: "Hashtag အမြန်ရ", desc: "Post ကို ပျံ့နှံ့ဖို့ targeted hashtags အသင့်", color: "#47C8FF", border: "rgba(71,200,255,0.25)" },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Product Comparison", mm: "ကုန်နှိုင်းယှဉ်ချက်", desc: "Competitor နဲ့ ယှဉ်ပြပြီး ဘာကြောင့် မင်းထဲ ဝယ်ရမယ်", color: "#FB923C", border: "rgba(251,146,60,0.25)" },
  { icon: <Film className="w-5 h-5" />, title: "Reel Script", mm: "Reel/Short Script", desc: "15-60 sec hook-based video scripts အသင့်", color: "#BF5FFF", border: "rgba(191,95,255,0.25)" },
  { icon: <Calendar className="w-5 h-5" />, title: "Seasonal Post", mm: "ရာသီပွဲ Post ရေးပေး", desc: "Thingyan, Tazaungdaing, Christmas အတွက် themed posts", color: "#FFD166", border: "rgba(255,209,102,0.25)" },
]

const TESTIMONIALS = [
  { name: "Thin Thin", role: "Clothing Shop · Yangon", text: "တစ်နေ့ caption 10 ခုလောက် ရေးရတာ 3 နာရီ ကုန်တယ်။ Ronnix သုံးပြီးတည်း 10 မိနစ်ပဲ ကုန်တော့တယ်။", stars: 5 },
  { name: "Kyaw Zin", role: "Cosmetic Seller · Mandalay", text: "Customer တွေ comment ပြန်ဖြေရတာ professional ဆန်ဆန်ဖြစ်လာပြီ။ Order တွေပါ ပိုများလာတယ်။", stars: 5 },
  { name: "May Thu", role: "Food Shop · Taunggyi", text: "Myanmar နဲ့ English နှစ်မျိုးလုံး ရေးပေးတာ အများကြီးအဆင်ပြေတယ်။ TikTok engagement တက်လာတယ်။", stars: 5 },
]

const FAQS = [
  { q: "Free tier မှာ ဘာတွေ ရသလဲ?", a: "Sign up လုပ်တာနဲ့ Caption, Reply, Hashtag, Reel, Promo — Tools 5 ခု အခမဲ့ သုံးနိုင်သည်။ တစ်နေ့ 3 ကြိမ် Generate လုပ်နိုင်သည်။ Description, Live Script, Variants စသော advanced tools များအတွက် Credits လိုသည်။" },
  { q: "Wave Money နဲ့ ဘယ်လို ပေးချေရလဲ?", a: "Pricing page မှာ Wave number ထည့်ပြီး screenshot ပို့ပါ။ Admin က 24 နာရီအတွင်း credits ထည့်ပေးမည်။" },
  { q: "Credits expire ဖြစ်သလား?", a: "မဖြစ်ပါ။ ဝယ်ထားတဲ့ credits တွေ expire မဖြစ်ဘဲ သုံးနိုင်သည်။" },
  { q: "Myanmar Unicode text ရေးပေးနိုင်သလား?", a: "ဟုတ်ပါသည်။ Myanmar Unicode နဲ့ English နှစ်မျိုးလုံး choose လုပ်နိုင်ပြီး natural Myanmar text ရေးပေးသည်။" },
  { q: "Platform တွေ ဘာတွေ support လုပ်သလဲ?", a: "Facebook, TikTok, Instagram, Telegram — platform ရွေးပြီး style ကိုက်ညီတဲ့ caption ရေးပေးသည်။" },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "18px 0", display: "flex", alignItems: "center",
        justifyContent: "space-between", background: "none", border: "none",
        cursor: "pointer", textAlign: "left", gap: 12,
      }}>
        <span className="font-mm" style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{q}</span>
        <ChevronDown style={{ width: 16, height: 16, color: "var(--muted2)", flexShrink: 0,
          transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <p className="font-mm" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8,
          paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  )
}

export default function Landing() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500, borderRadius: "50%", opacity: 0.13,
          background: "radial-gradient(ellipse, #3D7A1F, transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-10%",
          width: 400, height: 400, borderRadius: "50%", opacity: 0.08,
          background: "radial-gradient(ellipse, #FECB00, transparent 70%)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.025,
          backgroundImage: "linear-gradient(var(--border-g) 1px, transparent 1px), linear-gradient(90deg, var(--border-g) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "18px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/IMG_1808.png" alt="Ronnix AI" style={{ width: 36, height: 36, objectFit: "contain",
            filter: "drop-shadow(0 0 8px rgba(254,203,0,0.4))" }} />
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: -0.5 }} className="grad-yg">RONNIX</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/auth" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none",
            padding: "9px 16px" }}>Log in</Link>
          <Link href="/auth" className="btn-yellow" style={{ padding: "9px 18px", fontSize: 13, borderRadius: 11, display: "flex", alignItems: "center", gap: 6 }}>
            အခမဲ့ စမ်းမည် <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "52px 24px 64px", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ duration: 0.6 }}>

          <Logo3D />

          {/* Social proof pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px",
            borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 28,
            background: "rgba(109,201,58,0.08)", border: "1px solid var(--border-g)", color: "var(--green-xl)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-xl)",
              display: "inline-block", animation: "pulse 2s infinite" }} />
            Myanmar Online Sellers အတွက် AI Tools
          </div>

          {/* Pain-first headline */}
          <h1 style={{ fontSize: "clamp(38px,7vw,72px)", fontWeight: 900, lineHeight: 1.08,
            letterSpacing: -2, marginBottom: 20 }}>
            <span className="grad-yg">Caption ရေး</span>ဖို့<br />
            <span style={{ color: "var(--text)" }}>အချိန်ဆုံးရှုံးနေတယ်မဟုတ်လား?</span>
          </h1>

          <p className="font-mm" style={{ fontSize: 15, color: "var(--muted)", maxWidth: 480,
            margin: "0 auto 32px", lineHeight: 1.9 }}>
            AI က 5 စက္ကန့်အတွင်း Caption · Reply · Live Script · Reel · Hashtag<br />
            နဲ့ Tools 11 ခု — မင်းရောင်းချရေးကိုပဲ အာရုံစိုက်ပါ
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Link href="/auth" className="btn-yellow" style={{
              padding: "16px 36px", fontSize: 16, borderRadius: 14, display: "inline-flex",
              alignItems: "center", gap: 8, fontWeight: 900,
            }}>
              <Zap style={{ width: 18, height: 18 }} /> အခမဲ့ Register လုပ်ပါ
            </Link>
            <p className="font-mm" style={{ fontSize: 12, color: "var(--muted2)" }}>
              Credit card မလိုပါ · Sign up မှာ 10 credits ချက်ချင်းရသည်
            </p>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,6vw,60px)", marginTop: 52,
            padding: "28px 32px", borderRadius: 20, background: "var(--glass)",
            border: "1px solid var(--border-g)", maxWidth: 480, margin: "52px auto 0" }}>
          {[["5s", "Generate time"], ["11", "AI Tools included"], ["Free", "To start"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">{n}</div>
              <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PAIN SECTION ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 860, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>
              ဒါတွေ မင်းနေ့စဉ် ကြုံနေရသလား?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {[
              "Caption တစ်ခု ရေးဖို့ 30 မိနစ် ဆုံးရှုံးနေရတယ်",
              "Customer comment ကို ဘယ်လို reply ပြန်ရမှန်း မသိဘူး",
              "Post တွေ boring ဖြစ်ပြီး engagement မတက်ဘူး",
              "Competitor တွေထက် professional ဆန်ချင်တယ်",
              "Description ရေးတာ boring ဖြစ်ပြီး ဝယ်ချင်စိတ် မဖြစ်ဘူး",
              "Myanmar / English နှစ်မျိုးလုံး content လိုတယ်",
            ].map((pain) => (
              <div key={pain} style={{ display: "flex", alignItems: "flex-start", gap: 10,
                padding: "16px 18px", borderRadius: 14,
                background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <X style={{ width: 15, height: 15, color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                <p className="font-mm" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{pain}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── TOOLS ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 40 }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10 }}>TOOLS 11 ခု</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Daily သုံးမည့် AI Tools 11 ခု</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {TOOLS.map((t, i) => (
            <motion.div key={t.title} className="glass" style={{ padding: 28 }}
              variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 16,
                background: `${t.color}18`, border: `1px solid ${t.border}`, color: t.color }}>
                {t.icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{t.title}</h3>
              <p className="font-mm" style={{ fontSize: 12, color: t.color, marginBottom: 10, fontWeight: 600 }}>{t.mm}</p>
              <p className="font-mm" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>{t.desc}</p>
              <Link href="/auth" style={{ fontSize: 12, fontWeight: 700, color: t.color,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                Use now <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="glass" style={{ padding: "44px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(var(--yellow), transparent 70%)", opacity: 0.05, filter: "blur(60px)" }} />
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>3 ဆင့်သာ</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28 }}>
            {[
              { n: "01", title: "Type ထည့်", mm: "ကုန်ပစ္စည်း သို့မဟုတ် customer comment ကို ရိုက်ထည့်ပါ" },
              { n: "02", title: "Generate", mm: "AI က 5 စက္ကန့်အတွင်း Myanmar/English ရေးပေးမည်" },
              { n: "03", title: "Copy & Post", mm: "Copy ပြီး Facebook · TikTok · Telegram မှာ paste" },
            ].map((s, i) => (
              <motion.div key={s.n} variants={FADE} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, marginBottom: 10 }} className="grad-gy">{s.n}</div>
                <p style={{ fontWeight: 800, marginBottom: 6, fontSize: 15 }}>{s.title}</p>
                <p className="font-mm" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>{s.mm}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 700, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>
              Ronnix ရှိ/မရှိ ဘာကွာသလဲ
            </h2>
          </div>
          <div className="glass" style={{ overflow: "hidden", borderRadius: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "var(--muted2)" }}></div>
              <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#EF4444",
                borderLeft: "1px solid var(--border)", textAlign: "center" }}>❌ မရှိရင်</div>
              <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 800, color: "var(--yellow)",
                borderLeft: "1px solid var(--border)", textAlign: "center" }}>✅ Ronnix နဲ့</div>
            </div>
            {[
              ["Caption ရေးချိန်", "30+ မိနစ်", "5 စက္ကန့်"],
              ["Reply quality", "မသေချာ", "Professional"],
              ["Myanmar + English", "တစ်ခုချင်း", "Toggle တစ်ချက်"],
              ["Platform-specific", "Manual adjust", "Auto style"],
              ["တစ်နေ့ post နိုင်တာ", "2-3 posts", "20+ posts"],
              ["Cost", "အချိန် + effort", "10,000 MMK မှ"],
            ].map(([f, bad, good], i) => (
              <div key={f} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                <div style={{ padding: "14px 20px" }}>
                  <p className="font-mm" style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{f}</p>
                </div>
                <div style={{ padding: "14px 20px", borderLeft: "1px solid var(--border)", textAlign: "center" }}>
                  <p className="font-mm" style={{ fontSize: 12, color: "rgba(239,68,68,0.7)" }}>{bad}</p>
                </div>
                <div style={{ padding: "14px 20px", borderLeft: "1px solid var(--border)", textAlign: "center",
                  background: "rgba(254,203,0,0.03)" }}>
                  <p className="font-mm" style={{ fontSize: 12, color: "var(--green-xl)", fontWeight: 700 }}>{good}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10 }}>PRICING</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Wave Money နဲ့ ပေးချေ</h2>
          <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", marginTop: 8 }}>Credit expire မဖြစ်ပါ · Admin ကိုယ်တိုင် စစ်ဆေးပြီး ထည့်ပေးသည်</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
          {[
            { name: "Free", price: "0", unit: "MMK", credits: "", features: ["3 ကြိမ်/နေ့", "Tools 11 ခုလုံး", "Myanmar + English", "Credit card မလို"], cta: "အခမဲ့ စတင်", href: "/auth", highlight: false },
            { name: "Starter", price: "10,000", unit: "MMK", credits: "200 Credits", features: ["200 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Wave Money pay"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: false },
            { name: "Pro", price: "30,000", unit: "MMK", credits: "500 Credits", features: ["500 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Best value"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: true },
            { name: "Max", price: "50,000", unit: "MMK", credits: "1,000 Credits", features: ["1,000 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Heavy sellers"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: false },
          ].map(p => (
            <div key={p.name} style={{ padding: 24, borderRadius: 20, position: "relative",
              background: p.highlight ? "rgba(254,203,0,0.07)" : "var(--glass)",
              border: p.highlight ? "1px solid var(--border-y)" : "1px solid var(--border-g)",
              boxShadow: p.highlight ? "0 0 40px rgba(254,203,0,0.10)" : "none" }}>
              {p.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "var(--yellow)", color: "#020704", fontSize: 10, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap" }}>⭐ Most Popular</div>
              )}
              <p style={{ fontSize: 11, fontWeight: 700, color: p.highlight ? "var(--yellow)" : "var(--muted)", marginBottom: 6 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 26, fontWeight: 900 }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.unit}</span>
              </div>
              {p.credits && (
                <p style={{ fontSize: 12, color: "var(--green-xl)", fontWeight: 700, marginBottom: 12 }}>
                  {p.credits}
                </p>
              )}
              <div style={{ margin: "14px 0", display: "flex", flexDirection: "column", gap: 7 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Check style={{ width: 13, height: 13, color: p.highlight ? "var(--yellow)" : "var(--green-xl)", flexShrink: 0 }} />
                    <span className="font-mm" style={{ fontSize: 12, color: "var(--muted)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={p.href} style={{ display: "block", textAlign: "center", padding: "11px 0", borderRadius: 12,
                background: p.highlight ? "var(--yellow)" : "rgba(255,255,255,0.06)",
                color: p.highlight ? "#020704" : "var(--text)",
                fontWeight: 800, fontSize: 13, textDecoration: "none", marginTop: 8 }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 36 }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10 }}>REVIEWS</p>
          <h2 style={{ fontSize: 26, fontWeight: 900 }}>Sellers တွေ ဘာပြောကြသလဲ</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} className="glass" style={{ padding: 24 }}
              variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} style={{ width: 13, height: 13, fill: "var(--yellow)", color: "var(--yellow)" }} />
                ))}
              </div>
              <Quote style={{ width: 20, height: 20, color: "var(--yellow)", opacity: 0.5, marginBottom: 10 }} />
              <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8, marginBottom: 18 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,var(--green),var(--yellow))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 14, color: "#020704" }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: "var(--muted2)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "40px 24px", maxWidth: 680, margin: "0 auto" }}>
        <motion.div className="glass-y" style={{ padding: "36px 32px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Quote style={{ width: 28, height: 28, color: "var(--yellow)", opacity: 0.6, marginBottom: 16 }} />
          <p className="font-mm" style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text)", marginBottom: 24, fontWeight: 500 }}>
            &ldquo;Myanmar မှာ online ရောင်းချသူတိုင်း AI ကို သုံးနိုင်ဖို့ ဆောက်တာ —
            ဈေးကြီးတဲ့ tool မဟုတ်ဘဲ၊ တကယ်အသုံးဝင်တဲ့ tool ဖြစ်ဖို့ Ronnix ကို တည်ဆောက်ခဲ့တယ်။&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--green),var(--yellow))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 17, color: "#020704", flexShrink: 0 }}>M</div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14 }}>Mike Ronny</p>
              <p style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 600 }}>Founder · Ronnix AI</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 680, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10 }}>FAQ</p>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>မေးလေ့မေးထရှိတဲ့ မေးခွန်းများ</h2>
          </div>
          <div className="glass" style={{ padding: "8px 28px 0" }}>
            {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </motion.div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px 80px", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <motion.div className="glass" style={{ padding: "48px 32px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5, marginBottom: 12 }}>
            အခုပဲ <span className="grad-yg">စတင်ပါ</span>
          </h2>
          <p className="font-mm" style={{ color: "var(--muted)", marginBottom: 28, fontSize: 13, lineHeight: 1.7 }}>
            Sign up တာနဲ့ 10 credits ချက်ချင်းရသည် · Credit card မလိုပါ
          </p>
          <Link href="/auth" className="btn-yellow" style={{
            padding: "15px 40px", fontSize: 15, borderRadius: 14, display: "inline-flex",
            alignItems: "center", gap: 8, fontWeight: 900,
          }}>
            <Zap style={{ width: 17, height: 17 }} /> အခမဲ့ Register လုပ်ပါ
          </Link>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {["Credit card မလို", "Expire မဖြစ်", "Myanmar Unicode"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Check style={{ width: 12, height: 12, color: "var(--green-xl)" }} />
                <span className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border)",
        padding: "28px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--yellow)",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap style={{ width: 13, height: 13, color: "#020704" }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 900 }} className="grad-yg">RONNIX</span>
        </div>
        <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 14 }}>
          Myanmar Sellers AI Platform · © 2025 Mike Ronny
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[["Pricing", "/pricing"], ["Dashboard", "/dashboard"], ["Login", "/auth"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: "var(--muted2)", textDecoration: "none", fontSize: 12, fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
