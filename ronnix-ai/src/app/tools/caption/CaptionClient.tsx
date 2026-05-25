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
      color="var(--yellow)"
      border="var(--border-y)"
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
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              POST / ကုန်ပစ္စည်း အကြောင်း
            </label>
            <textarea className="inp" rows={4}
              value={input.product || ""}
              onChange={e => setInput("product", e.target.value)}
              placeholder="ဥပမာ — ပန်းရောင် summer dress, size S-XL, ချည်ထည် ..."
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>PLATFORM</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setInput("platform", p)} style={{
                  padding:"7px 16px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                  background: input.platform === p ? "var(--yellow)" : "rgba(255,255,255,0.05)",
                  color: input.platform === p ? "#020704" : "var(--muted)",
                  transition:"all 0.15s",
                }}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>TONE</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setInput("tone", t)} style={{
                  padding:"7px 16px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                  background: input.tone === t ? "var(--green)" : "rgba(255,255,255,0.05)",
                  color: input.tone === t ? "#fff" : "var(--muted)",
                  transition:"all 0.15s",
                }}>{t}</button>
              ))}
            </div>
          </div>
        </>
      )}
    </ToolLayout>
  )
}
