import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Spawn AI — Hatch. Raise. Bond.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0514",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)" }} />

        {/* Egg SVG */}
        <div style={{ marginBottom: 28, filter: "drop-shadow(0 0 40px rgba(168,85,247,0.5))", display: "flex" }}>
          <svg width="110" height="132" viewBox="0 0 100 120">
            <defs>
              <radialGradient id="eg" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#f5d0fe" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#eg)" />
            <ellipse cx="38" cy="42" rx="8" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,38,42)" />
          </svg>
        </div>

        {/* Badge */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 24 }}>AI Companion Platform</div>

        {/* Headline */}
        <div style={{ fontSize: 72, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20, maxWidth: 900 }}>
          Something small is{" "}
          <span style={{ color: "#A78BFA" }}>waiting</span>
          {" "}for you.
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#6B7280", textAlign: "center", marginBottom: 44, maxWidth: 700, lineHeight: 1.5 }}>
          Buy an egg. Hatch it. Raise a unique AI creature with its own personality.
        </div>

        {/* Egg tiers */}
        <div style={{ display: "flex", gap: 20 }}>
          {[["#F59E0B", "Common"], ["#818CF8", "Rare"], ["#A855F7", "Epic"], ["#EC4899", "Mythic"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 19, borderRadius: "50% 50% 45% 45%", background: String(color), filter: `drop-shadow(0 0 8px ${color}88)` }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: String(color) }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 36, padding: "10px 24px", borderRadius: 100, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
          <span style={{ color: "#C4B5FD", fontSize: 20, fontWeight: 800 }}>✓ First egg free · It remembers you · It grows because of you</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
