"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import BottomNav from "./components/BottomNav";

const TOOLS = [
  { href: "/hook", emoji: "🎬", title: "Hook Generator", sub: "STOP THE SCROLL", color: "#FF0050", desc: "5 viral hooks for your next video — instantly" },
  { href: "/caption", emoji: "✍️", title: "Caption Enhancer", sub: "DRIVE ENGAGEMENT", color: "#00F2EA", desc: "Paste your caption → AI makes it fire" },
  { href: "/hashtags", emoji: "#️⃣", title: "Hashtag Finder", sub: "GO VIRAL", color: "#FF0050", desc: "30 perfect hashtags for your niche" },
  { href: "/timing", emoji: "⏰", title: "Best Time to Post", sub: "MAXIMIZE REACH", color: "#00F2EA", desc: "Know exactly when to post for max views" },
  { href: "/image", emoji: "🖼️", title: "AI Image Generator", sub: "AI VISUALS", color: "#FF0050", desc: "Generate scroll-stopping images free" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <header style={{ padding: "24px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #FF0050, #00F2EA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TikCheck
          </div>
          <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "2px", marginTop: 2 }}>CREATOR TOOLKIT</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #FF0050, #00F2EA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✨</div>
      </header>

      <div style={{ padding: "24px 20px 8px" }}>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
          Before you post —<br /><span style={{ color: "#FF0050" }}>check here first.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: "#555", fontSize: 13, marginTop: 8 }}>
          5 free AI tools for TikTok & Instagram creators
        </motion.p>
      </div>

      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        initial="hidden" animate="show"
        style={{ padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}
      >
        {TOOLS.map((t) => (
          <motion.div key={t.href} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.35 }}>
            <Link href={t.href} style={{ textDecoration: "none" }}>
              <motion.div whileTap={{ scale: 0.97 }}
                style={{
                  background: "rgba(255,255,255,0.03)", border: `1px solid ${t.color}30`,
                  borderRadius: 20, padding: "18px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: `0 0 24px ${t.color}0d`, position: "relative", overflow: "hidden",
                }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${t.color}1a, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${t.color}25` }}>
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: t.color, letterSpacing: "1.5px", marginBottom: 3 }}>{t.sub}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "white" }}>{t.title}</p>
                  <p style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{t.desc}</p>
                </div>
                <span style={{ color: t.color, fontSize: 18, flexShrink: 0 }}>→</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <BottomNav />
    </main>
  );
}
