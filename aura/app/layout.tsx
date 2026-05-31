import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA — AI Outfit Rater",
  description: "Upload your outfit. Get your aura score. Share your vibe.",
  openGraph: {
    title: "AURA — AI Outfit Rater",
    description: "Upload your outfit. Get your aura score.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0D0D0D] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
