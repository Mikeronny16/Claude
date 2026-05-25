"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Entry = {
  username: string;
  display_name: string;
  avatar_emoji: string;
  total: number;
  topMood: string | null;
};

const a = "#06b6d4";
const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [board, setBoard] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"all" | "week">("all");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then(r => r.json())
      .then(d => { setBoard(d.leaderboard ?? []); setLoading(false); });
  }, [period]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>Most anonymous messages received</p>
      </div>

      {/* Period toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
          {(["all", "week"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-5 py-2 text-sm font-bold cursor-pointer transition-all"
              style={{
                background: period === p ? a : "var(--glass)",
                color: period === p ? "#040d1a" : "var(--text-dim)",
              }}>
              {p === "all" ? "🌍 All Time" : "📅 This Week"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : board.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">{period === "week" ? "📅" : "👻"}</div>
          <p style={{ color: "var(--text-dim)" }}>
            {period === "week" ? "No messages this week yet. Be first!" : "No one on the board yet. Be first!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {board.map((u, i) => (
            <Link key={u.username} href={`/${u.username}`}
              className="flex items-center gap-4 p-4 rounded-2xl glass glass-hover cursor-pointer"
              style={{ borderColor: i === 0 ? "rgba(251,191,36,0.4)" : i === 1 ? "rgba(156,163,175,0.3)" : i === 2 ? "rgba(180,83,9,0.3)" : "var(--glass-border)" }}>

              {/* Rank */}
              <div className="text-2xl w-8 text-center shrink-0">
                {i < 3 ? MEDALS[i] : <span style={{ color: "var(--text-faint)", fontSize: "0.9rem", fontWeight: 700 }}>#{i + 1}</span>}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                {u.avatar_emoji}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{u.display_name}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>@{u.username}</p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <div className="font-extrabold text-lg" style={{ color: a }}>{u.total}</div>
                <div className="text-xs" style={{ color: "var(--text-faint)" }}>{u.topMood ?? "💬"}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10 space-y-3">
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>Share your link to climb the leaderboard 👆</p>
        <Link href="/join" className="inline-block px-6 py-3 rounded-2xl font-bold text-sm glow-btn"
          style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
          Get your Whispr link →
        </Link>
      </div>

      <footer className="text-center mt-8 text-xs" style={{ color: "var(--text-faint)" }}>
        <Link href="/" style={{ color: a }}>← Back to Whispr</Link>
      </footer>
    </main>
  );
}
