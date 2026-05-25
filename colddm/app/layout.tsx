import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/components/LanguageContext";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

const SITE_URL = "https://colddm.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ColdDM Scripts — 30 Proven Cold Outreach Scripts for Freelancers",
  description: "30 copy-paste cold DM & email scripts that land clients. Instagram DMs, cold emails, follow-ups, objection replies — used by 500+ freelancers. Only $5.",
  keywords: [
    "cold DM scripts", "cold outreach freelancer", "freelance client scripts",
    "Instagram DM scripts", "cold email templates", "land clients freelance",
    "cold message freelancer", "DM scripts", "client outreach templates"
  ],
  authors: [{ name: "Mike Ronny" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "ColdDM Scripts — 30 Scripts to Land Your Next Client",
    description: "Copy-paste cold DM and email scripts for freelancers. Land clients in 60 seconds. 30 proven scripts across 6 categories.",
    type: "website",
    url: SITE_URL,
    siteName: "ColdDM Scripts",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "ColdDM Scripts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColdDM Scripts — Land Clients with 30 Proven Scripts",
    description: "30 copy-paste cold DM scripts for freelancers. Works on Instagram, email, follow-ups & more. $5.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
