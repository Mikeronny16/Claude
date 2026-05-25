import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const { data: payments } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)
  return <ProfileClient profile={profile} payments={payments || []} />
}
