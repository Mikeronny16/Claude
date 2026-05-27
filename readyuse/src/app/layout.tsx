import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Readyuse — n8n & Make.com Automation Templates",
  description: "Ready-to-use n8n and Make.com workflow templates. Import, add your API keys, and go. Telegram AI bots, social media automation, lead gen, and more.",
  openGraph: {
    title: "Readyuse — Automation Templates",
    description: "Import. Add API keys. Done. n8n + Make.com workflow templates.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
