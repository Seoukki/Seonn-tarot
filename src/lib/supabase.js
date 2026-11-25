// Klien Supabase SISI SERVER saja. Memakai anon key (hanya SELECT lewat RLS). Service role key TIDAK dipakai di aplikasi.
import { createClient } from '@supabase/supabase-js';

let client = null;
export const hasSupabaseConfig = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

export const getSupabase = () => {
  if (!hasSupabaseConfig()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (u, o) => fetch(u, { ...o, cache: 'no-store' }) },
    });
  }
  return client;
};
