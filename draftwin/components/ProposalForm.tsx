"use client";

import { useState, useEffect } from "react";
import { Translations } from "@/lib/i18n";

type Tone = "professional" | "friendly" | "creative";
type Platform = "upwork" | "fiverr" | "email" | "linkedin";
type Length = "short" | "medium" | "long";
type Mode = "proposal" | "cover-letter";

interface Props {
  onGenerate: (data: { skills: string; projectDesc: string; yourName: string; clientName: string; tone: Tone; platform: Platform; length: Length; mode: Mode }) => void;
  loading: boolean;
  prefill?: Partial<{ skills: string; projectDesc: string; yourName: string; clientName: string; tone: Tone; platform: Platform; length: Length }> | null;
  translations: Translations;
}

export default function ProposalForm({ onGenerate, loading, prefill, translations: T }: Props) {
  const [yourName, setYourName] = useState("");
  const [clientName, setClientName] = useState("");
  const [skills, setSkills] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [platform, setPlatform] = useState<Platform>("upwork");
  const [length, setLength] = useState<Length>("medium");
  const [mode, setMode] = useState<Mode>("proposal");

  useEffect(() => {
    if (!prefill) return;
    if (prefill.skills !== undefined) setSkills(prefill.skills);
    if (prefill.projectDesc !== undefined) setProjectDesc(prefill.projectDesc);
    if (prefill.yourName !== undefined) setYourName(prefill.yourName);
    if (prefill.clientName !== undefined) setClientName(prefill.clientName);
    if (prefill.tone !== undefined) setTone(prefill.tone);
    if (prefill.platform !== undefined) setPlatform(prefill.platform);
    if (prefill.length !== undefined) setLength(prefill.length);
  }, [prefill]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({ skills, projectDesc, yourName, clientName, tone, platform, length, mode });
  }

  const isCoverLetter = mode === "cover-letter";

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: "professional", label: T.toneProf, emoji: "💼" },
    { value: "friendly", label: T.toneFriend, emoji: "😊" },
    { value: "creative", label: T.toneCreative, emoji: "✨" },
  ];

  const platforms: { value: Platform; label: string; emoji: string }[] = [
    { value: "upwork", label: "Upwork", emoji: "🟢" },
    { value: "fiverr", label: "Fiverr", emoji: "🟡" },
    { value: "email", label: "Email", emoji: "📧" },
    { value: "linkedin", label: "LinkedIn", emoji: "🔵" },
  ];

  const lengths: { value: Length; label: string; words: string }[] = [
    { value: "short", label: T.lenShort, words: "~150" },
    { value: "medium", label: T.lenMedium, words: "~300" },
    { value: "long", label: T.lenLong, words: "~500" },
  ];

  const activeBtn = (active: boolean) => ({
    background: active ? "rgba(16,185,129,0.15)" : "var(--glass)",
    border: `1px solid ${active ? "rgba(16,185,129,0.5)" : "var(--glass-border)"}`,
    color: active ? "var(--green)" : "var(--text-dim)",
  });

  return (
    <form onSubmit={submit} className="glass p-6 md:p-8 space-y-5">

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
        {([["proposal", "✍️ Proposal"], ["cover-letter", "📄 Cover Letter"]] as [Mode, string][]).map(([val, label]) => (
          <button key={val} type="button" onClick={() => setMode(val)}
            className="py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{
              background: mode === val ? "linear-gradient(135deg, var(--green), var(--green-dim))" : "transparent",
              color: mode === val ? "white" : "var(--text-dim)",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>{T.labelYourName}</label>
          <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Alex" required className="w-full px-4 py-3 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>
            {isCoverLetter ? "Company / Hiring Manager" : T.labelClientName}
          </label>
          <input value={clientName} onChange={e => setClientName(e.target.value)}
            placeholder={isCoverLetter ? "Google / Sarah" : "Sarah"}
            required className="w-full px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>{T.labelSkills}</label>
        <input value={skills} onChange={e => setSkills(e.target.value)}
          placeholder={isCoverLetter ? "React, 5 years experience, led teams of 10..." : "Web development, React, 5 years experience..."}
          required className="w-full px-4 py-3 text-sm" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>
          {isCoverLetter ? "Job Description / Requirements" : T.labelProject}
        </label>
        <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)}
          placeholder={isCoverLetter ? "Paste the job posting or describe the role and requirements..." : "Paste the job post or describe the project..."}
          required rows={5} className="w-full px-4 py-3 text-sm resize-none" />
      </div>

      {/* Platform — only for proposals */}
      {!isCoverLetter && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>{T.labelPlatform}</label>
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
      )}

      {/* Tone */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>{T.labelTone}</label>
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
        <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--green)" }}>{T.labelLength}</label>
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
        {loading ? T.btnGenerating : isCoverLetter ? "📄 Generate Cover Letter — Free" : T.btnGenerate}
      </button>
    </form>
  );
}
