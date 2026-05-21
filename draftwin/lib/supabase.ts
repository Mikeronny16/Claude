import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error("Supabase env vars missing");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export async function getCredits(userId: string): Promise<number> {
  const { data } = await getSupabase()
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();
  return data?.credits ?? 0;
}

export async function deductCredit(userId: string): Promise<boolean> {
  const { data } = await getSupabase().rpc("deduct_credit", { user_id: userId });
  return data === true;
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await getSupabase().rpc("add_credits", { user_id: userId, amount });
}

export async function ensureUser(userId: string): Promise<void> {
  await getSupabase()
    .from("users")
    .upsert({ id: userId, credits: 3 }, { onConflict: "id", ignoreDuplicates: true });
}
