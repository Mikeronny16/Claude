"use client";
import Link from "next/link";

export default function BackHeader({ title, color = "#FF0050" }: { title: string; color?: string }) {
  return (
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
      <span style={{ fontWeight: 700, fontSize: 17, color }}>{title}</span>
    </header>
  );
}
