import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error("Supabase env vars not set")
    _client = createClient(url, key)
  }
  return _client
}

export interface DocumentRow {
  id: string
  created_at: string
  lang: "en" | "mm"
  filename: string
  analysis: Record<string, unknown>
}

export async function insertDocument(doc: Omit<DocumentRow, "created_at">): Promise<void> {
  const { error } = await getClient().from("documents").insert(doc)
  if (error) throw new Error(error.message)
}

export async function fetchDocument(id: string): Promise<DocumentRow | null> {
  const { data, error } = await getClient()
    .from("documents")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data as DocumentRow
}
