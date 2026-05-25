import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import DescriptionClient from "./DescriptionClient"

export default async function DescriptionPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return <DescriptionClient profile={profile} />
}
