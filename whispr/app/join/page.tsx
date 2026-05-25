"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AVATARS = ["👤","😎","🦊","🐻","🌙","⭐","🔮","🎭","🦁","🐺","🌊","🔥","💎","🎯","🚀"];

const PROOF_MSGS = [
  { mood: "❤️", text: "You're honestly one of the most genuine people I know.", time: "2m ago" },
  { mood: "🔥", text: "Your confidence has grown so much. It's inspiring fr.", time: "7m ago" },
  { mood: "🤔", text: "Why are you always quiet in groups but so fun 1-on-1?", time: "23m ago" },
];

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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="text-center mb-6">
        <Link href="/" className="font-extrabold text-2xl tracking-tight" style={{ color: a }}>👻 Whispr</Link>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left — social proof */}
        <div className="hidden md:flex flex-col justify-center gap-5 py-4">
          <div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text)" }}>
              What do people <span className="italic" style={{ color: a }}>really</span> think?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
              Create your link in 30 seconds. Share it. Get brutally honest — and sometimes surprisingly sweet — anonymous messages.
            </p>
          </div>

          {/* Sample messages */}
          <div className="space-y-3">
            {PROOF_MSGS.map((m, i) => (
              <div key={i} className="p-3.5 rounded-2xl flex items-start gap-3"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <span className="text-xl shrink-0">{m.mood}</span>
                <div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{m.text}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-6">
            {[["100%", "Anonymous"], ["Free", "Forever"], ["30s", "Setup"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-extrabold text-lg" style={{ color: a }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="animate-slide-up">
          <form onSubmit={submit} className="glass p-7 space-y-5">

            <div className="text-center mb-1">
              <p className="font-bold" style={{ color: "var(--text)" }}>Create your anonymous link</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>No email required · Free forever</p>
            </div>

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
              {loading ? "Creating..." : `${avatar} Create My Whispr — Free`}
            </button>

            <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: a }}>Log in →</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
