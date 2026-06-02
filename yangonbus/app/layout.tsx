import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YBS Guide — Yangon Bus Finder",
  description:
    "ရန်ကုန် ဘတ်စ်ကား လမ်းညွှန် | Find Yangon bus routes and stops instantly",
  keywords: ["Yangon bus", "YBS", "YRTC", "bus routes", "ဘတ်စ်ကား", "ရန်ကုန်"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YBS Guide",
  },
  openGraph: {
    title: "YBS Guide — Yangon Bus Finder",
    description: "ရန်ကုန် ဘတ်စ်ကား လမ်းညွှန် | Find Yangon bus routes and stops instantly",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E42313",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansMyanmar.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
