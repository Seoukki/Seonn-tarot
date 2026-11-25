// Mengisi Supabase lewat API (alternatif dari menempel seed-*.sql). Jalankan LOKAL saja:
//   npm run seed:supabase      (membaca .env.local: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
// Service role key melewati RLS: jangan pernah dimasukkan ke Vercel atau kode frontend.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local terlebih dahulu.'); process.exit(1); }

const file = path.join(root, 'supabase/seed-data.json');
if (!fs.existsSync(file)) { console.error('supabase/seed-data.json belum ada. Jalankan: npm run data:build'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const sb = createClient(url, key, { auth: { persistSession: false } });

const upsert = async (table, rows, onConflict, size = 200) => {
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await sb.from(table).upsert(rows.slice(i, i + size), { onConflict });
    if (error) { console.error(`Gagal di ${table}:`, error.message); process.exit(1); }
  }
  console.log(`✓ ${table}: ${rows.length} baris`);
};

await upsert('tarot_categories', data.categories, 'id');
await upsert('tarot_cards', data.cards, 'id');
await upsert('tarot_card_categories', data.links, 'card_id,category_id');
await upsert('reading_templates', data.templates, 'card_id,category_id,position,orientation', 300);
console.log('Selesai.');
