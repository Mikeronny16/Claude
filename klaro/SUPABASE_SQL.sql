-- Run this in Supabase SQL Editor

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  lang TEXT NOT NULL DEFAULT 'en',
  filename TEXT NOT NULL DEFAULT 'document',
  analysis JSONB NOT NULL
);

-- Auto-delete documents older than 30 days (optional, saves storage)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('delete-old-docs', '0 0 * * *', $$ DELETE FROM documents WHERE created_at < now() - interval '30 days' $$);

-- RLS: public read (results are shareable via link)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON documents FOR SELECT USING (true);
-- Write is server-side only (service role key, not public anon key)
