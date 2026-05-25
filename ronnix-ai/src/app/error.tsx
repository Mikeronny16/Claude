"use client"

import { useEffect } from "react"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 24px", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, marginBottom: 20,
        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>⚠️</div>
      <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>တစ်ခုခု မှားသွားပါသည်</p>
      <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 28, lineHeight: 1.7 }}>
        {error.message || "ခဏနေပြန်ကြိုးစားပါ"}
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={reset} style={{
          padding: "11px 24px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer",
          background: "var(--yellow)", color: "#020704", border: "none",
        }}>
          ပြန်ကြိုးစားမည်
        </button>
        <a href="/dashboard" style={{
          padding: "11px 24px", borderRadius: 12, fontWeight: 700, fontSize: 13,
          background: "var(--glass)", color: "var(--muted)", border: "1px solid var(--border)",
          textDecoration: "none",
        }}>
          Dashboard
        </a>
      </div>
    </div>
  )
}
