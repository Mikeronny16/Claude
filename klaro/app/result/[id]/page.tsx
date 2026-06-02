import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { fetchDocument } from "@/lib/supabase"
import { DocumentAnalysis } from "@/lib/claude"
import ShareButton from "./ShareButton"

const RISK_COLORS = {
  high: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", label: "High Risk" },
  medium: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", label: "Some Concerns" },
  low: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", label: "Mostly OK" },
  none: { bg: "#F0F9FF", border: "#BAE6FD", text: "#0284C7", label: "No Issues" },
}

const SEVERITY_COLORS = {
  high: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", icon: "🔴" },
  medium: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", icon: "🟡" },
  low: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", icon: "🟢" },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const doc = await fetchDocument(id)
  if (!doc) notFound()

  const a = doc.analysis as unknown as DocumentAnalysis
  const isMM = doc.lang === "mm"
  const risk = RISK_COLORS[a.overall_risk] || RISK_COLORS.low

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 bg-white border-b sticky top-0 z-10" style={{ borderColor: "var(--border)" }}>
        <Link href="/">
          <Image src="/logo.svg" alt="Klaro" width={120} height={30} />
        </Link>
        <ShareButton lang={doc.lang} />
      </nav>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">

        {/* Overall risk badge */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
          <div className="text-2xl">{a.overall_risk === "high" ? "⚠️" : a.overall_risk === "medium" ? "⚡" : a.overall_risk === "none" ? "✅" : "👀"}</div>
          <div>
            <p className="font-semibold text-sm" style={{ color: risk.text }}>{risk.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {isMM
                ? <span className="font-myanmar">{a.doc_type_mm}</span>
                : a.doc_type}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
            {isMM ? <span className="font-myanmar">အကျဉ်းချုပ်</span> : "Summary"}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
            {isMM
              ? <span className="font-myanmar">{a.summary_mm}</span>
              : a.summary}
          </p>
        </div>

        {/* Red flags */}
        {a.red_flags.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
              {isMM ? <span className="font-myanmar">သတိပြုရမည့်အချက်များ</span> : `Red Flags (${a.red_flags.length})`}
            </h2>
            <div className="space-y-2">
              {a.red_flags.map((flag, i) => {
                const sc = SEVERITY_COLORS[flag.severity]
                return (
                  <div key={i} className="rounded-xl p-3 flex gap-3" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                    <span className="text-base flex-shrink-0">{sc.icon}</span>
                    <p className="text-sm leading-relaxed" style={{ color: sc.text }}>
                      {isMM
                        ? <span className="font-myanmar">{flag.text_mm}</span>
                        : flag.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action items */}
        {a.action_items.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
              {isMM ? <span className="font-myanmar">ဆောင်ရွက်ရမည့်အချက်များ</span> : "Action Items"}
            </h2>
            <div className="space-y-2">
              {a.action_items.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: "var(--teal)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                      {isMM
                        ? <span className="font-myanmar">{item.text_mm}</span>
                        : item.text}
                    </p>
                    {item.deadline && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                        ⏰ {item.deadline}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key terms */}
        {a.key_terms.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
              {isMM ? <span className="font-myanmar">အဓိကဝေါဟာရများ</span> : "Key Terms Explained"}
            </h2>
            <div className="space-y-3">
              {a.key_terms.map((t, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold" style={{ color: "var(--teal)" }}>{t.term}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text)" }}>
                    {isMM
                      ? <span className="font-myanmar">{t.meaning_mm}</span>
                      : t.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-2xl p-4 text-center" style={{ background: "#F8F7F4", border: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {isMM
              ? <span className="font-myanmar">ဤရှင်းပြချက်သည် နားလည်ရန်သာဖြစ်ပြီး တရားဥပဒေ သို့မဟုတ် ဆေးပညာဆိုင်ရာ အကြံပြုချက် မဟုတ်ပါ။</span>
              : "This explanation is for understanding only. Not legal or medical advice. Always consult a professional for important decisions."}
          </p>
        </div>

        {/* Analyze another */}
        <Link href="/" className="block">
          <button className="w-full py-4 rounded-2xl font-semibold text-base text-white" style={{ background: "var(--teal)" }}>
            {isMM
              ? <span className="font-myanmar">နောက်ထပ်စာရွက်တစ်ခု ရှင်းပြမည် →</span>
              : "Explain another document →"}
          </button>
        </Link>

      </main>
    </div>
  )
}
