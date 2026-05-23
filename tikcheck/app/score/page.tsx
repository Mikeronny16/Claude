"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import VantaBackground from "../components/VantaBackground";

const ACCENT = "#FF6B00";
const ACCENT_RGBA = "rgba(255,107,0,";

type ScoreResult = {
  score: number;
  grade: string;
  good: string[];
  improve: string[];
  rewrite: string;
};

function ScoreArc({ score }: { score: number }) {
  const color = score >= 80 ? "#00FF87" : score >= 60 ? "#FFD700" : score >= 40 ? "#FF8C35" : "#FF4500";
  const label = score >= 80 ? "VIRAL READY" : score >= 60 ? "GOOD" : score >= 40 ? "NEEDS WORK" : "WEAK";
  return (
    <div style={{ textAlign: "center", margin: "8px 0 20px" }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 40px ${color}40`,
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "#0d0800", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color }}>{score}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "1px" }}>/100</span>
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "2px", marginTop: 10 }}>{label}</p>
    </div>
  );
}

export default function ScorePage() {
  const [caption, setCaption] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function analyze() {
    if (!caption.trim()) return;
    setLoading(true); setResult(null);
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "score" }) });
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "score", input: caption }) });
    const data = await res.json();
    if (data.result) setResult(data.result);
    setLoading(false);
  }

  function copyRewrite() {
    if (!result?.rewrite) return;
    navigator.clipboard?.writeText(result.rewrite);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const showEmpty = !loading && !result;

  return (
    <VantaBackground color={0xFF6B00}>
      <BackHeader title="Viral Score Checker" color={ACCENT} />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>
          Paste your caption → AI scores its viral potential 1–100.
        </p>

        <textarea rows={4} value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Paste your caption here..." />

        <motion.button whileTap={{ scale: 0.97 }} onClick={analyze} disabled={loading || !caption.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: loading || !caption.trim() ? "#0f0a00" : "linear-gradient(135deg, #FF6B00, #FF3D00)",
            color: loading || !caption.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !caption.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && caption.trim() ? `0 0 28px ${ACCENT_RGBA}0.35)` : "none",
            transition: "all 0.2s",
          }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              Analyzing...
            </span>
          ) : "⚡ Check Viral Score"}
        </motion.button>

        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 16 }}>
                WHAT WE CHECK
              </p>
              {[
                { icon: "🎣", label: "Hook Strength", desc: "Does the first line stop the scroll?" },
                { icon: "💥", label: "Emotional Pull", desc: "Does it make people feel something?" },
                { icon: "📢", label: "CTA Quality", desc: "Does it drive action?" },
                { icon: "🎯", label: "Platform Fit", desc: "Is it right for your platform?" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start", opacity: 0.4 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: "#555" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: `${ACCENT_RGBA}0.08)`, letterSpacing: "-2px" }}>SCORE 1–100</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
              <ScoreArc score={result.score} />

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{
                  background: `${ACCENT_RGBA}0.12)`, border: `1px solid ${ACCENT_RGBA}0.28)`,
                  borderRadius: 20, padding: "4px 14px",
                  fontSize: 13, fontWeight: 700, color: ACCENT,
                }}>Grade: {result.grade}</span>
              </div>

              <div style={{ background: "rgba(0,22,10,0.85)", border: "1px solid rgba(0,255,135,0.18)", borderRadius: 16, padding: "16px", marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#00FF87", letterSpacing: "1.5px", marginBottom: 10 }}>✅ WHAT'S WORKING</p>
                {result.good?.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: "#00FF87", fontSize: 12 }}>+</span>
                    <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4 }}>{g}</p>
                  </div>
                ))}
              </div>

              <div style={{
                background: "rgba(22,5,0,0.88)", border: `1px solid ${ACCENT_RGBA}0.18)`,
                borderRadius: 16, padding: "16px", marginBottom: 10,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: ACCENT, letterSpacing: "1.5px", marginBottom: 10 }}>⚠️ IMPROVE THIS</p>
                {result.improve?.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: ACCENT, fontSize: 12 }}>→</span>
                    <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4 }}>{g}</p>
                  </div>
                ))}
              </div>

              {result.rewrite && (
                <div style={{
                  background: "linear-gradient(180deg, rgba(255,107,0,0.15) 0%, rgba(18,8,0,0.90) 55%)",
                  border: `1px solid ${ACCENT_RGBA}0.22)`,
                  borderRadius: 16, padding: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: ACCENT, letterSpacing: "1.5px" }}>✨ AI REWRITE</p>
                    <button onClick={copyRewrite} style={{
                      background: copied ? `${ACCENT_RGBA}0.2)` : "rgba(255,255,255,0.06)",
                      border: `1px solid ${copied ? ACCENT_RGBA + "0.4)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 8, padding: "4px 10px",
                      color: copied ? ACCENT : "#555",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{copied ? "✓ Copied" : "Copy"}</button>
                  </div>
                  <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.65 }}>{result.rewrite}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </VantaBackground>
  );
}
