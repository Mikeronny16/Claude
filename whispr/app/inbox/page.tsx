"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareCard from "@/components/ShareCard";

type Msg = {
  id: string;
  content: string;
  sender_mood: string | null;
  reaction: string | null;
  public_reply: string | null;
  is_read: boolean;
  created_at: string;
};

type Stats = { total: number; unread: number; today: number };
type User = { id: string; username: string; displayName: string; avatarEmoji: string };

const REACTIONS = ["❤️", "😂", "😮", "💯", "🔥"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function MessageCard({ msg, onReact, onReply, onShare }: { msg: Msg; onReact: (id: string, r: string) => void; onReply: (id: string, text: string) => void; onShare: (msg: Msg) => void }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const a = "#06b6d4";

  async function submitReply() {
    if (!replyText.trim()) return;
    setReplying(true);
    await onReply(msg.id, replyText.trim());
    setReplying(false);
    setShowReply(false);
  }

  function copyMsg() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass p-5 space-y-3 message-pop card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {msg.sender_mood && <span className="text-2xl shrink-0 mt-0.5">{msg.sender_mood}</span>}
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)", wordBreak: "break-word" }}>{msg.content}</p>
        </div>
        {!msg.is_read && (
          <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: a }} />
        )}
      </div>

      {msg.public_reply && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(6,182,212,0.08)", borderLeft: `3px solid ${a}` }}>
          <p className="text-xs font-semibold mb-1" style={{ color: a }}>Your reply</p>
          <p style={{ color: "var(--text-dim)" }}>{msg.public_reply}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {REACTIONS.map(r => (
            <button key={r} onClick={() => onReact(msg.id, r)}
              className="w-8 h-8 rounded-lg text-base flex items-center justify-center cursor-pointer transition-all"
              style={{ background: msg.reaction === r ? "rgba(6,182,212,0.2)" : "var(--glass)", border: `1px solid ${msg.reaction === r ? "rgba(6,182,212,0.4)" : "var(--glass-border)"}` }}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>{timeAgo(msg.created_at)}</span>
          <button onClick={copyMsg} className="text-xs px-2 py-1 rounded-lg cursor-pointer" style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
            {copied ? "✅" : "Copy"}
          </button>
          <button onClick={() => onShare(msg)} className="text-xs px-2 py-1 rounded-lg cursor-pointer font-semibold" style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
            Share
          </button>
          {!msg.public_reply && (
            <button onClick={() => setShowReply(v => !v)} className="text-xs px-2 py-1 rounded-lg cursor-pointer font-semibold" style={{ color: a, border: `1px solid rgba(6,182,212,0.3)` }}>
              Reply
            </button>
          )}
        </div>
      </div>

      {showReply && (
        <div className="flex gap-2 pt-1">
          <input value={replyText} onChange={e => setReplyText(e.target.value.slice(0, 200))}
            placeholder="Your public reply..." className="flex-1 px-3 py-2 text-sm" onKeyDown={e => e.key === "Enter" && submitReply()} />
          <button onClick={submitReply} disabled={replying || !replyText.trim()}
            className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer glow-btn shrink-0 disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {replying ? "..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState<Msg | null>(null);
  const a = "#06b6d4";

  const load = useCallback(async (u: User) => {
    const res = await fetch(`/api/messages/inbox?userId=${u.id}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
    setStats(data.stats ?? { total: 0, unread: 0, today: 0 });
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("whispr_user");
    if (!stored) { router.push("/login"); return; }
    const u = JSON.parse(stored) as User;
    setUser(u);
    load(u);
  }, [router, load]);

  function logout() {
    localStorage.removeItem("whispr_user");
    router.push("/");
  }

  async function react(messageId: string, reaction: string) {
    await fetch("/api/messages/react", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageId, reaction }) });
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reaction, is_read: true } : m));
  }

  async function reply(messageId: string, text: string) {
    await fetch("/api/messages/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageId, reply: text }) });
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, public_reply: text, is_read: true } : m));
  }

  function copyLink() {
    const url = `${window.location.origin}/${user?.username}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  }

  if (!user) return null;

  const myLink = `whispr.app/${user.username}`;

  function openShare(msg: Msg) {
    setShareMsg(msg);
  }

  return (
    <>
    {shareMsg && user && (
      <ShareCard
        message={shareMsg.content}
        senderMood={shareMsg.sender_mood}
        reaction={shareMsg.reaction}
        username={user.username}
        displayName={user.displayName}
        avatarEmoji={user.avatarEmoji}
        onClose={() => setShareMsg(null)}
      />
    )}
    <main className="min-h-screen px-4 py-6 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)" }}>
            {user.avatarEmoji}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{user.displayName}</p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>@{user.username}</p>
          </div>
        </div>
        <button onClick={logout} className="text-xs px-3 py-1.5 rounded-xl cursor-pointer" style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
          Logout
        </button>
      </div>

      {/* Your link */}
      <div className="glass p-4 mb-5" style={{ borderColor: "rgba(6,182,212,0.3)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: a }}>Your anonymous link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm font-mono truncate" style={{ color: "var(--text)" }}>{myLink}</code>
          <button onClick={copyLink} className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer glow-btn shrink-0"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {linkCopied ? "✅ Copied!" : "Copy Link"}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--text-faint)" }}>Share this everywhere — TikTok, Instagram, Twitter 📲</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Unread", value: stats.unread, highlight: stats.unread > 0 },
          { label: "Today", value: stats.today },
        ].map(s => (
          <div key={s.label} className="glass p-3 text-center">
            <div className="font-extrabold text-xl" style={{ color: s.highlight ? a : "var(--text)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-3xl" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-5xl">👻</div>
          <p className="font-bold" style={{ color: "var(--text)" }}>No messages yet</p>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>Share your link and watch messages roll in!</p>
          <button onClick={copyLink} className="px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer glow-btn"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            {linkCopied ? "✅ Copied!" : "📋 Copy Your Link"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
          {messages.map(msg => (
            <MessageCard key={msg.id} msg={msg} onReact={react} onReply={reply} onShare={openShare} />
          ))}
        </div>
      )}

      <footer className="text-center mt-12 text-xs" style={{ color: "var(--text-faint)" }}>
        <Link href="/" style={{ color: a }}>Whispr</Link> · Anonymous messages
      </footer>
    </main>
    </>
  );
}
