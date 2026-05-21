"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const MOODS = [
  { value: "💬", label: "Just saying" },
  { value: "❤️", label: "Appreciating" },
  { value: "🔥", label: "Being real" },
  { value: "🤔", label: "Curious" },
];

const PROMPTS = [
  "Roast me honestly 🔥",
  "Rate me 1-10 ⭐",
  "What do you really think of me?",
  "Give me one piece of advice 💡",
  "What's your first impression of me?",
  "Tell me a secret about yourself 🤫",
  "What would surprise me about you?",
  "Compliment me anonymously ❤️",
];

type UserData = { user: { display_name: string; avatar_emoji: string; username: string }; totalMessages: number } | null;

export default function SendPage() {
  const params = useParams();
  const username = (params.username as string) ?? "";

  const [userData, setUserData] = useState<UserData>(null);
  const [notFound, setNotFound] = useState(false);
  const [mood, setMood] = useState("💬");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    fetch(`/api/user/${username}`)
      .then(r => { if (!r.ok) { setNotFound(true); return null; } return r.json(); })
      .then(d => { if (d) setUserData(d); });
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
  }, [username]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: message.trim(), senderMood: mood }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSent(true);
    } catch {
      setError("Failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const a = "#06b6d4";

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">👻</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>No one here</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>@{username} hasn&apos;t joined Whispr yet.</p>
          <Link href="/join" className="px-6 py-3 rounded-2xl font-bold text-sm glow-btn" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            Create your own →
          </Link>
        </div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${a} transparent transparent transparent` }} />
      </main>
    );
  }

  const { user, totalMessages } = userData;

  if (sent) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="animate-slide-up space-y-5 max-w-sm">
          <div className="text-7xl">💌</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Sent anonymously!</h1>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>{user.display_name} will never know it was you 👻</p>
          <button onClick={() => { setSent(false); setMessage(""); }} className="w-full py-3 rounded-2xl font-bold text-sm cursor-pointer glass glass-hover" style={{ color: a }}>
            Send another →
          </button>
          <Link href="/join" className="block w-full py-3 rounded-2xl font-bold text-sm text-center glow-btn" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            ✨ Create your own Whispr
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)", animation: "float-slow 9s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">

        {/* Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
            style={{ background: "rgba(6,182,212,0.1)", border: "2px solid rgba(6,182,212,0.3)" }}>
            {user.avatar_emoji}
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{user.display_name}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>@{user.username}</p>
          {totalMessages > 0 && (
            <p className="text-xs mt-2 font-semibold" style={{ color: a }}>{totalMessages} messages received</p>
          )}
        </div>

        <form onSubmit={send} className="glass p-6 space-y-5">
          <h2 className="font-bold text-center" style={{ color: "var(--text)" }}>
            Send {user.display_name} an anonymous message 👻
          </h2>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Quick prompts</label>
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map(p => (
                <button key={p} type="button" onClick={() => setMessage(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  style={{ background: message === p ? "rgba(6,182,212,0.15)" : "var(--glass)", border: `1px solid ${message === p ? "rgba(6,182,212,0.5)" : "var(--glass-border)"}`, color: message === p ? a : "var(--text-dim)" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Your vibe</label>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(m => (
                <button key={m.value} type="button" onClick={() => setMood(m.value)}
                  className="py-2 rounded-xl text-center cursor-pointer transition-all"
                  style={{
                    background: mood === m.value ? "rgba(6,182,212,0.15)" : "var(--glass)",
                    border: `1px solid ${mood === m.value ? "rgba(6,182,212,0.5)" : "var(--glass-border)"}`,
                  }}>
                  <div className="text-xl">{m.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: mood === m.value ? a : "var(--text-faint)" }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 300))}
              placeholder="Type your honest message... it's anonymous 👀"
              rows={4}
              required
              className="w-full px-4 py-3 text-sm resize-none"
            />
            <div className="text-right text-xs" style={{ color: "var(--text-faint)" }}>{message.length}/300</div>
          </div>

          {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

          <button type="submit" disabled={loading || !message.trim()}
            className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {loading ? "Sending..." : "👻 Send Anonymously"}
          </button>

          <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
            100% anonymous · They will never know it&apos;s you
          </p>
        </form>

        <div className="text-center text-xs mt-6 space-y-1">
          <p style={{ color: "var(--text-faint)" }}>
            Want your own?{" "}
            <Link href="/join" style={{ color: a }}>Create free Whispr link →</Link>
          </p>
          <p>
            <Link href="/leaderboard" style={{ color: "rgba(6,182,212,0.5)" }}>🏆 View leaderboard</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
