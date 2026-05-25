"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const FESTIVALS = ["သင်္ကြန် (Thingyan)", "သိန်းတန်းကုတ်", "ဒီပဲဝင်း", "ကြာဆုတ်", "ခရစ်စမတ်", "နှစ်သစ်", "Eid", "Mothers Day", "Valentines"]

export default function SeasonalClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Seasonal Campaign" mm="ပွဲတော် special post" color="#FFD166" border="rgba(255,209,102,0.35)" profile={profile} tool="seasonal" requiredField="product"
      buildPayload={(input) => ({ festival: input.festival || "သင်္ကြန်", product: input.product, offer: input.offer })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ပွဲတော် 🎊</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FESTIVALS.map(f=>(
              <button key={f} onClick={()=>setInput("festival",f)} style={{ padding:"8px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                background: input.festival===f ? "#FFD166" : "rgba(255,255,255,0.05)",
                color: input.festival===f ? "#020704" : "var(--muted)", transition:"all 0.15s" }}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ကုန်ပစ္စည်း / ဆိုင် 📦</label>
          <input className="inp" value={input.product||""} onChange={e=>setInput("product",e.target.value)} placeholder="ဥပမာ — Myanmar traditional dress · Gift sets" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>Special Offer (Optional)</label>
          <input className="inp" value={input.offer||""} onChange={e=>setInput("offer",e.target.value)} placeholder="ဥပမာ — 15% off · Free gift wrapping · Special bundle" />
        </div>
      </>)}
    </ToolLayout>
  )
}
