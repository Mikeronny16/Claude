"use client";

import { useState } from "react";

type Tone = "professional" | "friendly" | "creative";

interface Props {
  onGenerate: (data: { skills: string; projectDesc: string; yourName: string; clientName: string; tone: Tone }) => void;
  loading: boolean;
}

export default function ProposalForm({ onGenerate, loading }: Props) {
  const [yourName, setYourName] = useState("");
  const [clientName, setClientName] = useState("");
  const [skills, setSkills] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({ skills, projectDesc, yourName, clientName, tone });
  }

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: "professional", label: "Professional", emoji: "💼" },
    { value: "friendly", label: "Friendly", emoji: "😊" },
    { value: "creative", label: "Creative", emoji: "✨" },
  ];

  return (
    <form onSubmit={submit} className="glass p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Your Name</label>
          <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Alex" required className="w-full px-4 py-3 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Client Name</label>
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Sarah" required className="w-full px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Your Skills</label>
        <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Photography, Lightroom editing, 5 years experience..." required className="w-full px-4 py-3 text-sm" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Project Description</label>
        <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Paste the job post or describe the project..." required rows={5} className="w-full px-4 py-3 text-sm resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {tones.map(t => (
            <button key={t.value} type="button" onClick={() => setTone(t.value)}
              className="py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: tone === t.value ? "rgba(16,185,129,0.15)" : "transparent",
                border: `1px solid ${tone === t.value ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.1)"}`,
                color: tone === t.value ? "#10B981" : "rgba(255,255,255,0.4)",
              }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-2xl font-bold text-base cursor-pointer glow-btn disabled:opacity-50 disabled:cursor-not-allowed"
        style={{background: "linear-gradient(135deg, #10B981, #059669)", color: "white"}}>
        {loading ? "Writing your proposal..." : "✍️ Generate Proposal — Free"}
      </button>
    </form>
  );
}
