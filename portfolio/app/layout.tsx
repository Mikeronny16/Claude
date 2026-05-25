import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://mikeronny.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mike Ronny — Developer & Founder | Myanmar",
  description: "Developer & founder from Myanmar building AI-powered digital products. Creator of Ronnix AI, DraftWin, Whispr, TikCheck and more — tools used by thousands of creators and sellers.",
  keywords: [
    "Mike Ronny", "Myanmar developer", "AI tools developer",
    "Ronnix AI", "DraftWin", "Whispr", "TikCheck", "Myanmar startup",
    "creator tools developer", "Next.js developer Myanmar", "indie hacker Myanmar"
  ],
  authors: [{ name: "Mike Ronny" }],
  creator: "Mike Ronny",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mike Ronny",
    title: "Mike Ronny — Developer & Founder from Myanmar",
    description: "Building AI-powered tools for creators and online sellers. Founder of Ronnix AI, DraftWin, Whispr, TikCheck & more.",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Mike Ronny — Developer & Founder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mike Ronny — Developer & Founder from Myanmar",
    description: "Building AI tools for creators & online sellers. Ronnix AI, DraftWin, Whispr, TikCheck & more.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body>{children}</body>
    </html>
  );
}
