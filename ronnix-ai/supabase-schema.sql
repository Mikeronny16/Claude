-- Ronnix AI — Supabase Schema
-- Run this in Supabase SQL editor

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro')),
  credits integer default 10,
  daily_count integer default 0,
  daily_reset timestamptz default now(),
  referral_code text unique,
  referred_by uuid references profiles(id),
  wave_number text,
  created_at timestamptz default now()
);

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  tool text not null check (tool in ('caption', 'reply', 'description')),
  input_text text default '',
  output_text text default '',
  credits_used integer default 0,
  created_at timestamptz default now()
);

create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount_mmk integer not null,
  credits_to_add integer not null,
  plan_to_set text,
  wave_screenshot_url text,
  wave_number text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table generations enable row level security;
alter table payment_requests enable row level security;

-- Profiles policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Service can insert profiles" on profiles for insert with check (true);

-- Generations policies
create policy "Users can read own generations" on generations for select using (auth.uid() = user_id);
create policy "Users can insert generations" on generations for insert with check (auth.uid() = user_id);

-- Payment requests
create policy "Users can read own payments" on payment_requests for select using (auth.uid() = user_id);
create policy "Users can insert payments" on payment_requests for insert with check (auth.uid() = user_id);
create policy "Service can update payments" on payment_requests for update using (true);

-- Admin: read all (for admin panel using supabase-js with anon key + admin secret in app)
create policy "Public read payment requests" on payment_requests for select using (true);
create policy "Public read profiles" on profiles for select using (true);
