import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Ronnix AI — Myanmar Online Sellers' AI Assistant",
  description: "Caption, Reply, Product Description — AI tools for Myanmar online sellers. မြန်မာ online ရောင်းချသူများအတွက် AI tools",
  openGraph: {
    title: "Ronnix AI",
    description: "AI tools for Myanmar online sellers",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" className="h-full">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: "#13131F", border: "1px solid rgba(139,92,246,0.3)", color: "#F0EFFF" },
          }}
        />
        {children}
      </body>
    </html>
  )
}
