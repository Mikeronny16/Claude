"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AVATARS = ["👤","😎","🦊","🐻","🌙","⭐","🔮","🎭","🦁","🐺","🌊","🔥","💎","🎯","🚀"];

export default function JoinPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("👤");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, displayName: displayName.trim(), avatarEmoji: avatar, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("whispr_user", JSON.stringify(data.user));
      router.push("/inbox");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const a = "#06b6d4";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        <div className="text-center mb-8">
          <Link href="/" className="font-extrabold text-2xl tracking-tight" style={{ color: a }}>Whispr</Link>
          <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>Create your anonymous message link</p>
        </div>

        <form onSubmit={submit} className="glass p-7 space-y-5">

          {/* Avatar picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Pick your avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map(em => (
                <button key={em} type="button" onClick={() => setAvatar(em)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: avatar === em ? "rgba(6,182,212,0.2)" : "var(--glass)", border: `1px solid ${avatar === em ? "rgba(6,182,212,0.5)" : "var(--glass-border)"}` }}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" required className="w-full px-4 py-3 text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-faint)" }}>whispr.app/</span>
              <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourname" required minLength={3} maxLength={20}
                className="w-full pl-28 pr-4 py-3 text-sm" style={{ color: a }} />
            </div>
            {cleanUsername.length >= 3 && (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>Your link: whispr.app/{cleanUsername}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="w-full px-4 py-3 text-sm" />
          </div>

          {error && <p className="text-sm text-center font-medium" style={{ color: "#ef4444" }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer glow-btn glow-pulse disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {loading ? "Creating..." : `${avatar} Create My Whispr`}
          </button>

          <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: a }}>Log in →</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
