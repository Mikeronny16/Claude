import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const SITE_URL = "https://claude-hsmg.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DraftWin — AI Freelance Proposal Generator | Win More Jobs",
  description: "Write winning freelance proposals in 30 seconds with AI. Score ring, snippet vault, rewriter & follow-up generator. Free to try on Upwork, Fiverr, LinkedIn & Email.",
  keywords: [
    "freelance proposal", "AI proposal generator", "Upwork proposal writer",
    "Fiverr proposal", "freelancer tool", "win freelance jobs", "proposal AI",
    "cover letter generator", "freelance cover letter", "AI freelancer",
    "proposal writer free", "DraftWin",
  ],
  authors: [{ name: "Mike Ronny" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "DraftWin — Write Proposals That Actually Win",
    description: "AI-powered freelance proposals tailored to every job. Score ring shows how strong your proposal is. Free to try — no account needed.",
    url: SITE_URL,
    siteName: "DraftWin",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "DraftWin — AI Freelance Proposal Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DraftWin — AI Proposals That Win Jobs",
    description: "Write winning proposals in 30 seconds. Score ring, snippet vault, rewriter. Free, no signup.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
