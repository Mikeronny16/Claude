import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReadyPrompts — 100+ Ultimate AI Prompt Kit | $2 Only",
  description:
    "Stop wasting hours getting bad AI results. 105 copy-paste prompts for TikTok, Instagram, Marketing, Business & more. One $2 payment. Download instantly.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "TikTok prompts",
    "marketing prompts",
    "prompt kit",
    "AI writing",
    "content creation",
    "digital download",
  ],
  authors: [{ name: "ReadyPrompts" }],
  openGraph: {
    title: "ReadyPrompts — 100+ Ultimate AI Prompt Kit",
    description:
      "105 copy-paste AI prompts. TikTok, Instagram, Marketing, Business. $2 one-time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadyPrompts — 100+ Ultimate AI Prompt Kit | $2",
    description: "Stop getting bad AI results. 105 proven prompts. Download for $2.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#05080f" />
      </head>
      <body className="bg-cinema-bg text-cinema-text antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
