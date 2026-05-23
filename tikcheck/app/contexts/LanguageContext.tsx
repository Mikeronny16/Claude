"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations, T } from "../lib/i18n";

type LangCtx = { lang: Lang; t: T; setLang: (l: Lang) => void };
const Ctx = createContext<LangCtx>({ lang: 'en', t: translations.en, setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tikcheck-lang') as Lang;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('tikcheck-lang', l);
  }

  return <Ctx.Provider value={{ lang, t: translations[lang], setLang }}>{children}</Ctx.Provider>;
}

export function useLang() { return useContext(Ctx); }
