import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "DraftWin — AI Freelance Proposal Generator",
  description: "Write winning freelance proposals in 30 seconds with AI. Free to try, no signup needed. Works on Upwork, Fiverr, LinkedIn & Email.",
  keywords: ["freelance proposal", "AI proposal generator", "Upwork proposal", "Fiverr proposal", "freelancer tool"],
  authors: [{ name: "Mike Ronny" }],
  openGraph: {
    title: "DraftWin — Write Proposals That Actually Win",
    description: "AI-powered freelance proposals tailored to every job. Free to try. No account needed. Works on Upwork, Fiverr, LinkedIn & Email.",
    url: "https://claude-hsmg.vercel.app",
    siteName: "DraftWin",
    type: "website",
    images: [{ url: "https://claude-hsmg.vercel.app/og-image.png", width: 1200, height: 630, alt: "DraftWin — AI Freelance Proposal Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DraftWin — Write Proposals That Actually Win",
    description: "AI-powered freelance proposals in 30 seconds. Free. No signup.",
    images: ["https://claude-hsmg.vercel.app/og-image.png"],
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
