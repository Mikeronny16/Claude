import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import ReplyClient from "./ReplyClient"

export default async function ReplyPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return <ReplyClient profile={profile} />
}
