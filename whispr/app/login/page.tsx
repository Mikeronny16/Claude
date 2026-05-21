"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.toLowerCase().trim(), password }),
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
      <div className="w-full max-w-sm animate-slide-up">

        <div className="text-center mb-8">
          <Link href="/" className="font-extrabold text-2xl tracking-tight" style={{ color: a }}>Whispr</Link>
          <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>Welcome back 👋</p>
        </div>

        <form onSubmit={submit} className="glass p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="yourname" required className="w-full px-4 py-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: a }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required className="w-full px-4 py-3 text-sm" />
          </div>

          {error && <p className="text-sm text-center font-medium" style={{ color: "#ef4444" }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {loading ? "Logging in..." : "Log In →"}
          </button>

          <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
            No account?{" "}
            <Link href="/join" style={{ color: a }}>Create yours free →</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
