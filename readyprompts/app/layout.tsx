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

const BASE_URL = "https://readyprompts.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ReadyPrompts — 105 AI Prompt Kit | Only $2",
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
    "Claude prompts",
    "Gemini prompts",
  ],
  authors: [{ name: "ReadyPrompts" }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "ReadyPrompts — 105 AI Prompt Kit | Only $2",
    description:
      "105 copy-paste AI prompts. TikTok, Instagram, Marketing, Business. $2 one-time. Works with ChatGPT, Claude, Gemini & any AI.",
    type: "website",
    url: BASE_URL,
    locale: "en_US",
    siteName: "ReadyPrompts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReadyPrompts — 105 AI Prompt Kit for $2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadyPrompts — 105 AI Prompt Kit | Only $2",
    description: "Stop getting bad AI results. 105 proven prompts for TikTok, marketing, business & more. Download for $2.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "ReadyPrompts — 105 AI Prompt Kit",
  description:
    "105 copy-paste AI prompts for TikTok, Instagram, Marketing, Business, Email Marketing, and Personal Brand. Works with ChatGPT, Claude, Gemini, and any AI model.",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  brand: {
    "@type": "Brand",
    name: "ReadyPrompts",
  },
  offers: {
    "@type": "Offer",
    price: "2",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: BASE_URL,
    priceValidUntil: "2026-12-31",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cinema-bg text-cinema-text antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
