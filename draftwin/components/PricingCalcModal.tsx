"use client";

import { useState } from "react";

const PROJECT_RATES: Record<string, { beginner: [number, number]; intermediate: [number, number]; expert: [number, number]; unit: string }> = {
  "Website (basic)":     { beginner: [200, 500],   intermediate: [500, 1500],  expert: [1500, 4000],  unit: "project" },
  "Website (complex)":   { beginner: [500, 1500],  intermediate: [1500, 5000], expert: [5000, 15000], unit: "project" },
  "Mobile App":          { beginner: [800, 2000],  intermediate: [2000, 8000], expert: [8000, 25000], unit: "project" },
  "Logo Design":         { beginner: [50, 150],    intermediate: [150, 500],   expert: [500, 2000],   unit: "project" },
  "Brand Identity":      { beginner: [200, 600],   intermediate: [600, 2000],  expert: [2000, 8000],  unit: "project" },
  "Blog Article (500w)": { beginner: [15, 40],     intermediate: [40, 100],    expert: [100, 300],    unit: "article" },
  "Copywriting (page)":  { beginner: [50, 150],    intermediate: [150, 500],   expert: [500, 2000],   unit: "page" },
  "Video Editing":       { beginner: [30, 80],     intermediate: [80, 250],    expert: [250, 800],    unit: "minute" },
  "SEO Package":         { beginner: [200, 500],   intermediate: [500, 1500],  expert: [1500, 5000],  unit: "month" },
  "UI/UX Design":        { beginner: [300, 800],   intermediate: [800, 2500],  expert: [2500, 8000],  unit: "project" },
  "Data Analysis":       { beginner: [200, 600],   intermediate: [600, 1800],  expert: [1800, 6000],  unit: "project" },
  "Virtual Assistant":   { beginner: [5, 10],      intermediate: [10, 20],     expert: [20, 40],      unit: "hour" },
};

type Level = "beginner" | "intermediate" | "expert";

export default function PricingCalcModal({ onClose }: { onClose: () => void }) {
  const [projectType, setProjectType] = useState("Website (basic)");
  const [level, setLevel] = useState<Level>("intermediate");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const rate = PROJECT_RATES[projectType];
  const [low, high] = rate[level];
  const totalLow = Math.round(low * quantity);
  const totalHigh = Math.round(high * quantity);
  const midpoint = Math.round((totalLow + totalHigh) / 2);

  const snippet = `For this project, my rate is $${totalLow}–$${totalHigh} (${level}-level ${projectType.toLowerCase()}). I can deliver within the agreed timeline.`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden" style={{ maxHeight: "88vh", overflowY: "auto" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>💰 Rate Calculator</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Find your market rate — never undercharge again</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        <div className="p-5 space-y-5">

          {/* Project Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>Project Type</label>
            <select value={projectType} onChange={e => setProjectType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text)" }}>
              {Object.keys(PROJECT_RATES).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>Your Experience</label>
            <div className="grid grid-cols-3 gap-2">
              {(["beginner", "intermediate", "expert"] as Level[]).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="py-2.5 rounded-xl text-sm font-semibold cursor-pointer capitalize transition-all"
                  style={{
                    background: level === l ? "linear-gradient(135deg, var(--green), var(--green-dim))" : "var(--glass)",
                    border: `1px solid ${level === l ? "transparent" : "var(--glass-border)"}`,
                    color: level === l ? "white" : "var(--text-dim)",
                  }}>
                  {l === "beginner" ? "🌱" : l === "intermediate" ? "⚡" : "🏆"}<br />
                  <span style={{ fontSize: "11px" }}>{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          {rate.unit !== "project" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>
                Quantity ({rate.unit}s)
              </label>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
              />
            </div>
          )}

          {/* Result */}
          <div className="p-5 rounded-2xl text-center space-y-1"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
              Market Rate for {rate.unit === "project" ? "this project" : `${quantity} ${rate.unit}${quantity > 1 ? "s" : ""}`}
            </p>
            <p className="text-4xl font-extrabold" style={{ color: "var(--green)" }}>
              ${totalLow.toLocaleString()} – ${totalHigh.toLocaleString()}
            </p>
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              Sweet spot: <span className="font-bold" style={{ color: "var(--text)" }}>${midpoint.toLocaleString()}</span>
            </p>
            <div className="mt-1 flex justify-center gap-3 text-xs" style={{ color: "var(--text-faint)" }}>
              <span>🌱 ${(low * quantity).toLocaleString()}</span>
              <span>⚡ ${Math.round(((PROJECT_RATES[projectType].intermediate[0] + PROJECT_RATES[projectType].intermediate[1]) / 2) * quantity).toLocaleString()}</span>
              <span>🏆 ${(high * quantity).toLocaleString()}</span>
            </div>
          </div>

          {/* Copy snippet */}
          <div className="space-y-2">
            <p className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>📋 Paste into your proposal:</p>
            <div className="px-4 py-3 rounded-xl text-xs leading-relaxed"
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
              {snippet}
            </div>
            <button onClick={copy}
              className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              {copied ? "✅ Copied!" : "📋 Copy Snippet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
