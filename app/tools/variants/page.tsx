import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import VariantsClient from "./VariantsClient"

export default async function Page() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return <VariantsClient profile={profile} />
}
