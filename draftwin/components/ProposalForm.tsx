"use client";

import { useState } from "react";

type Tone = "professional" | "friendly" | "creative";

interface Props {
  onGenerate: (data: {
    skills: string;
    projectDesc: string;
    yourName: string;
    clientName: string;
    tone: Tone;
  }) => void;
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
    <form onSubmit={submit} className="card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Your Name</label>
          <input
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Alex Johnson"
            required
            className="w-full bg-[#0a0a12] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Client Name</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Sarah / TechCorp"
            required
            className="w-full bg-[#0a0a12] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Your Skills</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="React, Node.js, 4 years experience, UI/UX design..."
          required
          className="w-full bg-[#0a0a12] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Client&apos;s Project Description</label>
        <textarea
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          placeholder="Paste the job post or describe the project here..."
          required
          rows={5}
          className="w-full bg-[#0a0a12] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Tone</label>
        <div className="flex gap-3">
          {tones.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                tone === t.value
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-[#1e1e35] text-gray-400 hover:border-purple-500/50"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-lg glow-btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Writing your proposal..." : "✍️ Generate Proposal"}
      </button>
    </form>
  );
}
