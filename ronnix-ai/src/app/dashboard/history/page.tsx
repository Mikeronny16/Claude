import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import HistoryClient from "./HistoryClient"

export default async function HistoryPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30)

  return <HistoryClient generations={generations || []} />
}
