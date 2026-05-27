"use client";

import { useState, useEffect, useCallback } from "react";
import { PROMPTS } from "@/lib/prompts";

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

type SentCode = {
  email: string;
  downloadUrl: string;
  sentAt: string;
};

const CATEGORIES = [...new Set(PROMPTS.map((p) => p.category))];

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"send" | "traffic" | "prompts">("send");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(CATEGORIES[0]);
  const [error, setError] = useState("");

  // Send code state
  const [buyerEmail, setBuyerEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentCodes, setSentCodes] = useState<SentCode[]>([]);
  const [sendError, setSendError] = useState("");

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
    setLoading(true);
    // Simple client-side auth check via analytics endpoint
    fetch(`/api/admin/analytics?pass=${encodeURIComponent(pass)}`)
      .then(r => {
        if (r.status === 401) { setError("Wrong password"); }
        else { setAuthed(true); setError(""); }
      })
      .catch(() => setError("Failed to connect"))
      .finally(() => setLoading(false));
  };

  const handleSendCode = useCallback(async () => {
    if (!buyerEmail.includes("@")) { setSendError("Enter a valid email"); return; }
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/admin/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass, email: buyerEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setSendError(data.error || "Failed"); return; }

      const { downloadUrl, email } = data;
      const sentAt = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
      setSentCodes(prev => [{ email, downloadUrl, sentAt }, ...prev]);

      // Open Gmail with pre-filled email
      const subject = encodeURIComponent("Your ReadyPrompts Access — Download Link Inside");
      const body = encodeURIComponent(
        `Hi,\n\nThank you for your payment! Here is your download link for ReadyPrompts (120 AI Prompts):\n\n${downloadUrl}\n\nThis link is unique to you. Click it to download your prompts instantly.\n\nIf you have any questions, just reply to this email.\n\nThanks,\nMike`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      setBuyerEmail("");
    } catch {
      setSendError("Network error");
    } finally {
      setSending(false);
    }
  }, [pass, buyerEmail]);

  useEffect(() => {
    if (!authed) return;
    fetchAnalytics(pass);
  }, [authed, pass, fetchAnalytics]);

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

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {([
            { key: "send",    label: "📨 Send Access Code" },
            { key: "traffic", label: "📊 Traffic" },
            { key: "prompts", label: `📋 Prompts (${PROMPTS.length})` },
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

        {/* Send Access Code Tab */}
        {activeTab === "send" && (
          <div className="space-y-4">
            {/* Instruction */}
            <div className="rounded-xl p-4"
              style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#f97316" }}>How it works</p>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                1. Buyer sends payment screenshot to your Gmail<br />
                2. Enter their email below → click Send<br />
                3. Your Gmail opens with download link pre-filled → just hit Send
              </p>
            </div>

            {/* Send form */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
              <p className="text-sm font-bold text-white mb-4">Send Access Code to Buyer</p>
              <input
                type="email"
                value={buyerEmail}
                onChange={e => { setBuyerEmail(e.target.value); setSendError(""); }}
                placeholder="buyer@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white mb-3 outline-none"
                style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.8)" }}
              />
              {sendError && <p className="text-xs mb-3" style={{ color: "#ef4444" }}>{sendError}</p>}
              <button
                onClick={handleSendCode}
                disabled={sending || !buyerEmail.includes("@")}
                className="w-full py-3 rounded-xl font-black text-sm text-white"
                style={{
                  background: buyerEmail.includes("@") ? "linear-gradient(135deg, #f97316, #ea580c)" : "rgba(30,41,59,0.6)",
                  opacity: sending ? 0.7 : 1,
                  cursor: sending || !buyerEmail.includes("@") ? "not-allowed" : "pointer",
                }}>
                {sending ? "Generating..." : "📨 Generate & Send Code"}
              </button>
            </div>

            {/* Sent history */}
            {sentCodes.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                  Sent this session
                </p>
                <div className="space-y-2">
                  {sentCodes.map((s, i) => (
                    <div key={i} className="rounded-xl p-4 flex items-center justify-between"
                      style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.email}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{s.sentAt}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
                        ✓ Sent
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              </div>
            ) : analytics?.error ? (
              <div className="rounded-2xl p-6"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-2xl mb-2">⚠️</p>
                <p className="font-bold text-white mb-1 text-sm">Analytics Error</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>Could not load analytics data.</p>
              </div>
            ) : analytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Visitors", value: analytics.visitors.toLocaleString(), color: "#f97316" },
                    { label: "Page Views", value: analytics.pageviews.toLocaleString(), color: "#3b82f6" },
                    { label: "Bounce Rate", value: `${Math.round((analytics.bounce_rate || 0) * 100)}%`, color: "#a78bfa" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl p-4 text-center"
                      style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
                      <div className="text-xs font-semibold text-white">{label}</div>
                    </div>
                  ))}
                </div>
                {analytics.countries.length > 0 && (
                  <div className="rounded-xl p-4"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>🌍 Top Countries</p>
                    <div className="space-y-2">
                      {analytics.countries.map((c, i) => {
                        const max = analytics.countries[0].total;
                        const pct = Math.round((c.total / max) * 100);
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{c.key || "Unknown"}</span>
                              <span className="text-xs font-bold" style={{ color: "#f97316" }}>{c.total.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)" }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: i === 0 ? "linear-gradient(90deg,#f97316,#fb923c)" : "rgba(249,115,22,0.3)" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <button onClick={() => fetchAnalytics(pass)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(30,41,59,0.6)", color: "#64748b" }}>
                    🔄 Refresh
                  </button>
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
          ReadyPrompts Admin
        </p>
      </div>
    </main>
  );
}
