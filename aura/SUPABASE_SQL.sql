-- ============================================================
-- AURA Rebuild Schema — run this in Supabase SQL Editor
-- ============================================================

-- Drop old table if upgrading from previous version
DROP TABLE IF EXISTS style_sessions CASCADE;

-- Sessions: one per selfie upload
CREATE TABLE style_sessions (
  id           TEXT PRIMARY KEY,
  aura_type    TEXT,
  color_season TEXT,
  vibe_summary TEXT,
  prompts      JSONB,          -- array of 6 image_prompt strings
  looks_meta   JSONB,          -- array of 6 {name, style_tag, caption, key_pieces, why_it_suits_you}
  looks_generated JSONB DEFAULT '[]'::jsonb,  -- array of {lookIndex, imageUrl} as they complete
  occasion     TEXT,
  status       TEXT DEFAULT 'ready',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Orders: manual payment tracking
CREATE TABLE IF NOT EXISTS orders (
  id         TEXT PRIMARY KEY,
  session_id TEXT,
  pack       TEXT,
  amount     NUMERIC,
  currency   TEXT,
  method     TEXT,
  txn_ref    TEXT,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE style_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies: public read + insert (no auth in v1)
CREATE POLICY "public read sessions"  ON style_sessions FOR SELECT USING (true);
CREATE POLICY "public insert sessions" ON style_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "public update sessions" ON style_sessions FOR UPDATE USING (true);

CREATE POLICY "public insert orders"  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public read orders"    ON orders FOR SELECT USING (true);

-- Supabase Storage buckets (run in Dashboard > Storage)
-- 1. Create bucket "selfies"  — private (signed URLs)
-- 2. Create bucket "looks"    — public read

-- ============================================================
-- Verify: run SELECT * FROM style_sessions LIMIT 1;
-- ============================================================
