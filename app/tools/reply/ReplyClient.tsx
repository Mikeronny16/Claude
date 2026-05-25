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
      requiredField="comment"
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
              Customer ရဲ့ Comment 💬
            </label>
            <textarea className="inp" rows={3}
              value={input.comment || ""}
              onChange={e => setInput("comment", e.target.value)}
              placeholder={"ဥပမာ —\n\"size S ရှိသေးသလား?\"\n\"ဈေးလျော့နိုင်မလား?\"\n\"delivery ဘယ်နှစ်ရက် ကြာလဲ?\""}
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              Shop အကြောင်း (Optional)
            </label>
            <input className="inp"
              value={input.context || ""}
              onChange={e => setInput("context", e.target.value)}
              placeholder="ဥပမာ — Clothing shop · 3 ရက် delivery · COD ရ · No refund"
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>TONE</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setInput("tone", t)} style={{
                  padding:"10px 16px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
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
