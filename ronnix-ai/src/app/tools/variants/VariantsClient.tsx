"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const PLATFORMS = ["Facebook", "TikTok", "Instagram", "Telegram"]

export default function VariantsClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Caption Variants" mm="Caption 3 မျိုးတစ်ချက်တည်းရ" color="#A3FF47" border="rgba(163,255,71,0.30)" profile={profile} tool="variants" requiredField="product"
      buildPayload={(input) => ({ product: input.product, platform: input.platform || "Facebook" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ကုန်ပစ္စည်း / Post အကြောင်း ✍️</label>
          <textarea className="inp" rows={4} value={input.product||""} onChange={e=>setInput("product",e.target.value)}
            placeholder={"ဥပမာ —\nပန်းရောင် summer dress\nSize S/M/L · 18,000 MMK · Delivery ရ"} />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>PLATFORM</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {PLATFORMS.map(p=>(
              <button key={p} onClick={()=>setInput("platform",p)} style={{ padding:"10px 16px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
                background: input.platform===p ? "#A3FF47" : "rgba(255,255,255,0.05)",
                color: input.platform===p ? "#020704" : "var(--muted)", transition:"all 0.15s" }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ padding:"12px 14px", borderRadius:12, background:"rgba(163,255,71,0.06)", border:"1px solid rgba(163,255,71,0.2)" }}>
          <p style={{ fontSize:11, color:"rgba(163,255,71,0.8)", fontWeight:700 }}>✦ Professional · Fun & Casual · Urgency & Sales — 3 versions generate ဖြစ်မည်</p>
        </div>
      </>)}
    </ToolLayout>
  )
}
