"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useMemo } from "react"

const COUNT = 55

export default function CinematicHero() {
  const particles = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: (i / COUNT) * 100 + (Math.sin(i * 7.3) * 8),
      size: 1.5 + (Math.sin(i * 3.7) + 1) * 1.5,
      delay: (i * 0.19) % 7,
      dur: 10 + (i % 7) * 2,
      opacity: 0.12 + (i % 5) * 0.08,
      gold: i % 3 === 0,
    })),
  [])

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "#020704",
    }}>

      {/* ── Film grain ── */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none", zIndex: 6 }}
      >
        <filter id="cine-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cine-grain)" />
      </svg>

      {/* ── Deep background glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(254,203,0,0.04) 0%, transparent 70%)",
      }} />

      {/* ── Vertical spotlight beam ── */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "top center",
          width: 280, height: "72%",
          background: "linear-gradient(180deg, rgba(254,203,0,0.18) 0%, rgba(109,201,58,0.07) 45%, transparent 100%)",
          filter: "blur(36px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      {/* Narrow inner beam */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.7, scaleY: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "top center",
          width: 60, height: "55%",
          background: "linear-gradient(180deg, rgba(254,203,0,0.25) 0%, transparent 100%)",
          filter: "blur(12px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* ── Particles ── */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-15vh", opacity: p.opacity }}
          transition={{
            delay: p.delay,
            duration: p.dur,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.gold ? "rgba(254,203,0,0.9)" : "rgba(163,255,71,0.7)",
            boxShadow: p.gold
              ? `0 0 ${p.size * 4}px rgba(254,203,0,0.9)`
              : `0 0 ${p.size * 3}px rgba(163,255,71,0.6)`,
            pointerEvents: "none", zIndex: 2,
          }}
        />
      ))}

      {/* ── Radial aura pulses ── */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(254,203,0,0.09) 0%, transparent 68%)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{
          position: "absolute",
          width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(109,201,58,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* ── Horizontal light sweep at logo level ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.6, scaleX: 1 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 1.0 }}
        style={{
          position: "absolute",
          top: "38%",
          width: "100%", height: 1,
          background: "linear-gradient(90deg, transparent 5%, rgba(254,203,0,0.15) 35%, rgba(254,203,0,0.35) 50%, rgba(254,203,0,0.15) 65%, transparent 95%)",
          pointerEvents: "none", zIndex: 2,
        }}
      />

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 580 }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
            borderRadius: 100, fontSize: 12, fontWeight: 700,
            background: "rgba(109,201,58,0.08)", border: "1px solid rgba(109,201,58,0.25)",
            color: "var(--green-xl)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "var(--green-xl)",
              display: "inline-block", animation: "pulse 2s infinite",
            }} />
            Myanmar Online Sellers အတွက် AI Tools
          </div>
        </motion.div>

        {/* Headline — theater curtain reveal */}
        <div style={{ overflow: "hidden", marginBottom: 6 }}>
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
            className="grad-yg"
            style={{
              fontSize: "clamp(40px,7.5vw,70px)",
              fontWeight: 900, lineHeight: 1.06, letterSpacing: -2, margin: 0,
            }}
          >
            Caption ရေးဖို့
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 28 }}>
          <motion.div
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 1.18 }}
            style={{
              fontSize: "clamp(40px,7.5vw,70px)",
              fontWeight: 900, lineHeight: 1.06, letterSpacing: -2,
              color: "var(--text)",
            }}
          >
            အချိန်ဆုံးရှုံးနေတယ်မဟုတ်လား?
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.45 }}
          className="font-mm"
          style={{ fontSize: 15, color: "var(--muted)", maxWidth: 440, margin: "0 auto 40px", lineHeight: 1.9 }}
        >
          AI က 5 စက္ကန့်အတွင်း Caption · Reply · Live Script · Reel · Hashtag<br />
          နဲ့ Tools 11 ခု — မင်းရောင်းချရေးကိုပဲ အာရုံစိုက်ပါ
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
        >
          <Link href="/auth" className="btn-yellow" style={{
            padding: "18px 46px", fontSize: 17, borderRadius: 16,
            display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 900,
            boxShadow: "0 0 40px rgba(254,203,0,0.28), 0 0 80px rgba(254,203,0,0.10), 0 8px 32px rgba(0,0,0,0.6)",
          }}>
            ⚡ အခမဲ့ Register လုပ်ပါ
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="font-mm"
            style={{ fontSize: 12, color: "var(--muted2)" }}
          >
            Credit card မလိုပါ · Sign up မှာ credits ချက်ချင်းရသည်
          </motion.p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.0 }}
          style={{
            display: "flex", justifyContent: "center",
            gap: "clamp(24px,6vw,60px)", marginTop: 56,
            padding: "24px 36px", borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(109,201,58,0.12)",
            backdropFilter: "blur(10px)",
            maxWidth: 420, margin: "56px auto 0",
          }}
        >
          {[["5s", "Generate time"], ["11", "AI Tools"], ["Free", "To start"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900 }} className="grad-yg">{n}</div>
              <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 4, fontWeight: 600, letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          style={{ marginTop: 52, display: "flex", justifyContent: "center" }}
        >
          <motion.div
            animate={{ y: [0, 9, 0], opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, transparent, rgba(254,203,0,0.4))" }} />
            <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "rgba(254,203,0,0.4)" }}>Scroll</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
