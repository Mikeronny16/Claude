import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, MessageSquare, ShoppingBag, Hash, FileText,
  Languages, Megaphone, Check, Zap, Crown, Building2, ChevronDown
} from "lucide-react"

const features = [
  { icon: MessageSquare, title: "Facebook Post", desc: "Facebook Post မြန်မာဘာသာဖြင့် ဖန်တီးပါ" },
  { icon: ShoppingBag, title: "Product Description", desc: "ကုန်ပစ္စည်းဖော်ပြချက် ရေးပေးသည်" },
  { icon: Megaphone, title: "Marketing Caption", desc: "Marketing Caption ဖန်တီးပေးသည်" },
  { icon: Hash, title: "Hashtag Generator", desc: "Myanmar hashtag အစုံ ဖန်တီးပေးသည်" },
  { icon: Languages, title: "EN ↔ MY Translator", desc: "ဘာသာပြန်ဆိုပေးသည်" },
  { icon: FileText, title: "Blog Outline", desc: "Blog Post Outline ရေးပေးသည်" },
]

const faqs = [
  { q: "မြန်မာဘာသာ output ရပါသလား?", a: "ဟုတ်ကဲ့၊ AI သည် natural, fluent မြန်မာဘာသာဖြင့် Content ဖန်တီးပေးသည်" },
  { q: "Free plan မှာ ဘယ်နှစ်ကြိမ် သုံးရမည်?", a: "Free plan သည် တစ်လ ၁၀ ကြိမ် Generation ရပါသည်" },
  { q: "Payment ဘယ်လို ပေးရသည်?", a: "Manual payment flow ဖြင့် Admin ထံ email ပို့ပြီး payment instruction ရပါသည်" },
  { q: "Generation မြန်ပါသလား?", a: "Generation တစ်ခု ၅-၁၅ second ခန့်ကြာသည်" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg"><Sparkles className="h-5 w-5" /></div>
            <span className="font-bold text-gray-900 dark:text-white">MyanmarAI Writer</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin"><Button variant="ghost" size="sm">ဝင်ရောက်မည်</Button></Link>
            <Link href="/auth/signup"><Button size="sm">အခမဲ့ စတင်မည်</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            🇲🇲 Myanmar-First AI Writing Tool
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            မြန်မာဘာသာ Content တွေ{" "}
            <span className="text-indigo-600">AI နဲ့</span>{" "}
            စက္ကန့်ပိုင်းအတွင်း ရေးပါ
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Social media managers, online sellers နှင့် digital marketers များအတွက် Myanmar AI writing platform
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="text-base px-8">
                <Sparkles className="h-5 w-5" />
                အခမဲ့ စတင်မည်
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-base px-8">ဝင်ရောက်မည်</Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Credit card မလိုပါ · Free plan ကို ချက်ချင်း စတင်နိုင်သည်</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI Tools အမျိုးမျိုး</h2>
          <p className="text-gray-500 dark:text-gray-400">မြန်မာ digital marketing အတွက် tool အစုံ</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Plan ရွေးချယ်မည်</h2>
            <p className="text-gray-500 dark:text-gray-400">Manual payment · Admin approval · ၂၄ နာရီအတွင်း activate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "free", name: "Free", price: 0, credits: "10", icon: Zap, features: ["10 Generation/month", "Basic tools", "မြန်မာ AI output"], popular: false },
              { id: "pro", name: "Pro", price: 9, credits: "500", icon: Crown, features: ["500 Generation/month", "All tools", "Premium templates", "Priority support"], popular: true },
              { id: "business", name: "Business", price: 29, credits: "Unlimited", icon: Building2, features: ["Unlimited generations", "Team features", "API access", "Dedicated support"], popular: false },
            ].map(plan => {
              const Icon = plan.icon
              return (
                <Card key={plan.id} className={plan.popular ? "border-indigo-500 shadow-lg relative" : ""}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-indigo-600">Popular</Badge></div>}
                  <CardContent className="p-6">
                    <Icon className={`h-6 w-6 mb-3 ${plan.popular ? "text-indigo-600" : "text-gray-500"}`} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="my-3">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      {plan.price > 0 && <span className="text-gray-500">/month</span>}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{plan.credits} generations/month</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.id === "free" ? "အခမဲ့ စတင်မည်" : `${plan.name} ကိုရွေးမည်`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">မည်သူများ သုံးနိုင်သည်?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { emoji: "🛍️", title: "Online Sellers", desc: "Facebook Shop, Shopee Myanmar တွင် product description ရေးပါ" },
            { emoji: "📱", title: "Social Media Managers", desc: "Page content schedule ကို AI ဖြင့် ဖန်တီးပါ" },
            { emoji: "📊", title: "Digital Marketers", desc: "Campaign caption, hashtag, email copy ရေးပါ" },
          ].map(uc => (
            <Card key={uc.title}>
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{uc.emoji}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{uc.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <Card key={faq.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 text-indigo-600" />{faq.q}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 pl-6">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">ယနေ့ပင် စတင်ပါ</h2>
          <p className="text-indigo-200 mb-8">Free plan နဲ့ ချက်ချင်း စတင်နိုင်သည်။ Credit card မလိုပါ</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8">
              <Sparkles className="h-5 w-5" /> အခမဲ့ စတင်မည်
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1 rounded"><Sparkles className="h-4 w-4" /></div>
            <span className="font-semibold text-gray-900 dark:text-white">MyanmarAI Writer</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 MyanmarAI Writer. Made for Myanmar 🇲🇲</p>
        </div>
      </footer>
    </div>
  )
}
