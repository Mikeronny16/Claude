"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, RefreshCw, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"

const TOOL_INFO: Record<string, { name: string; description: string; placeholder: string; showAudience: boolean }> = {
  facebook_post: { name: "Facebook Post Generator", description: "Facebook Post မြန်မာဘာသာဖြင့် ရေးပေးသည်", placeholder: "ဥပမာ: မုန့်ဟင်းခါးဆိုင် promotion post", showAudience: true },
  product_description: { name: "Product Description Writer", description: "ကုန်ပစ္စည်းဖော်ပြချက် ရေးပေးသည်", placeholder: "ဥပမာ: Longtaing ထီးအသစ် feature တွေ", showAudience: false },
  marketing_caption: { name: "Marketing Caption Generator", description: "Marketing Caption ဖန်တီးပေးသည်", placeholder: "ဥပမာ: Summer Sale 50% off campaign", showAudience: true },
  email_reply: { name: "Email/Message Reply Writer", description: "Email နှင့် Message ပြန်ရေးပေးသည်", placeholder: "ဥပမာ: ကုန်ပစ္စည်းနောက်ကျတဲ့ customer complaint ကို reply", showAudience: false },
  hashtag: { name: "Hashtag Generator", description: "Hashtag အစုံ ဖန်တီးပေးသည်", placeholder: "ဥပမာ: Myanmar street food photography", showAudience: false },
  blog_outline: { name: "Blog Outline Generator", description: "Blog Post Outline ရေးပေးသည်", placeholder: "ဥပမာ: မြန်မာ digital marketing လုပ်နည်း", showAudience: true },
  translator: { name: "EN ↔ MY Translator", description: "မြန်မာ-အင်္ဂလိပ် ဘာသာပြန်ပေးသည်", placeholder: "ဘာသာပြန်ချင်တဲ့ စာသားကို ထည့်ပါ...", showAudience: false },
}

const schema = z.object({
  prompt: z.string().min(3, "အနည်းဆုံး စာလုံး ၃ လုံး ထည့်ပါ"),
  tone: z.string(),
  length: z.string(),
  audience: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ToolPage() {
  const params = useParams()
  const toolId = params.toolId as string
  const tool = TOOL_INFO[toolId]
  const [variations, setVariations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "casual", length: "medium" },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setVariations([])
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolType: toolId, ...data }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Generation failed")
        return
      }
      setVariations(json.variations ?? [json.output])
      toast.success("ဖန်တီးပြီးပါပြီ!")
    } catch {
      toast.error("Server error")
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string, index: number) {
    await navigator.clipboard.writeText(text)
    setCopied(index)
    toast.success("Clipboard ကူးယူပြီး!")
    setTimeout(() => setCopied(null), 2000)
  }

  if (!tool) return (
    <div className="text-center py-20 text-gray-500">Tool မတွေ့ပါ</div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Topic / Input</Label>
                <Textarea
                  placeholder={tool.placeholder}
                  className="resize-none min-h-[100px]"
                  {...register("prompt")}
                />
                {errors.prompt && <p className="text-xs text-red-500">{errors.prompt.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tone</Label>
                  <Select defaultValue="casual" onValueChange={(v) => setValue("tone", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Length</Label>
                  <Select defaultValue="medium" onValueChange={(v) => setValue("length", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tool.showAudience && (
                <div className="space-y-1.5">
                  <Label>Target Audience (optional)</Label>
                  <Input placeholder="ဥပမာ: Myanmar online shoppers" {...register("audience")} />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> ဖန်တီးနေသည်...</> : <><Sparkles className="h-4 w-4" /> Generate</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output */}
        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="p-4 space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {variations.map((variation, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Variation {index + 1}</Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(variation, index)}
                    >
                      {copied === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleSubmit(onSubmit)()}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{variation}</p>
              </CardContent>
            </Card>
          ))}

          {!loading && variations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Generate ကိုနှိပ်ပြီး AI ဖန်တီးချက်ကိုကြည့်ပါ</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
