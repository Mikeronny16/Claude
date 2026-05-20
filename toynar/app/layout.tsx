import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toynar — Turn yourself into a toy",
  description: "Upload your photo and AI transforms you into a collectible toy figure in seconds.",
  openGraph: {
    title: "Toynar",
    description: "Turn yourself into a toy with AI",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07070F] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
