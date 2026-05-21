# New Project Command

When Mike says "new project" or "build [project name]":

## Setup Steps

1. `cd /home/user/Claude`
2. `npx create-next-app@latest [name] --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
3. `cd [name]`
4. `npm install @supabase/supabase-js bcryptjs`
5. `npm install --save-dev @types/bcryptjs`

## Files to Create Immediately

### `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key
NEXT_PUBLIC_APP_URL=https://[name].vercel.app
```

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

### `lib/supabase.ts`
```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default supabase;
```

### `app/globals.css` — Copy Ocean Dark theme from whispr/app/globals.css

## Theme
Always use Ocean Dark: #040d1a bg, #06b6d4 cyan, Plus Jakarta Sans font.

## After Setup
- Run `npm run build` to verify clean build
- Commit: `git add [name]/ && git commit -m "feat: init [name] project"`
- Push to main
