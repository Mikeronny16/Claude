import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DraftWin — AI Freelance Proposal Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f0d",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#10B981" }}>DraftWin</span>
          <div style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: 14, fontWeight: 700, color: "#10B981" }}>AI</div>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 16, maxWidth: 900 }}>
          Write Winning Proposals{" "}
          <span style={{ color: "#10B981" }}>in 30 Seconds</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#6B7280", textAlign: "center", marginBottom: 44, maxWidth: 700 }}>
          AI-powered · Score ring · Snippet vault · Follow-up generator
        </div>

        {/* Platforms */}
        <div style={{ display: "flex", gap: 14 }}>
          {["Upwork", "Fiverr", "LinkedIn", "Email"].map(p => (
            <div key={p} style={{ padding: "8px 20px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981", fontSize: 20, fontWeight: 700 }}>{p}</div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ marginTop: 36, padding: "10px 24px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <span style={{ color: "#34D399", fontSize: 20, fontWeight: 800 }}>✓ Free to try · No signup required</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
