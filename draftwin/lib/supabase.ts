import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function getCredits(userId: string): Promise<number> {
  const { data } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();
  return data?.credits ?? 0;
}

export async function deductCredit(userId: string): Promise<boolean> {
  const { data } = await supabase.rpc("deduct_credit", { user_id: userId });
  return data === true;
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await supabase.rpc("add_credits", { user_id: userId, amount });
}

export async function ensureUser(userId: string): Promise<void> {
  await supabase
    .from("users")
    .upsert({ id: userId, credits: 3 }, { onConflict: "id", ignoreDuplicates: true });
}
