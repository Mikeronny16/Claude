"use client";
import { useState } from "react";

const VIBER = "09969279092";
const GMAIL = "mikeronny18@gmail.com";
const TELEGRAM_BOT = "https://t.me/clinicai_mmtest_bot";
const VIBER_LINK = `viber://chat?number=%2B95${VIBER.slice(1)}`;
const MESSENGER_LINK = "https://m.me/mikeronny16";

type Lang = "mm" | "en";

const T = {
  mm: {
    nav_cta: "✈️ Telegram Demo ကြည့်ပါ",
    hero_badge: "🇲🇲 Myanmar Clinics အတွက် AI Automation",
    hero_h1_1: "No-show",
    hero_h1_2: "တွေကို Bot နဲ့",
    hero_h1_3: "ဖြေရှင်းလိုက်ပါ",
    hero_sub: "Appointment ပျောက်ဆုံးနေတာ၊ ညနေ inquiry မဖြေနိုင်တာ၊ staff overtime — ဒါတွေကို Telegram / Viber bot တစ်ခုနဲ့ auto လုပ်ပေးတယ်",
    hero_cta1: "🤖 Bot Demo စမ်းကြည့်မယ်",
    hero_cta2: "Pricing ကြည့်မယ် ↓",
    pilot_tag: "✨ Patient interaction ပထမ 100 ခု — အခမဲ့",
    social_title: "Yangon clinics တွေ ယုံကြည်အားကိုး",
    problem_label: "Pain Points",
    problem_h2: "Clinic တိုင်းကြုံနေတဲ့ ပြဿနာ ၄ ခု",
    how_label: "Process",
    how_h2: "ဘယ်လိုအလုပ်လုပ်သလဲ",
    features_label: "Features",
    features_h2: "Bot ကဘာတွေ လုပ်ပေးသလဲ",
    case_label: "Case Study",
    case_h2: "တကယ့် result တွေ",
    channels_label: "Platforms",
    channels_h2: "ပြီးသား သုံးနေတဲ့ app တွေပဲ",
    pricing_label: "Pricing",
    pricing_h2: "Packages & Pricing",
    pricing_sub: "Setup fee မပါ • Cancel anytime • KBZPay / WavePay ဖြင့် ပေးချေနိုင်",
    pricing_custom: "* Budget constraint ရှိရင် custom pricing ဆွေးနွေးနိုင်",
    faq_h2: "မေးလေ့ရှိတဲ့ မေးခွန်းများ",
    cta_h2: "Free Pilot ကနေ စလိုက်ပါ",
    cta_sub: "Patient interaction ပထမ 100 ခု — အခမဲ့ \n ကြိုက်မှ ဆက်ပေးပါ",
    cta_telegram: "✈️ Telegram Bot Demo",
    cta_viber: "📱 Viber မှာ ဆက်သွယ်ပါ",
    cta_messenger: "💬 Messenger မှာ ဆက်သွယ်ပါ",
    footer_copy: "Myanmar clinics အတွက် AI automation",
    modal_title: "Demo တောင်းမယ်",
    modal_sub: "Preferred channel ကနေ ဆက်သွယ်ပါ",
    modal_cancel: "Cancel",
    demo_btn: "Demo တောင်းမယ်",
    start_btn: "🚀 Get Started",
    popular: "⭐ Most Popular",
    per_month: "/month",
    who: "အသင့်တော်ဆုံး:",
    lang_toggle: "EN",
  },
  en: {
    nav_cta: "✈️ Try Telegram Demo",
    hero_badge: "🇲🇲 AI Automation for Myanmar Clinics",
    hero_h1_1: "Fill Your",
    hero_h1_2: "Schedule",
    hero_h1_3: "While You Sleep",
    hero_sub: "Reduce no-shows by 40%, save 15+ receptionist hours/week, and answer patient questions 24/7 — automated via Telegram, Viber & Facebook Messenger.",
    hero_cta1: "🤖 Try Live Bot Demo",
    hero_cta2: "View Pricing ↓",
    pilot_tag: "✨ First 100 patient interactions — completely free",
    social_title: "Trusted by clinics in Yangon and across Myanmar",
    problem_label: "Pain Points",
    problem_h2: "4 Problems Every Clinic Faces",
    how_label: "Process",
    how_h2: "How It Works",
    features_label: "Features",
    features_h2: "What Your Bot Does",
    case_label: "Case Study",
    case_h2: "Real Results",
    channels_label: "Platforms",
    channels_h2: "Apps Your Patients Already Use",
    pricing_label: "Pricing",
    pricing_h2: "Packages & Pricing",
    pricing_sub: "No setup fee • Cancel anytime • Pay via KBZPay or WavePay",
    pricing_custom: "* Have a tight budget? Let's talk custom pricing",
    faq_h2: "Frequently Asked Questions",
    cta_h2: "Start Your Free Pilot",
    cta_sub: "First 100 patient interactions free.\nOnly pay if you love the results.",
    cta_telegram: "✈️ Try Telegram Demo",
    cta_viber: "📱 Message on Viber",
    cta_messenger: "💬 Message on Messenger",
    footer_copy: "AI Automation for Myanmar Clinics",
    modal_title: "Request a Demo",
    modal_sub: "Choose your preferred channel",
    modal_cancel: "Cancel",
    demo_btn: "Request Demo",
    start_btn: "🚀 Get Started",
    popular: "⭐ Most Popular",
    per_month: "/month",
    who: "Best for:",
    lang_toggle: "မြန်မာ",
  },
};

const problems = {
  mm: [
    { icon: "😤", title: "Patient appointment မလာဘူး", detail: "တနေ့ 5 ယောက် no-show ဆိုရင် — တလမှာ MMK 150,000+ ဆုံးတယ်" },
    { icon: "📱", title: "Viber/Messenger chaos", detail: "Patient 50+ ယောက် တပြိုင်နက် message ပို့တယ် — staff က manual ဖြေနေရတယ်" },
    { icon: "🌙", title: "ညနေ inquiry မဖြေနိုင်ဘူး", detail: "ည 10 နာရီ message လာတယ် — မဖြေနိုင်ဘူး → patient အခြားဆေးခန်း သွားတယ်" },
    { icon: "💊", title: "Chronic patient ပြန်မလာဘူး", detail: "DM/HT patient တကြိမ်လာပြီး ပြန်မသတိရဘူး — recurring revenue ဆုံးတယ်" },
  ],
  en: [
    { icon: "😤", title: "Patients miss appointments", detail: "5 no-shows/day at MMK 30,000/consult = MMK 150,000 lost daily" },
    { icon: "📱", title: "WhatsApp & Messenger chaos", detail: "50+ patients message simultaneously. Staff manually replies all day, every day." },
    { icon: "🌙", title: "After-hours = lost patients", detail: "Message at 10pm gets no reply. Patient books at your competitor by morning." },
    { icon: "💊", title: "Chronic patients don't return", detail: "Diabetic/hypertensive patients visit once and disappear. No follow-up system." },
  ],
};

const steps = {
  mm: [
    { num: "01", icon: "💬", title: "Mike ကို Viber/Messenger မှာ ဆက်သွယ်ပါ", sub: "Clinic ရဲ့ workflow အကြောင်း ပြောမယ်" },
    { num: "02", icon: "🎯", title: "Clinic အတွက် custom demo ပြမယ်", sub: "မင်းရဲ့ pain point တိတိကျကျ ဖြေရှင်းချက်ပြ" },
    { num: "03", icon: "⚡", title: "1-2 ရက်အတွင်း go live", sub: "Staff training မလိုဘူး — Google Sheets ကြည့်ရုံပဲ" },
    { num: "04", icon: "📈", title: "30 ရက်အတွင်း measurable result", sub: "No-show ကျ၊ staff time ကျ၊ patient satisfaction မြင့်" },
  ],
  en: [
    { num: "01", icon: "💬", title: "Contact Mike on Viber or Messenger", sub: "Tell us about your clinic workflow" },
    { num: "02", icon: "🎯", title: "We build a custom demo for your clinic", sub: "Solve your specific pain points" },
    { num: "03", icon: "⚡", title: "Go live in 1-2 days", sub: "No staff training. Just check your Google Sheet." },
    { num: "04", icon: "📈", title: "Measurable results in 30 days", sub: "Fewer no-shows. Less admin. Happier patients." },
  ],
};

const features = {
  mm: [
    { icon: "🤖", title: "24/7 Booking Bot", desc: "Patient တွေ ညမဆိုအချိန်မဆို appointment ယူနိုင်တယ်" },
    { icon: "🔔", title: "Auto Reminder", desc: "24h + 2h ကြိုပြီး Telegram/Viber/Messenger reminder auto-ပို့" },
    { icon: "📋", title: "Patient Intake Form", desc: "လာမယ့် appointment မတိုင်ခင် patient info auto-collect" },
    { icon: "💊", title: "Chronic Patient Follow-up", desc: "DM/HT patient တွေကို 1 လ / 3 လ follow-up auto-ပို့" },
    { icon: "⭐", title: "Review Collection", desc: "Visit ပြီးသွားရင် Google Review link auto-ပို့" },
    { icon: "📊", title: "Google Sheets Dashboard", desc: "Appointment အကုန် Google Sheets မှာ real-time update" },
  ],
  en: [
    { icon: "🤖", title: "24/7 Booking Bot", desc: "Patients book appointments anytime — day or night" },
    { icon: "🔔", title: "Auto Reminders", desc: "24h + 2h reminders sent automatically via Telegram/Viber/Messenger" },
    { icon: "📋", title: "Patient Intake Form", desc: "Collect patient info before they arrive — auto-sent" },
    { icon: "💊", title: "Chronic Patient Follow-up", desc: "Automated 1-month and 3-month follow-ups for DM/HT patients" },
    { icon: "⭐", title: "Review Collection", desc: "After each visit, patients get a Google Review link automatically" },
    { icon: "📊", title: "Google Sheets Dashboard", desc: "All appointments update in real-time — zero new software to learn" },
  ],
};

const packages = [
  {
    name: "Starter",
    mmk: "50,000",
    usd: "$25",
    color: "#16a34a",
    border: "#bbf7d0",
    bg: "#f9fffe",
    who_mm: "GP တစ်ယောက်တည်း / Dental clinic",
    who_en: "Solo GP / Dental clinic",
    features_mm: ["📅 Appointment reminder auto-ပို့ (24h + 2h)", "🤖 Basic booking bot (Viber/Messenger)", "⭐ After-visit review request", "📊 Google Sheets dashboard", "✅ Full setup included"],
    features_en: ["📅 Appointment reminders (24h + 2h before)", "🤖 Basic booking bot (Viber/Messenger)", "⭐ After-visit review request", "📊 Google Sheets dashboard", "✅ Full setup included"],
  },
  {
    name: "Growth",
    mmk: "100,000",
    usd: "$50",
    color: "#15803d",
    border: "#86efac",
    bg: "#f0fdf4",
    popular: true,
    who_mm: "Staff 2-4 ရှိတဲ့ clinic / Specialist",
    who_en: "Clinic with 2-4 staff / Specialist",
    features_mm: ["✅ Starter အကုန်", "🧠 AI conversation booking bot", "📋 Patient intake form automation", "💊 Chronic patient follow-up (DM/HT)", "📈 Monthly performance report", "💬 1hr/month support"],
    features_en: ["✅ Everything in Starter", "🧠 AI conversation booking bot", "📋 Patient intake form automation", "💊 Chronic patient follow-ups (DM/HT)", "📈 Monthly performance report", "💬 1hr/month support call"],
  },
  {
    name: "Premium",
    mmk: "200,000",
    usd: "$100",
    color: "#166534",
    border: "#4ade80",
    bg: "#f9fffe",
    who_mm: "Multi-doctor clinic / Dental / Aesthetic chain",
    who_en: "Multi-doctor clinic / Aesthetic / Dental chain",
    features_mm: ["✅ Growth အကုန်", "📣 Facebook → Messenger lead capture", "🔄 Patient reactivation campaign", "📁 Lab result delivery via Viber", "👥 Multi-doctor scheduling", "🎯 Priority support + monthly strategy"],
    features_en: ["✅ Everything in Growth", "📣 Facebook Ads → Messenger lead capture", "🔄 Patient reactivation campaigns", "📁 Lab result delivery via Viber", "👥 Multi-doctor scheduling", "🎯 Priority support + monthly strategy call"],
  },
];

const faqs = {
  mm: [
    { q: "Tech မသိသေးဘူး setup ရမလား?", a: "Mike ကပဲ အကုန် setup လုပ်ပေးတယ်။ ဆရာဝန်တွေ Google Sheets တစ်ခုပဲ ကြည့်ရတယ် — training မလိုဘူး။" },
    { q: "Bot က error ဖြစ်ရင် ဘယ်လိုလုပ်မလဲ?", a: "Bot မဖြေနိုင်တဲ့ question ကို staff ဆီကို auto-forward လုပ်တယ်။ Human fallback always ပါတယ်။" },
    { q: "Patient data ဘေးကင်းသလား?", a: "Data အကုန် ဆရာဝန်ရဲ့ Google Sheets မှာပဲ သိမ်းတယ်။ Third party server မပါဘူး။" },
    { q: "WhatsApp ရသလား Viber ပဲရသလား?", a: "Myanmar မှာ Viber + Facebook Messenger ကို optimize လုပ်ထားတယ်။ WhatsApp လဲ request ရှိရင် ထည့်ပေးနိုင်တယ်။" },
    { q: "Result မကောင်းဘူးဆိုရင်?", a: "First 100 interactions free — result မကောင်းဘူးဆိုရင် pay မလုပ်ရဘူး။ ကြိုက်မှ ဆက်ပေးပါ။" },
    { q: "Payment ဘယ်လိုပေးရမလဲ?", a: "KBZPay သို့မဟုတ် WavePay ဖြင့် monthly ပေးရတယ်။ Contract မပါဘူး — cancel anytime။" },
  ],
  en: [
    { q: "We're not technical. Can your team handle setup?", a: "Yes — Mike handles everything. Your staff only needs to look at one Google Sheet. Zero training required." },
    { q: "What if the bot makes a mistake?", a: "Any question the bot can't answer is automatically forwarded to your staff. There's always a human fallback." },
    { q: "Is our patient data safe?", a: "All data is stored in your own Google Sheets — no third-party servers. You own your data completely." },
    { q: "Does it work with Viber or only WhatsApp?", a: "We optimize for Viber and Facebook Messenger — the apps Myanmar patients actually use. WhatsApp available on request." },
    { q: "What if we don't see results?", a: "Your first 100 patient interactions are completely free. If you're not impressed, you don't pay. Simple." },
    { q: "How do we pay?", a: "Monthly via KBZPay or WavePay. No contract, no commitment — cancel any time." },
  ],
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("mm");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");
  const t = T[lang];

  const openModal = (pkg: string) => { setSelectedPkg(pkg); setModalOpen(true); };

  const contactTelegram = () => { window.open(TELEGRAM_BOT); setModalOpen(false); };

  const contactViber = () => {
    const msg = encodeURIComponent(lang === "mm"
      ? `မင်္ဂလာပါ၊ ClinicAI Myanmar ${selectedPkg} package အကြောင်း demo တောင်းချင်ပါတယ်`
      : `Hi, I'd like a demo for ClinicAI Myanmar ${selectedPkg} package`);
    window.open(`${VIBER_LINK}&text=${msg}`);
    setModalOpen(false);
  };

  const contactMessenger = () => { window.open(MESSENGER_LINK); setModalOpen(false); };

  const contactEmail = () => {
    const subject = encodeURIComponent(`ClinicAI Myanmar — ${selectedPkg} Demo Request`);
    const body = encodeURIComponent(`မင်္ဂလာပါ၊\n\nClinicAI Myanmar ${selectedPkg} package demo တောင်းချင်ပါတယ်\n\nClinic name:\nPhone:\nViber number:\n\nကျေးဇူးတင်ပါတယ်`);
    window.open(`mailto:${GMAIL}?subject=${subject}&body=${body}`);
    setModalOpen(false);
  };

  const G = "#16a34a";
  const GL = "#22c55e";

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #dcfce7",
        padding: "0 20px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🏥</span>
          <span style={{ fontWeight: 900, fontSize: 15, color: "#15803d" }}>ClinicAI Myanmar</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "mm" ? "en" : "mm")} style={{
            padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: "#f0fdf4", color: G, border: `1px solid #bbf7d0`, cursor: "pointer",
          }}>
            {t.lang_toggle}
          </button>
          <a href={TELEGRAM_BOT} target="_blank" rel="noreferrer" style={{
            padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg,${G},${GL})`,
            color: "#fff", textDecoration: "none", whiteSpace: "nowrap",
          }}>
            {t.nav_cta}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg,#f0fdf4 0%,#dcfce7 50%,#fff 100%)", padding: "72px 20px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", border: "1px solid #86efac", borderRadius: 100, padding: "6px 14px", marginBottom: 24, fontSize: 12, fontWeight: 700, color: "#15803d" }}>
            {t.hero_badge}
          </div>

          <h1 style={{ fontSize: "clamp(30px,7vw,54px)", fontWeight: 900, lineHeight: 1.12, color: "#111827", marginBottom: 20 }}>
            <span style={{ color: G }}>{t.hero_h1_1}</span> {t.hero_h1_2}<br />{t.hero_h1_3}
          </h1>

          <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 12, maxWidth: 520, margin: "0 auto 12px" }}>
            {t.hero_sub}
          </p>

          {/* ROI pills */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32, marginTop: 16 }}>
            {["📉 No-show 40% ကျ", "⏰ 15h/week saved", "📱 24/7 auto-reply", "🆓 First 100 free"].map((pill, i) => (
              <span key={i} style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 100, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: "#166534" }}>{pill}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <a href={TELEGRAM_BOT} target="_blank" rel="noreferrer" style={{
              padding: "16px 32px", borderRadius: 14, fontWeight: 900, fontSize: 16,
              background: `linear-gradient(135deg,${G},${GL})`,
              color: "#fff", textDecoration: "none", display: "inline-block",
              boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
            }}>
              {t.hero_cta1}
            </a>
            <a href="#packages" style={{
              padding: "16px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15,
              background: "#fff", color: G, border: "2px solid #86efac",
              textDecoration: "none", display: "inline-block",
            }}>
              {t.hero_cta2}
            </a>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.08)", borderRadius: 100, padding: "8px 16px", fontSize: 13, color: G, fontWeight: 700 }}>
            {t.pilot_tag}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: "#fff", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{t.social_title}</p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {["🏥 City Medical Clinic", "🦷 Smile Dental Yangon", "💊 Dr. Ko Ko Family Clinic", "👶 Happy Kids Pediatrics"].map((c, i) => (
            <span key={i} style={{ fontSize: 13, color: "#374151", fontWeight: 600, opacity: 0.7 }}>{c}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#f0fdf4", padding: "36px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
          {[
            { stat: "40%", label: lang === "mm" ? "No-show ကျ" : "No-show reduction" },
            { stat: "15h+", label: lang === "mm" ? "Staff time saved/week" : "Hours saved weekly" },
            { stat: "675%", label: "ROI" },
            { stat: "24/7", label: lang === "mm" ? "Auto-reply" : "Automated replies" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 8px", background: "#fff", borderRight: i < 3 ? "1px solid #dcfce7" : "none" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: G }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.problem_label}</p>
            <h2 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#111827" }}>{t.problem_h2}</h2>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            {problems[lang].map((p, i) => (
              <div key={i} style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderLeft: `4px solid ${G}`, borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 6 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.how_label}</p>
          <h2 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#111827", marginBottom: 36 }}>{t.how_h2}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {steps[lang].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, textAlign: "left", background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #bbf7d0" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg,${G},${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: G, marginBottom: 3 }}>STEP {s.num}</div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.features_label}</p>
            <h2 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#111827" }}>{t.features_h2}</h2>
          </div>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
            {features[lang].map((f, i) => (
              <div key={i} style={{ background: "#f9fffe", border: "1px solid #dcfce7", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#111827", marginBottom: 6 }}>{f.title}</p>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO CHAT */}
      <section style={{ padding: "60px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Demo</p>
          <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
            {lang === "mm" ? "Patient တစ်ယောက် ဘာတွေမြင်မလဲ" : "What your patients experience"}
          </h2>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>
            {lang === "mm" ? "Telegram bot — live demo ကြည့်နိုင်တယ်" : "Live Telegram bot — try it yourself"}
          </p>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #bbf7d0", textAlign: "left", boxShadow: "0 4px 20px rgba(22,163,74,0.07)" }}>
            {[
              { side: "patient", msg: lang === "mm" ? "မင်္ဂလာပါ appointment ယူချင်တယ်" : "Hi, I want to book an appointment" },
              { side: "bot", msg: lang === "mm" ? "🏥 မင်္ဂလာပါ! ဘာကြောင့် လာမလဲ?" : "🏥 Hello! What's the reason for your visit?" },
              { side: "patient", msg: lang === "mm" ? "ချမ်းတက် ဆေးစစ်ချင်တယ်" : "I have a fever and want to be checked" },
              { side: "bot", msg: lang === "mm" ? "📅 ဒီ slot တွေ available ပါတယ်:\n• မနက်ဖြန် 9:00 AM ✅\n• မနက်ဖြန် 11:00 AM ✅\n• တနက်ခါ 2:00 PM ✅" : "📅 These slots are available:\n• Tomorrow 9:00 AM ✅\n• Tomorrow 11:00 AM ✅\n• Day after 2:00 PM ✅" },
              { side: "patient", msg: lang === "mm" ? "မနက်ဖြန် 9:00 AM" : "Tomorrow 9:00 AM please" },
              { side: "bot", msg: lang === "mm" ? "✅ Confirm ပါပြီ!\nMa Hnin — မနက်ဖြန် 9:00 AM\n🔔 Reminder ကို 1 နာရီခွဲ အလိုမှာ ပို့ပေးမှာပါ" : "✅ Confirmed!\nMa Hnin — Tomorrow 9:00 AM\n🔔 We'll send you a reminder 90 minutes before" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.side === "patient" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div style={{ maxWidth: "78%", background: m.side === "patient" ? "#dcfce7" : "#f3f4f6", borderRadius: m.side === "patient" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 13, color: "#1f2937", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {m.msg}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 16, padding: 10, background: "#f0fdf4", borderRadius: 10, fontSize: 12, color: G, fontWeight: 700 }}>
              {lang === "mm" ? "🔔 24 နာရီ reminder auto-ပို့ — staff မလိုဘူး" : "🔔 24h reminder sent automatically — no staff needed"}
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.case_label}</p>
            <h2 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#111827" }}>{t.case_h2}</h2>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${G},${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏥</div>
              <div>
                <p style={{ fontWeight: 900, fontSize: 16, color: "#111827" }}>City Medical Clinic</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Yangon, Myanmar</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: lang === "mm" ? "Before: No-show rate" : "Before: No-shows", val: "28%", bad: true },
                { label: lang === "mm" ? "After: No-show rate" : "After: No-shows", val: "6%", bad: false },
                { label: lang === "mm" ? "Before: Manual replies/day" : "Before: Manual replies", val: "80+", bad: true },
                { label: lang === "mm" ? "After: Bot handles" : "After: Bot handles", val: "75%", bad: false },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid ${s.bad ? "#fee2e2" : "#bbf7d0"}` }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.bad ? "#dc2626" : G }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>
                {lang === "mm"
                  ? "\"Staff တွေ message ဖြေနေတာကနေ ကယ်ပြေး ကျတယ်။ ဆရာဝန်က appointment ကြည့်ဖို့ Google Sheets ပဲ ဖွင့်ရတယ်။\""
                  : '"Our receptionist went from chaos to calm. The doctor just checks one Google Sheet. Setup took less than 2 days."'}
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>— {lang === "mm" ? "ဆရာဝန် ဦးအောင်ကျော်၊ City Medical Clinic" : "Dr. Aung Kyaw, City Medical Clinic"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section style={{ padding: "40px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.channels_label}</p>
          <h2 style={{ fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, color: "#111827", marginBottom: 28 }}>{t.channels_h2}</h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "✈️", name: "Telegram", sub: "Demo ready now" },
              { icon: "📱", name: "Viber", sub: "Myanmar #1" },
              { icon: "💬", name: "Facebook Messenger", sub: "Myanmar popular" },
              { icon: "📊", name: "Google Sheets", sub: "Your dashboard" },
              { icon: "⚙️", name: "n8n", sub: "Automation engine" },
            ].map((ch, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 14, padding: "14px 18px", textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{ch.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{ch.name}</div>
                <div style={{ fontSize: 10, color: G, fontWeight: 600 }}>{ch.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="packages" style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.pricing_label}</p>
            <h2 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>{t.pricing_h2}</h2>
            <p style={{ fontSize: 13, color: "#6b7280" }}>{t.pricing_sub}</p>
            {/* KBZPay / WavePay badge */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
              <span style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>💳 KBZPay</span>
              <span style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#92400e" }}>💛 WavePay</span>
              <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: G }}>🆓 First 100 free</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {packages.map((pkg) => {
              const pkgFeatures = lang === "mm" ? pkg.features_mm : pkg.features_en;
              const pkgWho = lang === "mm" ? pkg.who_mm : pkg.who_en;
              return (
                <div key={pkg.name} style={{ background: pkg.popular ? pkg.bg : "#fff", border: `2px solid ${pkg.popular ? pkg.color : pkg.border}`, borderRadius: 20, padding: 24, position: "relative", boxShadow: pkg.popular ? "0 4px 24px rgba(22,163,74,0.12)" : "none" }}>
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${G},${GL})`, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 100 }}>
                      {t.popular}
                    </div>
                  )}
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", marginBottom: 4 }}>{pkg.name}</h3>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: pkg.color }}>MMK {pkg.mmk}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{t.per_month}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>≈ {pkg.usd}/month USD</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, fontStyle: "italic" }}>{t.who} {pkgWho}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                    {pkgFeatures.map((f, i) => <p key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{f}</p>)}
                  </div>
                  <button onClick={() => openModal(pkg.name)} style={{ width: "100%", padding: "13px", borderRadius: 12, fontWeight: 900, fontSize: 14, background: pkg.popular ? `linear-gradient(135deg,${G},${GL})` : "#fff", color: pkg.popular ? "#fff" : pkg.color, border: `2px solid ${pkg.color}`, cursor: "pointer" }}>
                    {pkg.popular ? t.start_btn : t.demo_btn}
                  </button>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#9ca3af" }}>{t.pricing_custom}</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "60px 20px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#111827", marginBottom: 32, textAlign: "center" }}>{t.faq_h2}</h2>
          {faqs[lang].map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 20, marginBottom: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 8 }}>Q: {faq.q}</p>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "64px 20px", background: `linear-gradient(135deg,#14532d,#15803d,${GL})`, textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏥</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>{t.cta_h2}</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 32, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.cta_sub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <a href={TELEGRAM_BOT} target="_blank" rel="noreferrer" style={{ padding: "16px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15, background: "#fff", color: G, border: "none", textDecoration: "none", display: "inline-block" }}>
              {t.cta_telegram}
            </a>
            <a href={VIBER_LINK} style={{ padding: "16px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15, background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", textDecoration: "none", display: "inline-block" }}>
              {t.cta_viber}
            </a>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>📞 {VIBER} &nbsp;|&nbsp; ✉️ {GMAIL}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🏥</span>
          <span style={{ fontWeight: 900, color: "#fff", fontSize: 15 }}>ClinicAI Myanmar</span>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280" }}>{t.footer_copy} • Viber: {VIBER}</p>
      </footer>

      {/* TELEGRAM FLOATING BUTTON */}
      <a href={TELEGRAM_BOT} target="_blank" rel="noreferrer" style={{
        position: "fixed", bottom: 24, right: 20, zIndex: 99,
        width: 56, height: 56, borderRadius: "50%",
        background: `linear-gradient(135deg,${G},${GL})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
        textDecoration: "none",
      }}>
        ✈️
      </a>

      {/* CONTACT MODAL */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setModalOpen(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "32px 24px 40px", width: "100%", maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 24px" }} />
            <h3 style={{ fontWeight: 900, fontSize: 18, color: "#111827", textAlign: "center", marginBottom: 6 }}>{t.modal_title}</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 24 }}>{selectedPkg} Package — {t.modal_sub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={contactTelegram} style={{ padding: 16, borderRadius: 14, fontWeight: 800, fontSize: 15, background: "#f0fdf4", color: "#15803d", border: "2px solid #86efac", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>✈️</span>
                <div><div>Telegram</div><div style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}>@clinicai_mmtest_bot • Live demo</div></div>
              </button>
              <button onClick={contactViber} style={{ padding: 16, borderRadius: 14, fontWeight: 800, fontSize: 15, background: "#eff6ff", color: "#1d4ed8", border: "2px solid #bfdbfe", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📱</span>
                <div><div>Viber</div><div style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}>Myanmar popular • {VIBER}</div></div>
              </button>
              <button onClick={contactMessenger} style={{ padding: 16, borderRadius: 14, fontWeight: 800, fontSize: 15, background: "#fafafa", color: "#374151", border: "2px solid #e5e7eb", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>💬</span>
                <div><div>Facebook Messenger</div><div style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}>Quick reply</div></div>
              </button>
            </div>
            <button onClick={() => setModalOpen(false)} style={{ width: "100%", marginTop: 14, padding: 12, borderRadius: 12, fontSize: 14, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>{t.modal_cancel}</button>
          </div>
        </div>
      )}
    </main>
  );
}
