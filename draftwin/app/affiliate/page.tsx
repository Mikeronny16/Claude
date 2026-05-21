import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Program — DraftWin",
  description: "Earn 30% commission on every DraftWin sale you refer. Share with freelancers and get paid every time they buy credits.",
  openGraph: {
    title: "Earn Money with DraftWin Affiliate Program",
    description: "30% commission on every sale. Share with freelancers, earn every time they buy credits.",
    url: "https://claude-hsmg.vercel.app/affiliate",
  },
};

const STEPS = [
  { num: "1", title: "Join for free", desc: "Email us to get your unique referral link. Takes 2 minutes." },
  { num: "2", title: "Share with freelancers", desc: "Post in freelance groups, YouTube, TikTok, your blog, anywhere." },
  { num: "3", title: "Earn 30% commission", desc: "Every time someone buys credits through your link, you get 30%." },
];

const EARNING = [
  { pkg: "Starter ($5)", commission: "$1.50", per: "per sale" },
  { pkg: "Pro ($15)", commission: "$4.50", per: "per sale" },
  { pkg: "Power ($39)", commission: "$11.70", per: "per sale" },
];

export default function AffiliatePage() {
  const emailSubject = encodeURIComponent("DraftWin Affiliate Program Application");
  const emailBody = encodeURIComponent("Hi Mike,\n\nI'd like to join the DraftWin affiliate program.\n\nMy platform/audience:\n[describe your audience — blog, YouTube, Facebook group, etc.]\n\nThank you!");
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=mikeronny18@gmail.com&su=${emailSubject}&body=${emailBody}`;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f0d", color: "#e2e8f0" }}>
      <nav style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" style={{ color: "#10B981", fontWeight: 900, fontSize: "1.1rem", textDecoration: "none" }}>
          ← DraftWin
        </Link>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>💰</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>
            Earn with DraftWin
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9CA3AF", maxWidth: 500, margin: "0 auto 1.5rem" }}>
            Share DraftWin with freelancers. Earn <strong style={{ color: "#10B981" }}>30% commission</strong> on every credit pack they buy.
          </p>
          <a href={gmailLink} target="_blank" rel="noreferrer" style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontWeight: 800,
            borderRadius: "0.875rem",
            textDecoration: "none",
            fontSize: "1rem",
          }}>
            📧 Apply Now — It&apos;s Free
          </a>
        </div>

        {/* Earnings */}
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "1.5rem", padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 800, color: "#fff", marginBottom: "1.25rem", textAlign: "center" }}>What you earn</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {EARNING.map(e => (
              <div key={e.pkg} style={{ textAlign: "center", padding: "1.25rem", background: "rgba(0,0,0,0.2)", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#10B981" }}>{e.commission}</div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}>{e.per}</div>
                <div style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "0.5rem" }}>{e.pkg}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6B7280", marginTop: "1rem" }}>
            50 referrals × Pro pack = <strong style={{ color: "#10B981" }}>$225/month passive income</strong>
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 800, color: "#fff", marginBottom: "1.5rem", textAlign: "center" }}>How it works</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#10B981", flexShrink: 0, fontSize: "0.9rem" }}>{s.num}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>{s.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who it works for */}
        <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "1.25rem", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Perfect for</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {["Freelance Facebook group admins", "YouTube creators (freelancing niche)", "Bloggers & newsletter writers", "TikTok / Instagram creators", "Telegram / WhatsApp group owners", "Upwork coaches & mentors"].map(item => (
              <div key={item} style={{ fontSize: "0.85rem", color: "#9CA3AF", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#10B981" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a href={gmailLink} target="_blank" rel="noreferrer" style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontWeight: 800,
            borderRadius: "0.875rem",
            textDecoration: "none",
            fontSize: "1rem",
          }}>
            📧 Apply to Become an Affiliate
          </a>
          <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#4B5563" }}>
            Email mikeronny18@gmail.com · Free to join · Paid via USDT
          </p>
        </div>
      </div>
    </main>
  );
}
