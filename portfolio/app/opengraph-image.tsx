import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mike Ronny — Developer & Founder from Myanmar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px 80px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,107,0,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 80% 80% at 70% 50%, black 0%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 70% 50%, black 0%, transparent 75%)" }} />
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#555", letterSpacing: "0.1em" }}>CREATOR + DEVELOPER</span>
        </div>

        {/* Name ghost */}
        <div style={{ position: "absolute", top: 20, left: 60, fontSize: 160, fontWeight: 700, color: "rgba(255,255,255,0.018)", letterSpacing: "-0.05em", lineHeight: 0.85 }}>MIKE</div>

        {/* Headline */}
        <div style={{ fontSize: 70, fontWeight: 700, color: "white", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20 }}>
          Designing & building<br />
          <span style={{ color: "#FF6B00" }}>for the creator</span><br />
          economy.
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 22, color: "#555", marginBottom: 40, maxWidth: 500, lineHeight: 1.6 }}>
          Mike Ronny — Developer & founder from Myanmar. Building digital tools used by creators across Southeast Asia.
        </div>

        {/* Products */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Ronnix AI", "DraftWin", "Whispr", "TikCheck", "Spawn AI"].map(p => (
            <div key={p} style={{ padding: "6px 16px", borderRadius: 100, background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)", color: "#FF6B00", fontSize: 16, fontWeight: 600 }}>{p}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
