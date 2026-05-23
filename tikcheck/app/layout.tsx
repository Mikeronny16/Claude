import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./globals.css";

const font = Space_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700"] });

export const metadata: Metadata = {
  title: "TikCheck — Creator Toolkit",
  description: "AI tools for TikTok & Instagram creators. Hook generator, caption enhancer, hashtag finder, best time to post, AI image generator.",
  openGraph: {
    title: "TikCheck — Creator Toolkit",
    description: "Level up your content before you post.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
