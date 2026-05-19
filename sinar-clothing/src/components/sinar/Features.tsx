import { Flower, Heart, Sparkles } from "lucide-react";

const items = [
  { icon: Flower,   mm: "အရည်အသွေးကောင်း", en: "Quality fabric",        desc: "ရွေးချယ်ထားသော အထည်ကောင်းများ" },
  { icon: Heart,    mm: "သက်တောင့်သက်သာ",   en: "Soft & comfy",          desc: "နူးညံ့ပြီး ဝတ်ဆင်ရလွယ်ကူ" },
  { icon: Sparkles, mm: "ရရှိနိုင်ပါပြီ",       en: "In Stock & Preorder",   desc: "အမြဲတမ်း ရရှိနိုင်သည်" },
];

export function Features() {
  return (
    <section className="bg-white py-12 lg:py-16 border-y border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
        {items.map((it, i) => (
          <div key={it.en} className="reveal flex items-center gap-4 sm:gap-5 p-5 rounded-2xl hover:bg-cream transition-colors" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-accent/40 flex items-center justify-center text-deep">
              <it.icon className="w-7 h-7" strokeWidth={1.6} />
            </div>
            <div>
              <div className="font-mm font-semibold text-ink text-lg leading-tight">{it.mm}</div>
              <div className="text-xs uppercase tracking-widest text-deep mt-0.5">{it.en}</div>
              <div className="font-mm text-sm text-muted mt-1">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
