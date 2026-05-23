"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TOOLS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/hook", icon: "🎬", label: "Hook" },
  { href: "/caption", icon: "✍️", label: "Caption" },
  { href: "/hashtags", icon: "#️⃣", label: "Tags" },
  { href: "/image", icon: "🖼️", label: "Image" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(0,0,0,0.92)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "10px 0 16px",
    }}>
      {TOOLS.map((t) => {
        const active = path === t.href;
        return (
          <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              minWidth: 52,
            }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: active ? "#FF0050" : "#444",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}>{t.label}</span>
              {active && (
                <div style={{ width: 20, height: 2, borderRadius: 2, background: "#FF0050" }} />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
