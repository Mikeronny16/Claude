"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({ name: z.string().min(2, "Name required") })
type FormData = z.infer<typeof schema>

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (session?.user?.name) reset({ name: session.user.name })
  }, [session, reset])

  async function onSubmit(data: FormData) {
    setLoading(true)
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setLoading(false)
    if (res.ok) {
      await update({ name: data.name })
      toast.success("Profile မွမ်းမံပြီးပါပြီ!")
    } else {
      toast.error("Update failed")
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>နာမည်</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={session?.user?.email ?? ""} disabled className="opacity-60" />
              <p className="text-xs text-gray-400">Email ကို ပြောင်းလဲ၍မရပါ</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              သိမ်းဆည်းမည်
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
