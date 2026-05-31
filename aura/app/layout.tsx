import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AURA — AI Personal Stylist",
  description: "Upload your selfie. AI reads your vibe. Get 6 real outfit looks generated on you.",
  openGraph: {
    title: "AURA — AI Personal Stylist",
    description: "Upload your selfie. AI reads your vibe. Get 6 real outfit looks generated on you.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full bg-[#0B0B0D] text-[#F5F5F0] antialiased" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
