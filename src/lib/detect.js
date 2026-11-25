// Deteksi kategori TANPA AI: normalisasi teks, sinonim, stemming ringan Bahasa Indonesia, lalu skor kata kunci.
// Ini hanya pencocokan kata/frasa — bukan pemahaman konteks cerita.
import { CATEGORIES, SYNONYMS, SENSITIVE_PHRASES } from '../data/categories.js';

export const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Reduplikasi ("teman-teman" -> "teman teman") dan huruf berulang ("bingunggg") dirapikan.
const squeeze = (w) => w.replace(/(.)\1{2,}/g, '$1$1').replace(/^(\w+?)\1$/, '$1');

const PREFIXES = ['meng', 'meny', 'mem', 'men', 'me', 'ber', 'bel', 'per', 'pe', 'ter', 'di', 'ke', 'se'];
const SUFFIXES = ['nya', 'kan', 'lah', 'kah', 'an', 'i', 'ku', 'mu'];

export const stem = (word) => {
  let w = word;
  if (w.length <= 4) return w;
  for (const s of SUFFIXES) {
    if (w.endsWith(s) && w.length - s.length >= 4) { w = w.slice(0, -s.length); break; }
  }
  for (const p of PREFIXES) {
    if (w.startsWith(p) && w.length - p.length >= 4) { w = w.slice(p.length); break; }
  }
  return w;
};

const tokenize = (text) =>
  normalize(text)
    .split(' ')
    .filter(Boolean)
    .map((t) => squeeze(t))
    .map((t) => SYNONYMS[t] || t);

// Kamus terkompilasi sekali.
const WEIGHTS = { strong: 3, normal: 2, weak: 1 };
const COMPILED = CATEGORIES.map((c) => {
  const words = new Map(); // stem -> {weight, word}
  for (const [level, w] of Object.entries(WEIGHTS)) {
    for (const raw of c[level] || []) {
      const n = normalize(raw);
      if (!n || n.includes(' ')) continue;
      const st = stem(n);
      if (!words.has(st) || words.get(st).weight < w) words.set(st, { weight: w, word: raw });
    }
  }
  const phrases = (c.phrases || []).map((p) => ({ norm: ` ${normalize(p)} `, raw: p }));
  // Kata kunci strong/normal/weak yang berisi spasi diperlakukan sebagai frasa.
  for (const level of Object.keys(WEIGHTS)) {
    for (const raw of c[level] || []) if (normalize(raw).includes(' ')) phrases.push({ norm: ` ${normalize(raw)} `, raw });
  }
  return { id: c.id, words, phrases };
});

const SENSITIVE = SENSITIVE_PHRASES.map((p) => ` ${normalize(p)} `);

export const MIN_TOP_SCORE = 3;
export const AMBIGUOUS_RATIO = 0.75;

// Hasil: { primary, confidence: 'clear'|'ambiguous'|'unclear', ranking:[{id,score,matches}], sensitive }
export const detectCategory = (text) => {
  const norm = ` ${normalize(text)} `;
  const tokens = tokenize(text);
  const stems = tokens.map(stem);
  const sensitive = SENSITIVE.some((p) => norm.includes(p));

  const ranking = COMPILED.map((c) => {
    let score = 0;
    const matches = new Set();
    for (const ph of c.phrases) {
      if (norm.includes(ph.norm)) { score += 3; matches.add(ph.raw); }
    }
    const counted = new Set();
    stems.forEach((st, i) => {
      const hit = c.words.get(st) || c.words.get(tokens[i]);
      if (hit && !counted.has(hit.word)) {
        counted.add(hit.word);
        score += hit.weight;
        matches.add(hit.word);
      }
    });
    return { id: c.id, score, matches: [...matches] };
  }).sort((a, b) => b.score - a.score);

  const [top, second] = ranking;
  let confidence = 'clear';
  if (!top || top.score < MIN_TOP_SCORE) confidence = 'unclear';
  else if (second && second.score >= top.score * AMBIGUOUS_RATIO && second.score >= MIN_TOP_SCORE) confidence = 'ambiguous';

  return {
    primary: confidence === 'unclear' ? null : top.id,
    confidence,
    ranking: ranking.filter((r) => r.score > 0).slice(0, 4),
    sensitive,
  };
};
