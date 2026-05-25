"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("ronnix_theme")
    setDark(saved !== "light")
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    const theme = next ? "dark" : "light"
    localStorage.setItem("ronnix_theme", theme)
    document.documentElement.classList.toggle("light", !next)
  }

  if (!mounted) return <div style={{ width: 34, height: 34 }} />

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border-g)",
        background: "var(--glass)", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: dark ? "var(--muted2)" : "var(--yellow)",
        flexShrink: 0,
      }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {dark
            ? <Moon style={{ width: 15, height: 15 }} />
            : <Sun style={{ width: 15, height: 15 }} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
