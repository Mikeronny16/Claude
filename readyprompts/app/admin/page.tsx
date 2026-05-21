"use client";

import { useState, useEffect, useCallback } from "react";
import { PROMPTS } from "@/lib/prompts";

type Payment = {
  payment_id: string;
  payment_status: string;
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  created_at: string;
  order_id?: string;
};

type Stats = {
  payments: Payment[];
  total_usd: number;
  count: number;
  total_count: number;
  error?: string;
};

const STATUS_COLOR: Record<string, string> = {
  finished: "#22c55e",
  confirmed: "#22c55e",
  waiting: "#f59e0b",
  confirming: "#f59e0b",
  sending: "#3b82f6",
  partially_paid: "#a78bfa",
  failed: "#ef4444",
  expired: "#6b7280",
  refunded: "#ef4444",
};

const CATEGORIES = [...new Set(PROMPTS.map((p) => p.category))];

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"payments" | "prompts">("payments");
  const [openCat, setOpenCat] = useState<string | null>(CATEGORIES[0]);
  const [error, setError] = useState("");

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
      }
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(pass);
  };

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchStats(pass), 60000);
    return () => clearInterval(interval);
  }, [authed, pass, fetchStats]);

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
          <button onClick={() => setAuthed(false)}
            className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "#64748b", background: "rgba(30,41,59,0.5)" }}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Revenue", value: `$${stats.total_usd.toFixed(0)}`, color: "#f97316" },
              { label: "Sales", value: stats.count, color: "#22c55e" },
              { label: "All Payments", value: stats.total_count, color: "#3b82f6" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-4 text-center"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <div className="text-2xl font-black mb-1" style={{ color }}>{value}</div>
                <div className="text-xs" style={{ color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["payments", "prompts"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
              style={{
                background: activeTab === tab ? "rgba(249,115,22,0.15)" : "rgba(15,20,30,0.8)",
                color: activeTab === tab ? "#f97316" : "#64748b",
                border: `1px solid ${activeTab === tab ? "rgba(249,115,22,0.3)" : "rgba(30,41,59,0.6)"}`,
              }}>
              {tab === "payments" ? `💳 Payments` : `📋 Prompts (${PROMPTS.length})`}
            </button>
          ))}
        </div>

        {/* Payments Tab */}
        {activeTab === "payments" && stats && (
          <div>
            {stats.payments.length === 0 ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm" style={{ color: "#64748b" }}>No payments yet. Share your link!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.payments.map((p) => (
                  <div key={p.payment_id} className="rounded-xl p-4"
                    style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: STATUS_COLOR[p.payment_status] || "#64748b" }} />
                        <span className="text-xs font-semibold capitalize" style={{ color: STATUS_COLOR[p.payment_status] || "#64748b" }}>
                          {p.payment_status}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "#f97316" }}>
                        ${p.price_amount || 2} {p.price_currency?.toUpperCase() || "USD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#475569" }}>
                        {p.pay_currency?.toUpperCase() || "—"}
                      </span>
                      <span className="text-xs" style={{ color: "#334155" }}>
                        {p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
