import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return <ProfileClient profile={profile} />
}
