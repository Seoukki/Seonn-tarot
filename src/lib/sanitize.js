// Validasi & sanitasi input. Dipakai di klien (form) dan server (/api/interpret).
import { CATALOG_BY_ID } from '../data/catalog.js';
import { CATEGORY_IDS } from '../data/categories.js';
import { SPREADS } from '../data/spreads.js';

export const MAX_STORY = 1200;
export const MIN_STORY = 15;
export const MAX_QUESTION = 1200;

// Membuang karakter kontrol, tag HTML, dan spasi berlebih; memotong ke batas panjang.
export const sanitizeText = (input, max = MAX_QUESTION) => {
  if (typeof input !== 'string') return '';
  return input
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‏‪-‮⁦-⁩]/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
};

export const isCategory = (id) => id === 'general' || CATEGORY_IDS.includes(id);

// Memvalidasi body POST /api/interpret. Mengembalikan { ok, value } atau { ok:false, error }.
export const validateReadingRequest = (body) => {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Permintaan tidak valid.' };
  const spread = SPREADS[body.type];
  if (!spread) return { ok: false, error: 'Jenis pembacaan tidak dikenal.' };
  const category = isCategory(body.category) ? body.category : spread.category;
  const question = sanitizeText(body.question || '', MAX_QUESTION);
  if (!Array.isArray(body.cards) || body.cards.length !== spread.positions.length) {
    return { ok: false, error: `Pembacaan ini membutuhkan ${spread.positions.length} kartu.` };
  }
  const seen = new Set();
  const cards = [];
  for (let i = 0; i < body.cards.length; i++) {
    const c = body.cards[i];
    if (!c || typeof c.id !== 'string' || !CATALOG_BY_ID[c.id]) return { ok: false, error: 'Kartu tidak dikenal.' };
    if (seen.has(c.id)) return { ok: false, error: 'Kartu tidak boleh duplikat.' };
    if (c.orientation !== 'upright' && c.orientation !== 'reversed') return { ok: false, error: 'Orientasi kartu tidak valid.' };
    seen.add(c.id);
    cards.push({ id: c.id, orientation: c.orientation, position: spread.positions[i].id });
  }
  const detected = typeof body.detected === 'string' && isCategory(body.detected) ? body.detected : null;
  return { ok: true, value: { type: spread.id, category, detected, question, cards } };
};
