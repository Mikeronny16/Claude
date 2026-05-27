import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicAI Myanmar — Clinic Automation အပြည့်",
  description: "Myanmar clinic တွေအတွက် AI appointment bot, reminder system နဲ့ patient automation.",
  keywords: "clinic automation myanmar, appointment bot, viber bot clinic, myanmar ai",
  openGraph: {
    title: "ClinicAI Myanmar",
    description: "Appointment no-show ကျပြီး patient satisfaction မြင့်တဲ့ automation system",
    locale: "my_MM",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}
