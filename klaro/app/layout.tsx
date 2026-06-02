import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Klaro — Document Explainer",
  description: "Photograph any confusing document. Get a plain-language explanation with red flags and action items — in English or Myanmar.",
  openGraph: {
    title: "Klaro — Document Explainer",
    description: "Understand any document in seconds.",
    images: ["/icon.svg"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
