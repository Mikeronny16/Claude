import { Facebook, MessageCircle } from "lucide-react"
import { SITE } from "@/config"

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink text-cream/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl text-cream mb-3">{SITE.name}</h3>
            <p className="font-mm text-sm leading-relaxed">{SITE.tagline}</p>
            <p className="font-mm text-sm mt-2 leading-relaxed">
              ချစ်စရာ ဝတ်စုံလေးများကို ရွေးချယ်ဖန်တီးပေးနေသည်
            </p>
          </div>

          {/* About */}
          <div id="about">
            <h4 className="text-cream text-sm font-semibold uppercase tracking-widest mb-4">About</h4>
            <p className="font-mm text-sm leading-relaxed">
              Sinar ဆိုသည်မှာ မြန်မာ့ အမျိုးသမီးများအတွက် ချစ်စရာ၊ ကြည်နူးဖွယ် ဝတ်စုံများကို
              ရောင်းချနေသော fashion brand တစ်ခုဖြစ်သည်။
              Quality မြင့်မားပြီး ဈေးနှုန်း သင့်တော်သော ဝတ်စုံများ ပေးနေပါသည်။
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream text-sm font-semibold uppercase tracking-widest mb-4">ဆက်သွယ်ရန်</h4>
            <div className="space-y-3">
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-cream transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span className="text-sm">Facebook Page</span>
              </a>
              <a
                href={`https://m.me/${SITE.facebookPageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-cream transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-mm text-sm">Messenger မှတဆင့် DM</span>
              </a>
              {SITE.phone && (
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 hover:text-cream transition-colors">
                  <span className="text-sm">📞 {SITE.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <a href="/admin" className="text-xs text-cream/30 hover:text-cream/60 transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  )
}
