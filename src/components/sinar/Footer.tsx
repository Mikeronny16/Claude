import { Facebook, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { LINKS } from "@/lib/sinar-links";

const links = [
  { mm: "ပင်မ", en: "Home", href: "#home" },
  { mm: "ဝတ်စုံများ", en: "Shop", href: "#shop" },
  { mm: "အကြောင်း", en: "About", href: "#about" },
  { mm: "ဆက်သွယ်ရန်", en: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-cream border-t border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2">
          <Logo height={60} />
          <p className="font-mm text-ink mt-5 max-w-sm leading-relaxed">
            နူးညံ့ချစ်စရာ ဝတ်စုံများ • အရည်အသွေးကောင်း သက်တောင့်သက်သာ
          </p>
          <p className="text-sm text-muted mt-1 max-w-sm">
            Soft & cute tops · Quality & comfy · In stock & Preorder available
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { href: LINKS.facebook,  Icon: Facebook,      label: "Facebook" },
              { href: LINKS.messenger, Icon: MessageCircle, label: "Messenger" },
              { href: LINKS.instagram, Icon: Instagram,     label: "Instagram" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-10 h-10 rounded-full bg-white border border-hairline hover:bg-deep hover:text-white text-ink flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg text-ink">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group inline-flex items-baseline gap-2 hover:text-deep transition-colors">
                  <span className="font-mm text-ink group-hover:text-deep">{l.mm}</span>
                  <span className="text-xs text-muted">{l.en}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-ink">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-deep mt-0.5 shrink-0" />
              <div>
                <div className="font-mm text-ink">မြစ်ကြီးနား, မြန်မာ</div>
                <div className="text-xs text-muted">Myitkyina, Myanmar</div>
              </div>
            </li>
            <li>
              <a href={LINKS.messenger} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-deep">
                <MessageCircle className="w-4 h-4 text-deep mt-0.5 shrink-0" />
                <div>
                  <div className="font-mm text-ink">Messenger</div>
                  <div className="text-xs text-muted">m.me/SinarClothing</div>
                </div>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-deep mt-0.5 shrink-0" />
              <div>
                <div className="font-mm text-ink">Viber</div>
                <div className="text-xs text-muted">+95 XXX XXX XXX</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <p>&copy; 2026 Sinar Clothing. All rights reserved.</p>
        <p className="font-mm">Made with <span className="text-deep">&hearts;</span> for our lovely customers</p>
      </div>
    </footer>
  );
}
