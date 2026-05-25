import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

const SITE_URL = "https://claude-plum-eta.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ronnix AI — Myanmar Online Sellers AI Platform",
    template: "%s | Ronnix AI",
  },
  description: "Caption ရေး၊ Customer reply ပြန်၊ Product description ဖန်တီး — မြန်မာ online ရောင်းချသူများအတွက် AI tools. 3 ကြိမ်/နေ့ အခမဲ့",
  keywords: ["Myanmar AI", "online seller", "caption generator", "မြန်မာ AI", "Facebook caption", "TikTok caption", "product description Myanmar"],
  authors: [{ name: "Mike Ronny" }],
  creator: "Ronnix AI",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ronnix AI",
    title: "Ronnix AI — Myanmar Online Sellers AI Platform",
    description: "Caption ရေး၊ Customer reply ပြန်၊ Product description — AI tools for Myanmar online sellers",
    locale: "my_MM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ronnix AI",
    description: "AI tools for Myanmar online sellers — Caption, Reply, Description",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" className="h-full">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: "#071009", border: "1px solid rgba(61,122,31,0.4)", color: "#EFF2EC" },
          }}
        />
        {children}
      </body>
    </html>
  )
}
