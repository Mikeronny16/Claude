"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import VantaBackground from "../components/VantaBackground";
import { useLang } from "../contexts/LanguageContext";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Twitter"];

export default function CaptionPage() {
  const { t } = useLang();
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

  const showEmpty = !loading && !result;

  return (
    <VantaBackground color={0xA855F7}>
      <BackHeader title="✍️ Caption Enhancer" color="#A855F7" />

      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{t.caption.subtitle}</p>

        {/* Platform selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: "7px 14px", borderRadius: 20,
              border: `1px solid ${platform === p ? "#A855F7" : "rgba(255,255,255,0.08)"}`,
              background: platform === p ? "rgba(168,85,247,0.12)" : "transparent",
              color: platform === p ? "#A855F7" : "#555",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{p}</button>
          ))}
        </div>

        <textarea rows={4} value={caption} onChange={e => setCaption(e.target.value)}
          placeholder={t.caption.placeholder} />

        <motion.button whileTap={{ scale: 0.97 }} onClick={enhance} disabled={loading || !caption.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: loading || !caption.trim() ? "#0f0f0f" : "linear-gradient(135deg, #A855F7, #00c4be)",
            color: loading || !caption.trim() ? "#333" : "#000",
            fontSize: 15, fontWeight: 700, cursor: loading || !caption.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && caption.trim() ? "0 0 28px rgba(168,85,247,0.3)" : "none",
            transition: "all 0.2s",
          }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#000", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              {t.caption.loading}
            </span>
          ) : t.caption.button}
        </motion.button>

        {/* Empty state — before/after example */}
        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 12 }}>
                {t.caption.exampleLabel}
              </p>

              {/* Before card */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "12px 14px", marginBottom: 6, opacity: 0.5,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "1.5px", marginBottom: 6 }}>BEFORE</p>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{t.caption.exampleBefore}</p>
              </div>

              {/* Arrow */}
              <div style={{ textAlign: "center", fontSize: 18, color: "#A855F7", opacity: 0.4, margin: "4px 0" }}>↓</div>

              {/* After card */}
              <div style={{
                background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)",
                borderRadius: 14, padding: "12px 14px", opacity: 0.5,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#A855F7", letterSpacing: "1.5px", marginBottom: 6 }}>AFTER ✨</p>
                <p style={{ fontSize: 13, color: "#999", lineHeight: 1.5 }}>{t.caption.exampleAfter}</p>
              </div>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(168,85,247,0.1)", letterSpacing: "-1px" }}>VIRAL READY</div>
                <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 2 }}>AI-enhanced for {platform} algorithm</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
              <div style={{
                background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.2)",
                borderRadius: 18, padding: "18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#A855F7", letterSpacing: "2px" }}>{t.caption.resultLabel}</span>
                  <button onClick={copy} style={{
                    background: copied ? "rgba(0,242,234,0.2)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied ? "rgba(0,242,234,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8, padding: "5px 12px",
                    color: copied ? "#A855F7" : "#555",
                    fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>{copied ? t.common.copied : t.common.copy}</button>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#ddd", whiteSpace: "pre-wrap" }}>{result.caption}</p>
                {result.cta && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                    <span style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: "1px" }}>{t.caption.ctaLabel}: </span>
                    <span style={{ fontSize: 13, color: "#A855F7" }}>{result.cta}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </VantaBackground>
  );
}
