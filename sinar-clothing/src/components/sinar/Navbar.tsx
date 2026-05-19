import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LINKS } from "@/lib/sinar-links";

const links = [
  { mm: "ပင်မ", en: "Home", href: "#home" },
  { mm: "ဝတ်စုံများ", en: "Shop", href: "#shop" },
  { mm: "အကြောင်း", en: "About", href: "#about" },
  { mm: "ဆက်သွယ်ရန်", en: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-md border-b border-hairline shadow-card" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#home" className="shrink-0"><Logo /></a>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group flex flex-col items-center text-sm transition-colors">
              <span className="font-mm font-semibold text-ink group-hover:text-deep">{l.mm}</span>
              <span className="text-[10px] tracking-wider text-muted uppercase group-hover:text-deep">{l.en}</span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/admin" aria-label="Admin"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-cream border border-hairline transition">
            <Lock className="w-4 h-4" />
          </Link>
          <a href={LINKS.messenger} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-deep hover:bg-deep-hover text-white px-4 lg:px-5 py-2.5 rounded-full text-sm font-medium shadow-soft transition-all hover:scale-[1.03]">
            <MessageCircle className="w-4 h-4" />
            <span className="font-mm hidden md:inline">Messenger မှာ Order</span>
            <span className="md:hidden">Order</span>
          </a>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-full hover:bg-hairline text-ink" aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} bg-white/95 backdrop-blur-md border-t border-hairline`}>
        <nav className="px-6 py-4 flex flex-col divide-y divide-hairline">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 flex items-baseline gap-3">
              <span className="font-mm font-semibold text-ink text-base">{l.mm}</span>
              <span className="text-xs text-muted uppercase tracking-widest">{l.en}</span>
            </a>
          ))}
          <a href={LINKS.messenger} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 bg-deep text-white px-5 py-3 rounded-full text-sm font-medium shadow-soft">
            <MessageCircle className="w-4 h-4" />
            <span className="font-mm">Messenger မှာ Order တင်ရန်</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
