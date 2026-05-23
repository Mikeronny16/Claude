"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";
import VantaBackground from "../components/VantaBackground";

const PLATFORMS = ["TikTok", "Instagram", "YouTube Shorts", "Facebook"];
const ACCENT = "#FF6B00";
const ACCENT_RGBA = "rgba(255,107,0,";

type DayEntry = { day: number; type: string; idea: string; hook: string };

const TYPE_COLORS: Record<string, string> = {
  Tutorial: "#FF8C35",
  POV: "#FF5500",
  Story: "#FFAA55",
  Tips: "#FFD080",
  Challenge: "#FF6B00",
  Trend: "#FFC040",
  "Behind the scenes": "#FF7A20",
  "Q&A": "#FFBB60",
  Motivation: "#FF9030",
  Reaction: "#FF7040",
};

export default function CalendarPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [days, setDays] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function generate() {
    if (!niche.trim()) return;
    setLoading(true); setDays([]);
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "calendar" }) });
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "calendar", niche, platform }) });
    const data = await res.json();
    if (Array.isArray(data.result)) setDays(data.result.slice(0, 30));
    setLoading(false);
  }

  function copyDay(d: DayEntry) {
    navigator.clipboard?.writeText(`Day ${d.day} — ${d.type}\n${d.idea}\nHook: "${d.hook}"`);
    setCopied(d.day); setTimeout(() => setCopied(null), 2000);
  }

  const showEmpty = !loading && days.length === 0;
  const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return (
    <VantaBackground color={0xFF6B00}>
      <BackHeader title="30-Day Calendar" color={ACCENT} />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>
          Get 30 content ideas planned out — one per day, ready to execute.
        </p>

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
          placeholder="Your niche (e.g. fitness, food, travel, finance...)"
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
              Building your calendar...
            </span>
          ) : "📅 Generate 30-Day Calendar"}
        </motion.button>

        <AnimatePresence>
          {showEmpty && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 28 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#333", letterSpacing: "2px", marginBottom: 14 }}>
                CONTENT TYPES INCLUDED
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, opacity: 0.4 }}>
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                  <span key={type} style={{
                    background: `${color}10`, border: `1px solid ${color}25`,
                    borderRadius: 20, padding: "5px 12px",
                    fontSize: 11, fontWeight: 600, color,
                  }}>{type}</span>
                ))}
              </div>
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: `${ACCENT_RGBA}0.1)`, letterSpacing: "-1px" }}>30 IDEAS</div>
                <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 2 }}>one month of content · free</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {days.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 20 }}>
              {WEEK_LABELS.map((wk, wi) => {
                const weekDays = days.slice(wi * 7, wi * 7 + 7);
                if (weekDays.length === 0) return null;
                return (
                  <div key={wi} style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "2px", marginBottom: 8 }}>{wk}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {weekDays.map((d, i) => {
                        const color = TYPE_COLORS[d.type] ?? ACCENT;
                        const isExpanded = expanded === d.day;
                        return (
                          <motion.div key={d.day}
                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (wi * 7 + i) * 0.025 }}
                            onClick={() => setExpanded(isExpanded ? null : d.day)}
                            style={{
                              background: isExpanded
                                ? "linear-gradient(180deg, rgba(255,107,0,0.15) 0%, rgba(18,8,0,0.90) 55%)"
                                : "rgba(20,8,0,0.78)",
                              border: `1px solid ${isExpanded ? ACCENT_RGBA + "0.25)" : ACCENT_RGBA + "0.1)"}`,
                              borderRadius: 14, padding: "12px 14px",
                              cursor: "pointer", transition: "all 0.15s",
                            }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                background: `${color}15`, border: `1px solid ${color}30`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 800, color,
                              }}>{d.day}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "1px" }}>{d.type}</span>
                                <p style={{ fontSize: 13, color: "#ccc", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                                  {d.idea}
                                </p>
                              </div>
                              <button onClick={e => { e.stopPropagation(); copyDay(d); }}
                                style={{
                                  background: copied === d.day ? `${ACCENT_RGBA}0.2)` : "rgba(255,255,255,0.05)",
                                  border: `1px solid ${copied === d.day ? ACCENT_RGBA + "0.4)" : "rgba(255,255,255,0.08)"}`,
                                  borderRadius: 7, padding: "4px 8px", flexShrink: 0,
                                  color: copied === d.day ? ACCENT : "#444",
                                  fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                }}>{copied === d.day ? "✓" : "Copy"}</button>
                            </div>
                            {isExpanded && (
                              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${ACCENT_RGBA}0.1)` }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "#444", marginBottom: 4, letterSpacing: "1px" }}>HOOK</p>
                                <p style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>"{d.hook}"</p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </VantaBackground>
  );
}
