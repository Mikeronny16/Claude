"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export default function BackHeader({ title, color = "#FF0050" }: { title: string; color?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: isDark ? "rgba(0,0,0,0.9)" : "rgba(245,245,247,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <Link href="/" style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none", fontSize: 18,
        color: isDark ? "white" : "#0a0a0a",
      }}>←</Link>
      <span style={{ fontWeight: 700, fontSize: 16, color, flex: 1 }}>{title}</span>
      <ThemeToggle />
    </header>
  );
}
