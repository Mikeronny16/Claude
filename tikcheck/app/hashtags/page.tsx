"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";

const PLATFORMS = ["TikTok", "Instagram", "YouTube Shorts", "Reels"];

export default function HashtagsPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [result, setResult] = useState<{ mega: string[]; medium: string[]; niche: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    if (!niche.trim()) return;
    setLoading(true); setResult(null);
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
    { key: "mega", label: "MEGA (1M+)", tags: result.mega, color: "#FF0050" },
    { key: "medium", label: "MEDIUM (100K-1M)", tags: result.medium, color: "#FF0050" },
    { key: "niche", label: "NICHE (<100K)", tags: result.niche, color: "#00F2EA" },
  ] : [];

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="#️⃣ Hashtag Finder" color="#FF0050" />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>30 hashtags — mega, medium & niche for max reach.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: "7px 14px", borderRadius: 20, border: `1px solid ${platform === p ? "#FF0050" : "rgba(255,255,255,0.08)"}`,
              background: platform === p ? "rgba(255,0,80,0.12)" : "transparent",
              color: platform === p ? "#FF0050" : "#555", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{p}</button>
          ))}
        </div>

        <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Your niche (e.g. fitness, cooking, travel...)" />

        <motion.button whileTap={{ scale: 0.96 }} onClick={generate} disabled={loading || !niche.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: loading || !niche.trim() ? "#1a1a1a" : "linear-gradient(135deg, #FF0050, #ff4080)",
            color: loading || !niche.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !niche.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && niche.trim() ? "0 0 24px rgba(255,0,80,0.35)" : "none",
          }}>
          {loading ? "Finding..." : "🔍 Find Hashtags"}
        </motion.button>

        <AnimatePresence>
          {groups.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {groups.map((g, gi) => (
                <motion.div key={g.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${g.color}25`, borderRadius: 16, padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: g.color, letterSpacing: "1.5px" }}>{g.label}</span>
                    <button onClick={() => copyGroup(g.key, g.tags)} style={{
                      background: copied === g.key ? `${g.color}20` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${copied === g.key ? g.color + "40" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 8, padding: "4px 10px",
                      color: copied === g.key ? g.color : "#555",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{copied === g.key ? "✓ Copied" : "Copy All"}</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.tags.map((tag, i) => (
                      <span key={i} style={{ background: `${g.color}12`, border: `1px solid ${g.color}20`, borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#ccc" }}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </main>
  );
}
