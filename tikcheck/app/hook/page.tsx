"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";

export default function HookPage() {
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setHooks([]); fetch('/api/track', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool:'hook'})});
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hook", input: topic }) });
    const data = await res.json();
    if (data.result) setHooks(data.result);
    setLoading(false);
  }

  function copy(i: number) {
    navigator.clipboard?.writeText(hooks[i]);
    setCopied(i); setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="🎬 Hook Generator" color="#FF0050" />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>What's your video about? Get 5 viral hooks instantly.</p>

        <textarea rows={3} value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. How I made $500 in one day as a freelancer..." />

        <motion.button whileTap={{ scale: 0.96 }} onClick={generate} disabled={loading || !topic.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: loading || !topic.trim() ? "#1a1a1a" : "linear-gradient(135deg, #FF0050, #ff4080)",
            color: loading || !topic.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !topic.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && topic.trim() ? "0 0 24px rgba(255,0,80,0.35)" : "none",
          }}>
          {loading ? "Generating..." : "✨ Generate Hooks"}
        </motion.button>

        <AnimatePresence>
          {hooks.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: "1.5px" }}>5 HOOKS GENERATED</p>
              {hooks.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: "rgba(255,0,80,0.05)", border: "1px solid rgba(255,0,80,0.15)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#FF0050", fontWeight: 800, fontSize: 12, minWidth: 20 }}>#{i + 1}</span>
                  <p style={{ flex: 1, fontSize: 14, lineHeight: 1.5, color: "#ddd" }}>{h}</p>
                  <button onClick={() => copy(i)} style={{
                    background: copied === i ? "rgba(0,242,234,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied === i ? "rgba(0,242,234,0.3)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8, padding: "4px 10px", color: copied === i ? "#00F2EA" : "#555",
                    fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                  }}>{copied === i ? "✓" : "Copy"}</button>
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
