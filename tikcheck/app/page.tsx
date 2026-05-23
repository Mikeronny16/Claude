"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import LanguageSelector from "./components/LanguageSelector";
import { useLang } from "./contexts/LanguageContext";

const TOOL_HREFS = ["/hook", "/caption", "/hashtags", "/timing", "/image"] as const;
const TOOL_KEYS = ["hook", "caption", "hashtags", "timing", "image"] as const;
const COLORS = ["#FF0050", "#A855F7", "#FF6B35", "#00FF87", "#FFD700"];
const EMOJIS = ["🎬", "✍️", "#️⃣", "⏰", "🖼️"];

export default function Home() {
  const { t } = useLang();

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      {/* Header */}
      <header style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #FF0050, #00F2EA)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            TikCheck
          </div>
          <div style={{ fontSize: 9, color: "#333", fontWeight: 700, letterSpacing: "2.5px", marginTop: 1 }}>CREATOR TOOLKIT</div>
        </div>
        <LanguageSelector />
      </header>

      {/* Hero */}
      <div style={{ padding: "20px 20px 4px" }}>
        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}
        >
          <div style={{
            background: "rgba(255,0,80,0.1)", border: "1px solid rgba(255,0,80,0.2)",
            borderRadius: 20, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, color: "#FF0050", display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF0050", display: "inline-block", animation: "pulse 2s infinite" }} />
            {t.home.creators}
          </div>
        </motion.div>
        <div style={{ fontSize: 11, letterSpacing: "1px", color: "#555", marginBottom: 6 }}>{t.home.flags}</div>

        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
          {t.home.tagline}<br />
          <span style={{ color: "#FF0050" }}>{t.home.taglineAccent}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: "#444", fontSize: 13, marginTop: 6 }}>
          {t.home.subtitle}
        </motion.p>
      </div>

      {/* Tool cards */}
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
        initial="hidden" animate="show"
        style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {TOOL_KEYS.map((key, i) => {
          const tool = t.home.tools[key];
          const color = COLORS[i];
          const href = TOOL_HREFS[i];
          return (
            <motion.div key={href} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}>
              <Link href={href} style={{ textDecoration: "none" }}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${color}28`,
                    borderRadius: 20, padding: "16px",
                    display: "flex", alignItems: "center", gap: 14,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Glow blob */}
                  <div style={{
                    position: "absolute", top: -30, right: -30, width: 100, height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}18, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `${color}14`, border: `1px solid ${color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>
                    {EMOJIS[i]}
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "1.5px", marginBottom: 2 }}>{tool.sub}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{tool.title}</p>
                    <p style={{ fontSize: 12, color: "#444", marginTop: 1 }}>{tool.desc}</p>
                  </div>
                  <span style={{ color, fontSize: 16, flexShrink: 0, opacity: 0.8 }}>›</span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pricing teaser */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ margin: "16px 20px 0" }}
      >
        <Link href="/pricing" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,0,80,0.08), rgba(0,242,234,0.08))",
            border: "1px solid rgba(255,0,80,0.2)",
            borderRadius: 18, padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#FF0050", letterSpacing: "1px" }}>⚡ PRO</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "white", marginTop: 1 }}>Unlock unlimited access</p>
              <p style={{ fontSize: 11, color: "#555", marginTop: 1 }}>One-time payment · No subscription</p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #FF0050, #00F2EA)",
              borderRadius: 12, padding: "8px 14px",
              fontSize: 12, fontWeight: 700, color: "white",
              flexShrink: 0, marginLeft: 12,
            }}>
              View Plans
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Founder card */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ margin: "14px 20px 0" }}
      >
        <Link href="/about" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 18, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #FF0050, #A855F7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white",
            }}>M</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "1.5px" }}>{t.home.founder.label}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{t.home.founder.name}</p>
              <p style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{t.home.founder.role}</p>
            </div>
            <span style={{ fontSize: 12, color: "#FF0050", fontWeight: 600 }}>{t.home.founder.cta}</span>
          </div>
        </Link>
      </motion.div>

      <BottomNav />
    </main>
  );
}
