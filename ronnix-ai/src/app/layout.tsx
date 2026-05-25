import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import ThemeProvider from "@/components/ThemeProvider"

const SITE_URL = "https://ronnixai.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ronnix AI — Myanmar Online Sellers AI Platform | 11 AI Tools",
    template: "%s | Ronnix AI",
  },
  description: "Myanmar online sellers အတွက် AI tools 11 ခု — Caption, Reply, Live Script, Promo, Reel, Hashtags + more. 5 seconds ထဲ content ရ. Free plan available.",
  keywords: [
    "Myanmar AI tools", "online seller Myanmar", "caption generator Myanmar",
    "မြန်မာ AI", "Facebook caption Myanmar", "TikTok caption Myanmar",
    "product description Myanmar", "live script Myanmar", "hashtag generator Myanmar",
    "Myanmar Facebook seller", "AI for Myanmar business", "ronnix ai",
    "social media tools Myanmar", "content creator Myanmar", "e-commerce Myanmar AI"
  ],
  authors: [{ name: "Mike Ronny" }],
  creator: "Ronnix AI",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ronnix AI",
    title: "Ronnix AI — 11 AI Tools for Myanmar Online Sellers",
    description: "Caption, Reply, Live Script, Promo, Reel, Hashtags နဲ့ AI Tools 11 ခု. Myanmar online sellers အတွက်. 5 seconds ထဲ content ရ.",
    locale: "my_MM",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Ronnix AI — Myanmar Online Sellers AI Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ronnix AI — 11 AI Tools for Myanmar Online Sellers",
    description: "Caption, Reply, Live Script, Reel, Hashtags + 6 more. 5 seconds content. Free to start.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" className="h-full">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: "var(--bg2,#071009)", border: "1px solid var(--border-g)", color: "var(--text,#EFF2EC)" },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
