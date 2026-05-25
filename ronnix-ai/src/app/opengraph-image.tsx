import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ronnix AI — 11 AI Tools for Myanmar Online Sellers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020704",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(61,122,31,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(254,203,0,0.12) 0%, transparent 70%)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(61,122,31,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,122,31,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FECB00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>⚡</div>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#FECB00", letterSpacing: "-1px" }}>RONNIX</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20, maxWidth: 900 }}>
          Myanmar Sellers အတွက်{" "}
          <span style={{ color: "#FECB00" }}>AI Tools 11 ခု</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#6D7E6A", textAlign: "center", marginBottom: 44, maxWidth: 700, lineHeight: 1.4 }}>
          Caption · Reply · Live Script · Hashtags · Reel · Promo — 5 စက္ကန့်အတွင်း
        </div>

        {/* Bottom badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 100, background: "rgba(254,203,0,0.12)", border: "1px solid rgba(254,203,0,0.3)" }}>
          <span style={{ color: "#6DC13A", fontWeight: 800, fontSize: 22 }}>✓ Free to start · Wave Money pay · 100% Myanmar language</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
