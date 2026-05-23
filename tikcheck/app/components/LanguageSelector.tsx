"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANG_META, Lang } from "../lib/i18n";
import { useLang } from "../contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const entries = Object.entries(LANG_META) as [Lang, { flag: string; native: string }][];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20, padding: "6px 12px",
          color: "white", fontSize: 13, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 16 }}>{LANG_META[lang].flag}</span>
        <span style={{ fontSize: 12, color: "#999" }}>{LANG_META[lang].native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              style={{
                position: "fixed", bottom: 90, left: 16, right: 16,
                background: "#111", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24, padding: 20, zIndex: 101,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "2px", marginBottom: 14 }}>
                SELECT LANGUAGE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {entries.map(([code, meta]) => (
                  <motion.button
                    key={code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setLang(code); setOpen(false); }}
                    style={{
                      padding: "12px 8px", borderRadius: 14,
                      border: `1px solid ${lang === code ? "rgba(255,0,80,0.5)" : "rgba(255,255,255,0.07)"}`,
                      background: lang === code ? "rgba(255,0,80,0.12)" : "rgba(255,255,255,0.03)",
                      color: lang === code ? "#FF0050" : "#888",
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      fontFamily: "inherit", textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{meta.flag}</div>
                    <div>{meta.native}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
