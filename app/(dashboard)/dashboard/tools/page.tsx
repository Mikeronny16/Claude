import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ShoppingBag, Hash, Mail, FileText, Languages, Megaphone } from "lucide-react"

const tools = [
  { id: "facebook_post", name: "Facebook Post Generator", description: "Facebook Post မြန်မာဘာသာဖြင့် ရေးပေးသည်", icon: MessageSquare, color: "bg-blue-100 text-blue-600", premium: false },
  { id: "product_description", name: "Product Description Writer", description: "ကုန်ပစ္စည်းဖော်ပြချက် ရေးပေးသည်", icon: ShoppingBag, color: "bg-green-100 text-green-600", premium: false },
  { id: "marketing_caption", name: "Marketing Caption Generator", description: "Marketing Caption ဖန်တီးပေးသည်", icon: Megaphone, color: "bg-purple-100 text-purple-600", premium: false },
  { id: "email_reply", name: "Email/Message Reply Writer", description: "Email နှင့် Message ပြန်ရေးပေးသည်", icon: Mail, color: "bg-orange-100 text-orange-600", premium: false },
  { id: "hashtag", name: "Hashtag Generator", description: "Hashtag အစုံ ဖန်တီးပေးသည်", icon: Hash, color: "bg-pink-100 text-pink-600", premium: false },
  { id: "blog_outline", name: "Blog Outline Generator", description: "Blog Post Outline ရေးပေးသည်", icon: FileText, color: "bg-yellow-100 text-yellow-600", premium: true },
  { id: "translator", name: "EN ↔ MY Translator", description: "မြန်မာ-အင်္ဂလိပ် ဘာသာပြန်ပေးသည်", icon: Languages, color: "bg-teal-100 text-teal-600", premium: false },
]

function cn(...c: (string | undefined)[]) { return c.filter(Boolean).join(" ") }

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Tools</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">မြန်မာဘာသာ Content ဖန်တီးရန် Tool ကိုရွေးပါ</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.id} href={`/dashboard/tools/${tool.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-2.5 rounded-xl", tool.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {tool.premium && <Badge>Pro</Badge>}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
