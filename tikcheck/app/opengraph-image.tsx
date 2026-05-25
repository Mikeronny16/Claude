import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TikCheck — AI Creator Toolkit for TikTok & Instagram";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,0,80,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,242,234,0.12) 0%, transparent 70%)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ fontSize: 38, fontWeight: 900, background: "linear-gradient(90deg, #FF0050, #00F2EA)", WebkitBackgroundClip: "text", color: "transparent" }}>TikCheck</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#555", letterSpacing: "3px" }}>CREATOR TOOLKIT</div>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20, maxWidth: 900 }}>
          7 AI Tools to Make Your{" "}
          <span style={{ color: "#FF0050" }}>Content Go Viral</span>
        </div>

        {/* Tools grid */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {[
            ["🎬", "Hook Generator", "#FF0050"],
            ["✍️", "Caption Writer", "#A855F7"],
            ["#️⃣", "Hashtag Finder", "#FF6B35"],
            ["⏰", "Best Time to Post", "#00FF87"],
            ["⚡", "Viral Score", "#00D4FF"],
            ["📅", "30-Day Calendar", "#10B981"],
            ["🖼️", "Image Prompt", "#FFD700"],
          ].map(([emoji, label, color]) => (
            <div key={String(label)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: `${color}14`, border: `1px solid ${color}28` }}>
              <span style={{ fontSize: 18 }}>{emoji}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: String(color) }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 36, padding: "10px 24px", borderRadius: 100, background: "rgba(255,0,80,0.1)", border: "1px solid rgba(255,0,80,0.25)" }}>
          <span style={{ color: "#FF0050", fontSize: 20, fontWeight: 800 }}>Free to start · Works for TikTok & Instagram</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
