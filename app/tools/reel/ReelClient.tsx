"use client"
import ToolLayout from "@/components/ToolLayout"
import type { Profile } from "@/lib/supabase"

const PLATFORMS = ["TikTok", "Instagram Reels", "Facebook Reels"]
const HOOKS = ["Product showcase", "Before & After", "Price reveal", "Unboxing", "Outfit of day", "Tutorial"]

export default function ReelClient({ profile }: { profile: Profile | null }) {
  return (
    <ToolLayout title="Reel Caption" mm="Short video caption punchy" color="#BF5FFF" border="rgba(191,95,255,0.30)" profile={profile} tool="reel" requiredField="topic"
      buildPayload={(input) => ({ topic: input.topic, hook: input.hook, platform: input.platform || "TikTok" })}>
      {({ input, setInput }) => (<>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>Video အကြောင်း 🎬</label>
          <input className="inp" value={input.topic||""} onChange={e=>setInput("topic",e.target.value)} placeholder="ဥပမာ — Pink dress OOTD · Skincare morning routine" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>HOOK / ANGLE</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {HOOKS.map(h=>(
              <button key={h} onClick={()=>setInput("hook",h)} style={{ padding:"8px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                background: input.hook===h ? "#BF5FFF" : "rgba(255,255,255,0.05)",
                color: input.hook===h ? "#fff" : "var(--muted)", transition:"all 0.15s" }}>{h}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:700, color:"var(--muted)", display:"block", marginBottom:8, letterSpacing:1 }}>PLATFORM</label>
          <div style={{ display:"flex", gap:8 }}>
            {PLATFORMS.map(p=>(
              <button key={p} onClick={()=>setInput("platform",p)} style={{ flex:1, padding:"10px 6px", borderRadius:10, fontSize:11, fontWeight:700, cursor:"pointer", border:"none",
                background: input.platform===p ? "#BF5FFF" : "rgba(255,255,255,0.05)",
                color: input.platform===p ? "#fff" : "var(--muted)", transition:"all 0.15s" }}>{p}</button>
            ))}
          </div>
        </div>
      </>)}
    </ToolLayout>
  )
}
