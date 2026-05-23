"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Twitter"];

export default function CaptionPage() {
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [result, setResult] = useState<{ caption: string; cta: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function enhance() {
    if (!caption.trim()) return;
    setLoading(true); setResult(null);
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "caption", input: caption, platform }) });
    const data = await res.json();
    if (data.result) setResult(data.result);
    setLoading(false);
  }

  function copy() {
    if (!result) return;
    navigator.clipboard?.writeText(result.caption);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="✍️ Caption Enhancer" color="#A855F7" />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Paste your caption → AI makes it viral-ready.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: "7px 14px", borderRadius: 20, border: `1px solid ${platform === p ? "#A855F7" : "rgba(255,255,255,0.08)"}`,
              background: platform === p ? "rgba(0,242,234,0.12)" : "transparent",
              color: platform === p ? "#A855F7" : "#555", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{p}</button>
          ))}
        </div>

        <textarea rows={4} value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Paste your caption here..." />

        <motion.button whileTap={{ scale: 0.96 }} onClick={enhance} disabled={loading || !caption.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: loading || !caption.trim() ? "#1a1a1a" : "linear-gradient(135deg, #A855F7, #00c4be)",
            color: loading || !caption.trim() ? "#333" : "#000",
            fontSize: 15, fontWeight: 700, cursor: loading || !caption.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && caption.trim() ? "0 0 24px rgba(0,242,234,0.3)" : "none",
          }}>
          {loading ? "Enhancing..." : "✨ Enhance Caption"}
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
              <div style={{ background: "rgba(0,242,234,0.05)", border: "1px solid rgba(0,242,234,0.2)", borderRadius: 16, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#A855F7", letterSpacing: "1.5px" }}>ENHANCED CAPTION</span>
                  <button onClick={copy} style={{
                    background: copied ? "rgba(0,242,234,0.2)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied ? "rgba(0,242,234,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8, padding: "5px 12px", color: copied ? "#A855F7" : "#555",
                    fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>{copied ? "✓ Copied" : "Copy"}</button>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#ddd", whiteSpace: "pre-wrap" }}>{result.caption}</p>
                {result.cta && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                    <span style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>CTA SUGGESTION: </span>
                    <span style={{ fontSize: 13, color: "#A855F7" }}>{result.cta}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </main>
  );
}
