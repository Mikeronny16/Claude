"use client"

import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const TONES = ["Friendly", "Professional", "Fun", "Urgent", "Trendy"]
const PLATFORMS = ["Facebook", "TikTok", "Instagram", "Telegram"]

export default function CaptionClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout
      title="Caption Generator"
      mm="Caption ရေးပေးသည်"
      color="#8B5CF6"
      profile={profile}
      tool="caption"
      buildPayload={(input) => ({
        product: input.product,
        tone: input.tone || "Friendly",
        platform: input.platform || "Facebook",
      })}
    >
      {({ input, setInput }) => (
        <>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              ကုန်ပစ္စည်း / Post အကြောင်း
            </label>
            <textarea
              value={input.product || ""}
              onChange={(e) => setInput("product", e.target.value)}
              rows={3}
              placeholder="ဥပမာ - ကြက်သားဒယ်မြိုးဆောင်း လှပပြီး ဝတ်ဆင်ရ သက်တောင့်သက်သာ..."
              className="w-full px-4 py-3 rounded-xl text-sm font-mm outline-none resize-none transition-colors"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput("platform", p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: input.platform === p ? "#8B5CF6" : "var(--surface)",
                    color: input.platform === p ? "white" : "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
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
                    background: input.tone === t ? "#8B5CF6" : "var(--surface)",
                    color: input.tone === t ? "white" : "var(--muted)",
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
