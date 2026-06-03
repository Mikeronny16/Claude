import { DocumentAnalysis } from "./claude"

export interface StoredResult {
  id: string
  created_at: string
  lang: "en" | "mm"
  filename: string
  analysis: DocumentAnalysis
}

// In-memory store for results (serverless-safe via edge cache)
// For production: swap with Supabase insert/select
const store = new Map<string, StoredResult>()

export function saveResult(result: StoredResult): void {
  store.set(result.id, result)
}

export function getResult(id: string): StoredResult | null {
  return store.get(id) ?? null
}
