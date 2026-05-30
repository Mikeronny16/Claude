"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import CinematicHero from "@/components/CinematicHero"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Star, Quote, Check, X, ChevronDown, Mic, Megaphone, Heart, Layers, Hash, BarChart2, Film, Calendar } from "lucide-react"
import { useState } from "react"

const VIRAL_SAMPLES = [
  { name: "Thin Thin", title: "ငြိမ်သောမြစ်ရိုး", element: "ရေ 💧", trait: "ကိုယ်ချစ်တဲ့လူတွေကို ကန်းဆင်ပေးတတ်သည်", rgba: "71,200,255" },
  { name: "Kyaw Zin", title: "The Storm Bringer", element: "Fire 🔥", trait: "Born to lead — even when it's uncomfortable", rgba: "255,107,53" },
  { name: "May Thu", title: "ရွှေသောနှလုံး", element: "မြေ 🌿", trait: "ပတ်ဝန်းကျင်ကို ကောင်းကောင်း ကြည့်တတ်သည်", rgba: "110,231,183" },
]

const FADE = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

// rgba = "R,G,B" for liquid glass tinting
const TOOLS = [
  { icon: <Sparkles className="w-5 h-5" />, title: "Caption Generator", mm: "Caption ရေးပေးသည်", desc: "Facebook, TikTok, Instagram, Telegram အတွက် engaging captions", rgba: "254,203,0" },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Reply Helper", mm: "Customer Reply အမြန်ရ", desc: "Customer comment တိုင်းကို friendly + professional reply", rgba: "109,201,58" },
  { icon: <FileText className="w-5 h-5" />, title: "Product Description", mm: "ကုန်ဖော်ပြချက် Pro", desc: "ဝယ်ယူချင်စိတ် ဖြစ်အောင် compelling descriptions", rgba: "110,231,183" },
  { icon: <Mic className="w-5 h-5" />, title: "Live Script", mm: "Live ရောင်းချ Script", desc: "Facebook/TikTok Live အတွက် structured selling script", rgba: "255,107,53" },
  { icon: <Megaphone className="w-5 h-5" />, title: "Promo Writer", mm: "ပရိုမိုး Post ရေးပေး", desc: "Sale, discount, limited offer posts အတွက် promo copy", rgba: "255,59,111" },
  { icon: <Heart className="w-5 h-5" />, title: "Testimonial", mm: "Review Post ရေးပေး", desc: "Customer reviews ကို compelling post အဖြစ် ပြောင်းပေး", rgba: "0,210,184" },
  { icon: <Layers className="w-5 h-5" />, title: "Caption Variants", mm: "Caption 3 မျိုးထုတ်ပေး", desc: "တစ်ကြိမ်နဲ့ tone ကွဲပြားသော versions 3 ခု", rgba: "163,255,71" },
  { icon: <Hash className="w-5 h-5" />, title: "Hashtag Generator", mm: "Hashtag အမြန်ရ", desc: "Post ကို ပျံ့နှံ့ဖို့ targeted hashtags အသင့်", rgba: "71,200,255" },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Product Comparison", mm: "ကုန်နှိုင်းယှဉ်ချက်", desc: "Competitor နဲ့ ယှဉ်ပြပြီး ဘာကြောင့် မင်းထဲ ဝယ်ရမယ်", rgba: "251,146,60" },
  { icon: <Film className="w-5 h-5" />, title: "Reel Script", mm: "Reel/Short Script", desc: "15-60 sec hook-based video scripts အသင့်", rgba: "191,95,255" },
  { icon: <Calendar className="w-5 h-5" />, title: "Seasonal Post", mm: "ရာသီပွဲ Post ရေးပေး", desc: "Thingyan, Tazaungdaing, Christmas အတွက် themed posts", rgba: "255,209,102" },
]

const TESTIMONIALS = [
  { name: "Thin Thin", role: "Clothing Shop · Yangon", text: "တစ်နေ့ caption 10 ခုလောက် ရေးရတာ 3 နာရီ ကုန်တယ်။ Ronnix သုံးပြီးတည်း 10 မိနစ်ပဲ ကုန်တော့တယ်။", stars: 5, rgba: "254,203,0" },
  { name: "Kyaw Zin", role: "Cosmetic Seller · Mandalay", text: "Customer တွေ comment ပြန်ဖြေရတာ professional ဆန်ဆန်ဖြစ်လာပြီ။ Order တွေပါ ပိုများလာတယ်။", stars: 5, rgba: "109,201,58" },
  { name: "May Thu", role: "Food Shop · Taunggyi", text: "Myanmar နဲ့ English နှစ်မျိုးလုံး ရေးပေးတာ အများကြီးအဆင်ပြေတယ်။ TikTok engagement တက်လာတယ်။", stars: 5, rgba: "71,200,255" },
]

const FAQS = [
  { q: "Free tier မှာ ဘာတွေ ရသလဲ?", a: "Sign up လုပ်တာနဲ့ Caption, Reply, Hashtag, Reel, Promo — Tools 5 ခု အခမဲ့ သုံးနိုင်သည်။ တစ်နေ့ 3 ကြိမ် Generate လုပ်နိုင်သည်။" },
  { q: "Wave Money နဲ့ ဘယ်လို ပေးချေရလဲ?", a: "Pricing page မှာ Wave number ထည့်ပြီး screenshot ပို့ပါ။ Admin က 24 နာရီအတွင်း credits ထည့်ပေးမည်။" },
  { q: "Credits expire ဖြစ်သလား?", a: "မဖြစ်ပါ။ ဝယ်ထားတဲ့ credits တွေ expire မဖြစ်ဘဲ သုံးနိုင်သည်။" },
  { q: "Myanmar Unicode text ရေးပေးနိုင်သလား?", a: "ဟုတ်ပါသည်။ Myanmar Unicode နဲ့ English နှစ်မျိုးလုံး choose လုပ်နိုင်ပြီး natural Myanmar text ရေးပေးသည်။" },
  { q: "Platform တွေ ဘာတွေ support လုပ်သလဲ?", a: "Facebook, TikTok, Instagram, Telegram — platform ရွေးပြီး style ကိုက်ညီတဲ့ caption ရေးပေးသည်။" },
]

// Liquid glass card style
function lg(rgba: string, strong = false): React.CSSProperties {
  const opacity = strong ? "0.22" : "0.16"
  const opacity2 = strong ? "0.08" : "0.05"
  return {
    backdropFilter: "blur(28px) saturate(160%) brightness(1.04)",
    WebkitBackdropFilter: "blur(28px) saturate(160%) brightness(1.04)",
    background: `linear-gradient(150deg, rgba(${rgba},${opacity}) 0%, rgba(${rgba},${opacity2}) 55%, rgba(255,255,255,0.02) 100%)`,
    borderTop: "1px solid rgba(255,255,255,0.20)",
    borderRight: `1px solid rgba(${rgba},0.16)`,
    borderBottom: "1px solid rgba(0,0,0,0.20)",
    borderLeft: `1px solid rgba(${rgba},0.10)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.09) inset, 0 8px 32px rgba(0,0,0,0.40), 0 0 40px rgba(${rgba},0.10)`,
    position: "relative" as const,
    overflow: "hidden" as const,
  }
}

// Top light-catch bar
function LightCatch({ rgba }: { rgba: string }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 50%, transparent)`,
      pointerEvents: "none", zIndex: 2,
    }} />
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
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
        <p className="font-mm" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8, paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  )
}

export default function Landing() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Animated ambient background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12], x: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-15%", left: "40%", width: 700, height: 600,
            borderRadius: "50%", background: "radial-gradient(ellipse, #3D7A1F, transparent 70%)", filter: "blur(90px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.07, 0.14, 0.07], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", top: "35%", right: "-8%", width: 500, height: 500,
            borderRadius: "50%", background: "radial-gradient(ellipse, #FECB00, transparent 70%)", filter: "blur(100px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.05, 0.10, 0.05], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          style={{ position: "absolute", bottom: "20%", left: "-5%", width: 400, height: 400,
            borderRadius: "50%", background: "radial-gradient(ellipse, #47C8FF, transparent 70%)", filter: "blur(100px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", top: "65%", left: "55%", width: 350, height: 350,
            borderRadius: "50%", background: "radial-gradient(ellipse, #BF5FFF, transparent 70%)", filter: "blur(110px)" }}
        />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.022,
          backgroundImage: "linear-gradient(var(--border-g) 1px, transparent 1px), linear-gradient(90deg, var(--border-g) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />
        {/* Noise */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.016,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px" }} />
      </div>

      {/* ── Nav — liquid glass ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(28px) saturate(160%)", WebkitBackdropFilter: "blur(28px) saturate(160%)",
        background: "rgba(2,7,4,0.70)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", maxWidth: "100%",
      }}>
        <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: -0.5 }} className="grad-yg">RONNIX</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/auth" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", padding: "9px 16px" }}>
            Log in
          </Link>
          <Link href="/auth" className="btn-yellow" style={{ padding: "9px 18px", fontSize: 13, borderRadius: 11,
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 0 20px rgba(254,203,0,0.25)" }}>
            အခမဲ့ စမ်းမည် <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* ── CINEMATIC HERO ── */}
      <CinematicHero />

      {/* ── VIRAL PERSONALITY ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px 40px", maxWidth: 700, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <motion.div
              animate={{ boxShadow: ["0 0 0px rgba(254,203,0,0)", "0 0 20px rgba(254,203,0,0.35)", "0 0 0px rgba(254,203,0,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100,
                background: "rgba(254,203,0,0.10)", border: "1px solid rgba(254,203,0,0.30)", marginBottom: 16 }}>
              <span style={{ fontSize: 14 }}>🔮</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FECB00", letterSpacing: 1 }}>FREE · NO LOGIN</span>
            </motion.div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 10 }}>
              နာမည် ထည့် — Soul ဖတ်မည်
            </h2>
            <p className="font-mm" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              AI က မင်းနာမည်မှ ကိုယ်ရည်ကိုယ်သွေး၊ 2026 ကံကြမ္မာ နဲ့ lucky elements ဖတ်ပေးမည်
            </p>
          </div>

          {/* Sample cards */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}
            className="no-scrollbar">
            {VIRAL_SAMPLES.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ ...lg(s.rgba), minWidth: 190, borderRadius: 16, padding: "18px 18px", flexShrink: 0 }}>
                <LightCatch rgba={s.rgba} />
                <div style={{ fontSize: 11, color: `rgba(${s.rgba},0.8)`, marginBottom: 4 }}>{s.element}</div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{s.name}</p>
                <p className="font-mm" style={{ fontSize: 12, color: `rgba(${s.rgba},1)`, fontWeight: 700, marginBottom: 8 }}>{s.title}</p>
                <p className="font-mm" style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}>{s.trait}</p>
              </motion.div>
            ))}
          </div>

          {/* Personality CTA */}
          <Link href="/personality" style={{ textDecoration: "none", display: "block" }}>
            <motion.div whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 30px rgba(254,203,0,0.20)", "0 0 60px rgba(254,203,0,0.40)", "0 0 30px rgba(254,203,0,0.20)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                background: "linear-gradient(135deg, #FECB00 0%, #FF9500 100%)",
                borderRadius: 18, padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer",
              }}>
              <div>
                <p style={{ fontWeight: 900, fontSize: 16, color: "#020704", marginBottom: 2 }}>
                  🔮 Personality Reading — ဒီနေ့ ကြည့်မည်
                </p>
                <p className="font-mm" style={{ fontSize: 12, color: "rgba(2,7,4,0.60)", fontWeight: 600 }}>
                  နာမည်တစ်ခုသာ လိုသည် · Login မလို · Free
                </p>
              </div>
              <ArrowRight style={{ width: 22, height: 22, color: "#020704", flexShrink: 0 }} />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ── PAIN ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 860, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>ဒါတွေ မင်းနေ့စဉ် ကြုံနေရသလား?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
            {[
              "Caption တစ်ခု ရေးဖို့ 30 မိနစ် ဆုံးရှုံးနေရတယ်",
              "Customer comment ကို ဘယ်လို reply ပြန်ရမှန်း မသိဘူး",
              "Post တွေ boring ဖြစ်ပြီး engagement မတက်ဘူး",
              "Competitor တွေထက် professional ဆန်ချင်တယ်",
              "Description ရေးတာ boring ဖြစ်ပြီး ဝယ်ချင်စိတ် မဖြစ်ဘူး",
              "Myanmar / English နှစ်မျိုးလုံး content လိုတယ်",
            ].map((pain) => (
              <div key={pain} style={{
                ...lg("239,68,68"),
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "14px 16px", borderRadius: 14,
              }}>
                <LightCatch rgba="239,68,68" />
                <X style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10,
            textShadow: "0 0 20px rgba(254,203,0,0.5)" }}>TOOLS 11 ခု</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Daily သုံးမည့် AI Tools 11 ခု</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
          {TOOLS.map((t, i) => (
            <motion.div key={t.title}
              style={{ ...lg(t.rgba), padding: 26, borderRadius: 20 }}
              variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.07 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <LightCatch rgba={t.rgba} />
              <div style={{ width: 46, height: 46, borderRadius: 14, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 16,
                background: `rgba(${t.rgba},0.18)`, border: `1px solid rgba(${t.rgba},0.30)`,
                color: `rgba(${t.rgba},1)`,
                boxShadow: `0 0 18px rgba(${t.rgba},0.18)` }}>
                {t.icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{t.title}</h3>
              <p className="font-mm" style={{ fontSize: 12, color: `rgba(${t.rgba},0.85)`, marginBottom: 10, fontWeight: 600 }}>{t.mm}</p>
              <p className="font-mm" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>{t.desc}</p>
              <Link href="/auth" style={{ fontSize: 12, fontWeight: 700, color: `rgba(${t.rgba},1)`,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                Use now <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div style={{ ...lg("61,122,31", true), borderRadius: 24, padding: "44px 36px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <LightCatch rgba="61,122,31" />
          <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(#FECB00, transparent 70%)", opacity: 0.06, filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10,
              textShadow: "0 0 18px rgba(254,203,0,0.45)" }}>HOW IT WORKS</p>
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
                <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, marginBottom: 12,
                  filter: "drop-shadow(0 0 12px rgba(254,203,0,0.4))" }} className="grad-gy">{s.n}</div>
                <p style={{ fontWeight: 800, marginBottom: 6, fontSize: 15 }}>{s.title}</p>
                <p className="font-mm" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>{s.mm}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 700, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Ronnix ရှိ/မရှိ ဘာကွာသလဲ</h2>
          </div>
          <div style={{ ...lg("61,122,31"), borderRadius: 20, overflow: "hidden" }}>
            <LightCatch rgba="61,122,31" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ padding: "14px 20px" }} />
              <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#EF4444",
                borderLeft: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>❌ မရှိရင်</div>
              <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 800, color: "var(--yellow)",
                borderLeft: "1px solid rgba(255,255,255,0.07)", textAlign: "center",
                textShadow: "0 0 12px rgba(254,203,0,0.4)" }}>✅ Ronnix နဲ့</div>
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
                borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ padding: "13px 20px" }}>
                  <p className="font-mm" style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{f}</p>
                </div>
                <div style={{ padding: "13px 20px", borderLeft: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <p className="font-mm" style={{ fontSize: 12, color: "rgba(239,68,68,0.65)" }}>{bad}</p>
                </div>
                <div style={{ padding: "13px 20px", borderLeft: "1px solid rgba(255,255,255,0.06)", textAlign: "center",
                  background: "rgba(109,201,58,0.05)" }}>
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10,
            textShadow: "0 0 20px rgba(254,203,0,0.5)" }}>PRICING</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Wave Money နဲ့ ပေးချေ</h2>
          <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", marginTop: 8 }}>
            Credit expire မဖြစ်ပါ · Admin ကိုယ်တိုင် စစ်ဆေးပြီး ထည့်ပေးသည်
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
          {[
            { name: "Free", price: "0", unit: "MMK", credits: "", rgba: "109,201,58", features: ["3 ကြိမ်/နေ့", "Tools 11 ခုလုံး", "Myanmar + English", "Credit card မလို"], cta: "အခမဲ့ စတင်", href: "/auth", highlight: false },
            { name: "Starter", price: "10,000", unit: "MMK", credits: "200 Credits", rgba: "71,200,255", features: ["200 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Wave Money pay"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: false },
            { name: "Pro", price: "30,000", unit: "MMK", credits: "500 Credits", rgba: "254,203,0", features: ["500 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Best value"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: true },
            { name: "Max", price: "50,000", unit: "MMK", credits: "1,000 Credits", rgba: "191,95,255", features: ["1,000 credits", "Tools 11 ခုလုံး", "Expire မဖြစ်", "Heavy sellers"], cta: "ယခုဝယ်ပါ", href: "/pricing", highlight: false },
          ].map((p) => (
            <motion.div key={p.name}
              animate={p.highlight ? {
                boxShadow: ["0 0 30px rgba(254,203,0,0.15)", "0 0 60px rgba(254,203,0,0.35)", "0 0 30px rgba(254,203,0,0.15)"],
              } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ ...lg(p.rgba, p.highlight), borderRadius: 20, padding: 24, position: "relative" }}>
              <LightCatch rgba={p.rgba} />
              {p.highlight && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  background: "var(--yellow)", color: "#020704", fontSize: 10, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap",
                  boxShadow: "0 0 14px rgba(254,203,0,0.45)" }}>⭐ Most Popular</div>
              )}
              <p style={{ fontSize: 11, fontWeight: 700, color: `rgba(${p.rgba},0.9)`, marginBottom: 6,
                textShadow: `0 0 12px rgba(${p.rgba},0.4)` }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 26, fontWeight: 900 }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.unit}</span>
              </div>
              {p.credits && (
                <p style={{ fontSize: 12, color: `rgba(${p.rgba},0.9)`, fontWeight: 700, marginBottom: 12 }}>{p.credits}</p>
              )}
              <div style={{ margin: "14px 0", display: "flex", flexDirection: "column", gap: 7 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Check style={{ width: 13, height: 13, color: `rgba(${p.rgba},0.9)`, flexShrink: 0 }} />
                    <span className="font-mm" style={{ fontSize: 12, color: "var(--muted)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={p.href} style={{
                display: "block", textAlign: "center", padding: "11px 0", borderRadius: 12,
                background: p.highlight ? "var(--yellow)" : `rgba(${p.rgba},0.14)`,
                color: p.highlight ? "#020704" : `rgba(${p.rgba},1)`,
                border: p.highlight ? "none" : `1px solid rgba(${p.rgba},0.25)`,
                fontWeight: 800, fontSize: 13, textDecoration: "none", marginTop: 8,
                boxShadow: p.highlight ? "0 0 20px rgba(254,203,0,0.3)" : "none",
              }}>{p.cta}</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 36 }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10,
            textShadow: "0 0 18px rgba(254,203,0,0.45)" }}>REVIEWS</p>
          <h2 style={{ fontSize: 26, fontWeight: 900 }}>Sellers တွေ ဘာပြောကြသလဲ</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              style={{ ...lg(t.rgba), padding: 24, borderRadius: 20 }}
              variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <LightCatch rgba={t.rgba} />
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} style={{ width: 13, height: 13, fill: "var(--yellow)", color: "var(--yellow)",
                    filter: "drop-shadow(0 0 4px rgba(254,203,0,0.5))" }} />
                ))}
              </div>
              <Quote style={{ width: 20, height: 20, color: `rgba(${t.rgba},0.7)`, marginBottom: 10 }} />
              <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8, marginBottom: 18 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(${t.rgba},0.6), rgba(${t.rgba},0.3))`,
                  border: `1px solid rgba(${t.rgba},0.4)`,
                  boxShadow: `0 0 12px rgba(${t.rgba},0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 14, color: "var(--text)" }}>
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
        <motion.div style={{ ...lg("254,203,0", true), borderRadius: 24, padding: "36px 32px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <LightCatch rgba="254,203,0" />
          <Quote style={{ width: 28, height: 28, color: "var(--yellow)", opacity: 0.7, marginBottom: 16,
            filter: "drop-shadow(0 0 8px rgba(254,203,0,0.5))" }} />
          <p className="font-mm" style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text)", marginBottom: 24, fontWeight: 500 }}>
            &ldquo;Myanmar မှာ online ရောင်းချသူတိုင်း AI ကို သုံးနိုင်ဖို့ ဆောက်တာ —
            ဈေးကြီးတဲ့ tool မဟုတ်ဘဲ၊ တကယ်အသုံးဝင်တဲ့ tool ဖြစ်ဖို့ Ronnix ကို တည်ဆောက်ခဲ့တယ်။&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg, #3D7A1F, #FECB00)",
              boxShadow: "0 0 16px rgba(254,203,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 17, color: "#020704", flexShrink: 0 }}>M</div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14 }}>Mike Ronny</p>
              <p style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 600,
                textShadow: "0 0 10px rgba(254,203,0,0.4)" }}>Founder · Ronnix AI</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px", maxWidth: 680, margin: "0 auto" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--yellow)", marginBottom: 10,
              textShadow: "0 0 18px rgba(254,203,0,0.4)" }}>FAQ</p>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>မေးလေ့မေးထရှိတဲ့ မေးခွန်းများ</h2>
          </div>
          <div style={{ ...lg("61,122,31"), borderRadius: 20, padding: "8px 28px 0" }}>
            <LightCatch rgba="61,122,31" />
            {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </motion.div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 24px 80px", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <motion.div
          style={{ ...lg("61,122,31", true), borderRadius: 24, padding: "52px 32px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <LightCatch rgba="61,122,31" />
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.5, marginBottom: 12 }}>
            အခုပဲ <span className="grad-yg" style={{ filter: "drop-shadow(0 0 12px rgba(254,203,0,0.4))" }}>စတင်ပါ</span>
          </h2>
          <p className="font-mm" style={{ color: "var(--muted)", marginBottom: 32, fontSize: 13, lineHeight: 1.7 }}>
            Sign up တာနဲ့ 10 credits ချက်ချင်းရသည် · Credit card မလိုပါ
          </p>
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(254,203,0,0.25)", "0 0 50px rgba(254,203,0,0.55)", "0 0 20px rgba(254,203,0,0.25)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ display: "inline-block", borderRadius: 14 }}>
            <Link href="/auth" className="btn-yellow" style={{
              padding: "16px 44px", fontSize: 16, borderRadius: 14,
              display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 900,
            }}>
              <Zap style={{ width: 18, height: 18 }} /> အခမဲ့ Register လုပ်ပါ
            </Link>
          </motion.div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
            {["Credit card မလို", "Expire မဖြစ်", "Myanmar Unicode"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Check style={{ width: 12, height: 12, color: "var(--green-xl)",
                  filter: "drop-shadow(0 0 4px rgba(109,201,58,0.6))" }} />
                <span className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--yellow)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(254,203,0,0.35)" }}>
            <Zap style={{ width: 14, height: 14, color: "#020704" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 900 }} className="grad-yg">RONNIX</span>
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
    </div>
  )
}
