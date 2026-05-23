"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import VantaBackground from "../components/VantaBackground";
import { useLang } from "../contexts/LanguageContext";

export default function HookPage() {
  const { t } = useLang();
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setHooks([]);
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: 'hook' }) });
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hook", input: topic }) });
    const data = await res.json();
    if (data.result) setHooks(data.result);
    setLoading(false);
  }

  function copy(i: number) {
    navigator.clipboard?.writeText(hooks[i]);
    setCopied(i); setTimeout(() => setCopied(null), 2000);
  }

  function useExample(ex: string) {
    setTopic(ex);
  }

  const showEmpty = !loading && hooks.length === 0;

  return (
    <VantaBackground color={0xFF0050}>
      <BackHeader title="🎬 Hook Generator" color="#FF0050" />

      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{t.hook.subtitle}</p>

        <textarea rows={3} value={topic} onChange={e => setTopic(e.target.value)}
          placeholder={t.hook.placeholder} />

        <motion.button whileTap={{ scale: 0.97 }} onClick={generate} disabled={loading || !topic.trim()}
          style={{
            marginTop: 12, width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: loading || !topic.trim() ? "#0f0f0f" : "linear-gradient(135deg, #FF0050, #ff4080)",
            color: loading || !topic.trim() ? "#333" : "white",
            fontSize: 15, fontWeight: 700, cursor: loading || !topic.trim() ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: !loading && topic.trim() ? "0 0 28px rgba(255,0,80,0.3)" : "none",
            transition: "all 0.2s",
          }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              {t.hook.loading}
            </span>
          ) : t.hook.button}
        </motion.button>

        {/* Empty state — example cards */}
        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 12 }}>
                {t.hook.exampleLabel}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {t.hook.examples.map((ex, i) => (
                  <div key={i} className="example-card" onClick={() => useExample(ex)}
                    style={{
                      background: "rgba(255,0,80,0.04)",
                      border: "1px solid rgba(255,0,80,0.1)",
                      borderRadius: 14, padding: "14px 16px",
                      display: "flex", alignItems: "flex-start", gap: 10,
                    }}>
                    <span style={{ color: "#FF0050", fontWeight: 800, fontSize: 11, minWidth: 18, opacity: 0.6 }}>#{i + 1}</span>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: "#666", flex: 1 }}>{ex}</p>
                    <span style={{ fontSize: 10, color: "#333", fontWeight: 600, flexShrink: 0, marginTop: 1 }}>tap</span>
                  </div>
                ))}
              </div>
              {/* Decorative stat */}
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "rgba(255,0,80,0.12)", letterSpacing: "-2px" }}>5 HOOKS</div>
                <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 2 }}>generated per request · free forever</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {hooks.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "2px" }}>{t.hook.resultLabel}</p>
              {hooks.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  style={{
                    background: "rgba(255,0,80,0.05)", border: "1px solid rgba(255,0,80,0.12)",
                    borderRadius: 16, padding: "14px 16px",
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                  <span style={{ color: "#FF0050", fontWeight: 800, fontSize: 12, minWidth: 20 }}>#{i + 1}</span>
                  <p style={{ flex: 1, fontSize: 14, lineHeight: 1.55, color: "#ddd" }}>{h}</p>
                  <button onClick={() => copy(i)} style={{
                    background: copied === i ? "rgba(0,242,234,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied === i ? "rgba(0,242,234,0.3)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8, padding: "5px 10px",
                    color: copied === i ? "#00F2EA" : "#555",
                    fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                  }}>{copied === i ? t.common.copied : t.common.copy}</button>
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
