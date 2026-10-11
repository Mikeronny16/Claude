import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Download, EllipsisVertical, Facebook, MessageCircle, Phone, Ruler, Share, Sparkles, SquarePlus } from "lucide-react"
import { useLang } from "@/lib/lang"
import { ABOUT_EN, ABOUT_MM, ORDER_STEPS } from "@/lib/content"
import { isIOS, isStandalone, useInstallPrompt } from "@/lib/install"
import { MESSENGER_URL, PHONE_URL, SITE, VIBER_URL, whatsappUrl } from "@/config"
import { useAppUI } from "@/components/app/AppShell"
import { Sparkle } from "@/components/app/Garment"

function Card({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-4 flex scroll-mt-6 flex-col gap-3 rounded-[24px] bg-white p-4 shadow-soft">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Row({ href, onClick, icon, label, sub }: { href?: string; onClick?: () => void; icon: React.ReactNode; label: string; sub?: string }) {
  const inner = (
    <>
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-candy-soft text-candy-pink">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="font-mm text-[15px] font-semibold">{label}</span>
        {sub && <span className="font-mm truncate text-xs text-candy-muted">{sub}</span>}
      </span>
      <ChevronRight className="h-5 w-5 text-candy-line" />
    </>
  )
  const cls = "-mx-1 flex min-h-[56px] items-center gap-3 rounded-2xl px-1 active:bg-candy-soft/60"
  return href ? (
    <a href={href} target={href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <button onClick={onClick} className={cls}>{inner}</button>
  )
}

export default function Me() {
  const { t, lang, toggle } = useLang()
  const { openSizeGuide } = useAppUI()
  const { canInstall, install } = useInstallPrompt()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
  }, [hash])

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-safe relative overflow-hidden rounded-b-[30px] bg-candy-pink px-5 pb-7">
        <span className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <Sparkle className="absolute right-16 top-10 h-4 w-4 animate-twinkle text-candy-sun" />
        <div className="relative flex items-center gap-3 pt-6">
          <span className="font-display flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-2xl font-bold text-candy-pink">S</span>
          <div>
            <h1 className="font-display text-[26px] font-bold leading-none text-white">Sinar</h1>
            <p className="font-mm mt-1 text-[13px] text-white/90">{SITE.tagline}</p>
          </div>
        </div>
      </header>

      <Card title={t("ဘာသာစကား", "Language")}>
        <div className="grid grid-cols-2 gap-1 rounded-full bg-candy-soft p-1" role="radiogroup" aria-label="Language">
          {(["mm", "en"] as const).map((l) => (
            <button
              key={l}
              role="radio"
              aria-checked={lang === l}
              onClick={() => { if (lang !== l) toggle() }}
              className={`font-mm h-11 rounded-full text-sm font-bold transition-colors ${lang === l ? "bg-white text-candy-pink shadow-soft" : "text-candy-muted"}`}
            >
              {l === "mm" ? "မြန်မာ" : "English"}
            </button>
          ))}
        </div>
      </Card>

      <Card id="install" title={t("Sinar App ကို ဖုန်းထဲ ထည့်မယ်", "Get the Sinar app")}>
        {isStandalone ? (
          <p className="font-mm text-sm text-[#14532D]">{t("App အနေနဲ့ ဖွင့်ထားပြီးပါပြီ", "You're using the app — nice!")}</p>
        ) : canInstall ? (
          <button
            onClick={install}
            className="font-mm flex h-12 items-center justify-center gap-2 rounded-full bg-candy-pink text-sm font-bold text-white shadow-cta"
          >
            <Download className="h-4 w-4" /> {t("ဖုန်းထဲ ထည့်မယ်", "Install app")}
          </button>
        ) : (
          <ol className="font-mm flex flex-col gap-2.5 text-sm leading-relaxed">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-candy-sky text-[#1D4E89]">
                {isIOS ? <Share className="h-4 w-4" /> : <EllipsisVertical className="h-4 w-4" />}
              </span>
              {isIOS
                ? t("Safari အောက်ခြေက Share ခလုတ်ကို နှိပ်ပါ", "Tap the Share button in Safari")
                : t("Browser ညာဘက်အပေါ်က ⋮ menu ကို နှိပ်ပါ", "Open the ⋮ menu in your browser")}
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-candy-sky text-[#1D4E89]"><SquarePlus className="h-4 w-4" /></span>
              {t("“Add to Home Screen” ကို ရွေးပါ", "Choose “Add to Home Screen”")}
            </li>
          </ol>
        )}
      </Card>

      <Card title={t("မှာနည်း", "How to order")}>
        <ol className="flex flex-col gap-3">
          {ORDER_STEPS.map((s, i) => (
            <li key={s.en} className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-candy-soft text-xs font-extrabold text-candy-pink">{i + 1}</span>
              <span className="flex flex-col">
                <span className="font-mm text-sm font-bold">{t(s.mm, s.en)}</span>
                <span className="font-mm text-xs leading-relaxed text-candy-muted">{t(s.descMm, s.descEn)}</span>
              </span>
            </li>
          ))}
        </ol>
        <Row onClick={openSizeGuide} icon={<Ruler className="h-5 w-5" />} label={t("Size ဇယား", "Size guide")} sub={t("ရင်ဝိုင်း၊ ခါးလုံး၊ တင်ပါးလုံး", "Bust, waist and hip in cm")} />
      </Card>

      <Card title={t("ဆက်သွယ်ရန်", "Contact us")}>
        <div className="flex flex-col">
          <Row href={MESSENGER_URL} icon={<MessageCircle className="h-5 w-5" />} label="Messenger" sub={t("အမြန်ဆုံး ပြန်ဖြေပါတယ်", "Fastest reply")} />
          <Row href={VIBER_URL} icon={<Phone className="h-5 w-5" />} label="Viber" sub={SITE.viber} />
          <Row href={whatsappUrl("မင်္ဂလာပါ Sinar 🛍️")} icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp" sub={SITE.whatsapp} />
          <Row href={PHONE_URL} icon={<Phone className="h-5 w-5" />} label={t("ဖုန်းခေါ်မယ်", "Call us")} sub={SITE.phone} />
          <Row href={SITE.facebookUrl} icon={<Facebook className="h-5 w-5" />} label="Facebook Page" />
        </div>
      </Card>

      <Card title={t("Style ဂိမ်းလေးတွေ", "Style games")}>
        <Link to="/outfit" className="-mx-1 flex min-h-[56px] items-center gap-3 rounded-2xl px-1 active:bg-candy-soft/60">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-candy-lilac text-[#4B2BB8]"><Sparkles className="h-5 w-5" /></span>
          <span className="font-mm flex-1 text-[15px] font-semibold">Outfit Finder</span>
          <ChevronRight className="h-5 w-5 text-candy-line" />
        </Link>
        <Link to="/style" className="-mx-1 flex min-h-[56px] items-center gap-3 rounded-2xl px-1 active:bg-candy-soft/60">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-candy-butter text-[#7A4A00]"><Sparkle className="h-5 w-5" /></span>
          <span className="font-mm flex-1 text-[15px] font-semibold">{t("နာမည်နဲ့ Style ဖတ်မယ်", "Style from your name")}</span>
          <ChevronRight className="h-5 w-5 text-candy-line" />
        </Link>
      </Card>

      <Card title={t("Sinar အကြောင်း", "About Sinar")}>
        {(lang === "mm" ? ABOUT_MM : ABOUT_EN).map((line) => (
          <p key={line} className="font-mm text-sm leading-relaxed text-candy-muted">{line}</p>
        ))}
      </Card>

      <div className="flex items-center justify-between px-6 pb-2 pt-2 text-xs text-candy-muted">
        <span>© {new Date().getFullYear()} Sinar</span>
        <Link to="/admin" className="flex h-10 items-center px-2 text-candy-muted/70">Admin</Link>
      </div>
    </div>
  )
}
