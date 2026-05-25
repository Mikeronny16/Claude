"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Clock, User } from "lucide-react"

const TABS = [
  { href: "/dashboard", icon: <Sparkles className="w-5 h-5" />, label: "Tools" },
  { href: "/dashboard/history", icon: <Clock className="w-5 h-5" />, label: "History" },
  { href: "/dashboard/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      height: "calc(64px + env(safe-area-inset-bottom))",
      paddingBottom: "env(safe-area-inset-bottom)",
      background: "rgba(2,7,4,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid var(--border-g)",
      display: "flex",
    }}>
      {TABS.map((tab) => {
        const active = path === tab.href || (tab.href !== "/dashboard" && path.startsWith(tab.href))
        return (
          <Link key={tab.href} href={tab.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
            textDecoration: "none",
            color: active ? "var(--yellow)" : "var(--muted2)",
            transition: "color 0.2s",
          }}>
            <div style={{
              padding: "6px 20px", borderRadius: 12,
              background: active ? "rgba(254,203,0,0.10)" : "transparent",
              transition: "background 0.2s",
            }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
