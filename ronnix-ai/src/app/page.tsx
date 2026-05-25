"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, ArrowRight, Zap, Star, Quote } from "lucide-react"

const TOOLS = [
  { icon: <Sparkles className="w-5 h-5" />, title: "Caption Generator", mm: "Caption ရေးပေးသည်", color: "var(--yellow)", border: "var(--border-y)" },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Reply Helper", mm: "Reply အမြန်ရ", color: "var(--green-xl)", border: "var(--border-g)" },
  { icon: <FileText className="w-5 h-5" />, title: "Product Description", mm: "ကုန်ဖော်ပြချက်", color: "#6EE7B7", border: "rgba(110,231,183,0.25)" },
]

const FADE = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Mesh background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)",
          width:700, height:500, borderRadius:"50%", opacity:0.13,
          background:"radial-gradient(ellipse, #3D7A1F, transparent 70%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", top:"30%", right:"-10%",
          width:400, height:400, borderRadius:"50%", opacity:0.08,
          background:"radial-gradient(ellipse, #FECB00, transparent 70%)", filter:"blur(100px)" }} />
        <div style={{ position:"absolute", bottom:"10%", left:"-5%",
          width:350, height:350, borderRadius:"50%", opacity:0.07,
          background:"radial-gradient(ellipse, #52A628, transparent 70%)", filter:"blur(80px)" }} />
        {/* Grid lines */}
        <div style={{ position:"absolute", inset:0, opacity:0.03,
          backgroundImage:"linear-gradient(var(--border-g) 1px, transparent 1px), linear-gradient(90deg, var(--border-g) 1px, transparent 1px)",
          backgroundSize:"60px 60px" }} />
      </div>

      {/* ── Nav ── */}
      <nav style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"20px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"var(--yellow)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Zap style={{ width:18, height:18, color:"#020704" }} />
          </div>
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:-0.5 }} className="grad-yg">RONNIX</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Link href="/auth" style={{ fontSize:13, fontWeight:600, color:"var(--muted)", textDecoration:"none" }}>Log in</Link>
          <Link href="/auth" className="btn-yellow" style={{ padding:"10px 20px", fontSize:13, borderRadius:12 }}>
            စတင်ပါ →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position:"relative", zIndex:10, padding:"60px 24px 80px", maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ duration:0.7 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px",
            borderRadius:100, fontSize:12, fontWeight:700, letterSpacing:0.5, marginBottom:28,
            background:"rgba(254,203,0,0.08)", border:"1px solid var(--border-y)", color:"var(--yellow)" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--yellow)", display:"inline-block",
              animation:"pulse 2s infinite" }} />
            Myanmar Online Sellers AI Platform
          </div>

          <h1 style={{ fontSize:"clamp(42px,8vw,80px)", fontWeight:900, lineHeight:1.05,
            letterSpacing:-2, marginBottom:24 }}>
            <span style={{ color:"var(--text)" }}>ရောင်းချမှု</span><br />
            <span className="grad-yg">10x မြန်မည်</span>
          </h1>

          <p className="font-mm" style={{ fontSize:16, color:"var(--muted)", maxWidth:440,
            margin:"0 auto 36px", lineHeight:1.8 }}>
            Caption ရေးခြင်း · Customer reply · ကုန်ဖော်ပြချက် —
            AI က 5 စက္ကန့်အတွင်း professional ဆန်ဆန် ရေးပေးသည်
          </p>

          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:12 }}>
            <Link href="/auth" className="btn-yellow">
              <Zap style={{ width:16, height:16 }} />
              အခမဲ့ စမ်းကြည့်ပါ
            </Link>
            <Link href="#how" className="btn-ghost">ဘယ်လိုအလုပ်လုပ်လဲ →</Link>
          </div>

          <p className="font-mm" style={{ marginTop:16, fontSize:12, color:"var(--muted2)" }}>
            Credit card မလိုပါ · Sign up မှာ 10 credits ချက်ချင်းရသည်
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{ display:"flex", justifyContent:"center", gap:40, marginTop:60 }}
          variants={FADE} initial="hidden" animate="show" transition={{ delay:0.3 }}>
          {[["&lt;5s","Generate time"],["3","AI Tools"],["Free","To start"]].map(([n,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:900 }} className="grad-yg" dangerouslySetInnerHTML={{__html:n}} />
              <div style={{ fontSize:11, color:"var(--muted2)", marginTop:4, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Tools ── */}
      <section style={{ position:"relative", zIndex:10, padding:"60px 24px", maxWidth:1100, margin:"0 auto" }}>
        <motion.div style={{ textAlign:"center", marginBottom:40 }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{once:true}}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:"var(--yellow)", marginBottom:12 }}>TOOLS 3 ခု</p>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:-1 }}>Daily သုံးမည့် tools</h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {TOOLS.map((t, i)=>(
            <motion.div key={t.title} className="glass" style={{ padding:28 }}
              variants={FADE} initial="hidden" whileInView="show" viewport={{once:true}}
              transition={{ delay:i*0.12 }} whileHover={{ y:-4, scale:1.01 }}>
              <div style={{ width:44, height:44, borderRadius:14, display:"flex", alignItems:"center",
                justifyContent:"center", marginBottom:18,
                background:`${t.color}18`, border:`1px solid ${t.border}`, color:t.color }}>
                {t.icon}
              </div>
              <h3 style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>{t.title}</h3>
              <p className="font-mm" style={{ fontSize:12, color:t.color, marginBottom:8, fontWeight:600 }}>{t.mm}</p>
              <div style={{ height:1, background:"var(--border)", margin:"14px 0" }} />
              <Link href="/auth" style={{ fontSize:12, fontWeight:700, color:t.color,
                textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                Use now <ArrowRight style={{width:14,height:14}} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ position:"relative", zIndex:10, padding:"60px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div className="glass" style={{ padding:"48px 40px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:300, height:300, borderRadius:"50%",
            background:"radial-gradient(var(--yellow), transparent 70%)", opacity:0.06, filter:"blur(60px)" }} />
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:"var(--yellow)", marginBottom:12 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:-1, marginBottom:40 }}>3 ဆင့်သာ</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              { n:"01", title:"Type ထည့်", mm:"ကုန်ပစ္စည်း သို့မဟုတ် comment ကို ရိုက်ထည့်ပါ" },
              { n:"02", title:"Generate", mm:"AI က 5 စက္ကန့်အတွင်း Myanmar/English ရေးပေးမည်" },
              { n:"03", title:"Copy & Post", mm:"Copy ပြီး Facebook / TikTok / Telegram မှာ paste" },
            ].map((s,i)=>(
              <motion.div key={s.n} variants={FADE} initial="hidden" whileInView="show"
                viewport={{once:true}} transition={{delay:i*0.1}}>
                <div style={{ fontSize:40, fontWeight:900, lineHeight:1, marginBottom:12 }} className="grad-gy">{s.n}</div>
                <p style={{ fontWeight:800, marginBottom:8 }}>{s.title}</p>
                <p className="font-mm" style={{ fontSize:12, color:"var(--muted)", lineHeight:1.7 }}>{s.mm}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ position:"relative", zIndex:10, padding:"60px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:"var(--yellow)", marginBottom:12 }}>PRICING</p>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:-1 }}>Wave Money နဲ့ ပေးချေ</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, maxWidth:700, margin:"0 auto" }}>
          {[
            { name:"Free", price:"0", unit:"MMK", note:"3 ကြိမ်/နေ့ + 10 signup credits", cta:"စတင်", href:"/auth", highlight:false },
            { name:"500 Credits", price:"3,900", unit:"MMK", note:"Expire မဖြစ်ပါ", cta:"ဝယ်ယူ", href:"/pricing", highlight:true },
            { name:"1,500 Credits", price:"9,900", unit:"MMK", note:"Best value", cta:"ဝယ်ယူ", href:"/pricing", highlight:false },
          ].map(p=>(
            <div key={p.name} style={{ padding:24, borderRadius:20, position:"relative",
              background: p.highlight ? "rgba(254,203,0,0.07)" : "var(--glass)",
              border: p.highlight ? "1px solid var(--border-y)" : "1px solid var(--border-g)",
              boxShadow: p.highlight ? "0 0 40px rgba(254,203,0,0.12)" : "none" }}>
              {p.highlight && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                background:"var(--yellow)", color:"#020704", fontSize:10, fontWeight:800,
                padding:"4px 12px", borderRadius:100, whiteSpace:"nowrap" }}>⭐ Popular</div>}
              <p style={{ fontSize:11, fontWeight:700, color: p.highlight ? "var(--yellow)" : "var(--muted)", marginBottom:8 }}>{p.name}</p>
              <div style={{ fontSize:28, fontWeight:900, marginBottom:4 }}>{p.price} <span style={{ fontSize:13, fontWeight:500, color:"var(--muted)" }}>{p.unit}</span></div>
              <p className="font-mm" style={{ fontSize:11, color:"var(--muted2)", marginBottom:16 }}>{p.note}</p>
              <Link href={p.href} style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:12,
                background: p.highlight ? "var(--yellow)" : "rgba(255,255,255,0.06)",
                color: p.highlight ? "#020704" : "var(--text)",
                fontWeight:700, fontSize:13, textDecoration:"none" }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founder ── */}
      <section style={{ position:"relative", zIndex:10, padding:"60px 24px 80px", maxWidth:700, margin:"0 auto" }}>
        <motion.div className="glass-y" style={{ padding:"40px 36px" }}
          variants={FADE} initial="hidden" whileInView="show" viewport={{once:true}}>
          <Quote style={{ width:32, height:32, color:"var(--yellow)", opacity:0.6, marginBottom:20 }} />
          <p className="font-mm" style={{ fontSize:17, lineHeight:1.9, color:"var(--text)", marginBottom:28, fontWeight:500 }}>
            &ldquo;Myanmar မှာ online ရောင်းချသူတိုင်း AI ကို သုံးနိုင်ဖို့ ဆောက်တာ —
            ဈေးကြီးတဲ့ tool မဟုတ်ဘဲ၊ တကယ်အသုံးဝင်တဲ့ tool ဖြစ်ဖို့ Ronnix ကို တည်ဆောက်ခဲ့တယ်။&rdquo;
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,var(--green),var(--yellow))",
              display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:18, color:"#020704", flexShrink:0 }}>
              M
            </div>
            <div>
              <p style={{ fontWeight:800, fontSize:15 }}>Mike Ronny</p>
              <p style={{ fontSize:12, color:"var(--yellow)", fontWeight:600 }}>Founder · Ronnix AI</p>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
              {[1,2,3,4,5].map(s=><Star key={s} style={{width:13,height:13,fill:"var(--yellow)",color:"var(--yellow)"}} />)}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative", zIndex:10, padding:"40px 24px 80px", textAlign:"center" }}>
        <motion.div variants={FADE} initial="hidden" whileInView="show" viewport={{once:true}}>
          <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:-1, marginBottom:16 }}>
            အခုပဲ <span className="grad-yg">စတင်ပါ</span>
          </h2>
          <p className="font-mm" style={{ color:"var(--muted)", marginBottom:28, fontSize:14 }}>
            Sign up တာနဲ့ 10 credits ချက်ချင်းရသည်
          </p>
          <Link href="/auth" className="btn-yellow">
            <Zap style={{width:16,height:16}} /> အခမဲ့ Register လုပ်ပါ
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position:"relative", zIndex:10, borderTop:"1px solid var(--border)",
        padding:"24px", textAlign:"center", color:"var(--muted2)", fontSize:12 }}>
        <p className="font-mm">© 2025 Ronnix AI · Mike Ronny · Myanmar Sellers အတွက်</p>
        <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:12 }}>
          {[["Pricing","/pricing"],["Dashboard","/dashboard"],["Login","/auth"]].map(([l,h])=>(
            <Link key={l} href={h} style={{ color:"var(--muted2)", textDecoration:"none", fontSize:12, fontWeight:500 }}
              className="hover:text-white">{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
