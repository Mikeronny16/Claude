import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare, ShoppingBag, Hash, Mail, FileText,
  Languages, Megaphone, Zap, TrendingUp, Clock
} from "lucide-react"

const tools = [
  { id: "facebook_post", name: "Facebook Post", description: "Facebook Post မြန်မာဘာသာ ရေးပေးသည်", icon: MessageSquare, color: "bg-blue-100 text-blue-600", premium: false },
  { id: "product_description", name: "Product Description", description: "ကုန်ပစ္စည်းဖော်ပြချက် ရေးပေးသည်", icon: ShoppingBag, color: "bg-green-100 text-green-600", premium: false },
  { id: "marketing_caption", name: "Marketing Caption", description: "Marketing Caption ဖန်တီးပေးသည်", icon: Megaphone, color: "bg-purple-100 text-purple-600", premium: false },
  { id: "email_reply", name: "Email/Message Reply", description: "Email နှင့် Message ပြန်ရေးပေးသည်", icon: Mail, color: "bg-orange-100 text-orange-600", premium: false },
  { id: "hashtag", name: "Hashtag Generator", description: "Hashtag အစုံ ဖန်တီးပေးသည်", icon: Hash, color: "bg-pink-100 text-pink-600", premium: false },
  { id: "blog_outline", name: "Blog Outline", description: "Blog Post Outline ရေးပေးသည်", icon: FileText, color: "bg-yellow-100 text-yellow-600", premium: true },
  { id: "translator", name: "EN ↔ MY Translator", description: "မြန်မာ-အင်္ဂလိပ် ဘာသာပြန်ပေးသည်", icon: Languages, color: "bg-teal-100 text-teal-600", premium: false },
]

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, plan: true, credits: true, planExpiresAt: true, createdAt: true },
  }) : null

  const recentGenerations = session?.user?.id ? await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  }) : []

  const totalGenerations = session?.user?.id ? await prisma.generation.count({
    where: { userId: session.user.id },
  }) : 0

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          မင်္ဂလာပါ, {user?.name ?? "User"} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">AI ဖြင့် မြန်မာဘာသာ Content ရေးပါ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg"><Zap className="h-4 w-4 text-indigo-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.credits ?? 0}</p>
                <p className="text-xs text-gray-500">Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="h-4 w-4 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalGenerations}</p>
                <p className="text-xs text-gray-500">Generations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg"><FileText className="h-4 w-4 text-purple-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tools.length}</p>
                <p className="text-xs text-gray-500">Tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg"><Clock className="h-4 w-4 text-yellow-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{user?.plan ?? "free"}</p>
                <p className="text-xs text-gray-500">Plan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.id} href={`/dashboard/tools/${tool.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("p-2 rounded-lg", tool.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {tool.premium && <Badge variant="default" className="text-xs">Pro</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentGenerations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">မကြာမီ ဖန်တီးခဲ့သည်</h2>
          <div className="space-y-2">
            {recentGenerations.map((gen) => (
              <Card key={gen.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{gen.type.replace("_", " ")}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{gen.output.slice(0, 100)}...</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-3 whitespace-nowrap">
                      {new Date(gen.createdAt).toLocaleDateString("my-MM")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
