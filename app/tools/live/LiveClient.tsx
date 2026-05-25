"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const DURATIONS = ["10 မိနစ်", "30 မိနစ်", "1 နာရီ"]

export default function LiveClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="FB Live Script" mm="Facebook Live ရောင်းချ script" color="#FF6B35" border="rgba(255,107,53,0.30)" profile={profile} tool="live" requiredField="product"
      buildPayload={(input) => ({ product: input.product, price: input.price, benefit: input.benefit, duration: input.duration || "30 မိနစ်" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ဘာ ရောင်းမလဲ 📦</label>
          <input className="inp" value={input.product||""} onChange={e=>setInput("product",e.target.value)} placeholder="ဥပမာ — Pink Linen Dress · Summer Collection" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ဈေးနှုန်း MMK</label>
            <input className="inp" type="number" value={input.price||""} onChange={e=>setInput("price",e.target.value)} placeholder="25000" />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>DURATION</label>
            <div style={{ display:"flex", gap:6 }}>
              {DURATIONS.map(d=>(
                <button key={d} onClick={()=>setInput("duration",d)} style={{ flex:1, padding:"10px 4px", borderRadius:10, fontSize:11, fontWeight:700, cursor:"pointer", border:"none",
                  background: input.duration===d ? "#FF6B35" : "rgba(255,255,255,0.05)",
                  color: input.duration===d ? "#fff" : "var(--muted)", transition:"all 0.15s" }}>{d}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>အဓိ့က Selling Point ✨</label>
          <input className="inp" value={input.benefit||""} onChange={e=>setInput("benefit",e.target.value)} placeholder="ဥပမာ — ချည်ထည်မို့ အေးတယ် · Size ကြီးရ · Delivery fast" />
        </div>
      </>)}
    </ToolLayout>
  )
}
