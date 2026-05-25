import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

const SITE_URL = "https://tikcheck.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TikCheck — AI Creator Toolkit for TikTok & Instagram",
  description: "7 AI tools for TikTok & Instagram creators. Hook generator, viral caption writer, hashtag finder, best time to post, content calendar & more. Free to start.",
  keywords: [
    "TikTok creator tools", "Instagram creator tools", "hook generator TikTok",
    "viral caption generator", "hashtag finder", "best time to post TikTok",
    "content calendar creator", "TikTok AI tools", "creator toolkit",
    "viral score checker", "TikTok growth tools"
  ],
  authors: [{ name: "Mike Ronny" }],
  openGraph: {
    title: "TikCheck — 7 AI Tools for TikTok & Instagram Creators",
    description: "Hook generator, caption writer, hashtag finder, timing advisor, content calendar & more. Level up your content before you post.",
    type: "website",
    url: SITE_URL,
    siteName: "TikCheck",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "TikCheck — AI Creator Toolkit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TikCheck — AI Tools for TikTok & Instagram",
    description: "7 AI tools to make your content go viral. Hook generator, captions, hashtags & more. Free to start.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
