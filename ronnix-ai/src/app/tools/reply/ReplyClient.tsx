"use client"

import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const TONES = ["Friendly", "Professional", "Apologetic", "Excited"]

export default function ReplyClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout
      title="Reply Helper"
      mm="Customer Reply အမြန်ရ"
      color="var(--green-xl)"
      border="var(--border-g)"
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
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              CUSTOMER COMMENT
            </label>
            <textarea className="inp" rows={3}
              value={input.comment || ""}
              onChange={e => setInput("comment", e.target.value)}
              placeholder="ဥပမာ — size S ရှိသေးသလား? ဈေးလျော့နိုင်မလား?"
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              SHOP CONTEXT (Optional)
            </label>
            <input className="inp"
              value={input.context || ""}
              onChange={e => setInput("context", e.target.value)}
              placeholder="ဥပမာ — Clothing shop, 3-5 days delivery, no refund"
            />
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
