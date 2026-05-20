"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Home, ShoppingBag, Settings, Shield } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { href: "/dashboard", icon: Home,        label: "Home"     },
    { href: "/shop",      icon: ShoppingBag, label: "Shop"     },
    { href: "/settings",  icon: Settings,    label: "Settings" },
    ...(session?.user?.isAdmin ? [{ href: "/admin", icon: Shield, label: "Admin" }] : []),
  ]

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
        paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 10px)",
        background: "rgba(8,6,20,0.97)",
        borderTop: "1px solid rgba(139,92,246,0.25)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {links.map(({ href, icon: Icon, label }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "4px 16px",
              borderRadius: 12,
              minWidth: 60,
              textDecoration: "none",
              background: active ? "rgba(139,92,246,0.15)" : "transparent",
            }}
          >
            <Icon
              style={{ width: 20, height: 20, color: active ? "#A78BFA" : "#6B7280" }}
            />
            <span
              style={{
                fontSize: 11,
                color: active ? "#A78BFA" : "#6B7280",
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
