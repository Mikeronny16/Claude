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
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#0D0920",
        borderTop: "2px solid #7C3AED",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {links.map(({ href, label, emoji }) => {
        const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "6px 20px",
              borderRadius: 10,
              textDecoration: "none",
              background: active ? "rgba(124,58,237,0.2)" : "transparent",
              color: active ? "#A78BFA" : "#6B7280",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              minWidth: 64,
            }}
          >
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
