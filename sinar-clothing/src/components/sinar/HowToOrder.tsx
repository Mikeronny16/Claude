import { Eye, MessageCircle, Package, Truck } from "lucide-react";

const steps = [
  { icon: Eye,            n: "01", mm: "ဝတ်စုံရွေးပါ",                  en: "Browse our collection",     desc: "ကြိုက်နှစ်သက်ရာ ဝတ်စုံကို ရွေးချယ်ပါ" },
  { icon: MessageCircle,  n: "02", mm: "Messenger မှ DM ပို့ပါ",         en: "DM us on Messenger",        desc: "Order တင်ရန် Messenger မှ ဆက်သွယ်ပါ" },
  { icon: Package,        n: "03", mm: "ဈေးနှုန်း+ပို့ဆောင်ခ အတည်ပြုပါ",   en: "Confirm price & delivery",  desc: "အသေးစိတ် အချက်အလက် အတည်ပြုပါ" },
  { icon: Truck,          n: "04", mm: "ကားဂိတ်ကနေ ပစ္စည်းရရှိပါ",        en: "Receive via highway bus",   desc: "အနီးဆုံးကားဂိတ်တွင် လက်ခံရယူပါ" },
];

export function HowToOrder() {
  return (
    <section className="py-16 lg:py-24 gradient-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center reveal">
          <div className="text-xs tracking-[0.3em] text-deep uppercase mb-3">How To Order</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink">
            ဘယ်လို <span className="italic">မှာရမလဲ</span>
          </h2>
          <p className="font-mm text-muted mt-4 max-w-md mx-auto">
            လွယ်ကူရိုးရှင်းတဲ့ အဆင့် ၄ ဆင့်ဖြင့် order တင်နိုင်ပါသည်
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((s, i) => (
            <div key={s.n}
              className="reveal relative bg-white rounded-2xl p-6 border border-hairline hover:shadow-soft transition-all hover:-translate-y-1 group"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="absolute -top-4 -right-4 font-serif italic text-6xl text-accent/70 select-none">{s.n}</div>
              <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-deep mb-4 group-hover:bg-deep group-hover:text-white transition-colors">
                <s.icon className="w-6 h-6" strokeWidth={1.6} />
              </div>
              <h3 className="font-mm font-semibold text-ink text-base leading-tight">{s.mm}</h3>
              <p className="text-xs uppercase tracking-wider text-deep mt-1">{s.en}</p>
              <p className="font-mm text-sm text-muted mt-3 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
