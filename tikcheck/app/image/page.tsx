"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";

const STYLES = ["Cinematic", "Anime", "Realistic", "Digital Art", "Minimalist", "Vintage"];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true); setImgUrl("");
    const fullPrompt = encodeURIComponent(`${prompt}, ${style} style, high quality, detailed`);
    const url = `https://image.pollinations.ai/prompt/${fullPrompt}?width=768&height=768&nologo=true&seed=${Date.now()}`;
    setImgUrl(url);
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="🖼️ AI Image Generator" color="#FF0050" />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Free AI images for your posts. No account needed.</p>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#444", letterSpacing: "1px", marginBottom: 8 }}>STYLE</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STYLES.map(s => (
              <button key={s} onClick={() => setStyle(s)} style={{
                padding: "7px 14px", borderRadius: 20, border: `1px solid ${style === s ? "#FF0050" : "rgba(255,255,255,0.08)"}`,
                background: style === s ? "rgba(255,0,80,0.12)" : "transparent",
                color: style === s ? "#FF0050" : "#555", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>{s}</button>
            ))}
          </div>
        </div>

        <textarea rows={3} value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your image... e.g. A creator recording in a neon-lit studio" />

        <motion.button whileTap={{ scale: 0.96 }} onClick={generate} disabled={loading || !prompt.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: loading || !prompt.trim() ? "#1a1a1a" : "linear-gradient(135deg, #FF0050, #ff4080)",
            color: loading || !prompt.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !prompt.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && prompt.trim() ? "0 0 24px rgba(255,0,80,0.35)" : "none",
          }}>
          {loading ? "Generating..." : "🎨 Generate Image"}
        </motion.button>

        <AnimatePresence>
          {imgUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 24 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,0,80,0.2)", position: "relative" }}>
                <Image src={imgUrl} alt="Generated" width={768} height={768}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  unoptimized onLoad={() => setLoading(false)} />
              </div>
              <a href={imgUrl} download="tikcheck-image.jpg" target="_blank" rel="noreferrer"
                style={{
                  display: "block", marginTop: 12, width: "100%", padding: "13px", borderRadius: 14, textAlign: "center",
                  background: "rgba(255,0,80,0.1)", border: "1px solid rgba(255,0,80,0.25)",
                  color: "#FF0050", fontSize: 14, fontWeight: 700, textDecoration: "none",
                }}>
                ⬇️ Download Image
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </main>
  );
}
