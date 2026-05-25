import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Toaster } from "sonner"
import Providers from "./Providers"
import "./globals.css"

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] })

const SITE_URL = "https://spawn-ai.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Spawn AI — Hatch. Raise. Bond.",
  description: "Buy an AI egg. Hatch it. Raise a unique AI creature with its own personality. It remembers you. It grows because of you.",
  keywords: [
    "AI pet", "virtual pet game", "AI companion", "hatch egg", "AI creature",
    "digital pet", "spawn AI", "raise AI pet", "AI egg game", "companion AI",
    "virtual companion", "AI pet app",
  ],
  authors: [{ name: "Mike Ronny" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Spawn AI — Hatch. Raise. Bond.",
    description: "Buy an AI egg. Hatch it. Raise a unique AI creature from baby to adult. It remembers you. It grows because of you.",
    type: "website",
    url: SITE_URL,
    siteName: "Spawn AI",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Spawn AI — AI Pet Companion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spawn AI — Hatch. Raise. Bond.",
    description: "Buy an AI egg. Hatch it. Raise a unique AI creature with its own personality.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Providers>
          {children}
          <Toaster position="top-center" theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
