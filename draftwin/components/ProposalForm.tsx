"use client";

import { useState } from "react";

type Tone = "professional" | "friendly" | "creative";
type Platform = "upwork" | "fiverr" | "email" | "linkedin";
type Length = "short" | "medium" | "long";

interface Props {
  onGenerate: (data: {
    skills: string;
    projectDesc: string;
    yourName: string;
    clientName: string;
    tone: Tone;
    platform: Platform;
    length: Length;
  }) => void;
  loading: boolean;
}

export default function ProposalForm({ onGenerate, loading }: Props) {
  const [yourName, setYourName] = useState("");
  const [clientName, setClientName] = useState("");
  const [skills, setSkills] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [platform, setPlatform] = useState<Platform>("upwork");
  const [length, setLength] = useState<Length>("medium");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({ skills, projectDesc, yourName, clientName, tone, platform, length });
  }

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: "professional", label: "Professional", emoji: "💼" },
    { value: "friendly", label: "Friendly", emoji: "😊" },
    { value: "creative", label: "Creative", emoji: "✨" },
  ];

  const platforms: { value: Platform; label: string; emoji: string }[] = [
    { value: "upwork", label: "Upwork", emoji: "🟢" },
    { value: "fiverr", label: "Fiverr", emoji: "🟡" },
    { value: "email", label: "Email", emoji: "📧" },
    { value: "linkedin", label: "LinkedIn", emoji: "🔵" },
  ];

  const lengths: { value: Length; label: string; words: string }[] = [
    { value: "short", label: "Short", words: "~150 words" },
    { value: "medium", label: "Medium", words: "~300 words" },
    { value: "long", label: "Long", words: "~500 words" },
  ];

  const activeBtn = (active: boolean) => ({
    background: active ? "rgba(16,185,129,0.15)" : "var(--glass)",
    border: `1px solid ${active ? "rgba(16,185,129,0.5)" : "var(--glass-border)"}`,
    color: active ? "var(--green)" : "var(--text-dim)",
  });

  return (
    <form onSubmit={submit} className="glass p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Your Name</label>
          <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Alex" required className="w-full px-4 py-3 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Client Name</label>
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Sarah" required className="w-full px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Your Skills</label>
        <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Web development, React, 5 years experience..." required className="w-full px-4 py-3 text-sm" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Project Description</label>
        <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Paste the job post or describe the project..." required rows={5} className="w-full px-4 py-3 text-sm resize-none" />
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Platform</label>
        <div className="grid grid-cols-4 gap-2">
          {platforms.map(p => (
            <button key={p.value} type="button" onClick={() => setPlatform(p.value)}
              className="py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={activeBtn(platform === p.value)}>
              <span className="block text-base leading-none mb-1">{p.emoji}</span>
              <span className="text-xs">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {tones.map(t => (
            <button key={t.value} type="button" onClick={() => setTone(t.value)}
              className="py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={activeBtn(tone === t.value)}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>Length</label>
        <div className="grid grid-cols-3 gap-2">
          {lengths.map(l => (
            <button key={l.value} type="button" onClick={() => setLength(l.value)}
              className="py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={activeBtn(length === l.value)}>
              <span className="block font-semibold">{l.label}</span>
              <span className="text-xs opacity-60">{l.words}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-2xl font-bold text-base cursor-pointer glow-btn disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
        {loading ? "Writing your proposal..." : "✍️ Generate Proposal — Free"}
      </button>
    </form>
  );
}
