"use client"

import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

export default function DescriptionClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout
      title="Product Description"
      mm="ကုန်ပစ္စည်းဖော်ပြချက် ရေးပေးသည်"
      color="#10B981"
      profile={profile}
      tool="description"
      buildPayload={(input) => ({
        product: input.product,
        features: input.features,
        price: input.price,
      })}
    >
      {({ input, setInput }) => (
        <>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              ကုန်ပစ္စည်း အမည်
            </label>
            <input
              value={input.product || ""}
              onChange={(e) => setInput("product", e.target.value)}
              placeholder="ဥပမာ - Floral Linen Blouse"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Feature / Details
            </label>
            <textarea
              value={input.features || ""}
              onChange={(e) => setInput("features", e.target.value)}
              rows={3}
              placeholder="ဥပမာ - Size S/M/L, cotton material, handwash, 3 colors available..."
              className="w-full px-4 py-3 rounded-xl text-sm font-mm outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              ဈေးနှုန်း (MMK) — Optional
            </label>
            <input
              type="number"
              value={input.price || ""}
              onChange={(e) => setInput("price", e.target.value)}
              placeholder="ဥပမာ - 18000"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        </>
      )}
    </ToolLayout>
  )
}
