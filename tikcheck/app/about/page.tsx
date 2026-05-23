"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLang();

  return (
    <main style={{ minHeight: "100vh", background: "#000", paddingBottom: 40 }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          textDecoration: "none", fontSize: 18, color: "white",
        }}>←</Link>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#FF0050" }}>{t.about.back.replace('← ', '')}</span>
      </header>

      <div style={{ padding: "28px 20px 0" }}>
        {/* Founder avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF0050, #A855F7, #FFD700)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 800, color: "white",
            marginBottom: 14,
            boxShadow: "0 0 40px rgba(255,0,80,0.3)",
          }}>M</div>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "2px", marginBottom: 4 }}>{t.about.builtBy}</p>
          <h1 style={{
            fontSize: 26, fontWeight: 800,
            background: "linear-gradient(90deg, #FF0050, #A855F7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Mike Ronny</h1>
          <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Creator · Founder · Myanmar 🇲🇲</p>
        </motion.div>

        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 16 }}>{t.about.story}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                emoji: "🤳",
                text: "I'm Mike Ronny — a digital creator from Myanmar. I started making content when most people around me had never even heard of TikTok.",
              },
              {
                emoji: "😤",
                text: "The problem? Every tool I found was either expensive, required a foreign bank card, or was built for creators in New York — not Southeast Asia.",
              },
              {
                emoji: "💡",
                text: "So I built TikCheck. 5 free AI tools that any creator can use — no subscription, no account, no credit card. Just open it and go.",
              },
              {
                emoji: "🌏",
                text: "TikCheck is built for creators in Myanmar, Thailand, Indonesia, Philippines, and beyond. We speak 9 languages because your story deserves to be told in yours.",
              },
              {
                emoji: "🔥",
                text: "This is just the beginning. More tools, more features, and always — free first.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "16px",
                  display: "flex", gap: 14, alignItems: "flex-start",
                }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#aaa" }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ margin: "24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { value: "2,400+", label: "Creators worldwide" },
              { value: "9",      label: "Languages supported" },
              { value: "5",      label: "Free AI tools" },
              { value: "100%",   label: "Free forever" },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "14px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#FF0050" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #FF0050, #A855F7)",
              borderRadius: 16, padding: "16px",
              textAlign: "center",
              boxShadow: "0 0 32px rgba(255,0,80,0.25)",
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Start using TikCheck →</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Free · No account needed</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
