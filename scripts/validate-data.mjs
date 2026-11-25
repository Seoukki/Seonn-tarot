// Validator data kartu.
// Pemakaian:
//   node scripts/validate-data.mjs                       -> validasi semua src/data/cards/*.js (+ kelengkapan 78 kartu)
//   node scripts/validate-data.mjs src/data/cards/wands.js [file lain ...]  -> validasi sebagian
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { CATALOG_BY_ID, CATALOG } from '../src/data/catalog.js';
import { CATEGORY_IDS } from '../src/data/categories.js';

const CORE_IDS = ['relationship','friendship','career','finance','self-discovery']; // 3 kategori lain diturunkan oleh engine
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const quiet = process.argv.includes('--quiet');
const explicit = args.length > 0;

const cardsDir = path.join(root, 'src/data/cards');
const files = explicit
  ? args.map((a) => path.resolve(a))
  : fs
      .readdirSync(cardsDir)
      .filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_'))
      .map((f) => path.join(cardsDir, f));

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`[${id}] ${msg}`);
const warn = (id, msg) => warnings.push(`[${id}] ${msg}`);

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const BANNED = [
  [/\bpasti akan\b/i, 'kalimat deterministik "pasti akan"'],
  [/\bdijamin\b/i, '"dijamin"'],
  [/\bakan (meninggal|mati|sakit parah|hamil|bercerai)\b/i, 'prediksi hidup-mati/kesehatan'],
  [/\b(AI|ChatGPT|OpenAI)\b/, 'menyebut AI'],
  [/\b(obat|dosis|diagnosis)\b/i, 'bahasa medis'],
];

const LIMITS = {
  keyword: [4, 6],
  meaning: [12, 80, 18, 60],
  interp: [6, 70, 9, 45],
  guidance: [6, 50, 10, 32],
  description: [25, 120, 35, 90],
};

function checkLen(id, label, text, [hardMin, hardMax, softMin, softMax]) {
  const n = words(text);
  if (n < hardMin || n > hardMax) err(id, `${label}: ${n} kata (batas keras ${hardMin}-${hardMax})`);
  else if (n < softMin || n > softMax) warn(id, `${label}: ${n} kata (disarankan ${softMin}-${softMax})`);
}

const seenAll = new Map(); // normalized text -> "id:path"
const covered = new Set();

for (const file of files) {
  let mod;
  try {
    mod = await import(pathToFileURL(file).href);
  } catch (e) {
    errors.push(`[${path.basename(file)}] gagal diimpor: ${e.message}`);
    continue;
  }
  const data = mod.default;
  if (!data || typeof data !== 'object') {
    errors.push(`[${path.basename(file)}] harus mengekspor default berupa objek { 'card-id': {...} }`);
    continue;
  }

  for (const [id, c] of Object.entries(data)) {
    if (!CATALOG_BY_ID[id]) {
      err(id, `id tidak ada di katalog (${path.basename(file)})`);
      continue;
    }
    covered.add(id);

    // Struktur
    for (const k of ['keywords', 'meaning', 'guidance', 'tone', 'interpretations']) {
      if (!c[k] || typeof c[k] !== 'object') err(id, `field "${k}" hilang`);
    }
    if (typeof c.description !== 'string' || !c.description.trim()) err(id, 'field "description" hilang');
    if (!Array.isArray(c.categories)) err(id, 'field "categories" hilang');
    if (errors.some((e) => e.startsWith(`[${id}] field`))) continue;

    for (const o of ['upright', 'reversed']) {
      // keywords
      const kw = c.keywords[o];
      if (!Array.isArray(kw) || kw.length < LIMITS.keyword[0] || kw.length > LIMITS.keyword[1]) {
        err(id, `keywords.${o}: harus array ${LIMITS.keyword[0]}-${LIMITS.keyword[1]} item`);
      } else {
        kw.forEach((k) => {
          if (typeof k !== 'string' || !k.trim() || k.length > 40) err(id, `keywords.${o}: item tidak valid "${k}"`);
        });
        if (new Set(kw.map((k) => k.toLowerCase())).size !== kw.length) err(id, `keywords.${o}: ada duplikat`);
      }
      // meaning & guidance
      if (typeof c.meaning[o] !== 'string') err(id, `meaning.${o} hilang`);
      else checkLen(id, `meaning.${o}`, c.meaning[o], LIMITS.meaning);
      if (typeof c.guidance[o] !== 'string') err(id, `guidance.${o} hilang`);
      else checkLen(id, `guidance.${o}`, c.guidance[o], LIMITS.guidance);
      // tone
      const t = c.tone[o];
      if (!Number.isInteger(t) || t < -2 || t > 2) err(id, `tone.${o} harus integer -2..2`);
      // interpretasi per kategori
      const block = c.interpretations?.[o];
      if (!block) {
        err(id, `interpretations.${o} hilang`);
        continue;
      }
      const texts = [];
      for (const cat of CORE_IDS) {
        const v = block[cat];
        if (typeof v !== 'string' || !v.trim()) {
          err(id, `interpretations.${o}.${cat} hilang`);
          continue;
        }
        checkLen(id, `interpretations.${o}.${cat}`, v, LIMITS.interp);
        texts.push(norm(v));
        BANNED.forEach(([re, why]) => re.test(v) && warn(id, `interpretations.${o}.${cat}: ${why}`));
      }
      for (const extra of Object.keys(block)) {
        if (!CATEGORY_IDS.includes(extra)) err(id, `interpretations.${o}: kategori tidak dikenal "${extra}"`);
      }
      if (new Set(texts).size !== texts.length) err(id, `interpretations.${o}: ada teks kategori yang identik`);
      // pembuka kalimat yang berulang
      const starts = {};
      texts.forEach((t) => {
        const s = t.split(' ').slice(0, 2).join(' ');
        starts[s] = (starts[s] || 0) + 1;
      });
      Object.entries(starts).forEach(([s, n]) => n > 3 && warn(id, `interpretations.${o}: ${n} teks dibuka dengan "${s}"`));

      // duplikat lintas kartu
      for (const [label, text] of [
        [`meaning.${o}`, c.meaning[o]],
        [`guidance.${o}`, c.guidance[o]],
        ...CORE_IDS.map((cat) => [`interp.${o}.${cat}`, block[cat]]),
      ]) {
        if (typeof text !== 'string') continue;
        const key = norm(text);
        if (seenAll.has(key)) err(id, `${label} identik dengan ${seenAll.get(key)}`);
        else seenAll.set(key, `${id}:${label}`);
        BANNED.forEach(([re, why]) => re.test(text) && label !== 'x' && label.startsWith('interp') === false && warn(id, `${label}: ${why}`));
      }
    }
    // description
    if (typeof c.description === 'string') checkLen(id, 'description', c.description, LIMITS.description);
    // categories (afinitas)
    if (Array.isArray(c.categories)) {
      if (c.categories.length < 2 || c.categories.length > 4) err(id, 'categories harus berisi 2-4 id');
      c.categories.forEach((x) => !CATEGORY_IDS.includes(x) && err(id, `categories: id tidak dikenal "${x}"`));
      if (new Set(c.categories).size !== c.categories.length) err(id, 'categories: duplikat');
    }
  }
}

if (!explicit) {
  const missing = CATALOG.filter((c) => !covered.has(c.id)).map((c) => c.id);
  if (missing.length) errors.push(`Kartu belum ada datanya (${missing.length}): ${missing.join(', ')}`);
}

if (!quiet || errors.length) {
  warnings.slice(0, 80).forEach((w) => console.log('WARN ', w));
  if (warnings.length > 80) console.log(`... dan ${warnings.length - 80} peringatan lain`);
}
errors.forEach((e) => console.log('ERROR', e));
console.log(
  `\n${covered.size} kartu diperiksa — ${errors.length} error, ${warnings.length} peringatan.`,
);
process.exit(errors.length ? 1 : 0);
