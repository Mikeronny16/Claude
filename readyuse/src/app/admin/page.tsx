"use client";
import { useState, useCallback } from "react";

type SentCode = { email: string; downloadUrl: string; sentAt: string };

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentCodes, setSentCodes] = useState<SentCode[]>([]);
  const [sendError, setSendError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/admin/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass, email: "test@test.com" }),
    }).then(r => {
      if (r.status === 401) { setError("Wrong password"); }
      else { setAuthed(true); setError(""); }
    }).catch(() => setError("Failed")).finally(() => setLoading(false));
  };

  const handleSendCode = useCallback(async () => {
    if (!buyerEmail.includes("@")) { setSendError("Enter a valid email"); return; }
    setSending(true); setSendError("");
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

      const subject = encodeURIComponent("Your Readyuse Templates — Download Link");
      const body = encodeURIComponent(`Hi,\n\nThank you for your purchase! Here are your Readyuse automation templates:\n\n📥 Download Link:\n${downloadUrl}\n\nThis link gives you all 4 templates for both n8n and Make.com.\n\nSetup guide is included in the downloaded files.\n\nIf you need help, just reply to this email.\n\nThanks,\nMike — Readyuse`);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      setBuyerEmail("");
    } catch { setSendError("Network error"); }
    finally { setSending(false); }
  }, [pass, buyerEmail]);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 14 }}>R</div>
            <span style={{ fontWeight: 900, color: "#fff" }}>Readyuse Admin</span>
          </div>
          <form onSubmit={handleLogin} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 20 }}>Admin Access</h1>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              placeholder="Password" autoFocus
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, background: "rgba(15,20,30,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
            {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "12px", borderRadius: 12, fontWeight: 900, fontSize: 14, background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", border: "none", cursor: "pointer" }}>
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 12 }}>R</div>
            <span style={{ fontWeight: 900, color: "#fff" }}>Admin</span>
          </div>
          <button onClick={() => setAuthed(false)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, background: "rgba(30,41,59,0.5)", color: "var(--muted2)", border: "none", cursor: "pointer" }}>Logout</button>
        </div>

        {/* How it works */}
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#60a5fa", marginBottom: 8 }}>How to send access</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
            1. Buyer sends payment screenshot to your Gmail<br />
            2. Enter their email below → Generate & Send<br />
            3. Your Gmail opens with download link → just click Send
          </p>
        </div>

        {/* Send form */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <p style={{ fontWeight: 900, fontSize: 16, color: "#fff", marginBottom: 16 }}>Send Download Link to Buyer</p>
          <input type="email" value={buyerEmail} onChange={e => { setBuyerEmail(e.target.value); setSendError(""); }}
            placeholder="buyer@email.com"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, background: "rgba(15,20,30,0.8)", border: "1px solid rgba(59,130,246,0.3)", color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
          {sendError && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{sendError}</p>}
          <button onClick={handleSendCode} disabled={sending || !buyerEmail.includes("@")}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, fontWeight: 900, fontSize: 15,
              background: buyerEmail.includes("@") ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(30,41,59,0.6)",
              color: "#fff", border: "none", cursor: sending || !buyerEmail.includes("@") ? "not-allowed" : "pointer",
              opacity: sending ? 0.7 : 1,
            }}>
            {sending ? "Generating..." : "📨 Generate & Send Download Link"}
          </button>
        </div>

        {/* Sent history */}
        {sentCodes.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted2)", marginBottom: 16 }}>Sent This Session</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sentCodes.map((s, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{s.email}</p>
                    <p style={{ fontSize: 11, color: "var(--muted2)", marginTop: 2 }}>{s.sentAt}</p>
                  </div>
                  <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "rgba(34,197,94,0.12)", color: "#4ade80", fontWeight: 700 }}>✓ Sent</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
