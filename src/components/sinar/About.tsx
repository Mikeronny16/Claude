import { MapPin } from "lucide-react";
import { FALLBACK_IMG } from "@/lib/sinar-products";

export function About() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative reveal order-2 lg:order-1">
          <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-accent/40 to-cream rounded-[2.5rem] -rotate-2" />
          <div className="rounded-[2rem] overflow-hidden aspect-[4/5] shadow-card">
            <img
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&h=1000&q=85"
              alt="About Sinar Clothing"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="reveal order-1 lg:order-2">
          <div className="text-xs tracking-[0.3em] text-deep uppercase mb-3">About Us</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink">
            ကျွန်မတို့ <span className="italic">အကြောင်း</span>
          </h2>
          <p className="font-mm text-lg text-ink mt-6 leading-loose">
            Sinar Clothing မှ ကြိုဆိုပါတယ်ရှင် 🌸 ကျွန်မတို့က မြစ်ကြီးနားမြို့ကနေ
            မိန်းကလေးတိုင်း သက်တောင့်သက်သာနဲ့ လှပစေချင်တဲ့ စိတ်ထားနဲ့ အရည်အသွေးကောင်းတဲ့
            ဝတ်စုံလေးတွေကို ရွေးချယ်ပေးနေပါတယ်။ In stock ရော Preorder ပါ ရရှိနိုင်ပြီး
            Messenger မှ တိုက်ရိုက် order တင်နိုင်ပါပြီရှင်။
          </p>
          <p className="text-sm text-muted mt-4 leading-relaxed max-w-lg">
            Welcome to Sinar Clothing. From Myitkyina with love — we curate soft, cute,
            quality pieces so every girl can feel beautiful and comfortable. Both in-stock
            and pre-order available, and you can DM us directly on Messenger to order.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-ink">
            <MapPin className="w-4 h-4 text-deep" />
            <span className="font-mm">မြစ်ကြီးနား, မြန်မာ</span>
            <span className="text-muted">· Myitkyina, Myanmar</span>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { num: "1.1K+", mm: "ပရိသတ်များ", en: "Followers" },
              { num: "100+",  mm: "ဝယ်ယူသူများ", en: "Happy Customers" },
              { num: "MKN",   mm: "မြစ်ကြီးနား", en: "Based" },
            ].map((s) => (
              <div key={s.en} className="text-center p-4 rounded-2xl bg-cream border border-hairline">
                <div className="font-serif text-2xl sm:text-3xl text-ink">{s.num}</div>
                <div className="font-mm text-xs text-ink mt-1">{s.mm}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted">{s.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
