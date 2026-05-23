"use client";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: 16, flexShrink: 0,
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </motion.button>
  );
}
