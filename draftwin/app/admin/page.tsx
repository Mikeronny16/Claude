"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("20");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function login() {
    const res = await fetch("/api/admin/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "ping", amount: 0, adminPassword: password }),
    });
    const data = await res.json();
    // "Invalid input" means password was correct (passed auth, failed validation)
    if (data.error === "Invalid input" || data.ok) {
      setAuthed(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  }

  async function addCredits() {
    if (!userId.trim() || !amount) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), amount: Number(amount), adminPassword: password }),
      });
      const data = await res.json();
      setResult(data.ok
        ? { ok: true, message: `✅ Added ${amount} credits to ${userId.slice(0, 12)}...` }
        : { ok: false, message: `❌ Error: ${data.error}` }
      );
      if (data.ok) { setUserId(""); setNote(""); }
    } catch {
      setResult({ ok: false, message: "❌ Network error" });
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="glass p-8 rounded-2xl w-full max-w-sm space-y-4" style={{ maxWidth: 360 }}>
          <h1 className="text-xl font-bold text-center" style={{ color: "var(--text)" }}>🔐 Admin</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(0,0,0,0.15)", border: `1px solid ${authError ? "#EF4444" : "var(--glass-border)"}`, color: "var(--text)" }}
            autoFocus
          />
          {authError && <p className="text-xs text-center" style={{ color: "#EF4444" }}>Wrong password</p>}
          <button onClick={login}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn"
            style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }} className="space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>⚡ DraftWin Admin</h1>
          <button onClick={() => setAuthed(false)}
            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
            Logout
          </button>
        </div>

        {/* Add Credits */}
        <div className="glass p-6 rounded-2xl space-y-4">
          <h2 className="font-bold" style={{ color: "var(--text)" }}>💳 Add Credits to User</h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>User ID (from their Gmail email)</label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Paste full User ID here..."
              className="w-full px-4 py-3 rounded-xl text-sm font-mono"
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>Credits to Add</label>
            <div className="grid grid-cols-3 gap-2">
              {[["20", "Starter"], ["70", "Pro"], ["200", "Unlimited"]].map(([val, label]) => (
                <button key={val} onClick={() => setAmount(val)}
                  className="py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all"
                  style={{
                    background: amount === val ? "linear-gradient(135deg, var(--green), var(--green-dim))" : "var(--glass)",
                    border: `1px solid ${amount === val ? "transparent" : "var(--glass-border)"}`,
                    color: amount === val ? "white" : "var(--text-dim)",
                  }}>
                  +{val}<br />
                  <span style={{ fontSize: "10px", opacity: 0.8 }}>{label}</span>
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Or custom amount"
              className="w-full px-4 py-2.5 rounded-xl text-sm mt-2"
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>Note (optional)</label>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Myanmar payment 5000 MMK received"
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
            />
          </div>

          <button onClick={addCredits} disabled={loading || !userId.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
            {loading ? "Adding..." : `⚡ Add ${amount} Credits`}
          </button>

          {result && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold text-center"
              style={{
                background: result.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${result.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: result.ok ? "var(--green)" : "#EF4444",
              }}>
              {result.message}
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <div className="glass p-5 rounded-2xl space-y-3">
          <h2 className="font-bold text-sm" style={{ color: "var(--text)" }}>📋 Package Reference</h2>
          {[
            { label: "Starter", credits: 20, mmk: "5,000", usd: "$5" },
            { label: "Pro", credits: 70, mmk: "15,000", usd: "$15" },
            { label: "Unlimited", credits: 200, mmk: "35,000", usd: "$39" },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.label}</span>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-faint)" }}>
                <span>+{p.credits} credits</span>
                <span style={{ color: "var(--green)", fontWeight: 700 }}>{p.mmk} MMK / {p.usd}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>
          DraftWin Admin · mikeronny18@gmail.com
        </p>
      </div>
    </div>
  );
}
