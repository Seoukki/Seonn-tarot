// Sumber data kartu (server-side): Supabase bila dikonfigurasi, jika gagal/kosong → data lokal.
import { LOCAL_CARDS, fromDbRows } from '../data/cards/index.js';
import { CATALOG } from '../data/catalog.js';
import { getSupabase } from './supabase.js';

const TTL = 5 * 60 * 1000;
let cache = null;

const fetchAll = async (sb, table, select) => {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select(select).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) break;
  }
  return out;
};

const loadFromSupabase = async () => {
  const sb = getSupabase();
  if (!sb) return null;
  const [cards, links, templates] = await Promise.all([
    fetchAll(sb, 'tarot_cards', '*'),
    fetchAll(sb, 'tarot_card_categories', 'card_id, category_id, weight'),
    fetchAll(sb, 'reading_templates', 'card_id, category_id, orientation, interpretation').catch(() => []),
  ]);
  if (cards.length < CATALOG.length) throw new Error(`tarot_cards hanya berisi ${cards.length} baris`);
  return fromDbRows({ cards, links, templates });
};

// Mengembalikan { cards: {id: kartu}, source: 'supabase' | 'local' }
export const getDataset = async () => {
  if (cache && Date.now() - cache.at < TTL) return cache.value;
  let value;
  try {
    const cards = await loadFromSupabase();
    value = cards ? { cards, source: 'supabase' } : { cards: LOCAL_CARDS, source: 'local' };
  } catch (e) {
    console.warn('[data-source] Supabase tidak bisa dipakai, memakai data lokal:', e.message);
    value = { cards: LOCAL_CARDS, source: 'local' };
  }
  cache = { at: Date.now(), value };
  return value;
};

export const getCardList = async () => {
  const { cards, source } = await getDataset();
  return { cards: CATALOG.map((c) => cards[c.id]), source };
};
export const getCard = async (id) => (await getDataset()).cards[id] || null;
