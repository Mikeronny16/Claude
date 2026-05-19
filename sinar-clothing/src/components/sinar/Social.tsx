import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { LINKS } from "@/lib/sinar-links";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.43z" />
    </svg>
  );
}

const socials = [
  { href: LINKS.facebook,  label: "Facebook",  Icon: Facebook,      color: "hover:bg-[#1877f2]" },
  { href: LINKS.messenger, label: "Messenger", Icon: MessageCircle, color: "hover:bg-deep" },
  { href: LINKS.tiktok,    label: "TikTok",    Icon: TikTokIcon,    color: "hover:bg-black" },
  { href: LINKS.instagram, label: "Instagram", Icon: Instagram,     color: "hover:bg-pink-500" },
];

export function Social() {
  return (
    <section id="contact" className="py-16 lg:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <div className="text-xs tracking-[0.3em] text-deep uppercase mb-3">Follow Us</div>
        <h2 className="font-serif text-4xl sm:text-5xl text-ink">
          ကျွန်မတို့ကို <span className="italic">Follow</span> လုပ်ပါ
        </h2>
        <p className="font-mm text-muted mt-4">
          အသစ်အသစ် ဝတ်စုံလေးတွေကို မလွတ်တမ်း ကြည့်ရှုနိုင်ဖို့
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {socials.map(({ href, label, Icon, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className={`group w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cream text-ink ${color} hover:text-white flex items-center justify-center border border-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft`}>
              <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
