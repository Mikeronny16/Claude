"use client";
import { useState, useCallback } from "react";
import { TEMPLATES, BUNDLE_PRICE } from "@/lib/templates";

const PAYMENT_EMAIL = "mikeronny18@gmail.com";

export default function HomePage() {
  const [payModal, setPayModal] = useState(false);
  const [payStep, setPayStep] = useState<"pick" | "wave" | "kbz">("pick");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("bundle");

  const openBuy = useCallback((item = "bundle") => {
    setSelectedItem(item);
    setPayStep("pick");
    setBuyerEmail("");
    setOrderSent(false);
    setPayModal(true);
  }, []);

  const handleEmailBuy = useCallback(() => {
    const subject = encodeURIComponent(`Readyuse Purchase — ${selectedItem === "bundle" ? "All Templates Bundle $29" : selectedItem}`);
    const body = encodeURIComponent(`Hi Mike,\n\nI want to buy Readyuse automation templates.\n\nItem: ${selectedItem === "bundle" ? "All Templates Bundle ($29)" : selectedItem}\nMy email: ${buyerEmail || "(my email)"}\n\nPlease send the download link. Thank you!`);
    window.open(`mailto:${PAYMENT_EMAIL}?subject=${subject}&body=${body}`);
  }, [selectedItem, buyerEmail]);

  const handlePayAndEmail = useCallback(async (method: "wave" | "kbz") => {
    if (!orderSent) {
      setOrderSent(true);
    }
    const subject = encodeURIComponent("Readyuse Payment Screenshot");
    const body = encodeURIComponent(`Hi Mike,\n\nI've just sent payment via ${method === "wave" ? "Wave Money" : "KBZPay"} for Readyuse templates.\n\nItem: ${selectedItem === "bundle" ? "All Templates Bundle ($29)" : selectedItem}\nMy email: ${buyerEmail || "(see screenshot)"}\n\nPlease send my download link. Thank you!`);
    window.open(`mailto:${PAYMENT_EMAIL}?subject=${subject}&body=${body}`);
  }, [orderSent, selectedItem, buyerEmail]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
        background: "rgba(6,8,16,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900, color: "#fff",
          }}>R</div>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>Readyuse</span>
        </div>
        <button onClick={() => openBuy("bundle")}
          className="btn-primary"
          style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13 }}>
          Get Bundle — $29
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%", opacity: 0.12,
          background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100, marginBottom: 24,
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
            fontSize: 12, fontWeight: 700, color: "#60a5fa",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "pulse 2s infinite" }} />
            Works with n8n AND Make.com
          </div>

          <h1 style={{
            fontSize: "clamp(36px,7vw,68px)", fontWeight: 900,
            lineHeight: 1.08, letterSpacing: -2, marginBottom: 20,
            color: "#fff",
          }}>
            Automation workflows{" "}
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ready to use
            </span>
          </h1>

          <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Import the .json file → add your API keys → done.
            No coding. No setup headaches. Works in minutes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button onClick={() => openBuy("bundle")}
              className="btn-primary"
              style={{ padding: "18px 48px", borderRadius: 16, fontSize: 18, animation: "glow 3s ease-in-out infinite" }}>
              ⚡ Get All 4 Templates — $29
            </button>
            <p style={{ fontSize: 12, color: "var(--muted2)" }}>
              n8n + Make.com versions included · One-time payment
            </p>
          </div>

          {/* Platform badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
            {[
              { name: "n8n", color: "#ea4b71", bg: "rgba(234,75,113,0.12)" },
              { name: "Make.com", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
            ].map(p => (
              <div key={p.name} style={{
                padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: p.bg, color: p.color, border: `1px solid ${p.color}33`,
              }}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section style={{ padding: "20px 20px 80px", maxWidth: 860, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "var(--muted2)", marginBottom: 40 }}>
          4 Templates Included
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TEMPLATES.map(t => (
            <div key={t.id} className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
              {/* Color accent top */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: "20px 20px 0 0" }} />

              <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12,
                padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: t.accentColor, color: t.color,
              }}>
                {t.category}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>{t.tagline}</p>

              <ul style={{ marginBottom: 20, paddingLeft: 0, listStyle: "none" }}>
                {t.whatItDoes.slice(0, 3).map((item, i) => (
                  <li key={i} style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ color: t.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>$9</span>
                  <span style={{ fontSize: 11, color: "var(--muted2)", marginLeft: 4 }}>single</span>
                  <span style={{ fontSize: 11, color: "var(--muted2)", marginLeft: 8 }}>$14 both</span>
                </div>
                <button
                  onClick={() => openBuy(`${t.name} — both platforms $14`)}
                  style={{
                    padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 800,
                    background: t.accentColor, color: t.color, border: `1px solid ${t.color}44`,
                    cursor: "pointer",
                  }}>
                  Buy →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle CTA */}
        <div style={{
          marginTop: 32, padding: "32px 28px", borderRadius: 24,
          background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(99,102,241,0.3)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#6366f1" }}>Best Value</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>All 4 Templates Bundle</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 400 }}>
            Get all 4 workflows for both n8n AND Make.com — 8 files total.
            Saves you $27 vs buying separately.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: "#fff" }}>$29</span>
            <span style={{ fontSize: 16, color: "var(--muted2)", textDecoration: "line-through" }}>$56</span>
          </div>
          <button onClick={() => openBuy("bundle")} className="btn-primary"
            style={{ padding: "16px 48px", borderRadius: 14, fontSize: 17 }}>
            ⚡ Get Bundle Now
          </button>
          <p style={{ fontSize: 11, color: "var(--muted2)" }}>Wave Money · KBZPay · Email · One-time payment</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "60px 24px", maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "var(--muted2)", marginBottom: 12 }}>How It Works</p>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 48 }}>3 steps. That&apos;s it.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {[
            { n: "1", icon: "📥", title: "Download", desc: "Get the .json workflow file after payment" },
            { n: "2", icon: "📤", title: "Import", desc: "Import into n8n or Make.com — one click" },
            { n: "3", icon: "🔑", title: "Add API Keys", desc: "Paste your credentials. Follow the included guide." },
          ].map(s => (
            <div key={s.n} className="card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#3b82f6", marginBottom: 6 }}>STEP {s.n}</div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "40px 24px 100px", maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 24 }}>FAQ</h2>
        {[
          { q: "Do I need to know coding?", a: "No. Just import the file and follow the step-by-step guide included." },
          { q: "What's n8n?", a: "n8n is a free, open-source automation tool (like Make.com or Zapier). You self-host it for free or use n8n.cloud." },
          { q: "What's Make.com?", a: "Make.com (formerly Integromat) is a visual automation platform. Free plan available at make.com." },
          { q: "Can I modify the templates?", a: "Yes! The workflows are fully editable. Customize them however you like." },
          { q: "How do I pay from Myanmar?", a: "Wave Money or KBZPay. Payment info shown after clicking Buy." },
          { q: "How do I get my files?", a: "Mike sends you a download link via email within a few hours of payment confirmation." },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 12, padding: "16px 20px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ fontWeight: 700, color: "#fff", marginBottom: 6, fontSize: 14 }}>{f.q}</p>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* Bottom padding for sticky */}
      <div style={{ height: 80 }} />

      {/* ── STICKY BAR ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6,8,16,0.97)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(59,130,246,0.25)",
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 900, fontSize: 14, color: "#fff" }}>Readyuse Bundle</p>
          <p style={{ fontSize: 12, color: "#3b82f6" }}>All 4 templates · n8n + Make · $29</p>
        </div>
        <button onClick={() => openBuy("bundle")} className="btn-primary"
          style={{ padding: "12px 24px", borderRadius: 12, fontSize: 14 }}>
          ⚡ Get for $29
        </button>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {payModal && (
        <div onClick={() => setPayModal(false)} style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 480,
            background: "rgba(8,10,20,0.99)", borderRadius: "24px 24px 0 0",
            border: "1px solid rgba(59,130,246,0.2)", borderBottom: "none",
            padding: "24px 20px 40px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>
                  {payStep === "pick" ? "Choose Payment" : payStep === "wave" ? "📱 Wave Money" : "💳 KBZPay"}
                </p>
                <p style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Readyuse · {selectedItem === "bundle" ? "All Templates — $29" : selectedItem}</p>
              </div>
              {payStep !== "pick" ? (
                <button onClick={() => setPayStep("pick")} style={{ fontSize: 13, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.8)", background: "rgba(15,20,30,0.9)", color: "var(--muted2)", cursor: "pointer" }}>← Back</button>
              ) : (
                <button onClick={() => setPayModal(false)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", color: "var(--muted2)", lineHeight: 1 }}>✕</button>
              )}
            </div>

            {payStep === "pick" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { method: "wave" as const, icon: "📱", label: "Wave Money", sub: "Myanmar · ~50,000 MMK (bundle)" },
                  { method: "kbz" as const, icon: "💳", label: "KBZPay", sub: "Myanmar · ~50,000 MMK (bundle)" },
                ].map(({ method, icon, label, sub }) => (
                  <button key={method} onClick={() => setPayStep(method)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                    borderRadius: 14, border: "1px solid rgba(59,130,246,0.2)",
                    background: "rgba(59,130,246,0.05)", cursor: "pointer", textAlign: "left",
                  }}>
                    <span style={{ fontSize: 26 }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>{label}</p>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</p>
                    </div>
                    <span style={{ marginLeft: "auto", color: "#3b82f6" }}>→</span>
                  </button>
                ))}
                <button onClick={handleEmailBuy} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  borderRadius: 14, border: "1px solid rgba(34,197,94,0.2)",
                  background: "rgba(34,197,94,0.05)", cursor: "pointer", textAlign: "left",
                }}>
                  <span style={{ fontSize: 26 }}>✉️</span>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Email (International)</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>USD · Mike sends payment details</p>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#22c55e" }}>→</span>
                </button>
              </div>
            )}

            {(payStep === "wave" || payStep === "kbz") && (() => {
              const isWave = payStep === "wave";
              const phone = isWave ? "09969279092" : "09967965497";
              const name = isWave ? "Mg Min Ma Haw" : "Daw San San Myint";
              const accent = "#3b82f6";
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}>Your email (to receive download link)</p>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      placeholder="you@email.com"
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
                        background: "rgba(15,20,30,0.9)", border: "1px solid rgba(59,130,246,0.3)",
                        color: "#fff", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 14, padding: "18px 20px" }}>
                    <p style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Transfer to</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: accent, letterSpacing: 1 }}>{phone}</p>
                      <button onClick={() => navigator.clipboard?.writeText(phone)}
                        style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: accent, cursor: "pointer", fontWeight: 700 }}>
                        Copy
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 700 }}>{name}</p>
                    <p style={{ fontSize: 13, color: accent, fontWeight: 800, marginTop: 8 }}>
                      Bundle: ~50,000 MMK · Single: ~16,000 MMK
                    </p>
                  </div>
                  <button onClick={() => handlePayAndEmail(payStep)} style={{
                    padding: "14px", borderRadius: 14, fontWeight: 900, fontSize: 15, cursor: "pointer",
                    background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", border: "none",
                  }}>
                    {orderSent ? "✅ Gmail opened — hit Send!" : "✉️ I've Paid — Send Proof to Mike"}
                  </button>
                  <p style={{ fontSize: 11, color: "var(--muted2)", textAlign: "center" }}>
                    Mike sends download link within a few hours
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
