"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGES, LangCode } from "@/lib/i18n";

interface Props {
  lang: LangCode;
  onChange: (lang: LangCode) => void;
}

export default function LangSelector({ lang, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all"
        style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
        <span>{current.flag}</span>
        <span className="font-semibold text-xs">{current.label}</span>
        <span className="text-xs opacity-50">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "var(--bg2)", border: "1px solid var(--glass-border)", minWidth: "160px" }}>
          {LANGUAGES.map(l => (
            <button key={l.code}
              onClick={() => { onChange(l.code); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-all text-left"
              style={{
                background: l.code === lang ? "var(--glass-hover)" : "transparent",
                color: l.code === lang ? "var(--green)" : "var(--text-dim)",
              }}>
              <span>{l.flag}</span>
              <span>{l.name}</span>
              {l.code === lang && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
