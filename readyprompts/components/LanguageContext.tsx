"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, LANG_NAMES, translations, Translations } from "@/lib/i18n";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("rp_lang") as Lang | null;
    if (saved && saved in LANG_NAMES) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("rp_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const langs = Object.entries(LANG_NAMES) as [Lang, string][];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
        style={{ background: "rgba(30,41,59,0.8)", color: "#94a3b8", border: "1px solid rgba(30,41,59,0.8)" }}>
        {LANG_NAMES[lang]}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden py-1 min-w-[110px]"
            style={{ background: "#0d1321", border: "1px solid rgba(30,41,59,0.8)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            {langs.map(([code, label]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-2"
                style={{
                  color: lang === code ? "#f97316" : "#94a3b8",
                  background: lang === code ? "rgba(249,115,22,0.08)" : "transparent",
                }}>
                {label}
                {lang === code && <span style={{ color: "#f97316", marginLeft: "auto" }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
