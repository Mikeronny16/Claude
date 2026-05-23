"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import VantaBackground from "../components/VantaBackground";
import { useLang } from "../contexts/LanguageContext";

const PLATFORMS = ["TikTok", "Instagram", "YouTube Shorts", "Reels"];
const ACCENT = "#FF6B00";
const ACCENT_LIGHT = "#FFAA55";
const ACCENT_RGBA = "rgba(255,107,0,";

const EXAMPLE_TAGS = {
  mega: ["#fitness", "#workout", "#gym", "#health", "#motivation"],
  medium: ["#fitnessmotivation", "#gymlife", "#workoutgoals", "#fitfam", "#bodybuilding"],
  niche: ["#homeworkout30days", "#beginnerfitness", "#noequipmentworkout"],
};

export default function HashtagsPage() {
  const { t } = useLang();
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [result, setResult] = useState<{ mega: string[]; medium: string[]; niche: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    if (!niche.trim()) return;
    setLoading(true); setResult(null);
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "hashtags" }) });
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hashtags", niche, platform }) });
    const data = await res.json();
    if (data.result) setResult(data.result);
    setLoading(false);
  }

  function copyGroup(key: string, tags: string[]) {
    navigator.clipboard?.writeText(tags.join(" "));
    setCopied(key); setTimeout(() => setCopied(null), 2000);
  }

  const groups = result ? [
    { key: "mega",   label: t.hashtags.mega,   tags: result.mega,   color: ACCENT },
    { key: "medium", label: t.hashtags.medium, tags: result.medium, color: ACCENT },
    { key: "niche",  label: t.hashtags.niche,  tags: result.niche,  color: ACCENT_LIGHT },
  ] : [];

  const showEmpty = !loading && !result;

  return (
    <VantaBackground color={0xFF6B00}>
      <BackHeader title="Hashtag Finder" color={ACCENT} />

      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{t.hashtags.subtitle}</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: "7px 14px", borderRadius: 20,
              border: `1px solid ${platform === p ? ACCENT : "rgba(255,255,255,0.08)"}`,
              background: platform === p ? `${ACCENT_RGBA}0.12)` : "transparent",
              color: platform === p ? ACCENT : "#555",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{p}</button>
          ))}
        </div>

        <input value={niche} onChange={e => setNiche(e.target.value)}
          placeholder={t.hashtags.placeholder}
          onKeyDown={e => { if (e.key === "Enter") generate(); }} />

        <motion.button whileTap={{ scale: 0.97 }} onClick={generate} disabled={loading || !niche.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: loading || !niche.trim() ? "#0f0a00" : "linear-gradient(135deg, #FF6B00, #FF3D00)",
            color: loading || !niche.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !niche.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && niche.trim() ? `0 0 28px ${ACCENT_RGBA}0.35)` : "none",
            transition: "all 0.2s",
          }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              {t.hashtags.loading}
            </span>
          ) : t.hashtags.button}
        </motion.button>

        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 14 }}>
                {t.hashtags.exampleLabel}
              </p>
              {[
                { label: t.hashtags.mega,   tags: EXAMPLE_TAGS.mega,   color: ACCENT },
                { label: t.hashtags.medium, tags: EXAMPLE_TAGS.medium, color: ACCENT },
                { label: t.hashtags.niche,  tags: EXAMPLE_TAGS.niche,  color: ACCENT_LIGHT },
              ].map((g, gi) => (
                <div key={gi} style={{ marginBottom: 12, opacity: 0.35 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: g.color, letterSpacing: "1.5px", marginBottom: 6 }}>{g.label}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.tags.map((tag, i) => (
                      <span key={i} style={{
                        background: `${g.color}18`, border: `1px solid ${g.color}28`,
                        borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#666",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: `${ACCENT_RGBA}0.1)`, letterSpacing: "-1px" }}>30 HASHTAGS</div>
                <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 2 }}>mega + medium + niche · per request</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {groups.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {groups.map((g, gi) => (
                <motion.div key={g.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}
                  style={{
                    background: "linear-gradient(180deg, rgba(255,107,0,0.07) 0%, rgba(255,107,0,0.02) 100%)",
                    border: `1px solid ${ACCENT_RGBA}0.2)`,
                    borderRadius: 18, padding: "16px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: g.color, letterSpacing: "1.5px" }}>{g.label}</span>
                    <button onClick={() => copyGroup(g.key, g.tags)} style={{
                      background: copied === g.key ? `${ACCENT_RGBA}0.2)` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${copied === g.key ? ACCENT_RGBA + "0.4)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 8, padding: "4px 10px",
                      color: copied === g.key ? ACCENT : "#555",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{copied === g.key ? t.common.copied : t.common.copyAll}</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.tags.map((tag, i) => (
                      <span key={i} style={{
                        background: `${ACCENT_RGBA}0.08)`, border: `1px solid ${ACCENT_RGBA}0.15)`,
                        borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#ccc",
                      }}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </VantaBackground>
  );
}
