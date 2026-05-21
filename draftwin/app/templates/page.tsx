import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Freelance Proposal Templates — DraftWin",
  description: "100% free freelance proposal templates for Upwork, Fiverr, LinkedIn and email. Web developer, designer, writer, SEO, VA and more. Generate custom AI proposals in 30 seconds.",
  openGraph: {
    title: "Free Freelance Proposal Templates — DraftWin",
    description: "Free AI-powered proposal templates for every freelance niche. No signup needed.",
    url: "https://claude-hsmg.vercel.app/templates",
  },
};

const TEMPLATES = [
  { slug: "web-developer", emoji: "💻", title: "Web Developer Proposal Template", platform: "Upwork", niche: "Development" },
  { slug: "graphic-designer", emoji: "🎨", title: "Graphic Designer Proposal Template", platform: "Fiverr", niche: "Design" },
  { slug: "content-writer", emoji: "✍️", title: "Content Writer Proposal Template", platform: "Upwork", niche: "Writing" },
  { slug: "mobile-app-developer", emoji: "📱", title: "Mobile App Developer Proposal Template", platform: "Upwork", niche: "Development" },
  { slug: "seo-specialist", emoji: "📈", title: "SEO Specialist Proposal Template", platform: "Upwork", niche: "Marketing" },
  { slug: "video-editor", emoji: "🎬", title: "Video Editor Proposal Template", platform: "Fiverr", niche: "Video" },
  { slug: "virtual-assistant", emoji: "🤝", title: "Virtual Assistant Proposal Template", platform: "Upwork", niche: "Admin" },
  { slug: "ui-ux-designer", emoji: "🖥️", title: "UI/UX Designer Proposal Template", platform: "Upwork", niche: "Design" },
  { slug: "data-analyst", emoji: "📊", title: "Data Analyst Proposal Template", platform: "Upwork", niche: "Data" },
  { slug: "copywriter", emoji: "📝", title: "Copywriter Proposal Template", platform: "Email", niche: "Writing" },
];

export default function TemplatesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0f0d", color: "#e2e8f0" }}>
      <style>{`.template-card:hover { border-color: rgba(16,185,129,0.4) !important; }`}</style>
      <nav style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" style={{ color: "#10B981", fontWeight: 900, fontSize: "1.1rem", textDecoration: "none" }}>
          ← DraftWin
        </Link>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>
            Free Freelance Proposal Templates
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9CA3AF", maxWidth: 600, margin: "0 auto" }}>
            Professionally written templates for every niche. Copy, customize, or use AI to generate
            a personalized version in 30 seconds — free, no signup.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {TEMPLATES.map(t => (
            <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: "none" }}>
              <div className="template-card" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1rem",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{t.emoji}</div>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.25rem", fontSize: "0.95rem" }}>{t.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{t.platform} · {t.niche}</div>
                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#10B981", fontWeight: 600 }}>
                  View template →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem", padding: "2rem", background: "rgba(16,185,129,0.05)", borderRadius: "1.5rem", border: "1px solid rgba(16,185,129,0.15)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>
            Want a custom proposal in 30 seconds?
          </h2>
          <p style={{ color: "#9CA3AF", marginBottom: "1.5rem" }}>
            Tell AI about your skills and the project — it writes a personalized proposal instantly. Free.
          </p>
          <Link href="/" style={{
            display: "inline-block",
            padding: "0.875rem 2rem",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontWeight: 700,
            borderRadius: "0.75rem",
            textDecoration: "none",
            fontSize: "0.95rem",
          }}>
            ✍️ Generate Free AI Proposal →
          </Link>
        </div>
      </div>
    </main>
  );
}
