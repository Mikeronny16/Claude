"use client";

import { useState, useEffect, useCallback } from "react";

type Stats = {
  users: { total: number; today: number; week: number };
  messages: { total: number; today: number; week: number };
  views: { total: number; today: number };
  msgsByDay: { day: string; count: number }[];
  usersByDay: { day: string; count: number }[];
  recentUsers: { id: string; username: string; display_name: string; avatar_emoji: string; created_at: string }[];
  topUsers: { id: string; username: string; display_name: string; avatar_emoji: string; msgCount: number }[];
};

const a = "#06b6d4";

function StatCard({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "1rem", padding: "1.25rem" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(6,182,212,0.7)", marginBottom: "0.4rem" }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: highlight ? a : "#f0f9ff", lineHeight: 1 }}>{value.toLocaleString()}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: "rgba(240,249,255,0.4)", marginTop: "0.3rem" }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ data, color }: { data: { day: string; count: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "60px" }}>
      {data.map(d => (
        <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div
            title={`${d.day}: ${d.count}`}
            style={{
              width: "100%",
              height: `${Math.max(4, (d.count / max) * 52)}px`,
              background: color,
              borderRadius: "3px 3px 0 0",
              opacity: 0.85,
              transition: "height 0.5s ease",
            }}
          />
          <div style={{ fontSize: "0.55rem", color: "rgba(240,249,255,0.3)", whiteSpace: "nowrap" }}>
            {d.day.slice(5)}
          </div>
        </div>
      ))}
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminPage() {
  const [pwd, setPwd] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = useCallback(async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?pwd=${encodeURIComponent(password)}`);
      if (res.status === 401) { setError("Wrong password"); setAuthed(false); return; }
      if (!res.ok) { setError("Failed to load stats"); return; }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
      setLastRefresh(new Date());
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    fetchStats(pwd);
  }

  // Auto-refresh every 60s when authed
  useEffect(() => {
    if (!authed || !pwd) return;
    const interval = setInterval(() => fetchStats(pwd), 60000);
    return () => clearInterval(interval);
  }, [authed, pwd, fetchStats]);

  // Login screen
  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
            <h1 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#f0f9ff" }}>Whispr Admin</h1>
            <p style={{ fontSize: "0.8rem", color: "rgba(240,249,255,0.4)", marginTop: "0.25rem" }}>Private insight panel</p>
          </div>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Admin password"
              autoFocus
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.05)", color: "#f0f9ff", fontSize: "1rem", outline: "none" }}
            />
            {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center" }}>{error}</p>}
            <button type="submit" disabled={loading || !pwd}
              style={{ padding: "0.85rem", borderRadius: "0.75rem", background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, border: "none" }}>
              {loading ? "Loading..." : "Enter →"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!stats) return null;

  return (
    <main style={{ minHeight: "100vh", padding: "1.5rem", maxWidth: "800px", margin: "0 auto", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#f0f9ff" }}>👻 Whispr Insights</h1>
          {lastRefresh && (
            <p style={{ fontSize: "0.7rem", color: "rgba(240,249,255,0.3)", marginTop: "0.15rem" }}>
              Last updated {lastRefresh.toLocaleTimeString()} · auto-refreshes every 60s
            </p>
          )}
        </div>
        <button onClick={() => fetchStats(pwd)} disabled={loading}
          style={{ padding: "0.5rem 1rem", borderRadius: "0.75rem", border: `1px solid rgba(6,182,212,0.3)`, background: "rgba(6,182,212,0.05)", color: a, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          {loading ? "Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Users" value={stats.users.total} sub={`+${stats.users.today} today`} />
        <StatCard label="This Week" value={stats.users.week} sub="new users" highlight />
        <StatCard label="Total Messages" value={stats.messages.total} sub={`+${stats.messages.today} today`} />
        <StatCard label="Msgs This Week" value={stats.messages.week} highlight />
        <StatCard label="Page Views" value={stats.views.total} sub={`+${stats.views.today} today`} />
        <StatCard label="Views Today" value={stats.views.today} highlight />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(6,182,212,0.7)", marginBottom: "0.75rem" }}>Messages — Last 7 Days</p>
          <MiniBar data={stats.msgsByDay} color="rgba(6,182,212,0.7)" />
        </div>
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(59,130,246,0.8)", marginBottom: "0.75rem" }}>New Users — Last 7 Days</p>
          <MiniBar data={stats.usersByDay} color="rgba(59,130,246,0.7)" />
        </div>
      </div>

      {/* Top Users + Recent Signups */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>

        {/* Top by messages */}
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(6,182,212,0.7)", marginBottom: "0.75rem" }}>🏆 Top by Messages</p>
          {stats.topUsers.length === 0 ? (
            <p style={{ fontSize: "0.75rem", color: "rgba(240,249,255,0.3)" }}>No data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {stats.topUsers.map((u, i) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(240,249,255,0.3)", width: "14px" }}>{i + 1}</span>
                  <span style={{ fontSize: "1.1rem" }}>{u.avatar_emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f0f9ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.display_name}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(240,249,255,0.35)" }}>@{u.username}</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: a }}>{u.msgCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent signups */}
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "1rem", padding: "1rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(59,130,246,0.8)", marginBottom: "0.75rem" }}>🆕 Recent Signups</p>
          {stats.recentUsers.length === 0 ? (
            <p style={{ fontSize: "0.75rem", color: "rgba(240,249,255,0.3)" }}>No users yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {stats.recentUsers.slice(0, 5).map(u => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{u.avatar_emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f0f9ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.display_name}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(240,249,255,0.35)" }}>@{u.username}</p>
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "rgba(240,249,255,0.3)" }}>{timeAgo(u.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(240,249,255,0.2)", marginTop: "2rem" }}>
        Whispr Admin · Private · Do not share this URL
      </p>
    </main>
  );
}
