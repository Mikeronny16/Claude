"use client";

import { useState, useEffect, useCallback } from "react";
import { SCRIPTS } from "@/lib/scripts";

type CountryRow  = { key: string; total: number };
type ReferrerRow = { key: string; total: number };
type Analytics = {
  visitors: number; pageviews: number; bounce_rate: number;
  countries: CountryRow[]; referrers: ReferrerRow[];
  error?: string;
};

const CATEGORIES = Array.from(new Set(SCRIPTS.map((s) => s.category)));

export default function AdminPage() {
  const [pass, setPass]           = useState("");
  const [authed, setAuthed]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState<"traffic" | "scripts">("traffic");
  const [openCat, setOpenCat]     = useState<string | null>(CATEGORIES[0]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [aLoading, setALoading]   = useState(false);

  const fetchAnalytics = useCallback(async (password: string) => {
    setALoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?pass=${encodeURIComponent(password)}`);
      setAnalytics(await res.json());
    } catch {
      setAnalytics({ visitors: 0, pageviews: 0, bounce_rate: 0, countries: [], referrers: [], error: "fetch_error" });
    } finally {
      setALoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/analytics?pass=${encodeURIComponent(pass)}`);
    if (res.status === 401) {
      setError("Wrong password");
      setLoading(false);
      return;
    }
    setAnalytics(await res.json());
    setAuthed(true);
    setLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchAnalytics(pass), 60000);
    return () => clearInterval(interval);
  }, [authed, pass, fetchAnalytics]);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5" style={{ background: "#0d1117" }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>C</div>
            <span className="font-bold text-white">ColdDM Admin</span>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-6"
            style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
            <h1 className="text-lg font-black text-white mb-5">Admin Access</h1>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl text-sm text-white mb-3 outline-none"
              style={{ background: "rgba(10,14,22,0.8)", border: "1px solid #1e2a3d" }}
              autoFocus />
            {error && <p className="text-xs mb-3" style={{ color: "#ef4444" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 font-bold rounded-xl text-white text-sm btn-blue">
              {loading ? "Checking..." : "Enter"}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: "#334155" }}>
              Default: cdm_admin_2025 (set ADMIN_PASSWORD env var to change)
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#0d1117" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>C</div>
            <span className="font-bold text-white text-sm">ColdDM Admin</span>
          </div>
          <button onClick={() => setAuthed(false)}
            className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "#64748b", background: "rgba(30,42,61,0.5)" }}>
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {([
            { key: "traffic", label: "📊 Traffic" },
            { key: "scripts", label: `📋 Scripts (${SCRIPTS.length})` },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === key ? "rgba(59,130,246,0.15)" : "rgba(16,21,35,0.8)",
                color: activeTab === key ? "#60a5fa" : "#64748b",
                border: `1px solid ${activeTab === key ? "rgba(59,130,246,0.3)" : "#1e2a3d"}`,
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Traffic Tab */}
        {activeTab === "traffic" && (
          <div>
            {aLoading ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm" style={{ color: "#64748b" }}>Loading analytics...</p>
              </div>
            ) : analytics?.error === "no_token" ? (
              <div className="rounded-2xl p-6" style={{ background: "#161b27", border: "1px solid rgba(59,130,246,0.2)" }}>
                <p className="text-2xl mb-3">🔑</p>
                <h3 className="font-black text-white mb-2 text-base">Setup Required</h3>
                <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
                  Add <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>VERCEL_TOKEN</code> to your Vercel environment variables.
                </p>
                <ol className="text-sm space-y-2 mb-5" style={{ color: "#64748b" }}>
                  <li>1. vercel.com → Account Settings → <strong style={{ color: "#94a3b8" }}>Tokens</strong> → Create Token</li>
                  <li>2. Project → Settings → <strong style={{ color: "#94a3b8" }}>Environment Variables</strong></li>
                  <li>3. Add <code className="text-xs px-1 rounded" style={{ background: "rgba(30,42,61,0.8)", color: "#94a3b8" }}>VERCEL_TOKEN</code> → Redeploy</li>
                </ol>
                <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer"
                  className="inline-block text-xs px-4 py-2 rounded-lg font-bold"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}>
                  Open Vercel Tokens →
                </a>
              </div>
            ) : analytics && !analytics.error ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Visitors",    value: analytics.visitors.toLocaleString(),                    color: "#3b82f6" },
                    { label: "Page Views",  value: analytics.pageviews.toLocaleString(),                   color: "#60a5fa" },
                    { label: "Bounce Rate", value: `${Math.round((analytics.bounce_rate || 0) * 100)}%`,  color: "#a78bfa" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl p-4 text-center"
                      style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
                      <div className="text-xs font-semibold text-white">{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#334155" }}>7 days</div>
                    </div>
                  ))}
                </div>

                {analytics.countries.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>🌍 Top Countries</p>
                    <div className="space-y-2">
                      {analytics.countries.map((c, i) => {
                        const pct = Math.round((c.total / analytics.countries[0].total) * 100);
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{c.key || "Unknown"}</span>
                              <span className="text-xs font-bold" style={{ color: "#3b82f6" }}>{c.total.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30,42,61,0.8)" }}>
                              <div className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: i === 0 ? "linear-gradient(90deg, #3b82f6, #60a5fa)" : "rgba(59,130,246,0.3)" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {analytics.referrers.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>🔗 Top Referrers</p>
                    <div className="space-y-2">
                      {analytics.referrers.map((r) => (
                        <div key={r.key} className="flex items-center justify-between">
                          <span className="text-sm truncate mr-3 max-w-[70%]" style={{ color: "#94a3b8" }}>{r.key || "Direct"}</span>
                          <span className="text-xs font-bold flex-shrink-0" style={{ color: "#60a5fa" }}>{r.total.toLocaleString()} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button onClick={() => fetchAnalytics(pass)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(30,42,61,0.6)", color: "#64748b" }}>
                    🔄 Refresh
                  </button>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                    Full Analytics on Vercel →
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#161b27", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-2xl mb-2">⚠️</p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>Could not load analytics. Check VERCEL_TOKEN permissions.</p>
                <button onClick={() => fetchAnalytics(pass)} className="mt-3 text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>Retry</button>
              </div>
            )}
          </div>
        )}

        {/* Scripts Tab */}
        {activeTab === "scripts" && (
          <div>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              These are the exact scripts buyers receive after payment.
            </p>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const catScripts = SCRIPTS.filter((s) => s.category === cat);
                const isOpen = openCat === cat;
                return (
                  <div key={cat} className="rounded-xl overflow-hidden"
                    style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                    <button onClick={() => setOpenCat(isOpen ? null : cat)}
                      className="w-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cat}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                          {catScripts.length}
                        </span>
                      </div>
                      <span style={{ color: "#3b82f6" }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        {catScripts.map((s) => (
                          <div key={s.id} className="rounded-xl p-3"
                            style={{ background: "rgba(10,14,22,0.8)", border: "1px solid #1e2a3d" }}>
                            <p className="text-xs font-bold mb-1.5" style={{ color: "#60a5fa" }}>
                              {s.id}. {s.title}
                            </p>
                            <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#64748b" }}>
                              {s.script}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-center mt-6" style={{ color: "#1e2a3d" }}>
          Auto-refreshes every 60s · ColdDM Admin
        </p>
      </div>
    </main>
  );
}
