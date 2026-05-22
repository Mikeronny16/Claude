import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"] });

export const metadata: Metadata = {
  title: "Mike Ronny — Builder of digital products",
  description: "Developer & founder from Myanmar. I build digital products people actually use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ background: "#04060e" }}>{children}</body>
    </html>
  );
}
