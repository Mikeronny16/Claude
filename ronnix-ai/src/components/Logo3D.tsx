"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import VanillaTilt from "vanilla-tilt"

export default function Logo3D() {
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    VanillaTilt.init(el, {
      max: 18,
      speed: 600,
      scale: 1.06,
      perspective: 800,
      glare: true,
      "max-glare": 0.25,
      gyroscope: true,
      gyroscopeMinAngleX: -20,
      gyroscopeMaxAngleX: 20,
      gyroscopeMinAngleY: -20,
      gyroscopeMaxAngleY: 20,
    })
    return () => (el as HTMLElement & { vanillaTilt?: { destroy: () => void } }).vanillaTilt?.destroy()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 160, damping: 16 }}
      style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}
    >
      {/* Outer ambient glow */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -30,
            background: "radial-gradient(ellipse, rgba(254,203,0,0.4) 0%, transparent 70%)",
            filter: "blur(25px)", borderRadius: "50%", pointerEvents: "none",
          }}
        />

        {/* Tilt container */}
        <div
          ref={tiltRef}
          style={{
            position: "relative",
            width: 180, height: 180,
            borderRadius: 28,
            transformStyle: "preserve-3d",
            cursor: "pointer",
          }}
        >
          {/* Inner card glow border */}
          <div style={{
            position: "absolute", inset: -1.5,
            borderRadius: 30,
            background: "linear-gradient(135deg, rgba(254,203,0,0.6), rgba(163,255,71,0.3), rgba(254,203,0,0.6))",
            zIndex: 0,
          }} />

          {/* Card bg */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(254,203,0,0.08), rgba(2,7,4,0.95))",
            zIndex: 1,
          }} />

          {/* Shine sweep */}
          <motion.div
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
            style={{
              position: "absolute", top: 0, left: 0,
              width: "45%", height: "100%",
              background: "linear-gradient(105deg, transparent, rgba(254,203,0,0.18), transparent)",
              borderRadius: 28,
              zIndex: 2, pointerEvents: "none",
            }}
          />

          {/* Logo image */}
          <motion.img
            src="/IMG_1808.png"
            alt="Ronnix AI"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 16,
              width: "calc(100% - 32px)",
              height: "calc(100% - 32px)",
              objectFit: "contain",
              zIndex: 3,
              filter: "drop-shadow(0 4px 20px rgba(254,203,0,0.6)) drop-shadow(0 0 40px rgba(254,203,0,0.3))",
              transform: "translateZ(30px)",
            }}
          />
        </div>

        {/* Shadow beneath */}
        <motion.div
          animate={{ scaleX: [1, 0.85, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 20,
            background: "rgba(254,203,0,0.25)",
            filter: "blur(12px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      </div>
    </motion.div>
  )
}
