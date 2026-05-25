"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const STYLES = ["Friendly", "Professional", "Emotional", "Simple"]

export default function TestimonialClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Testimonial" mm="Customer review ကို post ဖြစ်အောင်" color="#00D2B8" border="rgba(0,210,184,0.30)" profile={profile} tool="testimonial" requiredField="raw"
      buildPayload={(input) => ({ raw: input.raw, style: input.style || "Friendly" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>Customer မှာတဲ့ Message ⭐</label>
          <textarea className="inp" rows={4} value={input.raw||""} onChange={e=>setInput("raw",e.target.value)}
            placeholder={"ဥပမာ —\n\"ဒဿ ဝတ်ကောင်းတာပဲ size လည်း မှန်တယ် delivery လည်း မြန်တယ် 5 stars\""} />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>STYLE</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {STYLES.map(s=>(
              <button key={s} onClick={()=>setInput("style",s)} style={{ padding:"10px 16px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
                background: input.style===s ? "#00D2B8" : "rgba(255,255,255,0.05)",
                color: input.style===s ? "#020704" : "var(--muted)", transition:"all 0.15s" }}>{s}</button>
            ))}
          </div>
        </div>
      </>)}
    </ToolLayout>
  )
}
