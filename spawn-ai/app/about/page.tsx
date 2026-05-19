import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <svg width="24" height="29" viewBox="0 0 100 120">
            <defs><radialGradient id="an" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#f5d0fe"/><stop offset="60%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient></defs>
            <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#an)"/>
          </svg>
          <span className="text-gradient">Spawn AI</span>
        </Link>
        <Link href="/auth/signin" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs text-purple-400 uppercase tracking-widest mb-4">About the founder</p>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Mike Ronny<br/>
            <span className="text-gradient">& the question behind Spawn AI</span>
          </h1>
        </div>

        {/* The question */}
        <div className="mb-12 p-6 rounded-2xl" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <p className="text-xl text-white font-medium leading-relaxed italic">
            "In a world that scrolls past everything —<br/>
            how much care do we still have left?"
          </p>
        </div>

        {/* Story */}
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            My name is Mike Ronny. I'm from Myanmar. I built Spawn AI not because I wanted to build another AI product — but because I had a question I couldn't stop thinking about.
          </p>
          <p>
            We live in a time when everything competes for our attention. Every app is designed to capture us, hold us, keep us scrolling. But I noticed something: the things we actually care about — the things we remember — are the ones we had to <span className="text-white font-medium">wait for</span> and <span className="text-white font-medium">invest in</span>.
          </p>
          <p>
            A pet you raise from birth feels different than one you just encounter. A relationship that grew slowly means more than one that appeared fully formed.
          </p>
          <p>
            Spawn AI is a quiet experiment in that idea. Your creature starts as an egg. You whisper to it. You wait. You hatch it. You feed it, play with it, talk to it — and slowly, through time and attention, something real develops.
          </p>
          <p>
            The AI isn't the point. The <span className="text-white font-medium">caring</span> is the point.
          </p>
          <p>
            I wanted to build something that asks: do we still have the patience to nurture something slowly? Or has everything become instant and disposable?
          </p>
          <p>
            I'm still finding the answer. Maybe you'll find yours here too.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}>
          <p className="text-white font-semibold text-lg">— Mike Ronny</p>
          <p className="text-gray-500 text-sm mt-1">Founder, Spawn AI · Myanmar</p>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-gray-400 mb-5">Something small is waiting for you to notice.</p>
          <Link href="/auth/signup"
            className="inline-block px-8 py-3.5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
            Hatch your first egg — free
          </Link>
        </div>
      </div>
    </div>
  )
}
