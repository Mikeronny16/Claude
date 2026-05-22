import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/components/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColdDM Scripts — 30 Proven Scripts to Land Clients",
  description:
    "30 copy-paste cold DM and email scripts for freelancers. Land your first client or 10th — these scripts work.",
  openGraph: {
    title: "ColdDM Scripts — 30 Proven Scripts to Land Clients",
    description:
      "30 copy-paste cold DM and email scripts for freelancers. Land your first client or 10th — these scripts work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
