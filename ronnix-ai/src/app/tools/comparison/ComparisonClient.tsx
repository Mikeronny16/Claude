"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

export default function ComparisonClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Comparison Post" mm="ဘာကြောင့် ငါ့ဆိုင်ကို ရွေးသင့်လဲ" color="#FB923C" border="rgba(251,146,60,0.30)" profile={profile} tool="comparison" requiredField="product"
      buildPayload={(input) => ({ product: input.product, advantages: input.advantages })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>သင့်ဆိုင် / ကုန် 🏆</label>
          <input className="inp" value={input.product||""} onChange={e=>setInput("product",e.target.value)} placeholder="ဥပမာ — Mama Fashion · Myanmar handmade clothing shop" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>ဘာတွေ ပိုကောင်းလဲ? ✨</label>
          <textarea className="inp" rows={4} value={input.advantages||""} onChange={e=>setInput("advantages",e.target.value)}
            placeholder={"ဥပမာ —\n• Original မြန်မာ handmade\n• ဈေးနှုန်းသင့်တော် 8000-15000k\n• COD ရ · Return policy ရ\n• Fast delivery 1-2 ရက်"} />
        </div>
      </>)}
    </ToolLayout>
  )
}
