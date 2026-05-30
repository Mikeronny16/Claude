import { createContext, useContext, useState } from "react"

type Lang = "mm" | "en"
const LangCtx = createContext<{ lang: Lang; toggle: () => void; t: (mm: string, en: string) => string }>({
  lang: "mm", toggle: () => {}, t: (mm) => mm,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("mm")
  const toggle = () => setLang(l => l === "mm" ? "en" : "mm")
  const t = (mm: string, en: string) => lang === "mm" ? mm : en
  return <LangCtx.Provider value={{ lang, toggle, t }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
