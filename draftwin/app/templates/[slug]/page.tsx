import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const TEMPLATES: Record<string, {
  emoji: string;
  title: string;
  metaDesc: string;
  platform: string;
  skills: string;
  proposalText: string;
  tips: string[];
}> = {
  "web-developer": {
    emoji: "💻",
    title: "Web Developer Proposal Template for Upwork",
    metaDesc: "Free web developer proposal template for Upwork. Copy this winning proposal structure used by top-rated freelancers. Generate a personalized AI version in 30 seconds.",
    platform: "Upwork",
    skills: "React, Next.js, Node.js, 5 years experience",
    proposalText: `Hi [Client Name],

I came across your project and I'm confident I can deliver exactly what you need.

With 5+ years of full-stack web development experience and 50+ successful projects delivered, I specialize in building fast, modern, and scalable web applications using React, Next.js, and Node.js.

For your specific project, I would:
• Set up a clean, responsive frontend with React/Next.js
• Build a robust backend API with Node.js and your preferred database
• Ensure mobile-first design and fast load times (Core Web Vitals optimized)
• Deploy to Vercel/AWS with CI/CD pipeline

I've built similar projects for clients in [their industry] — I can share case studies and a live demo of my work.

Timeline: [X] weeks
Price: $[X] (fixed) or $[X]/hour

I'm available to start immediately. Can we schedule a 15-minute call to discuss your requirements?

Looking forward to working with you,
[Your Name]`,
    tips: [
      "Always mention the client's name in the opening line",
      "Reference specific details from their job post to show you read it",
      "Give a concrete timeline and price range upfront",
      "Offer a short call — it builds trust and closes deals faster",
      "Keep it under 250 words — clients read short proposals first",
    ],
  },
  "graphic-designer": {
    emoji: "🎨",
    title: "Graphic Designer Proposal Template for Fiverr",
    metaDesc: "Free graphic designer proposal template for Fiverr. Winning proposal structure for logo design, brand identity, and visual design projects.",
    platform: "Fiverr",
    skills: "Logo design, brand identity, Illustrator, Figma",
    proposalText: `Hi [Client Name],

Your project immediately caught my eye — creating [type of design] is exactly what I do best.

I'm a graphic designer with 4+ years of experience specializing in logo design and brand identity. I've created 200+ logos for businesses ranging from startups to established brands.

What I'll deliver for you:
• [Number] initial concept variations
• Unlimited revisions until you're 100% happy
• Final files in all formats (AI, EPS, SVG, PNG, PDF)
• Brand guidelines document

My design process: I start by understanding your brand values, target audience, and competitors — then create designs that stand out and communicate the right message.

I can have your initial concepts ready in [X] days.

Check out my portfolio: [link]

Ready to get started?

[Your Name]`,
    tips: [
      "Lead with your specialty — don't try to do everything",
      "Mention deliverables explicitly (file formats, revisions)",
      "Show your process — it builds confidence",
      "Include a portfolio link — always",
      "Set clear timelines for each deliverable",
    ],
  },
  "content-writer": {
    emoji: "✍️",
    title: "Content Writer Proposal Template for Upwork",
    metaDesc: "Free content writer and copywriter proposal template for Upwork. Win more writing projects with this proven proposal structure.",
    platform: "Upwork",
    skills: "SEO content, blog writing, copywriting, 3 years experience",
    proposalText: `Hi [Client Name],

I've read through your project brief carefully, and I'd love to help you create content that actually drives results.

I'm a content writer with 3+ years of experience in SEO-driven blog posts, website copy, and long-form articles. My content has ranked on the first page of Google for competitive keywords across SaaS, e-commerce, and B2B niches.

For your project, here's my approach:
• Thorough research on your topic, audience, and competitors
• SEO-optimized structure (headings, keywords, meta description)
• Engaging, clear writing that keeps readers on the page
• One round of revisions included

Sample of my work: [link to relevant sample]

I can deliver [word count] articles per [week/month] at [price per article or per word].

Would you like me to write a short sample paragraph so you can see my style before committing?

[Your Name]`,
    tips: [
      "Offer a free sample — it removes the risk for the client",
      "Mention SEO specifically — most clients want Google traffic",
      "Link to samples in the same niche as their project",
      "State your word rate or per-article price clearly",
      "Ask a question at the end to start a conversation",
    ],
  },
  "mobile-app-developer": {
    emoji: "📱",
    title: "Mobile App Developer Proposal Template for Upwork",
    metaDesc: "Free mobile app developer proposal template for Upwork. React Native and Flutter project proposals that win clients.",
    platform: "Upwork",
    skills: "React Native, Flutter, iOS, Android, Firebase",
    proposalText: `Hi [Client Name],

Building a mobile app like yours is exactly my area of expertise — I've shipped 10+ apps on both the App Store and Google Play.

I specialize in React Native and Flutter, which means your app will work perfectly on both iOS and Android from a single codebase — saving you time and money.

My plan for your project:
• Week 1-2: UI/UX design approval and architecture planning
• Week 3-5: Core feature development
• Week 6: Testing, bug fixes, and App Store submission prep
• Total: [X] weeks, $[X]

The app will include:
• [Feature 1 from their brief]
• [Feature 2]
• Push notifications, analytics, and crash reporting
• App Store + Google Play submission support

I'm happy to share my GitHub profile and published apps for reference.

Can we hop on a quick call to go through the technical requirements?

[Your Name]`,
    tips: [
      "Break the project into phases with clear timelines",
      "Explain why React Native/Flutter saves them money",
      "Offer to show published apps as proof of quality",
      "Include App Store submission in your scope — many devs don't",
      "Ask about a call — mobile projects need detailed discovery",
    ],
  },
  "seo-specialist": {
    emoji: "📈",
    title: "SEO Specialist Proposal Template for Upwork",
    metaDesc: "Free SEO specialist and digital marketing proposal template. Win Upwork SEO projects with this proven structure.",
    platform: "Upwork",
    skills: "SEO strategy, keyword research, Google Analytics, link building",
    proposalText: `Hi [Client Name],

I can help you rank higher on Google and drive consistent organic traffic to your site — without paying for ads.

In the past 2 years, I've helped 20+ businesses grow their organic traffic by an average of 180%. I specialize in technical SEO, content strategy, and white-hat link building.

Here's my 90-day plan for your site:

Month 1 — Audit & Quick Wins:
• Full technical SEO audit
• Fix critical on-page issues
• Optimize your top 10 pages for existing keyword opportunities

Month 2 — Content Strategy:
• Keyword research and content calendar
• Optimize existing content for ranking
• Begin outreach for quality backlinks

Month 3 — Scale:
• Publish new SEO content targeting high-value keywords
• Build domain authority through link acquisition
• Reporting with rankings and traffic improvements

I'll provide weekly reports showing exactly what changed and why.

Investment: $[X]/month (3-month minimum for real results)

SEO takes time but compounds. I'd love to show you a site audit to identify your biggest opportunities — free, no strings attached.

[Your Name]`,
    tips: [
      "Be specific about your process — vague SEO promises kill trust",
      "Set realistic expectations: 3-6 months for real results",
      "Offer a free audit — it demonstrates expertise before the pitch",
      "Show past results with specific numbers",
      "Explain monthly retainer vs one-time project clearly",
    ],
  },
  "video-editor": {
    emoji: "🎬",
    title: "Video Editor Proposal Template for Fiverr",
    metaDesc: "Free video editor proposal template for Fiverr and Upwork. Win YouTube, social media, and corporate video editing projects.",
    platform: "Fiverr",
    skills: "Premiere Pro, After Effects, color grading, motion graphics",
    proposalText: `Hi [Client Name],

Your project looks great — I'd love to help bring it to life with professional editing.

I'm a video editor with 3+ years of experience in YouTube content, social media videos, and corporate productions. I work in Premiere Pro and After Effects and specialize in fast pacing, clean cuts, and engaging motion graphics.

What I'll do for your video:
• Professional cut and pacing
• Color correction and grading
• Sound design and music sync
• Lower thirds, titles, and graphics (if needed)
• Export in the exact format you need (4K, 1080p, vertical, etc.)

My turnaround: [X] days for a [length]-minute video.

You can see my recent work here: [portfolio link]

I take feedback seriously and include 2 rounds of revisions in every project.

Send me your footage and let's create something great!

[Your Name]`,
    tips: [
      "Specify the software you use — clients care about compatibility",
      "Always mention revision rounds upfront",
      "Share your reel or portfolio link — this is everything for editors",
      "State turnaround time for typical video lengths",
      "Ask for the footage format early to avoid surprises",
    ],
  },
  "virtual-assistant": {
    emoji: "🤝",
    title: "Virtual Assistant Proposal Template for Upwork",
    metaDesc: "Free virtual assistant proposal template for Upwork. Win VA jobs with this professional, easy-to-read proposal structure.",
    platform: "Upwork",
    skills: "Admin support, email management, scheduling, data entry, research",
    proposalText: `Hi [Client Name],

I'd love to help you reclaim your time by handling the tasks that are slowing you down.

I'm a Virtual Assistant with 3 years of remote work experience supporting busy entrepreneurs and small business owners. I'm reliable, detail-oriented, and comfortable working independently.

Tasks I can handle for you:
• Email inbox management and drafting responses
• Calendar scheduling and appointment coordination
• Data entry and spreadsheet organization
• Online research and report preparation
• Customer support responses
• Social media scheduling

My tools: Google Workspace, Notion, Trello, Slack, Asana, Zoom — and I learn new tools quickly.

I'm available [X] hours per week, [timezone], and I respond within [X] hours during business days.

My rate: $[X]/hour

I'd love to start with a trial task so you can see my work quality before committing. What task would be most helpful this week?

[Your Name]`,
    tips: [
      "Be specific about your availability and timezone",
      "List the tools you know — clients want to avoid training time",
      "Offer a trial task — it removes the fear of hiring remotely",
      "Show reliability: response times, work hours",
      "Keep it friendly and warm — VAs are trusted partners",
    ],
  },
  "ui-ux-designer": {
    emoji: "🖥️",
    title: "UI/UX Designer Proposal Template for Upwork",
    metaDesc: "Free UI/UX designer proposal template for Upwork. Win product design, app design, and website design projects.",
    platform: "Upwork",
    skills: "UI/UX design, Figma, user research, prototyping, design systems",
    proposalText: `Hi [Client Name],

Good design is invisible — users accomplish their goals without friction. That's what I build.

I'm a UI/UX designer with 4 years of experience designing web and mobile products for funded startups and growing businesses. I work in Figma and follow a research-first process that ensures design decisions are based on real user behavior, not guesswork.

My process for your project:

Discovery (Week 1):
• Review existing designs and user feedback
• Competitive analysis of similar products
• Define user flows and wireframes

Design (Week 2-3):
• High-fidelity mockups for all screens
• Interactive prototype for stakeholder review
• Design system / component library

Handoff (Week 4):
• Developer-ready Figma files with specs
• Assets exported in all required formats

Portfolio: [link] — includes similar projects in your industry

My rate: $[X]/hour or $[X] fixed for this project.

Happy to jump on a call to discuss your users and goals. What's the main problem you're trying to solve?

[Your Name]`,
    tips: [
      "Show your process — design clients value structured thinking",
      "Always share a portfolio link with relevant work",
      "Ask about the user problem, not just the visual output",
      "Mention Figma handoff — developers need to know you do this",
      "Fixed price or hourly — state your preference and be flexible",
    ],
  },
  "data-analyst": {
    emoji: "📊",
    title: "Data Analyst Proposal Template for Upwork",
    metaDesc: "Free data analyst proposal template for Upwork. Win data analysis, dashboard, and business intelligence projects.",
    platform: "Upwork",
    skills: "Python, SQL, Power BI, Tableau, data visualization",
    proposalText: `Hi [Client Name],

The data you have is valuable — I can help you turn it into clear insights and decisions.

I'm a data analyst with 4 years of experience working with businesses to build dashboards, analyze datasets, and create reports that actually get used. My tools include Python (Pandas, NumPy), SQL, Power BI, and Tableau.

For your project, I would:
• Clean and validate your dataset
• Identify the key metrics that matter for your goals
• Build a [Power BI / Tableau / Google Data Studio] dashboard with clear, interactive visualizations
• Document findings in a plain-English summary report

I've built similar dashboards for [industry] businesses — I can share examples directly relevant to your data type.

Timeline: [X] days
Deliverable: Live dashboard + PDF report + raw analysis notebook

What format is your data in currently? (Excel, CSV, database, etc.)

[Your Name]`,
    tips: [
      "Ask about their data format early — it affects scope and price",
      "Offer a plain-English summary with every technical deliverable",
      "Mention specific tools by name — clients match their job post keywords",
      "State whether the dashboard is live/interactive or static",
      "Share examples from the same industry if possible",
    ],
  },
  "copywriter": {
    emoji: "📝",
    title: "Copywriter Proposal Template for Email Outreach",
    metaDesc: "Free copywriter proposal template for email and Upwork. Win website copy, landing page, and ad copywriting projects.",
    platform: "Email / Upwork",
    skills: "Sales copywriting, landing pages, email sequences, ads",
    proposalText: `Subject: Re: Copywriter for [their project]

Hi [Client Name],

Your project caught my attention — you need copy that converts, not just sounds good.

I'm a conversion copywriter with 4 years of experience writing landing pages, email sequences, and ad copy for e-commerce and SaaS brands. My copy has directly contributed to $2M+ in client revenue.

What makes my copy different:
• Research-first: I interview your customers and study your competitors before writing a single word
• Conversion-focused: every headline, bullet, and CTA is designed to drive a specific action
• Voice-matched: it sounds like you, just sharper

For this project I'd deliver:
• [Specific deliverable from their brief]
• 1 round of revisions based on your feedback
• Split-test variations for your highest-traffic elements

My rate: $[X] per page / $[X] per email / $[X] for the full project.

I'd love to send you a teardown of your current copy (or a competitor's) so you can see how I think — takes me 20 minutes and costs you nothing.

Interested?

[Your Name]`,
    tips: [
      "Lead with results (revenue, conversions) not just 'great writing'",
      "Offer a free teardown — it demonstrates expertise immediately",
      "Mention that you research before writing — clients fear generic copy",
      "Be specific about what's included and what's not",
      "Email proposals should have a clear subject line",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(TEMPLATES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = TEMPLATES[slug];
  if (!t) return {};
  return {
    title: `${t.title} — DraftWin`,
    description: t.metaDesc,
    openGraph: {
      title: t.title,
      description: t.metaDesc,
      url: `https://claude-hsmg.vercel.app/templates/${slug}`,
    },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = TEMPLATES[slug];
  if (!t) notFound();

  const prefillQuery = new URLSearchParams({ skills: t.skills }).toString();

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f0d", color: "#e2e8f0" }}>
      <nav style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "1rem" }}>
        <Link href="/" style={{ color: "#10B981", fontWeight: 900, fontSize: "1rem", textDecoration: "none" }}>DraftWin</Link>
        <span style={{ color: "#374151" }}>/</span>
        <Link href="/templates" style={{ color: "#6B7280", fontSize: "1rem", textDecoration: "none" }}>Templates</Link>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{t.emoji}</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>{t.title}</h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "100px", color: "#10B981" }}>{t.platform}</span>
            <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", color: "#9CA3AF" }}>Free to use</span>
          </div>
        </div>

        {/* AI CTA — above the template */}
        <div style={{ padding: "1.25rem 1.5rem", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "1rem", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontWeight: 700, color: "#fff", marginBottom: "0.15rem" }}>Want a personalized version in 30 seconds?</p>
            <p style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>AI writes it for your specific client and project — free, no signup</p>
          </div>
          <Link href={`/?${prefillQuery}`} style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontWeight: 700,
            borderRadius: "0.75rem",
            textDecoration: "none",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
          }}>
            ✍️ Generate Free →
          </Link>
        </div>

        {/* Template */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Template</h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.5rem" }}>
            <pre style={{ fontFamily: "inherit", fontSize: "0.9rem", lineHeight: 1.7, color: "#D1D5DB", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
              {t.proposalText}
            </pre>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Tips to win with this template</h2>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {t.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem", color: "#9CA3AF" }}>
                <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", padding: "2rem", background: "rgba(16,185,129,0.05)", borderRadius: "1.5rem", border: "1px solid rgba(16,185,129,0.15)" }}>
          <h3 style={{ fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>Skip the template — let AI write it for you</h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Personalized to your exact client and project. Takes 30 seconds. Free.
          </p>
          <Link href="/" style={{
            display: "inline-block",
            padding: "0.875rem 2rem",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontWeight: 700,
            borderRadius: "0.75rem",
            textDecoration: "none",
          }}>
            ✍️ Generate My Proposal — Free
          </Link>
        </div>
      </div>
    </main>
  );
}
