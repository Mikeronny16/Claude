"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function BackHeader({ title, color = "#FF0050" }: { title: string; color?: string }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "rgba(0,0,0,0.15)",
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <Link href="/" style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </Link>
      <span style={{ fontWeight: 700, fontSize: 16, color, flex: 1, letterSpacing: "-0.2px" }}>{title}</span>
      <ThemeToggle />
    </header>
  );
}
