import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://whispr.vercel.app";

export const metadata: Metadata = {
  title: "Whispr — Anonymous Messages from Anyone",
  description: "Create your Whispr link. Share it. Get 100% honest anonymous messages from friends, followers, and anyone who knows you.",
  keywords: ["anonymous messages", "whispr", "anonymous questions", "NGL", "ask me anything"],
  openGraph: {
    title: "Whispr — What do people REALLY think of you?",
    description: "Get honest anonymous messages from anyone. Create your free link in 30 seconds.",
    url: APP_URL,
    siteName: "Whispr",
    images: [{ url: `${APP_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Whispr — Anonymous Messages", description: "Create your free anonymous message link." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
