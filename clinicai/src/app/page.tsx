"use client";
import { useState } from "react";

const VIBER = "09969279092";
const GMAIL = "mikeronny18@gmail.com";
const VIBER_LINK = `viber://chat?number=%2B95${VIBER.slice(1)}`;
const MESSENGER_LINK = "https://m.me/mikeronny16";

const packages = [
  {
    name: "Starter",
    price: "50,000",
    eng: "Basic Automation",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    features: [
      "📅 Appointment reminder auto-ပို့ (24h + 2h before)",
      "🤖 Basic booking bot (Viber/Messenger)",
      "⭐ After-visit review request",
      "📊 Google Sheets dashboard",
      "✅ Setup included",
    ],
    who: "GP clinic တစ်ယောက်တည်း / Dental clinic",
  },
  {
    name: "Growth",
    price: "100,000",
    eng: "Full Automation",
    color: "#15803d",
    bg: "#dcfce7",
    border: "#86efac",
    popular: true,
    features: [
      "✅ Starter package အကုန်",
      "🧠 AI conversation booking bot",
      "📋 Patient intake form auto-send",
      "💊 Chronic patient follow-up (DM/HT)",
      "📈 Monthly performance report",
      "💬 WhatsApp support 1hr/month",
    ],
    who: "Staff 2-4 ရှိတဲ့ clinic / Specialist",
  },
  {
    name: "Premium",
    price: "200,000",
    eng: "Agency Level",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#4ade80",
    features: [
      "✅ Growth package အကုန်",
      "📣 Facebook → Messenger lead capture",
      "🔄 Patient reactivation campaign",
      "📁 Lab result delivery via Viber",
      "👥 Multi-doctor scheduling",
      "🎯 Priority support + monthly strategy call",
    ],
    who: "Multi-doctor clinic / Aesthetic / Dental chain",
  },
];

const problems = [
  {
    icon: "😤",
    mm: "Patient appointment မလာဘူး",
    en: "No-shows waste your slots",
    detail: "တနေ့ 5 ယောက် မလာဘူးဆိုရင် — တလမှာ MMK 150,000+ ဆုံးတယ်",
  },
  {
    icon: "📱",
    mm: "Viber/Messenger chaos",
    en: "Message flood every morning",
    detail: "Patient 50+ ယောက် တပြိုင်နက် message ပို့တယ် — staff က manual ဖြေနေရတယ်",
  },
  {
    icon: "🌙",
    mm: "ညနေ inquiry မဖြေနိုင်ဘူး",
    en: "After-hours = lost patients",
    detail: "ည 10 နာရီ message လာတယ် — မဖြေနိုင်ဘူး → patient အခြား clinic သွားတယ်",
  },
  {
    icon: "💊",
    mm: "Chronic patient ပြန်မလာဘူး",
    en: "No follow-up system",
    detail: "DM/HT patient တကြိမ်လာပြီး ပြန်မသတိရဘူး — recurring revenue ဆုံးတယ်",
  },
];

const steps = [
  {
    num: "01",
    mm: "Mike ကို Viber/Messenger မှာ ဆက်သွယ်ပါ",
    en: "Contact us on Viber or Messenger",
    icon: "💬",
  },
  {
    num: "02",
    mm: "ဆရာဝန်ရဲ့ clinic workflow ကို နားထောင်ပြီး demo ပြမယ်",
    en: "Free demo tailored to your clinic",
    icon: "🎯",
  },
  {
    num: "03",
    mm: "1-2 ရက်အတွင်း setup ပြည့်တဲ့ automation go live",
    en: "Live within 1-2 days",
    icon: "🚀",
  },
  {
    num: "04",
    mm: "Patient no-show ကျ၊ staff time ကျ၊ revenue မြင့်",
    en: "Measurable results in 30 days",
    icon: "📈",
  },
];

const results = [
  { stat: "30–60%", label: "No-show ကျ", en: "reduction in missed appointments" },
  { stat: "5–10h", label: "Staff time saved/week", en: "hours saved weekly" },
  { stat: "675%", label: "ROI", en: "documented return on investment" },
  { stat: "24/7", label: "Bot တွေ run", en: "automated patient responses" },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");

  const openModal = (pkg: string) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
  };

  const contactViber = () => {
    const msg = encodeURIComponent(`မင်္ဂလာပါ၊ ClinicAI Myanmar ${selectedPkg} package အကြောင်း သိချင်ပါတယ်`);
    window.open(`${VIBER_LINK}&text=${msg}`);
    setModalOpen(false);
  };

  const contactMessenger = () => {
    window.open(MESSENGER_LINK);
    setModalOpen(false);
  };

  const contactEmail = () => {
    const subject = encodeURIComponent(`ClinicAI Myanmar — ${selectedPkg} Inquiry`);
    const body = encodeURIComponent(`မင်္ဂလာပါ၊\n\nClinicAI Myanmar ${selectedPkg} package အကြောင်း demo တောင်းချင်ပါတယ်။\n\nClinic name:\nPhone:\n\nကျေးဇူးတင်ပါတယ်`);
    window.open(`mailto:${GMAIL}?subject=${subject}&body=${body}`);
    setModalOpen(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #dcfce7",
        padding: "0 20px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#16a34a,#4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🏥</div>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#15803d" }}>ClinicAI Myanmar</span>
        </div>
        <button onClick={() => openModal("Starter")} style={{
          padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg,#16a34a,#22c55e)",
          color: "#fff", border: "none", cursor: "pointer",
        }}>
          Free Demo ကြည့်မယ်
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        background: "linear-gradient(160deg,#f0fdf4 0%,#dcfce7 50%,#fff 100%)",
        padding: "80px 20px 60px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#dcfce7", border: "1px solid #86efac",
            borderRadius: 100, padding: "6px 14px", marginBottom: 24,
            fontSize: 12, fontWeight: 700, color: "#15803d",
          }}>
            🇲🇲 Myanmar Clinics အတွက် AI Automation
          </div>

          <h1 style={{ fontSize: "clamp(28px,7vw,52px)", fontWeight: 900, lineHeight: 1.15, color: "#111827", marginBottom: 16 }}>
            Appointment <span style={{ color: "#16a34a" }}>No-show</span> တွေကို<br />
            Bot နဲ့ ဖြေရှင်းလိုက်ပါ
          </h1>

          <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 8 }}>
            <em>Stop losing patients to missed appointments and unanswered messages.</em>
          </p>
          <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.7, marginBottom: 36 }}>
            Viber + Messenger bot တစ်ခုနဲ့ — appointment reminder auto-ပို့၊ 24/7 booking၊<br />
            patient follow-up အကုန် auto လုပ်ပေးတယ်
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => openModal("Starter")} style={{
              padding: "16px 32px", borderRadius: 14, fontWeight: 900, fontSize: 16,
              background: "linear-gradient(135deg,#16a34a,#22c55e)",
              color: "#fff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
            }}>
              🎯 Free Demo တောင်းမယ်
            </button>
            <a href="#packages" style={{
              padding: "16px 32px", borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: "#fff", color: "#16a34a",
              border: "2px solid #86efac", cursor: "pointer",
              textDecoration: "none", display: "inline-block",
            }}>
              Pricing ကြည့်မယ် ↓
            </a>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: 0, marginTop: 48, flexWrap: "wrap",
            background: "#fff", borderRadius: 16, border: "1px solid #dcfce7",
            boxShadow: "0 2px 16px rgba(22,163,74,0.08)", overflow: "hidden",
          }}>
            {results.map((r, i) => (
              <div key={i} style={{
                flex: "1 1 120px", padding: "20px 16px", textAlign: "center",
                borderRight: i < results.length - 1 ? "1px solid #dcfce7" : "none",
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>{r.stat}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginTop: 2 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{r.en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Pain Points
            </p>
            <h2 style={{ fontSize: "clamp(22px,5vw,34px)", fontWeight: 900, color: "#111827" }}>
              Clinic တိုင်းကြုံနေတဲ့ ပြဿနာ ၄ ခု
            </h2>
          </div>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))" }}>
            {problems.map((p, i) => (
              <div key={i} style={{
                background: "#fafafa", border: "1px solid #e5e7eb",
                borderRadius: 16, padding: 24,
                borderLeft: "4px solid #16a34a",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 4 }}>{p.mm}</p>
                <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 8 }}>{p.en}</p>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            Process
          </p>
          <h2 style={{ fontSize: "clamp(22px,5vw,34px)", fontWeight: 900, color: "#111827", marginBottom: 40 }}>
            ဘယ်လိုလုပ်ဆောင်သလဲ
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 16, textAlign: "left",
                background: "#fff", borderRadius: 16, padding: 20,
                border: "1px solid #bbf7d0",
                boxShadow: "0 2px 8px rgba(22,163,74,0.06)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg,#16a34a,#4ade80)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>STEP {s.num}</div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 2 }}>{s.mm}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{s.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Pricing
            </p>
            <h2 style={{ fontSize: "clamp(22px,5vw,34px)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              Packages & Pricing
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280" }}>Setup fee မပါဘူး • Cancel anytime • KPay/Wave ဖြင့် ပေးချေနိုင်</p>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {packages.map((pkg) => (
              <div key={pkg.name} style={{
                background: pkg.popular ? "#f0fdf4" : "#fff",
                border: `2px solid ${pkg.popular ? pkg.color : pkg.border}`,
                borderRadius: 20, padding: 24, position: "relative",
                boxShadow: pkg.popular ? "0 4px 24px rgba(22,163,74,0.15)" : "none",
              }}>
                {pkg.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg,#16a34a,#22c55e)",
                    color: "#fff", fontSize: 11, fontWeight: 800,
                    padding: "4px 14px", borderRadius: 100,
                  }}>
                    ⭐ Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pkg.color, textTransform: "uppercase" }}>{pkg.eng}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#111827", marginBottom: 4 }}>{pkg.name}</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: pkg.color }}>MMK {pkg.price}</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>/month</span>
                </div>

                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, fontStyle: "italic" }}>{pkg.who}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {pkg.features.map((f, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{f}</p>
                  ))}
                </div>

                <button onClick={() => openModal(pkg.name)} style={{
                  width: "100%", padding: "13px", borderRadius: 12,
                  fontWeight: 900, fontSize: 14,
                  background: pkg.popular
                    ? "linear-gradient(135deg,#16a34a,#22c55e)"
                    : "#fff",
                  color: pkg.popular ? "#fff" : pkg.color,
                  border: `2px solid ${pkg.color}`,
                  cursor: "pointer",
                }}>
                  {pkg.popular ? "🚀 Get Started" : "Demo တောင်းမယ်"}
                </button>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#9ca3af" }}>
            * Budget constraint ရှိရင် custom pricing ဆွေးနွေးနိုင်ပါတယ်
          </p>
        </div>
      </section>

      {/* WHAT PATIENTS SEE */}
      <section style={{ padding: "60px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            Demo
          </p>
          <h2 style={{ fontSize: "clamp(20px,4vw,30px)", fontWeight: 900, color: "#111827", marginBottom: 12 }}>
            Patient တစ်ယောက် ဘာတွေမြင်မလဲ
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
            Viber / Facebook Messenger bot conversation example
          </p>

          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            border: "1px solid #bbf7d0", textAlign: "left",
            boxShadow: "0 4px 20px rgba(22,163,74,0.08)",
          }}>
            {[
              { side: "patient", msg: "မင်္ဂလာပါ appointment ယူချင်ပါတယ်" },
              { side: "bot", msg: "🏥 မင်္ဂလာပါ! ဘာကြောင့် လာမလဲ?" },
              { side: "patient", msg: "ချမ်းတက် ဆေးစစ်ချင်တယ်" },
              { side: "bot", msg: "📅 ဒီ slot တွေ available ပါတယ်:\n• မနက်ဖြန် 9:00 AM ✅\n• မနက်ဖြန် 11:00 AM ✅\n• မတ်ပတ်ဖြန် 2:00 PM ✅" },
              { side: "patient", msg: "မနက်ဖြန် 9:00 AM" },
              { side: "bot", msg: "✅ Confirm ပါပြီ!\nMa Hnin — မနက်ဖြန် 9:00 AM\nReminder ကို 1 နာရီခွဲ အလိုမှာ ပို့ပေးမှာပါ 🔔" },
            ].map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.side === "patient" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: "75%",
                  background: m.side === "patient" ? "#dcfce7" : "#f3f4f6",
                  borderRadius: m.side === "patient" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 13, color: "#1f2937", lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}>
                  {m.msg}
                </div>
              </div>
            ))}
            <div style={{
              textAlign: "center", marginTop: 16, padding: "10px",
              background: "#f0fdf4", borderRadius: 10, fontSize: 12, color: "#16a34a", fontWeight: 700,
            }}>
              🔔 24 နာရီ reminder auto-ပို့ပြီး — bot run လိုက်ပြီ
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "60px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#111827", marginBottom: 32, textAlign: "center" }}>
            မေးလေ့ရှိတဲ့ မေးခွန်းများ
          </h2>
          {[
            {
              q: "Tech မသိသေးဘူး setup ရမလား?",
              a: "Mike ကပဲ အကုန် setup လုပ်ပေးတယ်။ Qdoctor တွေ Google Sheets တစ်ခုပဲ ကြည့်ရုံ။",
            },
            {
              q: "Patient data ဘေးကင်းသလား?",
              a: "Data အကုန် ဆရာဝန်ရဲ့ Google Sheets မှာပဲ သိမ်းတယ်။ Third party မပါဘူး။",
            },
            {
              q: "WhatsApp မဟုတ်ဘူး Viber သုံးလို့ရသလား?",
              a: "ဟုတ်ပါတယ်! Myanmar clinics အတွက် Viber နဲ့ Facebook Messenger ကို optimize လုပ်ထားတယ်။",
            },
            {
              q: "Result မကောင်းဘူးဆိုရင်?",
              a: "30 ရက် free trial ပေးတယ်။ Result မကောင်းဘူးဆိုရင် cancel လုပ်လို့ရတယ် — no questions asked။",
            },
            {
              q: "Payment ဘယ်လို ပေးရမလဲ?",
              a: "KBZPay / WavePay ဖြင့် ပေးချေနိုင်ပါတယ်။ Monthly subscription ပုံစံ။",
            },
          ].map((faq, i) => (
            <div key={i} style={{
              borderBottom: "1px solid #f3f4f6", paddingBottom: 20, marginBottom: 20,
            }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 8 }}>Q: {faq.q}</p>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "60px 20px",
        background: "linear-gradient(135deg,#15803d,#16a34a,#22c55e)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Free Demo ကြည့်ဖို့<br />ဆက်သွယ်ပါ
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 32, lineHeight: 1.6 }}>
            ဒီနေ့ message ပို့ — မနက်ဖြန် demo ကြည့်မယ်
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={VIBER_LINK} style={{
              padding: "16px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15,
              background: "#fff", color: "#16a34a", border: "none",
              textDecoration: "none", display: "inline-block",
            }}>
              📱 Viber မှာ ဆက်သွယ်ပါ
            </a>
            <a href={MESSENGER_LINK} style={{
              padding: "16px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "2px solid rgba(255,255,255,0.5)",
              textDecoration: "none", display: "inline-block",
            }}>
              💬 Messenger မှာ ဆက်သွယ်ပါ
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            📞 {VIBER} &nbsp;|&nbsp; ✉️ {GMAIL}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#111827", padding: "28px 20px", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🏥</span>
          <span style={{ fontWeight: 900, color: "#fff", fontSize: 15 }}>ClinicAI Myanmar</span>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          Myanmar clinics အတွက် AI automation • Viber: {VIBER}
        </p>
      </footer>

      {/* CONTACT MODAL */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }} onClick={() => setModalOpen(false)}>
          <div style={{
            background: "#fff", borderRadius: "24px 24px 0 0",
            padding: "32px 24px 40px", width: "100%", maxWidth: 480,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 24px" }} />
            <h3 style={{ fontWeight: 900, fontSize: 18, color: "#111827", textAlign: "center", marginBottom: 6 }}>
              {selectedPkg} Package — Demo တောင်းမယ်
            </h3>
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 28 }}>
              Preferred channel ကနေ ဆက်သွယ်ပါ
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={contactViber} style={{
                padding: "16px", borderRadius: 14, fontWeight: 800, fontSize: 15,
                background: "#f0fdf4", color: "#15803d",
                border: "2px solid #86efac", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 24 }}>📱</span>
                <div>
                  <div>Viber မှာ message ပို့</div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>Myanmar popular</div>
                </div>
              </button>

              <button onClick={contactMessenger} style={{
                padding: "16px", borderRadius: 14, fontWeight: 800, fontSize: 15,
                background: "#eff6ff", color: "#1d4ed8",
                border: "2px solid #bfdbfe", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 24 }}>💬</span>
                <div>
                  <div>Facebook Messenger</div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>Quick reply</div>
                </div>
              </button>

              <button onClick={contactEmail} style={{
                padding: "16px", borderRadius: 14, fontWeight: 800, fontSize: 15,
                background: "#fafafa", color: "#374151",
                border: "2px solid #e5e7eb", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 24 }}>✉️</span>
                <div>
                  <div>Email ပို့မယ်</div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>{GMAIL}</div>
                </div>
              </button>
            </div>

            <button onClick={() => setModalOpen(false)} style={{
              width: "100%", marginTop: 16, padding: "12px",
              borderRadius: 12, fontSize: 14, color: "#9ca3af",
              background: "none", border: "none", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
