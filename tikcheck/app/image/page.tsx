"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import { useLang } from "../contexts/LanguageContext";

const STYLES_EN = ["Cinematic", "Anime", "Realistic", "Digital Art", "Minimalist", "Vintage"];
const STYLE_COLORS = ["#FFD700", "#FF6B9D", "#00D4FF", "#A855F7", "#888", "#D4A843"];

export default function ImagePage() {
  const { t } = useLang();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true); setImgUrl("");
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "image" }) });
    const fullPrompt = encodeURIComponent(`${prompt}, ${style} style, high quality, detailed`);
    const url = `https://image.pollinations.ai/prompt/${fullPrompt}?width=768&height=768&nologo=true&seed=${Date.now()}`;
    setImgUrl(url);
    setLoading(false);
  }

  const showEmpty = !loading && !imgUrl;

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="🖼️ AI Image Generator" color="#FFD700" />

      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{t.image.subtitle}</p>

        {/* Style selector */}
        <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 8 }}>{t.image.styleLabel}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {STYLES_EN.map((s, i) => (
            <button key={s} onClick={() => setStyle(s)} style={{
              padding: "7px 14px", borderRadius: 20,
              border: `1px solid ${style === s ? STYLE_COLORS[i] : "rgba(255,255,255,0.08)"}`,
              background: style === s ? `${STYLE_COLORS[i]}15` : "transparent",
              color: style === s ? STYLE_COLORS[i] : "#555",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>

        <textarea rows={3} value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder={t.image.placeholder} />

        <motion.button whileTap={{ scale: 0.97 }} onClick={generate} disabled={loading || !prompt.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: loading || !prompt.trim() ? "#0f0f0f" : "linear-gradient(135deg, #FFD700, #ff4080)",
            color: loading || !prompt.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !prompt.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && prompt.trim() ? "0 0 28px rgba(255,215,0,0.25)" : "none",
            transition: "all 0.2s",
          }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              {t.image.loading}
            </span>
          ) : t.image.button}
        </motion.button>

        {/* Empty state — style preview cards */}
        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 14 }}>
                STYLE PREVIEW
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {STYLES_EN.map((s, i) => (
                  <div key={s} onClick={() => setStyle(s)}
                    style={{
                      borderRadius: 14, padding: "24px 8px 12px",
                      border: `1px solid ${style === s ? STYLE_COLORS[i] + "60" : "rgba(255,255,255,0.06)"}`,
                      background: style === s ? `${STYLE_COLORS[i]}10` : "rgba(255,255,255,0.02)",
                      textAlign: "center", cursor: "pointer",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>
                      {["🎬", "🎌", "📷", "💻", "◻️", "📽️"][i]}
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: style === s ? STYLE_COLORS[i] : "#444" }}>{s}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,215,0,0.08)", letterSpacing: "-1px" }}>FREE AI ART</div>
                <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 2 }}>powered by pollinations.ai · no account needed</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {imgUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 24 }}>
              <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,215,0,0.2)", position: "relative" }}>
                <Image src={imgUrl} alt="Generated" width={768} height={768}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  unoptimized onLoad={() => setLoading(false)} />
              </div>
              <a href={imgUrl} download="tikcheck-image.jpg" target="_blank" rel="noreferrer"
                style={{
                  display: "block", marginTop: 12, width: "100%", padding: "13px",
                  borderRadius: 14, textAlign: "center",
                  background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)",
                  color: "#FFD700", fontSize: 14, fontWeight: 700, textDecoration: "none",
                }}>
                {t.image.download}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}
