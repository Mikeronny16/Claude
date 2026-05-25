import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

const SITE_URL = "https://toynar.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Toynar — Turn Yourself into a Collectible Toy with AI",
  description: "Upload your photo and AI transforms you into a cute collectible toy figurine in seconds. Free, no signup needed. Share with friends!",
  keywords: [
    "AI toy generator", "turn photo into toy", "AI photo transformer",
    "collectible toy AI", "toy figurine from photo", "AI image transformation",
    "fun AI tool", "photo to toy", "AI avatar generator"
  ],
  authors: [{ name: "Mike Ronny" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Toynar — Turn Yourself into a Toy 🧸",
    description: "Upload your photo, AI transforms you into a collectible toy in seconds. Free. No signup. Share with friends!",
    type: "website",
    url: SITE_URL,
    siteName: "Toynar",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Toynar — AI Toy Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toynar — Turn Yourself into a Toy 🧸",
    description: "Upload your photo → AI turns you into a collectible toy figurine. Free & instant!",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen bg-[#07070F] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
