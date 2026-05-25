"use client"

import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

export default function DescriptionClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout
      title="Product Description"
      mm="ကုန်ဖော်ပြချက် Pro ဆန်ဆန်"
      color="#6EE7B7"
      border="rgba(110,231,183,0.25)"
      profile={profile}
      tool="description"
      requiredField="product"
      buildPayload={(input) => ({
        product: input.product,
        features: input.features,
        price: input.price,
      })}
    >
      {({ input, setInput }) => (
        <>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              ကုန်ပစ္စည်း အမည်
            </label>
            <input className="inp"
              value={input.product || ""}
              onChange={e => setInput("product", e.target.value)}
              placeholder="ဥပမာ — Floral Linen Blouse"
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              FEATURES / DETAILS
            </label>
            <textarea className="inp" rows={3}
              value={input.features || ""}
              onChange={e => setInput("features", e.target.value)}
              placeholder="ဥပမာ — Size S/M/L, cotton material, 3 colors available..."
            />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>
              ဈေးနှုန်း MMK (Optional)
            </label>
            <input className="inp" type="number"
              value={input.price || ""}
              onChange={e => setInput("price", e.target.value)}
              placeholder="18000"
            />
          </div>
        </>
      )}
    </ToolLayout>
  )
}
