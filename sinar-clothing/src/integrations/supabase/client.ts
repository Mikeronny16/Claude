import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : undefined) || (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined) || '';
const SUPABASE_KEY = (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY : undefined) || (typeof process !== 'undefined' ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined) || '';

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient<Database>('https://placeholder.supabase.co', 'placeholder-key');
