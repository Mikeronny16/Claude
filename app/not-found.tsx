import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 24px", textAlign: "center",
    }}>
      <div style={{
        fontSize: 72, fontWeight: 900, lineHeight: 1,
        background: "linear-gradient(135deg, var(--yellow), var(--green-xl))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: 16,
      }}>404</div>
      <p style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Page မတွေ့ပါ</p>
      <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
        ဒီ page မရှိပါ သို့မဟုတ် ရွှေ့ပြောင်းသွားပြီဖြစ်နိုင်သည်
      </p>
      <Link href="/dashboard" style={{
        padding: "12px 28px", borderRadius: 14, fontWeight: 700, fontSize: 14,
        background: "var(--yellow)", color: "#020704", textDecoration: "none",
      }}>
        Dashboard သို့ပြန်သွား
      </Link>
    </div>
  )
}
