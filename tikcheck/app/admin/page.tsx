"use client";
import { useState, useEffect, useCallback } from "react";

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS ?? "tikcheck2025";

const TOOL_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  hook:     { label: "Hook Generator",     emoji: "🎬", color: "#FF0050" },
  caption:  { label: "Caption Enhancer",   emoji: "✍️", color: "#A855F7" },
  hashtags: { label: "Hashtag Finder",     emoji: "#️⃣", color: "#FF6B35" },
  image:    { label: "Image Generator",    emoji: "🖼️", color: "#FFD700" },
};

type Stats = {
  counts: Record<string, number>;
  daily: Record<string, Record<string, number>>;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/track", { cache: "no-store" });
    const data = await res.json();
    setStats(data);
    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) { fetchStats(); const t = setInterval(fetchStats, 30000); return () => clearInterval(t); }
  }, [authed, fetchStats]);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: "2px", marginBottom: 20, textAlign: "center" }}>TIKCHECK ADMIN</p>
          <input
            type="password" placeholder="Password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && pw === PASS) setAuthed(true); }}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontFamily: "inherit", fontSize: 15, outline: "none", padding: "13px 16px", width: "100%", marginBottom: 10 }}
          />
          <button onClick={() => { if (pw === PASS) setAuthed(true); }}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: pw === PASS ? "#FF0050" : "#111", color: pw === PASS ? "white" : "#333", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
            Enter
          </button>
          {pw && pw !== PASS && <p style={{ color: "#FF0050", fontSize: 12, marginTop: 8, textAlign: "center" }}>Wrong password</p>}
        </div>
      </main>
    );
  }

  const total = stats?.counts["__total__"] ?? 0;
  const today = new Date().toISOString().split("T")[0];
  const todayTotal = stats?.daily[today] ? Object.values(stats.daily[today]).reduce((a, b) => a + b, 0) : 0;
  const tools = Object.entries(TOOL_LABELS);
  const maxCount = Math.max(...tools.map(([k]) => stats?.counts[k] ?? 0), 1);

  return (
    <main style={{ minHeight: "100vh", background: "#000", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: "2px" }}>TIKCHECK ADMIN</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "white", marginTop: 2 }}>Dashboard</p>
        </div>
        <button onClick={fetchStats} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "..." : "↻ Refresh"}
        </button>
      </div>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Generations", value: total, color: "#FF0050" },
          { label: "Today", value: todayTotal, color: "#A855F7" },
          { label: "Tools Active", value: tools.filter(([k]) => (stats?.counts[k] ?? 0) > 0).length, color: "#FF6B35" },
          { label: "Days Tracked", value: Object.keys(stats?.daily ?? {}).length, color: "#00FF87" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px" }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tool breakdown */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "1.5px", marginBottom: 16 }}>TOOL USAGE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tools.map(([key, t]) => {
            const count = stats?.counts[key] ?? 0;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "white", fontWeight: 600 }}>{t.emoji} {t.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: t.color, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily breakdown */}
      {stats?.daily && Object.keys(stats.daily).length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "1.5px", marginBottom: 14 }}>DAILY BREAKDOWN</p>
          {Object.entries(stats.daily).sort(([a], [b]) => b.localeCompare(a)).slice(0, 7).map(([date, data]) => (
            <div key={date} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 12, color: "#555" }}>{date}</span>
              <div style={{ display: "flex", gap: 8 }}>
                {Object.entries(data).map(([tool, cnt]) => (
                  <span key={tool} style={{ fontSize: 11, color: TOOL_LABELS[tool]?.color ?? "#fff", fontWeight: 600 }}>
                    {TOOL_LABELS[tool]?.emoji} {cnt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "#222", marginTop: 20 }}>
        Last refresh: {lastRefresh} · Auto-refresh every 30s
      </p>
    </main>
  );
}
