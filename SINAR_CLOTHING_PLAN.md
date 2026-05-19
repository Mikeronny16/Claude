# Sinar Clothing — Supabase + Admin Panel Implementation Guide

**ဤ guide ကို Sinar Clothing website အတွက် Supabase database နှင့် Admin Panel ထည့်သွင်းရန် ရေးသားထားပါသည်။**

---

## အကျဉ်းချုပ် (Overview)

| Item | Details |
|---|---|
| Frontend | Lovable.dev → React + Vite + TypeScript + Tailwind + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Admin | Single admin, email/password login |
| Customers | Browse only, no account needed |
| Free Tier | Supabase free: 500MB DB, 1GB Storage, 50K users/month |

---

## မာတိကာ (Table of Contents)

1. [Supabase Project Setup](#1-supabase-project-setup)
2. [Lovable.dev နှင့် Supabase ချိတ်ဆက်ခြင်း](#2-lovabledev-supabase-connection)
3. [Database Schema (SQL)](#3-database-schema)
4. [Row Level Security (RLS) Policies](#4-rls-policies)
5. [Supabase Storage Setup](#5-supabase-storage-setup)
6. [Admin Panel Features](#6-admin-panel-features)
7. [Customer-Facing Changes](#7-customer-facing-changes)
8. [Lovable AI Chat Prompts (Ordered)](#8-lovable-ai-prompts-ordered-steps)
9. [Environment Variables](#9-environment-variables)
10. [Security Checklist](#10-security-checklist)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Supabase Project Setup

### Step 1.1 — Account ဖွင့်ခြင်း

1. **https://supabase.com** သို့ သွားပါ
2. **"Start your project"** ကို နှိပ်ပါ
3. GitHub account ဖြင့် sign up လုပ်ပါ (အမြန်ဆုံး method)
4. Credit card မလိုပါ — free tier သုံးနိုင်သည်

### Step 1.2 — Project အသစ်ဖန်တီးခြင်း

1. Supabase dashboard တွင် **"New Project"** နှိပ်ပါ
2. ဖြည့်ရမည့် fields:
   - **Name**: `sinar-clothing`
   - **Database Password**: Strong password တစ်ခု (မမေ့ပါနှင့်! မှတ်ထားပါ)
   - **Region**: `Southeast Asia (Singapore)` — Myanmar နှင့် အနီးဆုံး
   - **Pricing Plan**: Free
3. **"Create new project"** နှိပ်ပါ
4. ၂–၃ မိနစ်စောင့်ပါ (database provision လုပ်နေသည်)

### Step 1.3 — API Keys မှတ်သားထားခြင်း

Project ပြီးသောအခါ **Project Settings → API** တွင်:

```
Project URL:     https://xxxxxxxxxxxx.supabase.co
Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← လျှို့ဝှက်ထားပါ!
```

> **အရေးကြီး**: Service Role Key သည် RLS ကို bypass လုပ်နိုင်သောကြောင့် browser-side code တွင် မထည့်ပါနှင့်။ Lovable Secrets UI တွင်သာ သိမ်းထားပါ။

---

## 2. Lovable.dev Supabase Connection

Lovable.dev တွင် Supabase Integration သည် **native/built-in** ဖြစ်သည်။ Manual configuration သိပ်မလိုပါ။

### Method A: Lovable Native Integration (အကောင်းဆုံး)

1. Lovable project ဖွင့်ပါ (Sinar Clothing project)
2. **Project Settings** (top-right gear icon) သို့ သွားပါ
3. **"Integrations"** tab ကို နှိပ်ပါ
4. **"Supabase"** section တွင် **"Connect Supabase"** နှိပ်ပါ
5. Supabase account ဖြင့် login လုပ်ပြီး Lovable ကို authorize ပေးပါ
6. Organization နှင့် project (`sinar-clothing`) ကို select လုပ်ပါ
7. Lovable က automatically:
   - `VITE_SUPABASE_URL` set လုပ်မည်
   - `VITE_SUPABASE_ANON_KEY` set လုပ်မည်
   - Supabase client code generate လုပ်မည်
8. Chat တွင် ✅ confirmation message ပေါ်လာမည်

### Method B: Manual Key Input (Fallback)

Native integration မအလုပ်လုပ်ပါက:

1. Lovable **Settings → Connectors → Supabase**
2. Paste:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Save

### Lovable တွင် Supabase Client Code

Lovable က auto-generate လုပ်ပေးသည် (ဒါမှမဟုတ် Lovable AI ကို prompt ပေးပြီး generate လုပ်ခိုင်းနိုင်သည်):

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## 3. Database Schema

**Supabase Dashboard → SQL Editor** တွင် ဤ SQL ကို run ပါ။ တစ်ခြင်းစီ run ပါ သို့မဟုတ် အကုန်လုံး တစ်ကြိမ်တည်း run နိုင်သည်။

### 3.1 — Categories Table

```sql
-- ကိုယ်ပိုင် category (Baju, Celana, Dress, Hijab စသည်)
CREATE TABLE IF NOT EXISTS categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,                    -- ဥပမာ: "Baju Batik"
  slug        TEXT NOT NULL UNIQUE,             -- ဥပမာ: "baju-batik" (URL-friendly)
  description TEXT,
  sort_order  INTEGER DEFAULT 0,               -- display order အတွက်
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data ထည့်ပါ
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Semua Produk', 'semua',  0),
  ('Baju',         'baju',   1),
  ('Celana',       'celana', 2),
  ('Dress',        'dress',  3),
  ('Hijab',        'hijab',  4),
  ('Aksesoris',    'aksesoris', 5);
```

### 3.2 — Products Table

```sql
-- ပင်မ products table
CREATE TABLE IF NOT EXISTS products (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(12, 0) NOT NULL DEFAULT 0,   -- IDR တွင် decimal မလို
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Sizes: array of text, ဥပမာ ["S","M","L","XL","XXL"]
  sizes        TEXT[] DEFAULT '{}',

  -- Images: array of storage URLs, ဥပမာ ["https://...supabase.../image1.jpg"]
  images       TEXT[] DEFAULT '{}',

  in_stock     BOOLEAN DEFAULT TRUE,
  is_featured  BOOLEAN DEFAULT FALSE,             -- homepage featured products
  is_active    BOOLEAN DEFAULT TRUE,              -- soft delete / hide

  -- Optional metadata
  sku          TEXT UNIQUE,                       -- stock keeping unit
  stock_qty    INTEGER,                           -- ထည့်ချင်မှ ထည့်

  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.3 — Admin Users Table

> **မှတ်ချက်**: Supabase Auth ကို သုံးသောကြောင့် password ကို products DB တွင် မသိမ်းပါ။
> Admin user ကို Supabase Auth တွင် ဖန်တီး၍ profiles table တွင် role မှတ်သည်။

```sql
-- User profiles + roles table
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'customer',  -- 'admin' or 'customer'
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- New user sign up တိုင်း auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3.4 — Orders Table (Future Use, Optional)

```sql
-- Future use — customer account မလိုသေးသောကြောင့် optional
CREATE TABLE IF NOT EXISTS orders (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number   TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || LPAD(CAST(FLOOR(RANDOM() * 999999) AS TEXT), 6, '0'),
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  items          JSONB NOT NULL DEFAULT '[]',  -- [{product_id, name, price, qty, size}]
  total_amount   NUMERIC(14, 0) NOT NULL,
  status         TEXT DEFAULT 'pending',       -- pending/confirmed/shipped/delivered
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.5 — Indexes (Performance)

```sql
-- Search နှင့် filter အတွက် indexes
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_in_stock    ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_slug      ON categories(slug);
```

---

## 4. RLS Policies

**RLS (Row Level Security)** သည် database level တွင် access control ကို enforce လုပ်သည်။
Client-side check ကသာ UI ကိုဝှက်သည်၊ RLS ကသာ data ကိုကာကွယ်သည်။

### 4.1 — RLS Enable လုပ်ခြင်း

```sql
-- Tables အားလုံးတွင် RLS ကို enable လုပ်ပါ
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
```

### 4.2 — Helper Function (Admin Check)

```sql
-- Admin ဟုတ်/မဟုတ် စစ်ဆေးသော reusable function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 4.3 — Categories Policies

```sql
-- Anyone (login မလို) can read categories
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- Only admin can manage categories
CREATE POLICY "categories_admin_insert"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_update"
  ON categories FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_delete"
  ON categories FOR DELETE
  TO authenticated
  USING (public.is_admin());
```

### 4.4 — Products Policies

```sql
-- Anyone can read active products
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Admin can read all products (including hidden ones)
CREATE POLICY "products_admin_read_all"
  ON products FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin only: Insert
CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Admin only: Update
CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin only: Delete
CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  TO authenticated
  USING (public.is_admin());
```

### 4.5 — Profiles Policies

```sql
-- User သည် မိမိ profile ကိုသာ ဖတ်နိုင်သည်
CREATE POLICY "profiles_own_read"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- User သည် မိမိ profile ကိုသာ update လုပ်နိုင်သည်
CREATE POLICY "profiles_own_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = 'customer');  -- role မပြောင်းနိုင်

-- Admin သည် role ပြောင်းနိုင်သည်
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

### 4.6 — Orders Policies

```sql
-- Anyone can insert order (no account needed for now)
CREATE POLICY "orders_public_insert"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Admin can read all orders
CREATE POLICY "orders_admin_read"
  ON orders FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin can update order status
CREATE POLICY "orders_admin_update"
  ON orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

---

## 5. Supabase Storage Setup

### 5.1 — Product Images Bucket ဖန်တီးခြင်း

**Supabase Dashboard → Storage → New Bucket**:

```
Bucket Name:  product-images
Public:       ✅ YES (customers တွေ image ကိုကြည့်နိုင်ရမည်)
File size:    10 MB (clothing photos အတွက် လုံလောက်သည်)
Allowed MIME: image/jpeg, image/png, image/webp
```

### 5.2 — Storage RLS Policies

```sql
-- Storage bucket policies (SQL Editor တွင် run ပါ)

-- Public: Anyone can view product images
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Admin only: Upload images
CREATE POLICY "product_images_admin_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Admin only: Update/replace images
CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Admin only: Delete images
CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );
```

### 5.3 — Image Upload React Code

```typescript
// Admin panel တွင် image upload လုပ်နည်း
import { supabase } from '@/integrations/supabase/client';

async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Public URL ရယူပါ
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Multiple images upload
async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const urls = await Promise.all(files.map(uploadProductImage));
  return urls;
}
```

---

## 6. Admin Panel Features

### 6.1 — Admin တစ်ဦး Setup လုပ်ခြင်း

**Supabase Dashboard → Authentication → Users → "Add user"**:

```
Email:    admin@sinarclothing.com   (သင့်ကိုယ်ပိုင် email)
Password: [Strong password]
Auto Confirm: ✅
```

Admin ဖန်တီးပြီးနောက် SQL Editor တွင် role ကို admin အဖြစ် update လုပ်ပါ:

```sql
-- admin@sinarclothing.com ၏ user ID ကိုရှာပါ
SELECT id, email FROM auth.users WHERE email = 'admin@sinarclothing.com';

-- ထို ID ဖြင့် profile ကို admin အဖြစ် update လုပ်ပါ
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@sinarclothing.com';

-- Verify လုပ်ပါ
SELECT * FROM profiles WHERE role = 'admin';
```

### 6.2 — Admin Pages Structure

```
/admin              → redirect to /admin/dashboard
/admin/login        → Login page (email/password)
/admin/dashboard    → Stats: total products, featured, out of stock
/admin/products     → Product list with search/filter
/admin/products/new → Add new product form
/admin/products/:id → Edit product form
/admin/categories   → Category management
```

### 6.3 — Route Protection (Auth Guard)

```typescript
// src/components/AdminRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
```

### 6.4 — Product Form Fields

Admin panel product form တွင် ပါသင့်သည့် fields:

| Field | Type | Notes |
|---|---|---|
| name | Text input | Required |
| description | Textarea | Rich text optional |
| price | Number input | IDR, no decimal |
| category_id | Select dropdown | Categories မှ |
| sizes | Multi-checkbox | S, M, L, XL, XXL, Free Size |
| images | File upload (multiple) | Max 10MB each |
| in_stock | Toggle switch | |
| is_featured | Toggle switch | Homepage display |
| is_active | Toggle switch | Show/Hide product |

---

## 7. Customer-Facing Changes

### 7.1 — Products Hook (Supabase မှ ဆွဲ)

```typescript
// src/hooks/useProducts.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  sizes: string[];
  images: string[];
  in_stock: boolean;
  is_featured: boolean;
  categories?: { name: string; slug: string };
}

interface UseProductsOptions {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select(`
            *,
            categories (name, slug)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (options.categorySlug && options.categorySlug !== 'semua') {
          query = query.eq('categories.slug', options.categorySlug);
        }
        if (options.featuredOnly) {
          query = query.eq('is_featured', true);
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [options.categorySlug, options.featuredOnly, options.limit]);

  return { products, loading, error };
}
```

### 7.2 — Loading State Component

```typescript
// src/components/ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3" />
          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
          <div className="bg-gray-200 h-4 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

### 7.3 — Out of Stock Badge

```typescript
// Product card တွင်
{!product.in_stock && (
  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
    Habis
  </span>
)}
```

### 7.4 — Category Filter

```typescript
// src/components/CategoryFilter.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function CategoryFilter({
  activeSlug,
  onChange
}: {
  activeSlug: string;
  onChange: (slug: string) => void;
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
            activeSlug === cat.slug
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
```

---

## 8. Lovable AI Prompts (Ordered Steps)

ဤ prompts များကို **အစဉ်လိုက်** Lovable chat တွင် paste လုပ်ပါ။ တစ်ခု complete မဖြစ်မချင်း နောက်တစ်ခုကို မပေးပါနှင့်။

---

### PROMPT 1: Supabase ချိတ်ဆက်ပြီးနောက် Database Setup

```
I've connected Supabase to this project. Now please set up the database for Sinar Clothing, an Indonesian clothing store.

Create a Supabase client at src/integrations/supabase/client.ts using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.

Also generate TypeScript types for these tables:
- categories (id, name, slug, description, sort_order, created_at)
- products (id, name, description, price, category_id, sizes TEXT[], images TEXT[], in_stock, is_featured, is_active, sku, stock_qty, created_at, updated_at)
- profiles (id, email, role, full_name, created_at)

Save the types to src/integrations/supabase/types.ts
```

---

### PROMPT 2: Products Page ကို Supabase မှ Fetch လုပ်ခြင်း

```
Update the products/shop page to fetch products from Supabase instead of using hardcoded data.

Requirements:
1. Create a custom hook useProducts() in src/hooks/useProducts.ts that fetches from the products table, joining with categories
2. Only show products where is_active = true
3. Add a loading skeleton state (animated gray boxes while loading)
4. Add category filter buttons at the top (fetched from categories table)
5. Show "Habis" (out of stock) badge on products where in_stock = false
6. Out of stock products should still be visible but show the badge and have a different cursor style

Use the existing card design but replace hardcoded data with Supabase data.
```

---

### PROMPT 3: Admin Login Page

```
Create an admin login page at the route /admin/login.

Requirements:
1. Simple centered card with Sinar Clothing logo/name
2. Email and password fields using shadcn/ui Input and Button components
3. On submit, use supabase.auth.signInWithPassword({ email, password })
4. On success, redirect to /admin/dashboard
5. On error, show error message (e.g., "Email atau password salah")
6. Add "Forgot password" link (can be placeholder for now)
7. Do NOT show this page in main navigation — it's admin-only

Use Tailwind CSS and shadcn/ui components for the UI.
```

---

### PROMPT 4: Admin Route Protection

```
Create a protected route wrapper component at src/components/AdminRoute.tsx.

This component should:
1. Check if the current user is logged in via supabase.auth.getUser()
2. If logged in, fetch their profile from the profiles table to check if role = 'admin'
3. If not logged in OR not admin: redirect to /admin/login
4. If admin: render the children components
5. Show a loading spinner while checking

Then wrap all /admin/* routes (except /admin/login) with this AdminRoute component in the router.
```

---

### PROMPT 5: Admin Dashboard Page

```
Create an admin dashboard page at /admin/dashboard (protected by AdminRoute).

Layout:
- Top navbar with "Sinar Clothing Admin" title and logout button
- Sidebar navigation: Dashboard, Products, Categories
- Main content area

Dashboard content (4 stat cards):
1. Total Products → SELECT COUNT(*) FROM products
2. Active Products → WHERE is_active = true
3. Featured Products → WHERE is_featured = true
4. Out of Stock → WHERE in_stock = false

Use shadcn/ui Card components for the stat cards.
Logout button should call supabase.auth.signOut() then redirect to /admin/login.
```

---

### PROMPT 6: Product List (Admin)

```
Create an admin product list page at /admin/products (protected by AdminRoute).

Features:
1. Table showing: Product Image (thumbnail), Name, Category, Price (format as IDR), Stock Status, Featured, Actions
2. Search input to filter by product name
3. Filter by category dropdown
4. "Tambah Produk" button → navigate to /admin/products/new
5. Edit button → navigate to /admin/products/:id
6. Toggle in_stock button (switch/toggle) — updates immediately in Supabase
7. Toggle is_active button — soft delete/hide product
8. Delete button with confirmation dialog before deleting

Fetch data from Supabase products table joined with categories.
Use shadcn/ui Table, Button, Badge, Switch, AlertDialog components.
```

---

### PROMPT 7: Add Product Form

```
Create an "Add Product" form page at /admin/products/new (protected by AdminRoute).

Form fields:
1. Product Name (required) — Text input
2. Description — Textarea
3. Price — Number input, label "Harga (IDR)"
4. Category — Select dropdown (fetched from categories table)
5. Sizes — Multi-select checkboxes: S, M, L, XL, XXL, Free Size
6. Images — Multiple file upload, accept image/*, max 5 images
   - Preview uploaded images
   - Upload to Supabase Storage bucket "product-images" folder "products/"
   - Store public URLs in images array
7. In Stock — Toggle switch (default: true)
8. Featured — Toggle switch (default: false)
9. Active — Toggle switch (default: true)

On save:
- Validate required fields
- Insert into products table via Supabase
- Show success toast and redirect to /admin/products

Use shadcn/ui form components. Use react-hook-form for form state management.
```

---

### PROMPT 8: Edit Product Form

```
Create an "Edit Product" form page at /admin/products/:id (protected by AdminRoute).

This should be the same form as the Add Product page but:
1. Fetch existing product data on mount using the :id param
2. Pre-fill all form fields with existing data
3. For images: show existing images with delete (X) button for each
4. New image uploads are added to the existing images array
5. On save: UPDATE the product in Supabase instead of INSERT
6. Add a "Hapus Produk" (Delete Product) button at the bottom with confirmation dialog
7. Show "Terakhir diperbarui: [date]" at the top

Reuse the same form component from the Add Product page.
```

---

### PROMPT 9: Categories Management

```
Create a Categories management page at /admin/categories (protected by AdminRoute).

Features:
1. List all categories in a simple table (Name, Slug, Sort Order, Actions)
2. Inline edit: click on a row to edit name and sort_order
3. "Tambah Kategori" button — opens a dialog/modal with Name and Slug fields
   - Auto-generate slug from name (lowercase, replace spaces with hyphens)
4. Delete category button with confirmation
   - Warn if products are using this category

CRUD operations:
- INSERT into categories table
- UPDATE categories SET name, slug, sort_order
- DELETE FROM categories (if no products linked)

Use shadcn/ui Dialog, Table, Button components.
```

---

### PROMPT 10: Homepage Featured Products

```
Update the homepage to show featured products from Supabase.

Changes:
1. In the featured/new arrivals section, fetch products where is_featured = true AND is_active = true, limit 8
2. Add loading skeleton while fetching
3. If no featured products exist yet, show a placeholder message
4. Each product card should show:
   - First image from images array (or a placeholder if empty)
   - Product name
   - Price formatted as "Rp 150.000"
   - "Habis" badge if in_stock = false
5. Clicking a product card should scroll/navigate to the shop page with that product highlighted or shown in a modal

Keep the existing homepage design/layout, just replace the hardcoded products.
```

---

## 9. Environment Variables

### Lovable Secrets UI တွင် သိမ်းရမည့် Variables

**Project Settings → Secrets** (Lovable) တွင်:

```
VITE_SUPABASE_URL        = https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Browser-side (Public) Variables

`VITE_` prefix ပါသော variables များသည် browser မှ မြင်နိုင်သည်။ Anon key သည် public ဖြစ်ပြီး RLS ဖြင့် ကာကွယ်ထားသောကြောင့် safe ဖြစ်သည်။

### ဘယ်တော့မှ Browser Code တွင် မထည့်ရ

```
SUPABASE_SERVICE_ROLE_KEY  ← လုံးဝ frontend တွင် မသုံးပါ!
```

Service role key ကို သာ Edge Functions (server-side) တွင် သုံးပါ။

---

## 10. Security Checklist

### Database Security

- [x] RLS enabled on all tables
- [x] `is_admin()` helper function SECURITY DEFINER mode တွင် run သည်
- [x] Products: public read, admin write only
- [x] Profiles: users own data only, admin can update roles
- [x] Storage: public read, admin upload/delete only

### Authentication Security

- [x] Admin email/password via Supabase Auth
- [x] Role check database level (RLS) တွင် ပါဝင်သည် — client-side check တစ်ခုတည်း မဆိုင်
- [x] JWT token expiry: Supabase default 1 hour, auto-refresh with session
- [x] `signOut()` သည် Supabase session ကို destroy လုပ်သည်

### Lovable-specific

- [x] Secret keys Lovable Secrets UI တွင် သိမ်းထားသည် (code တွင် hardcode မလုပ်)
- [x] GitHub export တွင် `.env` file မပါဝင်ရ

### Common Mistakes မဖြစ်ရန်

```typescript
// ❌ မမှားပါနှင့် — Service role key ကို frontend တွင် မသုံးပါ
const adminClient = createClient(url, process.env.SERVICE_ROLE_KEY);

// ✅ မှန်သော နည်း — RLS policies ကို is_admin() function ဖြင့် enforce လုပ်ပါ
const { data } = await supabase.from('products').insert(newProduct);
// → RLS သည် authenticated admin ဟုတ်/မဟုတ် automatically စစ်ဆေးမည်
```

---

## 11. Troubleshooting

### ပြဿနာများနှင့် ဖြေရှင်းနည်းများ

**Q: Products fetch မရဘူး, empty array ပြနေတယ်**
```sql
-- RLS policy check — anon role ရှိ/မရှိ စစ်ပါ
SELECT * FROM products; -- Supabase SQL Editor တွင် (authenticated ဖြင့် run ပါ)

-- Policy ကို double check
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Q: Admin login ပြီးနောက် redirect မလုပ်ဘူး**
- `supabase.auth.onAuthStateChange` listener ကို check ပါ
- Profile fetch ပြီး role = 'admin' ဟုတ်/မဟုတ် log ထုတ်ကြည့်ပါ

**Q: Image upload failed**
```sql
-- Storage bucket policy ရှိ/မရှိ စစ်ပါ
SELECT * FROM storage.policies WHERE bucket_id = 'product-images';

-- bucket public ဖြစ်ကြောင်း confirm လုပ်ပါ
SELECT * FROM storage.buckets WHERE name = 'product-images';
```

**Q: is_admin() function မအလုပ်လုပ်ဘူး**
```sql
-- profiles table တွင် admin user ရှိ/မရှိ စစ်ပါ
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- function ကို directly test လုပ်ပါ (SQL Editor, as the admin user)
SELECT public.is_admin();
```

**Q: Supabase project paused (free tier)**
- Free tier projects ၁ ပတ် inactivity ရှိလျှင် pause ဖြစ်သည်
- Supabase Dashboard → Projects → "Restore" နှိပ်ပါ
- Regular usage ရှိပါက auto-pause မဖြစ်ပါ

**Q: "new row violates row-level security policy" error**
- Admin user profile တွင် role = 'admin' set မလုပ်ရသေးဘူး
- Section 6.1 ရှိ SQL UPDATE ကို run ပါ

---

## အကျဉ်းချုပ် Implementation Order

```
Day 1 — Foundation
  ├── 1. Supabase project ဖန်တီး + region Singapore
  ├── 2. Lovable တွင် Supabase connect (native integration)
  ├── 3. SQL Editor တွင် Schema run (categories, products, profiles)
  ├── 4. RLS policies run
  ├── 5. Storage bucket "product-images" ဖန်တီး
  └── 6. Admin user ဖန်တီး + role = 'admin' set

Day 2 — Admin Panel
  ├── 7. Prompt 1: Supabase client + TypeScript types
  ├── 8. Prompt 3: Admin login page
  ├── 9. Prompt 4: AdminRoute protection
  ├── 10. Prompt 5: Dashboard with stats
  └── 11. Prompt 6: Product list page

Day 3 — Product CRUD
  ├── 12. Prompt 7: Add product form + image upload
  ├── 13. Prompt 8: Edit product form
  └── 14. Prompt 9: Categories management

Day 4 — Customer-facing
  ├── 15. Prompt 2: Shop page → fetch from Supabase
  └── 16. Prompt 10: Homepage featured products

Day 5 — Testing & Polish
  ├── 17. Test all CRUD operations as admin
  ├── 18. Test customer view (no login)
  ├── 19. Test RLS (try to access admin APIs without login)
  └── 20. Add sample products + categories data
```

---

## Supabase Free Tier Summary

| Resource | Limit | Sinar Clothing Usage |
|---|---|---|
| Database | 500 MB | Hundreds of products, safe |
| Storage | 1 GB | ~100–200 product photos |
| MAU | 50,000 | 1 admin only, very safe |
| Projects | 2 | 1 project used |
| Bandwidth | 5 GB/month | Small store, safe |
| Auto-pause | 1 week inactivity | Use regularly to avoid |

> **Upgrade ကို စဉ်းစားသင့်သောအချိန်**: Product photos 200+ ကျော်ပြီး storage 1GB နီးကပ်လာသောအခါ သို့မဟုတ် traffic တိုးလာသောအခါ Pro plan ($25/month) ကိုစဉ်းစားပါ။

---

*Guide prepared: May 2026 | Sinar Clothing Supabase Implementation*
*Technologies: Lovable.dev + React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase (PostgreSQL + Auth + Storage)*
