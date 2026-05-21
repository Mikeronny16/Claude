import Link from "next/link";

const DEMO_MESSAGES = [
  { mood: "❤️", text: "You're honestly one of the most genuine people I know. Don't change.", time: "2m ago" },
  { mood: "🔥", text: "Your confidence has grown so much this year. It's inspiring fr.", time: "14m ago" },
  { mood: "🤔", text: "Why are you always so quiet in group settings but so fun 1 on 1?", time: "1h ago" },
  { mood: "💬", text: "You give the best advice. Everyone knows it but nobody says it enough.", time: "3h ago" },
];

const STEPS = [
  { num: "1", emoji: "⚡", title: "Create your link", desc: "Pick a username. Get whispr.app/you in 30 seconds." },
  { num: "2", emoji: "📲", title: "Share everywhere", desc: "Put it in your TikTok bio, Instagram story, Twitter." },
  { num: "3", emoji: "💌", title: "Receive real messages", desc: "People tell you what they actually think — anonymously." },
];

export default function LandingPage() {
  const a = "#06b6d4";

  return (
    <main className="min-h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(6,182,212,0.12)" }}>
        <span className="font-extrabold text-xl tracking-tight" style={{ color: a }}>Whispr</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-xl cursor-pointer" style={{ color: "var(--text-dim)" }}>
            Login
          </Link>
          <Link href="/join" className="text-sm px-4 py-2 rounded-xl font-bold glow-btn" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-4 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", animation: "float-slow 9s ease-in-out infinite" }} />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", animation: "float-alt 11s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm glass" style={{ color: a }}>
            <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: a }} />
            100% anonymous · No accounts needed to send
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text)" }}>
            What do people{" "}
            <span className="glow-text">really</span>
            <br />think of you?
          </h1>

          <p className="text-lg max-w-md mx-auto" style={{ color: "var(--text-dim)" }}>
            Create your Whispr link. Share it anywhere. Get brutally honest — and sometimes surprisingly sweet — anonymous messages.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join" className="px-8 py-4 rounded-2xl font-extrabold text-base glow-btn glow-pulse" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
              ✨ Create My Whispr Link — Free
            </Link>
          </div>

          <p className="text-xs" style={{ color: "var(--text-faint)" }}>No credit card · No spam · Just honest messages</p>
        </div>
      </section>

      {/* Demo messages */}
      <section className="px-4 pb-16 max-w-lg mx-auto">
        <p className="text-center text-sm font-semibold mb-5" style={{ color: "var(--text-faint)" }}>WHAT PEOPLE GET IN THEIR INBOX</p>
        <div className="space-y-3">
          {DEMO_MESSAGES.map((m, i) => (
            <div key={i} className="glass p-4 flex items-start gap-3 card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-2xl shrink-0">{m.mood}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{m.text}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map(s => (
            <div key={s.num} className="glass p-6 text-center space-y-3 card-hover">
              <div className="text-4xl">{s.emoji}</div>
              <div className="font-bold" style={{ color: "var(--text)" }}>{s.title}</div>
              <div className="text-sm" style={{ color: "var(--text-dim)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 max-w-md mx-auto text-center">
        <div className="glass p-8 space-y-4" style={{ borderColor: `rgba(6,182,212,0.3)` }}>
          <div className="text-5xl">👻</div>
          <h3 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Ready to find out?</h3>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>Create your free anonymous link in 30 seconds.</p>
          <Link href="/join" className="block w-full py-4 rounded-2xl font-extrabold text-base glow-btn" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            Create My Whispr →
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 border-t text-xs space-y-1" style={{ borderColor: "rgba(6,182,212,0.1)", color: "var(--text-faint)" }}>
        <p><span style={{ color: a }}>Whispr</span> · Anonymous messages</p>
        <p>Built by Mike Ronny</p>
      </footer>
    </main>
  );
}
