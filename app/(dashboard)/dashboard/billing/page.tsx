"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Building2, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

const PLANS = [
  {
    id: "free", name: "Free", price: 0, credits: 10,
    features: ["မြန်မာဘာသာ AI Generation", "Basic Templates", "10 Generation/month", "All basic tools"],
    icon: Zap, color: "border-gray-200",
  },
  {
    id: "pro", name: "Pro", price: 9, credits: 500,
    features: ["Free plan အားလုံး", "500 Generation/month", "Premium Templates", "Priority support", "Blog Outline tool"],
    icon: Crown, color: "border-indigo-500",
  },
  {
    id: "business", name: "Business", price: 29, credits: 9999,
    features: ["Pro plan အားလုံး", "Unlimited Generations", "Team features", "API access", "Dedicated support"],
    icon: Building2, color: "border-purple-500",
  },
]

interface UserProfile { plan: string; credits: number; planExpiresAt: string | null }

export default function BillingPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/user/profile").then(r => r.json()).then(setProfile)
  }, [])

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@gmail.com"

  async function handleUpgrade(planId: string, planName: string, price: number) {
    setLoading(true)
    setSelectedPlan(planId)
    try {
      await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })

      const subject = `${planName} Plan Purchase Request - ${session?.user?.email}`
      const body = `Hello Admin,\n\nI would like to purchase the ${planName} Plan.\n\nMy account email: ${session?.user?.email}\nMy account name: ${session?.user?.name}\nPlan: ${planName} $${price}/month\n\nPlease send me payment instructions.\n\nThank you!`
      const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, "_blank")
      toast.success("Payment request ဖန်တီးပြီး! Admin ထံ email ပို့ပါ")
    } catch {
      toast.error("Error occurred")
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const currentPlan = profile?.plan ?? "free"

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Plan နှင့် Credits စီမံပါ</p>
      </div>

      {/* Current Status */}
      <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{currentPlan} Plan</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Credits: {profile?.credits ?? "--"} remaining
                {profile?.planExpiresAt && ` · Expires: ${formatDate(profile.planExpiresAt)}`}
              </p>
            </div>
            <Badge variant={currentPlan === "free" ? "secondary" : "default"} className="capitalize">{currentPlan}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isCurrent = currentPlan === plan.id
          return (
            <Card key={plan.id} className={`relative ${plan.id === "pro" ? "border-indigo-500 shadow-md" : ""}`}>
              {plan.id === "pro" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600">Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${plan.id === "pro" ? "text-indigo-600" : plan.id === "business" ? "text-purple-600" : "text-gray-500"}`} />
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-500">/month</span>}
                </div>
                <CardDescription>{plan.credits === 9999 ? "Unlimited" : plan.credits} generations/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : plan.id === "free" ? (
                  <Button variant="outline" className="w-full" disabled>Free</Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id, plan.name, plan.price)}
                    disabled={loading && selectedPlan === plan.id}
                  >
                    {loading && selectedPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* How to upgrade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upgrade လုပ်နည်း</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-2"><span className="font-bold text-indigo-600">1.</span> Plan ရွေးပြီး &quot;Upgrade&quot; ကိုနှိပ်ပါ</li>
            <li className="flex gap-2"><span className="font-bold text-indigo-600">2.</span> Gmail အလိုအလျောက် ပွင့်လာပါမည်</li>
            <li className="flex gap-2"><span className="font-bold text-indigo-600">3.</span> ပြင်စရာမလိုပါ — တိုက်ရိုက် ပို့လိုက်ပါ</li>
            <li className="flex gap-2"><span className="font-bold text-indigo-600">4.</span> Admin က ၂၄ နာရီအတွင်း ပြန်ဆက်သွယ်ပါမည်</li>
            <li className="flex gap-2"><span className="font-bold text-indigo-600">5.</span> Payment ပြီးတာနဲ့ Plan ၃၀ ရက် activate ဖြစ်ပါမည်</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
