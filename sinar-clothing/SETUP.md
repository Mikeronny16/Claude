# Sinar Clothing — Admin Setup

## First time setup

1. Go to your site's `/auth` page
2. Click **Sign up** and create your account with your email
3. The first account automatically gets admin access
4. Go to `/admin` to manage products

## Adding products
- Go to `/admin`
- Click **Add product**
- Fill in name (Myanmar + English), category, sizes, price, status
- Upload product photo or paste image URL
- Click **Create**

## Supabase SQL (run once in Supabase SQL Editor)
If price column is missing, run:
```sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;
```

## Environment Variables (for deployment)
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```
