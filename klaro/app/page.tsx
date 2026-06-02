"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const EXAMPLE_TYPES = [
  { emoji: "📋", label: "Contracts", label_mm: "စာချုပ်" },
  { emoji: "🏥", label: "Medical bills", label_mm: "ဆေးဘိုး" },
  { emoji: "🏠", label: "Lease agreements", label_mm: "အငှားစာချုပ်" },
  { emoji: "🏛️", label: "Government forms", label_mm: "အစိုးရပုံစံ" },
  { emoji: "💊", label: "Prescriptions", label_mm: "ဆေးညွှန်း" },
  { emoji: "🏦", label: "Loan documents", label_mm: "ချေးငွေစာ" },
]

export default function Home() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [lang, setLang] = useState<"en" | "mm">("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      setError("Image or PDF file ရွေးပေးပါ")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size 10MB ထက်မကျော်ပါနှင့်")
      return
    }
    setFile(f)
    setError(null)
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("lang", lang)
      const res = await fetch("/api/analyze", { method: "POST", body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Analysis failed")
      }
      const data = await res.json()
      router.push(`/result/${data.id}`)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <Image src="/logo.svg" alt="Klaro" width={140} height={35} priority />
        <div className="flex gap-1 p-1 rounded-full text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setLang("en")}
            className="px-3 py-1 rounded-full font-medium transition-colors"
            style={lang === "en" ? { background: "var(--teal)", color: "white" } : { color: "var(--muted)" }}
          >EN</button>
          <button
            onClick={() => setLang("mm")}
            className="px-3 py-1 rounded-full font-medium transition-colors font-myanmar"
            style={lang === "mm" ? { background: "var(--teal)", color: "white" } : { color: "var(--muted)" }}
          >မြန်မာ</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-10 pb-6 text-center max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: "var(--text)" }}>
          {lang === "en"
            ? "Understand any document instantly"
            : <span className="font-myanmar">စာရွက်တိုင်းကို နားလည်လွယ်စေမည်</span>}
        </h1>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          {lang === "en"
            ? "Photo → plain English explanation with red flags & action items"
            : <span className="font-myanmar">ဓာတ်ပုံရိုက် → ရှင်းလင်းသောရှင်းပြချက် + သတိပြုရမည့်အချက်များ</span>}
        </p>
      </section>

      {/* Upload card */}
      <section className="px-4 max-w-lg mx-auto w-full">
        <div
          className={`upload-zone rounded-2xl p-6 text-center cursor-pointer ${dragging ? "drag-over" : ""}`}
          style={{ background: "white" }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onPick} />

          {preview ? (
            <div className="relative">
              <Image src={preview} alt="Preview" width={400} height={300} className="rounded-xl object-contain mx-auto max-h-52 w-auto" />
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center"
              >✕</button>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl">📄</div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{file.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "var(--teal-light)" }}>
                📸
              </div>
              <div>
                <p className="font-semibold text-base" style={{ color: "var(--text)" }}>
                  {lang === "en" ? "Tap to upload or drag document" : <span className="font-myanmar">ဓာတ်ပုံ သို့မဟုတ် PDF တင်ပါ</span>}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {lang === "en" ? "JPG, PNG, PDF · max 10MB" : <span className="font-myanmar">JPG, PNG, PDF · အများဆုံး 10MB</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Camera shortcut on mobile */}
        <button
          className="mt-3 w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ background: "var(--teal-light)", color: "var(--teal)" }}
          onClick={() => {
            if (fileRef.current) { fileRef.current.accept = "image/*"; fileRef.current.setAttribute("capture", "environment"); fileRef.current.click() }
          }}
        >
          <span>📷</span>
          {lang === "en" ? "Take a photo now" : <span className="font-myanmar">ယခုဓာတ်ပုံရိုက်မည်</span>}
        </button>

        {error && (
          <p className="mt-3 text-sm text-center rounded-xl px-4 py-2 flag-red">{error}</p>
        )}

        <button
          onClick={analyze}
          disabled={!file || loading}
          className="mt-4 w-full py-4 rounded-2xl font-semibold text-base text-white transition-all disabled:opacity-40"
          style={{ background: file ? "var(--teal)" : "var(--border)", color: file ? "white" : "var(--muted)" }}
        >
          {loading
            ? (lang === "en" ? "Analyzing…" : <span className="font-myanmar">လေ့လာနေသည်…</span>)
            : (lang === "en" ? "Explain this document →" : <span className="font-myanmar">ဒီစာရွက်ကိုရှင်းပြပေး →</span>)}
        </button>

        <p className="text-xs text-center mt-3" style={{ color: "var(--muted)" }}>
          {lang === "en" ? "Free · 3 documents/month · No account needed" : <span className="font-myanmar">အခမဲ့ · တစ်လ ၃ ခု · Account မလိုပါ</span>}
        </p>
      </section>

      {/* Doc type chips */}
      <section className="px-4 pt-8 pb-4 max-w-lg mx-auto w-full">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          {lang === "en" ? "Works with" : <span className="font-myanmar">အသုံးပြုနိုင်သည်</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TYPES.map((t) => (
            <span key={t.label} className="text-sm px-3 py-1.5 rounded-full" style={{ background: "white", border: "1px solid var(--border)", color: "var(--text)" }}>
              {t.emoji} {lang === "en" ? t.label : <span className="font-myanmar">{t.label_mm}</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="px-4 pt-4 pb-10 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🚩", en: "Red flags", mm: "သတိပြုရမည်" },
            { icon: "✅", en: "Action items", mm: "လုပ်ဆောင်ရမည်" },
            { icon: "🌐", en: "Myanmar & English", mm: "မြန်မာ & English" },
          ].map((f) => (
            <div key={f.en} className="rounded-xl p-3 text-center" style={{ background: "white", border: "1px solid var(--border)" }}>
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                {lang === "en" ? f.en : <span className="font-myanmar">{f.mm}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-xs border-t" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <p>Klaro · {lang === "en" ? "Not legal or medical advice." : <span className="font-myanmar">ဤရှင်းပြချက်သည် တရားဥပဒေ / ဆေးပညာဆိုင်ရာ အကြံပြုချက် မဟုတ်ပါ။</span>}</p>
      </footer>

    </div>
  )
}
