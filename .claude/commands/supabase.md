# Supabase Command

When Mike needs a new table or DB feature:

## Generate SQL

Always include:
1. Table with UUID primary key
2. Foreign keys with ON DELETE CASCADE
3. Indexes on frequently queried columns
4. created_at timestamp

## Template
```sql
CREATE TABLE project_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_project_name_user_id ON project_name(user_id);
CREATE INDEX idx_project_name_created ON project_name(created_at DESC);
```

## Instructions for Mike
1. Go to supabase.com → [project] → SQL Editor
2. Paste the SQL
3. Click Run ▶️
4. "Success. No rows returned." = done ✅

## After DB Change
Update `lib/supabase.ts` with new query functions.
Update API routes to use new tables.
Run `npm run build` to verify types are correct.
