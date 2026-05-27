"use client";

import { useState, useEffect, useCallback } from "react";
import { PROMPTS } from "@/lib/prompts";

type Order = {
  id: string;
  email: string;
  name: string;
  method: string;
  status: string;
  created_at: string;
};

type Stats = {
  payments: never[];
  total_usd: number;
  count: number;
  total_count: number;
  error?: string;
};

type CountryRow = { key: string; total: number };
type ReferrerRow = { key: string; total: number };

type Analytics = {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  countries: CountryRow[];
  referrers: ReferrerRow[];
  error?: string;
  detail?: unknown;
};


const CATEGORIES = [...new Set(PROMPTS.map((p) => p.category))];

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"payments" | "traffic" | "prompts">("payments");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(CATEGORIES[0]);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (password: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders/list?pass=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (res.status !== 401) setOrders(data.orders || []);
    } catch { /* ignore */ } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?pass=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (res.status === 401) {
        setError("Wrong password");
        setAuthed(false);
      } else {
        setStats(data);
        setAuthed(true);
        setError("");
        fetchOrders(password);
      }
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const fetchAnalytics = useCallback(async (password: string) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?pass=${encodeURIComponent(password)}`);
      const data = await res.json();
      setAnalytics(data);
    } catch {
      setAnalytics({ visitors: 0, pageviews: 0, bounce_rate: 0, countries: [], referrers: [], error: "fetch_error" });
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(pass);
  };

  useEffect(() => {
    if (!authed) return;
    fetchAnalytics(pass);
    const interval = setInterval(() => { fetchStats(pass); fetchOrders(pass); }, 60000);
    return () => clearInterval(interval);
  }, [authed, pass, fetchStats, fetchAnalytics, fetchOrders]);

  useEffect(() => {
    if (activeTab === "traffic" && authed && !analytics) {
      fetchAnalytics(pass);
    }
  }, [activeTab, authed, analytics, pass, fetchAnalytics]);

  if (!authed) {
    return (
      <main className="min-h-screen bg-cinema-bg flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
            <span className="font-bold text-white">ReadyPrompts Admin</span>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-6"
            style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
            <h1 className="text-lg font-black text-white mb-5">Admin Access</h1>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl text-sm text-white mb-3 outline-none"
              style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.8)" }}
              autoFocus
            />
            {error && <p className="text-xs mb-3" style={{ color: "#ef4444" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 font-bold rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              {loading ? "Checking..." : "Enter"}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: "#334155" }}>
              Default: rp_admin_2025 (set ADMIN_PASSWORD env var to change)
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
              style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
            <span className="font-bold text-white text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/emails"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ color: "#f97316", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              ✉️ Email Templates
            </a>
            <button onClick={() => setAuthed(false)}
              className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "#64748b", background: "rgba(30,41,59,0.5)" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Orders", value: orders.length, color: "#f97316" },
            { label: "Pending", value: orders.filter(o => o.status === "pending").length, color: "#f59e0b" },
            { label: "Wave / KBZ", value: `${orders.filter(o => o.method === "wave").length}/${orders.filter(o => o.method === "kbz").length}`, color: "#3b82f6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-4 text-center"
              style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
              <div className="text-2xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-xs" style={{ color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {([
            { key: "payments", label: `💳 Orders` },
            { key: "traffic",  label: `📊 Traffic` },
            { key: "prompts",  label: `📋 Prompts (${PROMPTS.length})` },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === key ? "rgba(249,115,22,0.15)" : "rgba(15,20,30,0.8)",
                color: activeTab === key ? "#f97316" : "#64748b",
                border: `1px solid ${activeTab === key ? "rgba(249,115,22,0.3)" : "rgba(30,41,59,0.6)"}`,
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "payments" && (
          <div>
            {ordersLoading ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm" style={{ color: "#64748b" }}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm mb-2" style={{ color: "#64748b" }}>No orders yet.</p>
                <p className="text-xs" style={{ color: "#334155" }}>
                  Orders appear here when buyers enter their email in the payment modal.
                  Make sure BLOB_READ_WRITE_TOKEN is set in Vercel env vars.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-xl p-4"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{o.method === "wave" ? "📱" : o.method === "kbz" ? "💳" : "✉️"}</span>
                        <span className="text-xs font-bold uppercase" style={{ color: o.method === "wave" ? "#f97316" : "#60a5fa" }}>
                          {o.method}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                        style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-0.5">{o.email}</p>
                    {o.name && <p className="text-xs mb-1" style={{ color: "#64748b" }}>{o.name}</p>}
                    <p className="text-xs" style={{ color: "#334155" }}>
                      {new Date(o.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-3">
              <button onClick={() => fetchOrders(pass)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: "rgba(30,41,59,0.6)", color: "#64748b" }}>
                🔄 Refresh
              </button>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === "traffic" && (
          <div>
            {analyticsLoading ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm" style={{ color: "#64748b" }}>Loading analytics...</p>
              </div>
            ) : analytics?.error === "no_token" ? (
              <div className="rounded-2xl p-6"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.2)" }}>
                <p className="text-2xl mb-3">🔑</p>
                <h3 className="font-black text-white mb-2 text-base">Setup Required</h3>
                <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
                  Add <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}>VERCEL_TOKEN</code> to your Vercel environment variables to see live traffic data.
                </p>
                <ol className="text-sm space-y-2 mb-5" style={{ color: "#64748b" }}>
                  <li>1. Go to <strong style={{ color: "#94a3b8" }}>vercel.com → Account Settings → Tokens</strong></li>
                  <li>2. Create a token → copy it</li>
                  <li>3. Go to your <strong style={{ color: "#94a3b8" }}>Vercel project → Settings → Environment Variables</strong></li>
                  <li>4. Add: <code className="px-1 py-0.5 rounded text-xs" style={{ background: "rgba(30,41,59,0.8)", color: "#94a3b8" }}>VERCEL_TOKEN</code> = your token</li>
                  <li>5. Redeploy</li>
                </ol>
                <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer"
                  className="inline-block text-xs px-4 py-2 rounded-lg font-bold"
                  style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>
                  Open Vercel Tokens →
                </a>
              </div>
            ) : analytics?.error ? (
              <div className="rounded-2xl p-6"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-2xl mb-2">⚠️</p>
                <p className="font-bold text-white mb-1 text-sm">Analytics Error</p>
                <p className="text-xs mb-3" style={{ color: "#94a3b8" }}>
                  {analytics.error === "no_project"
                    ? "VERCEL_PROJECT_ID not found — make sure the app is deployed on Vercel."
                    : "Could not load analytics. Check that your VERCEL_TOKEN has the correct permissions."}
                </p>
                <button onClick={() => fetchAnalytics(pass)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                  Retry
                </button>
              </div>
            ) : analytics ? (
              <div className="space-y-4">
                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Visitors", value: analytics.visitors.toLocaleString(), sub: "7 days", color: "#f97316" },
                    { label: "Page Views", value: analytics.pageviews.toLocaleString(), sub: "7 days", color: "#3b82f6" },
                    { label: "Bounce Rate", value: `${Math.round((analytics.bounce_rate || 0) * 100)}%`, sub: "7 days", color: "#a78bfa" },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="rounded-xl p-4 text-center"
                      style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
                      <div className="text-xs font-semibold text-white">{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#334155" }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Top Countries */}
                {analytics.countries.length > 0 && (
                  <div className="rounded-xl p-4"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                      🌍 Top Countries
                    </p>
                    <div className="space-y-2">
                      {analytics.countries.map((c, i) => {
                        const max = analytics.countries[0].total;
                        const pct = Math.round((c.total / max) * 100);
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>
                                {c.key || "Unknown"}
                              </span>
                              <span className="text-xs font-bold" style={{ color: "#f97316" }}>
                                {c.total.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)" }}>
                              <div className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  background: i === 0
                                    ? "linear-gradient(90deg, #f97316, #fb923c)"
                                    : "rgba(249,115,22,0.3)",
                                }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Top Referrers */}
                {analytics.referrers.length > 0 && (
                  <div className="rounded-xl p-4"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                      🔗 Top Referrers
                    </p>
                    <div className="space-y-2">
                      {analytics.referrers.map((r) => (
                        <div key={r.key} className="flex items-center justify-between">
                          <span className="text-sm truncate mr-3 max-w-[70%]" style={{ color: "#94a3b8" }}>
                            {r.key || "Direct"}
                          </span>
                          <span className="text-xs font-bold flex-shrink-0" style={{ color: "#3b82f6" }}>
                            {r.total.toLocaleString()} visits
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Refresh + Vercel link */}
                <div className="flex items-center justify-between">
                  <button onClick={() => fetchAnalytics(pass)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(30,41,59,0.6)", color: "#64748b" }}>
                    🔄 Refresh
                  </button>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                    Full Analytics on Vercel →
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === "prompts" && (
          <div>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              These are the exact prompts buyers receive after payment.
            </p>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const catPrompts = PROMPTS.filter((p) => p.category === cat);
                const isOpen = openCat === cat;
                return (
                  <div key={cat} className="rounded-xl overflow-hidden"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <button onClick={() => setOpenCat(isOpen ? null : cat)}
                      className="w-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cat}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                          {catPrompts.length}
                        </span>
                      </div>
                      <span style={{ color: "#f97316" }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        {catPrompts.map((prompt) => (
                          <div key={prompt.id} className="rounded-xl p-3"
                            style={{ background: "rgba(5,8,15,0.8)", border: "1px solid rgba(15,20,30,0.8)" }}>
                            <p className="text-xs font-bold mb-1.5" style={{ color: "#f97316" }}>
                              {prompt.id}. {prompt.title}
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                              {prompt.prompt}
                            </p>
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

        <p className="text-xs text-center mt-6" style={{ color: "#1e293b" }}>
          Auto-refreshes every 60s · ReadyPrompts Admin
        </p>
      </div>
    </main>
  );
}
