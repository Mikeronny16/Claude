"use client";

interface Template {
  emoji: string;
  label: string;
  skills: string;
  projectDesc: string;
  tone: "professional" | "friendly" | "creative" | "confident" | "urgent";
  platform: "upwork" | "fiverr" | "email" | "linkedin";
  length: "short" | "medium" | "long";
}

const TEMPLATES: Template[] = [
  {
    emoji: "💻",
    label: "Web Developer",
    skills: "Full-stack web development, React, Next.js, Node.js, 5+ years experience, built 30+ client projects",
    projectDesc: "Client needs a modern, responsive website or web application. Focus on performance, clean code, and SEO.",
    tone: "professional",
    platform: "upwork",
    length: "medium",
  },
  {
    emoji: "🎨",
    label: "Graphic Designer",
    skills: "Brand identity, logo design, Figma, Adobe Illustrator, Photoshop, 200+ happy clients",
    projectDesc: "Client needs professional logo and brand identity design — modern, memorable, and aligned with their business.",
    tone: "creative",
    platform: "fiverr",
    length: "medium",
  },
  {
    emoji: "✍️",
    label: "Content Writer",
    skills: "SEO content writing, blog articles, copywriting, 4+ years, 500+ articles published across SaaS and e-commerce niches",
    projectDesc: "Client needs high-quality blog articles or website copy that ranks on Google and converts readers.",
    tone: "friendly",
    platform: "upwork",
    length: "medium",
  },
  {
    emoji: "📱",
    label: "Mobile App Dev",
    skills: "React Native, Flutter, iOS and Android development, 4 years experience, published 10+ apps on App Store and Play Store",
    projectDesc: "Client wants to build a mobile app (iOS/Android) — needs clean UI, smooth performance, and App Store submission.",
    tone: "confident",
    platform: "upwork",
    length: "long",
  },
  {
    emoji: "🎬",
    label: "Video Editor",
    skills: "Video editing, Premiere Pro, After Effects, motion graphics, color grading, YouTube and social media content, 3 years",
    projectDesc: "Client needs professional video editing for YouTube, social media, or promotional content.",
    tone: "creative",
    platform: "fiverr",
    length: "short",
  },
  {
    emoji: "📈",
    label: "SEO / Marketing",
    skills: "SEO strategy, keyword research, Google Analytics, link building, content marketing, grew organic traffic 200%+ for clients",
    projectDesc: "Client wants to rank higher on Google and grow organic traffic to their website or e-commerce store.",
    tone: "professional",
    platform: "upwork",
    length: "medium",
  },
  {
    emoji: "🖥️",
    label: "UI/UX Designer",
    skills: "UI/UX design, Figma, user research, prototyping, design systems, 4+ years, designed for funded startups",
    projectDesc: "Client needs intuitive, beautiful interface design — wireframes, mockups, and a full clickable prototype.",
    tone: "creative",
    platform: "upwork",
    length: "medium",
  },
  {
    emoji: "🤝",
    label: "Virtual Assistant",
    skills: "Administrative support, email management, scheduling, data entry, customer service, research, 3 years remote VA experience",
    projectDesc: "Client needs a reliable virtual assistant for day-to-day admin tasks, email, scheduling, and research.",
    tone: "friendly",
    platform: "upwork",
    length: "short",
  },
  {
    emoji: "🔐",
    label: "Cybersecurity",
    skills: "Penetration testing, vulnerability assessment, OWASP, network security, CEH certified, 5 years enterprise security",
    projectDesc: "Client needs a security audit or penetration test for their web application, API, or infrastructure.",
    tone: "confident",
    platform: "upwork",
    length: "long",
  },
  {
    emoji: "📊",
    label: "Data Analyst",
    skills: "Python, SQL, Power BI, Tableau, data visualization, statistical analysis, built dashboards for 20+ companies",
    projectDesc: "Client needs data analysis, dashboard creation, or business intelligence reports from their raw data.",
    tone: "professional",
    platform: "upwork",
    length: "medium",
  },
];

interface Props {
  onClose: () => void;
  onSelect: (t: Omit<Template, "emoji" | "label">) => void;
}

export default function TemplatesModal({ onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden" style={{ maxHeight: "88vh", overflowY: "auto" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>📋 Proposal Templates</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Pick your niche — form auto-fills, just add your name</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        <div className="p-4 grid grid-cols-1 gap-2">
          {TEMPLATES.map(t => (
            <button key={t.label}
              onClick={() => { onSelect(t); onClose(); }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left cursor-pointer transition-all"
              style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}>
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{t.label}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-faint)" }}>{t.skills.slice(0, 60)}...</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg shrink-0" style={{ background: "rgba(16,185,129,0.1)", color: "var(--green)" }}>
                Use
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
