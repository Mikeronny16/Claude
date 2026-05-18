import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, FileText } from "lucide-react"
import { timeAgo } from "@/lib/utils"

export default async function HistoryPage() {
  const session = await auth()
  const generations = session?.user?.id ? await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) : []

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generation History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">သင်ဖန်တီးခဲ့သော Content များ</p>
      </div>

      {generations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Generation မရှိသေးပါ</p>
            <p className="text-sm text-gray-400 mt-1">Tools မှ Content ဖန်တီးပါ</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <Card key={gen.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">{gen.type.replace("_", " ")}</Badge>
                  <span className="text-xs text-gray-400">{timeAgo(gen.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-4">{gen.output.split("---")[0].trim()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
