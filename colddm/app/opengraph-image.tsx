import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ColdDM Scripts — 30 Cold Outreach Scripts for Freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div style={{ position: "absolute", top: -100, left: "20%", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,194,255,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #00c2ff, #0060e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "white" }}>C</div>
          <span style={{ fontSize: 32, fontWeight: 900, color: "white" }}>ColdDM Scripts</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 16, maxWidth: 900 }}>
          30 Scripts That{" "}
          <span style={{ color: "#00c2ff" }}>Actually Get Replies</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#475569", textAlign: "center", marginBottom: 44, maxWidth: 700 }}>
          Instagram DMs · Cold Emails · Follow-Ups · Objection Replies · $5 one-time
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 100, background: "rgba(0,194,255,0.12)", border: "1px solid rgba(0,194,255,0.3)" }}>
          <span style={{ color: "#38d9ff", fontSize: 22, fontWeight: 800 }}>✓ Used by 500+ freelancers · Copy-paste ready</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
