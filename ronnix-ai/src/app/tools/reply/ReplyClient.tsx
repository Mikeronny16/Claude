"use client"

import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const TONES = ["Friendly", "Professional", "Apologetic", "Excited"]

export default function ReplyClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout
      title="Reply Helper"
      mm="Comment Reply လုပ်ပေးသည်"
      color="#F59E0B"
      profile={profile}
      tool="reply"
      buildPayload={(input) => ({
        comment: input.comment,
        context: input.context,
        tone: input.tone || "Friendly",
      })}
    >
      {({ input, setInput }) => (
        <>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Customer Comment
            </label>
            <textarea
              value={input.comment || ""}
              onChange={(e) => setInput("comment", e.target.value)}
              rows={3}
              placeholder="ဥပမာ - ဒီဝတ်စုံ size S ရှိသေးသလား? ဈေးလျော့ပေးနိုင်မလား?"
              className="w-full px-4 py-3 rounded-xl text-sm font-mm outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Shop Context (optional)
            </label>
            <input
              value={input.context || ""}
              onChange={(e) => setInput("context", e.target.value)}
              placeholder="ဥပမာ - Clothing shop, 3-5 days delivery, no refund"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setInput("tone", t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: input.tone === t ? "#F59E0B" : "var(--surface)",
                    color: input.tone === t ? "#000" : "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </ToolLayout>
  )
}
