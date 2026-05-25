import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Toynar — Turn Yourself into a Collectible Toy with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%)",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />

        {/* Emoji decoration */}
        <div style={{ fontSize: 80, marginBottom: 24 }}>🧸</div>

        {/* Headline */}
        <div style={{ fontSize: 68, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 16, maxWidth: 900 }}>
          Turn Yourself Into a{" "}
          <span style={{ color: "#A78BFA" }}>Collectible Toy</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#6B7280", textAlign: "center", marginBottom: 44, maxWidth: 700 }}>
          Upload your photo · AI transforms you in ~40 seconds · Download free
        </div>

        {/* Style chips */}
        <div style={{ display: "flex", gap: 14 }}>
          {[["🧸", "Kawaii Plushie"], ["⚔️", "Action Figure"], ["🪆", "Soft Plushie"], ["🤖", "Robot"]].map(([emoji, label]) => (
            <div key={String(label)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 100, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#A78BFA" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 36, padding: "10px 24px", borderRadius: 100, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
          <span style={{ color: "#C4B5FD", fontSize: 20, fontWeight: 800 }}>✓ Free · No account needed · 10K+ toys made</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
