import { ChevronRight, Facebook, MessageCircle, Phone } from "lucide-react"
import { MESSENGER_URL, PHONE_URL, SITE, VIBER_URL, whatsappUrl } from "@/config"
import { useLang } from "@/lib/lang"
import Sheet from "./Sheet"

export default function ChatSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()

  const rows = [
    { href: VIBER_URL, label: "Viber", sub: SITE.viber, icon: Phone, tint: "bg-candy-lilac text-[#5B3FD0]" },
    { href: whatsappUrl("မင်္ဂလာပါ Sinar 🛍️"), label: "WhatsApp", sub: SITE.whatsapp, icon: MessageCircle, tint: "bg-candy-mint text-[#14532D]" },
    { href: PHONE_URL, label: t("ဖုန်းခေါ်မယ်", "Call us"), sub: SITE.phone, icon: Phone, tint: "bg-candy-butter text-[#7A4A00]" },
    { href: SITE.facebookUrl, label: "Facebook Page", sub: t("Post အသစ်တွေ ကြည့်မယ်", "See our latest posts"), icon: Facebook, tint: "bg-candy-sky text-[#1D4E89]" },
  ]

  return (
    <Sheet open={open} onClose={onClose} title={t("Sinar နဲ့ Chat မယ်", "Chat with Sinar")}>
      <p className="font-mm -mt-1 mb-4 text-sm leading-relaxed text-candy-muted">
        {t("Size၊ အရောင်၊ ပို့ခ — ဘာမဆို မေးလို့ရပါတယ်", "Ask anything — sizes, colours, delivery")}
      </p>

      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-candy-pink text-[15px] font-bold text-white shadow-cta active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2.3} />
        Messenger
      </a>

      <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-soft">
        {rows.map((r) => (
          <a
            key={r.label}
            href={r.href}
            target={r.href.startsWith("tel:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex min-h-[60px] items-center gap-3 border-b border-candy-soft px-4 py-2.5 last:border-0 active:bg-candy-soft/60"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${r.tint}`}>
              <r.icon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-mm text-[15px] font-semibold">{r.label}</span>
              <span className="font-mm truncate text-xs text-candy-muted">{r.sub}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-candy-line" />
          </a>
        ))}
      </div>

      <p className="font-mm mt-4 text-center text-xs text-candy-muted">
        {t("၂၄ နာရီအတွင်း ပြန်ဖြေပေးပါမယ်", "We reply within 24 hours")}
      </p>
    </Sheet>
  )
}
