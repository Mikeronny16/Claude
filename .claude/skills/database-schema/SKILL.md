---
name: database-schema
description: Design and generate Supabase PostgreSQL schemas. Always include proper types, foreign keys, RLS, and indexes. Use for any new project or table.
---

# Database Schema Design

## Standard Table Template

```sql
CREATE TABLE table_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_table_user_id ON table_name(user_id);
CREATE INDEX idx_table_created_at ON table_name(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Mike Ronny Stack Patterns

### Users table (Whispr pattern)
```sql
CREATE TABLE project_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_emoji TEXT DEFAULT '👤',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Messages/Content table
```sql
CREATE TABLE project_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES project_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) <= 1000),
  sender_mood TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Analytics/Views table
```sql
CREATE TABLE project_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_views_identifier ON project_views(identifier);
CREATE INDEX idx_views_created ON project_views(created_at DESC);
```

## Rules
- Always use UUID primary keys (not serial/integer)
- Always add `created_at TIMESTAMPTZ DEFAULT now()`
- Foreign keys always with `ON DELETE CASCADE`
- Add CHECK constraints for text length limits
- Add indexes on frequently queried columns
