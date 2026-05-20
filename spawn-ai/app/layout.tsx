import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import Providers from "./Providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spawn AI — Hatch. Raise. Bond.",
  description: "Something small is waiting for you to notice.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Providers>
          {children}
          <Toaster position="top-center" theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
