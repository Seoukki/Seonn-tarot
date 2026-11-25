// Menghasilkan supabase/schema.sql (statis) dan supabase/seed-*.sql dari data lokal.
// Pemakaian: node scripts/build-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCAL_CARD_LIST } from '../src/data/cards/index.js';
import { CATEGORIES } from '../src/data/categories.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'supabase');
fs.mkdirSync(out, { recursive: true });

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => `array[${a.map(q).join(', ')}]::text[]`;
const cardCategories = (c) => c.categories.filter((id) => CATEGORIES.some((k) => k.id === id));

// ---- Seed 1: kartu + kategori + relasi ----
let s1 = '-- Seed 1/3: tarot_categories, tarot_cards, tarot_card_categories (dihasilkan oleh scripts/build-data.mjs)\nbegin;\n\n';
s1 += 'insert into public.tarot_categories (id, label, title, description, sort_order) values\n';
s1 += CATEGORIES.map((c, i) => `  (${q(c.id)}, ${q(c.label)}, ${q(c.title)}, ${q(c.description)}, ${i + 1})`).join(',\n');
s1 += '\non conflict (id) do update set label = excluded.label, title = excluded.title, description = excluded.description, sort_order = excluded.sort_order;\n\n';
s1 += 'insert into public.tarot_cards (id, name, card_number, arcana, suit, sort_order, image_path, keywords_upright, keywords_reversed, meaning_upright, meaning_reversed, description, guidance_upright, guidance_reversed, tone_upright, tone_reversed) values\n';
s1 += LOCAL_CARD_LIST.map((c) => `  (${q(c.id)}, ${q(c.name)}, ${c.number}, ${q(c.arcana)}, ${q(c.suit)}, ${c.sort}, ${q(c.image)}, ${arr(c.keywords.upright)}, ${arr(c.keywords.reversed)}, ${q(c.meaning.upright)}, ${q(c.meaning.reversed)}, ${q(c.description)}, ${q(c.guidance.upright)}, ${q(c.guidance.reversed)}, ${c.tone.upright}, ${c.tone.reversed})`).join(',\n');
s1 += '\non conflict (id) do update set name = excluded.name, card_number = excluded.card_number, arcana = excluded.arcana, suit = excluded.suit, sort_order = excluded.sort_order, image_path = excluded.image_path, keywords_upright = excluded.keywords_upright, keywords_reversed = excluded.keywords_reversed, meaning_upright = excluded.meaning_upright, meaning_reversed = excluded.meaning_reversed, description = excluded.description, guidance_upright = excluded.guidance_upright, guidance_reversed = excluded.guidance_reversed, tone_upright = excluded.tone_upright, tone_reversed = excluded.tone_reversed;\n\n';
const links = LOCAL_CARD_LIST.flatMap((c) => cardCategories(c).map((cid, i) => `  (${q(c.id)}, ${q(cid)}, ${Math.max(1, 3 - i)})`));
s1 += 'insert into public.tarot_card_categories (card_id, category_id, weight) values\n' + links.join(',\n') + '\non conflict (card_id, category_id) do update set weight = excluded.weight;\n\ncommit;\n';
fs.writeFileSync(path.join(out, 'seed-1-cards.sql'), s1);

// ---- Seed 2 & 3: reading_templates (posisi 'general'), dibagi dua file agar muat di SQL Editor ----
const rows = [];
for (const c of LOCAL_CARD_LIST) for (const o of ['upright', 'reversed']) for (const cat of CATEGORIES) {
  rows.push(`  (${q(c.id)}, ${q(cat.id)}, 'general', ${q(o)}, ${q(c.interpretations[o][cat.id])})`);
}
const half = Math.ceil(rows.length / 2);
[rows.slice(0, half), rows.slice(half)].forEach((part, i) => {
  const sql = `-- Seed ${i + 2}/3: reading_templates (${part.length} baris)\nbegin;\ninsert into public.reading_templates (card_id, category_id, position, orientation, interpretation) values\n${part.join(',\n')}\non conflict (card_id, category_id, position, orientation) do update set interpretation = excluded.interpretation;\ncommit;\n`;
  fs.writeFileSync(path.join(out, `seed-${i + 2}-templates.sql`), sql);
});

// ---- JSON untuk skrip seed via API ----
const json = {
  categories: CATEGORIES.map((c, i) => ({ id: c.id, label: c.label, title: c.title, description: c.description, sort_order: i + 1 })),
  cards: LOCAL_CARD_LIST.map((c) => ({ id: c.id, name: c.name, card_number: c.number, arcana: c.arcana, suit: c.suit, sort_order: c.sort, image_path: c.image, keywords_upright: c.keywords.upright, keywords_reversed: c.keywords.reversed, meaning_upright: c.meaning.upright, meaning_reversed: c.meaning.reversed, description: c.description, guidance_upright: c.guidance.upright, guidance_reversed: c.guidance.reversed, tone_upright: c.tone.upright, tone_reversed: c.tone.reversed })),
  links: LOCAL_CARD_LIST.flatMap((c) => cardCategories(c).map((cid, i) => ({ card_id: c.id, category_id: cid, weight: Math.max(1, 3 - i) }))),
  templates: LOCAL_CARD_LIST.flatMap((c) => ['upright', 'reversed'].flatMap((o) => CATEGORIES.map((cat) => ({ card_id: c.id, category_id: cat.id, position: 'general', orientation: o, interpretation: c.interpretations[o][cat.id] })))),
};
fs.writeFileSync(path.join(out, 'seed-data.json'), JSON.stringify(json));
console.log(`OK: ${json.cards.length} kartu, ${json.categories.length} kategori, ${json.links.length} relasi, ${json.templates.length} template`);
