import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import CaptionClient from "./CaptionClient"

export default async function CaptionPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return <CaptionClient profile={profile} />
}
