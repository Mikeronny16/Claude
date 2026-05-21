---
name: security-audit
description: Audit Next.js + Supabase projects for security vulnerabilities. Check auth, SQL injection, XSS, exposed keys, rate limiting. Run before any deployment.
---

# Security Audit

## Critical Checks

### 1. Environment Variables
- [ ] No secrets in client-side code (`NEXT_PUBLIC_` prefix = public)
- [ ] `.env.local` in `.gitignore`
- [ ] No hardcoded passwords, API keys, or secrets in source
- [ ] Admin passwords set as server-only env vars

### 2. API Routes
- [ ] All admin routes check password/auth before responding
- [ ] Return 401 for unauthorized, not 403 or 200
- [ ] Validate all user inputs before DB operations
- [ ] Rate limit sensitive endpoints (auth, send message)

### 3. Supabase
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Service role key NEVER exposed to client
- [ ] Only anon/publishable key used on frontend

### 4. Authentication
- [ ] Passwords hashed with bcrypt (min rounds: 10)
- [ ] No plaintext passwords stored or logged
- [ ] Session tokens not exposed in URLs

### 5. XSS Prevention
- [ ] Never use `dangerouslySetInnerHTML` with user content
- [ ] User-generated content always escaped
- [ ] CSP headers configured if possible

### 6. SQL Injection
- [ ] Using Supabase client (parameterized) — safe by default
- [ ] Never concatenating user input into raw SQL

## Mike Ronny Project Notes
- Whispr: Admin panel protected by `WHISPR_ADMIN_PASSWORD` env var ✅
- Whispr: Passwords hashed with bcrypt ✅
- DraftWin: Admin protected by `ADMIN_PASSWORD` env var ✅
- No Stripe/payment keys (manual payment flow) ✅

## Supabase RLS Quick Setup
```sql
-- Enable RLS on all tables
ALTER TABLE whispr_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whispr_users ENABLE ROW LEVEL SECURITY;

-- Allow public reads for leaderboard
CREATE POLICY "Public read" ON whispr_users FOR SELECT USING (true);

-- Only owner can read their messages
CREATE POLICY "Owner messages" ON whispr_messages
  FOR SELECT USING (recipient_id = auth.uid());
```
