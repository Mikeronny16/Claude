import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MyanmarAI Writer - မြန်မာဘာသာ AI Content Generator",
  description: "AI-powered Burmese content generation for social media, online sellers, and digital marketers in Myanmar",
  keywords: "Myanmar AI, Burmese content, AI writer, မြန်မာ AI",
  openGraph: {
    title: "MyanmarAI Writer",
    description: "မြန်မာဘာသာ Content တွေ AI နဲ့ စက္ကန့်ပိုင်းအတွင်း ရေးပါ",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
