"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const PLATFORMS = ["Facebook", "TikTok", "Instagram"]
const CATS = ["Clothing", "Skincare", "Food", "Electronics", "Accessories", "Home", "Other"]

export default function HashtagsClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Hashtag Generator" mm="Myanmar seller hashtag pack" color="#47C8FF" border="rgba(71,200,255,0.30)" profile={profile} tool="hashtags" requiredField="product"
      buildPayload={(input) => ({ product: input.product, category: input.category || "Clothing", platform: input.platform || "Facebook" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ကုန်ပစ္စည်း / Content 🏷️</label>
          <input className="inp" value={input.product||""} onChange={e=>setInput("product",e.target.value)} placeholder="ဥပမာ — Pink summer dress · K-beauty skincare" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>CATEGORY</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setInput("category",c)} style={{ padding:"8px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                background: input.category===c ? "#47C8FF" : "rgba(255,255,255,0.05)",
                color: input.category===c ? "#020704" : "var(--muted)", transition:"all 0.15s" }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>PLATFORM</label>
          <div style={{ display:"flex", gap:8 }}>
            {PLATFORMS.map(p=>(
              <button key={p} onClick={()=>setInput("platform",p)} style={{ flex:1, padding:"10px 8px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                background: input.platform===p ? "#47C8FF" : "rgba(255,255,255,0.05)",
                color: input.platform===p ? "#020704" : "var(--muted)", transition:"all 0.15s" }}>{p}</button>
            ))}
          </div>
        </div>
      </>)}
    </ToolLayout>
  )
}
