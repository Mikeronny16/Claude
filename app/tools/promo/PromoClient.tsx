"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const PLATFORMS = ["Facebook", "TikTok", "Telegram", "Instagram"]
const OFFERS = ["% Discount", "Bundle Deal", "Free Delivery", "Buy 1 Get 1", "Limited Stock"]

export default function PromoClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Promo Post" mm="Flash Sale / ပရိုမိုး post" color="#FF3B6F" border="rgba(255,59,111,0.30)" profile={profile} tool="promo" requiredField="product"
      buildPayload={(input) => ({ product: input.product, offer: input.offer, deadline: input.deadline, platform: input.platform || "Facebook" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ကုန်ပစ္စည်း 🔥</label>
          <input className="inp" value={input.product||""} onChange={e=>setInput("product",e.target.value)} placeholder="ဥပမာ — Summer Dress Collection · Skincare Set" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>OFFER TYPE</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {OFFERS.map(o=>(
              <button key={o} onClick={()=>setInput("offer",o)} style={{ padding:"9px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                background: input.offer===o ? "#FF3B6F" : "rgba(255,255,255,0.05)",
                color: input.offer===o ? "#fff" : "var(--muted)", transition:"all 0.15s" }}>{o}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>Offer Details ✍️</label>
          <input className="inp" value={input.offer||""} onChange={e=>setInput("offer",e.target.value)} placeholder="ဥပမာ — 20% off · 3 ထည်ဝယ်ရင် 1 ထည်ဆောင် · ဒီနေ့ညထိပဲ" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>PLATFORM</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {PLATFORMS.map(p=>(
                <button key={p} onClick={()=>setInput("platform",p)} style={{ padding:"8px 12px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", border:"none",
                  background: input.platform===p ? "#FF3B6F" : "rgba(255,255,255,0.05)",
                  color: input.platform===p ? "#fff" : "var(--muted)", transition:"all 0.15s" }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>Deadline (Optional)</label>
            <input className="inp" value={input.deadline||""} onChange={e=>setInput("deadline",e.target.value)} placeholder="ဒီနေ့ ညတစ်နာရီထိ" />
          </div>
        </div>
      </>)}
    </ToolLayout>
  )
}
