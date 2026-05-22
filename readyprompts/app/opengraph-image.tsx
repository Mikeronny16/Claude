import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ReadyPrompts — 105 AI Prompt Kit for $2";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#05080f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #f97316, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "white",
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            ReadyPrompts
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          105 AI Prompts.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f97316, #fb923c)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            $2 only.
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 44,
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          TikTok · Instagram · Marketing · Business · Email · Personal Brand
        </div>

        {/* Category chips */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
            marginBottom: 44,
          }}
        >
          {["🎬 TikTok", "📸 Instagram", "💰 Marketing", "🏢 Business", "📧 Email", "🌟 Personal Brand"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.28)",
                color: "#fb923c",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            borderRadius: 100,
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.3)",
          }}
        >
          <span style={{ color: "#fb923c", fontSize: 22 }}>⚡</span>
          <span style={{ color: "#fb923c", fontWeight: 800, fontSize: 22 }}>
            Works with ChatGPT · Claude · Gemini · Any AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
