import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Whispr — Anonymous Messages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#040d1a",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <span style={{ fontSize: 52 }}>👻</span>
          <span style={{ fontSize: 40, fontWeight: 900, color: "#06b6d4", letterSpacing: "-1px" }}>Whispr</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20, maxWidth: 900 }}>
          What do people{" "}
          <span style={{ color: "#06b6d4", fontStyle: "italic" }}>really</span>
          {" "}think of you?
        </div>

        {/* Demo messages */}
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {[
            { mood: "❤️", text: "You're genuinely one of the most caring people I know." },
            { mood: "🔥", text: "Your confidence this year is inspiring fr." },
            { mood: "🤔", text: "Why are you so fun 1-on-1 but quiet in groups?" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 16, padding: "14px 18px", maxWidth: 280 }}>
              <span style={{ fontSize: 22 }}>{m.mood}</span>
              <span style={{ fontSize: 16, color: "#cbd5e1", lineHeight: 1.5 }}>{m.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 36, padding: "10px 24px", borderRadius: 100, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
          <span style={{ color: "#22c55e", fontSize: 20, fontWeight: 800 }}>● 100% Anonymous · Free Forever · 30s Setup</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
