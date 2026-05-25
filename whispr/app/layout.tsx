import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://whispr-shh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Whispr — What do people really think of you?",
  description: "Create your anonymous message link in 30 seconds. Share it on TikTok, Instagram, or Twitter. Get brutally honest — and sometimes surprisingly sweet — anonymous messages.",
  keywords: [
    "anonymous messages", "whispr", "anonymous questions", "NGL alternative",
    "ask me anything", "honest feedback", "anonymous confessions", "anonymous message app",
    "what do people think of me", "anonymous link", "truth app",
  ],
  authors: [{ name: "Mike Ronny" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Whispr — What do people REALLY think of you?",
    description: "100% anonymous. Free forever. Create your link in 30 seconds. Get honest messages with mood tags.",
    type: "website",
    url: SITE_URL,
    siteName: "Whispr",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Whispr — Anonymous Messages" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whispr — 100% Anonymous Messages",
    description: "Get brutally honest — and sometimes surprisingly sweet — anonymous messages. Free, no email needed.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
