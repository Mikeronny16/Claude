"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Home",     emoji: "🏠" },
    { href: "/shop",      label: "Shop",     emoji: "🛍️" },
    { href: "/settings",  label: "Settings", emoji: "⚙️" },
  ]

  return (
    <div style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 9999,
      background: "rgba(10,7,20,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(124,58,237,0.25)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: "calc(64px + env(safe-area-inset-bottom, 0px))",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {links.map(({ href, label, emoji }) => {
        const active = href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(href)
        return (
          <Link key={href} href={href} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            padding: "8px 24px",
            borderRadius: "14px",
            textDecoration: "none",
            background: active ? "rgba(124,58,237,0.18)" : "transparent",
            color: active ? "#A78BFA" : "#6B7280",
            fontSize: "11px",
            fontWeight: active ? 700 : 500,
            minWidth: "64px",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{emoji}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
