import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Unbounded } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", weight: ["500", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "NEXORA — Build your floating world", template: "%s · NEXORA" },
  description: "A creative 3D fantasy world-builder for ages 12–15. Shape a floating island, dream up creations with AI, and complete creative quests.",
  applicationName: "NEXORA",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#070620",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${unbounded.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
