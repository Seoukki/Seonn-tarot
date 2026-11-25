// Tes engine (tanpa framework): node scripts/test-engine.mjs
import assert from 'node:assert/strict';
import { CATALOG } from '../src/data/catalog.js';
import { LOCAL_CARDS, fromDbRows } from '../src/data/cards/index.js';
import { SPREADS } from '../src/data/spreads.js';
import { CATEGORIES } from '../src/data/categories.js';
import { randomInt, shuffle, drawCards, mulberry32, hashString } from '../src/lib/rng.js';
import { detectCategory } from '../src/lib/detect.js';
import { buildReading } from '../src/lib/interpret.js';
import { sanitizeText, validateReadingRequest } from '../src/lib/sanitize.js';

let passed = 0;
const t = (name, fn) => { fn(); passed++; console.log('✓', name); };

t('78 kartu unik, 22 major + 56 minor', () => {
  assert.equal(CATALOG.length, 78);
  assert.equal(new Set(CATALOG.map((c) => c.id)).size, 78);
  assert.equal(CATALOG.filter((c) => c.arcana === 'major').length, 22);
  for (const s of ['wands', 'cups', 'swords', 'pentacles']) assert.equal(CATALOG.filter((c) => c.suit === s).length, 14);
});

t('setiap kartu punya semua kategori di kedua orientasi', () => {
  for (const c of Object.values(LOCAL_CARDS)) for (const o of ['upright', 'reversed']) {
    assert.ok(c.keywords[o].length >= 3 && c.meaning[o] && c.guidance[o]);
    for (const cat of CATEGORIES) assert.ok(c.interpretations[o][cat.id]?.length > 20, `${c.id} ${o} ${cat.id}`);
  }
});

t('randomInt tanpa bias berarti (chi-square kasar)', () => {
  const N = 78000, k = 78, bins = Array(k).fill(0);
  for (let i = 0; i < N; i++) bins[randomInt(k)]++;
  const exp = N / k;
  const chi = bins.reduce((a, b) => a + (b - exp) ** 2 / exp, 0);
  assert.ok(chi < 130, `chi=${chi.toFixed(1)}`); // df=77, batas longgar
});

t('shuffle Fisher–Yates: permutasi valid & posisi merata', () => {
  const base = [...Array(10).keys()];
  const first = Array(10).fill(0);
  for (let i = 0; i < 20000; i++) { const s = shuffle(base); assert.deepEqual([...s].sort((a, b) => a - b), base); first[s[0]]++; }
  first.forEach((v) => assert.ok(v > 1700 && v < 2300, String(v)));
});

t('drawCards tidak pernah duplikat', () => {
  for (let i = 0; i < 2000; i++) { const d = drawCards(7); assert.equal(new Set(d.map((c) => c.id)).size, 7); }
});

t('mulberry32 deterministik', () => {
  const a = mulberry32(hashString('x')), b = mulberry32(hashString('x'));
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

t('deteksi kategori: jelas, ambigu, tidak jelas, sensitif', () => {
  assert.equal(detectCategory('Aku bingung sama pacar yang jarang membalas chat').primary, 'relationship');
  assert.equal(detectCategory('temen deket gue menjauh setelah bertengkar').primary, 'friendship');
  assert.equal(detectCategory('gaji kurang dan utang numpuk').primary, 'finance');
  assert.equal(detectCategory('ortu minta aku pulang').primary, 'family');
  assert.equal(detectCategory('hidupku gimana ya').confidence, 'unclear');
  assert.equal(detectCategory('pacar dan kerjaan sama-sama bikin stres').confidence, 'ambiguous');
  assert.equal(detectCategory('aku pengen mati').sensitive, true);
});

t('interpretasi: semua spread × kategori, tanpa undefined / placeholder', () => {
  for (let k = 0; k < 400; k++) for (const s of Object.values(SPREADS)) for (const cat of ['general', ...CATEGORIES.map((c) => c.id)]) {
    const r = buildReading({ type: s.id, category: cat, question: k % 2 ? 'tes pertanyaan' : '', cards: drawCards(s.positions.length) }, LOCAL_CARDS);
    assert.equal(r.cards.length, s.positions.length);
    assert.ok(r.overall.length >= 2 && r.guidance.length >= 2);
    assert.ok(!/undefined|NaN|\{\w+\}/.test(JSON.stringify(r)));
    if (s.id === 'yes-no') assert.ok(['yes', 'no', 'maybe'].includes(r.yesNo.answer));
  }
});

t('interpretasi stabil untuk input yang sama', () => {
  const cards = drawCards(3);
  const a = buildReading({ type: 'three-card', category: 'career', question: 'x', cards }, LOCAL_CARDS);
  const b = buildReading({ type: 'three-card', category: 'career', question: 'x', cards }, LOCAL_CARDS);
  assert.deepEqual(a, b);
});

t('Yes/No mengikuti tone kartu', () => {
  const pos = Object.values(LOCAL_CARDS).find((c) => c.tone.upright >= 1);
  const neg = Object.values(LOCAL_CARDS).find((c) => c.tone.upright <= -1);
  assert.equal(buildReading({ type: 'yes-no', category: 'general', cards: [{ id: pos.id, orientation: 'upright' }] }, LOCAL_CARDS).yesNo.answer, 'yes');
  assert.equal(buildReading({ type: 'yes-no', category: 'general', cards: [{ id: neg.id, orientation: 'upright' }] }, LOCAL_CARDS).yesNo.answer, 'no');
});

t('sanitasi & validasi request', () => {
  assert.ok(!sanitizeText('<script>alert(1)</script>halo\u0000').match(/[<>\u0000]/));
  assert.ok(!sanitizeText('<b>x</b><img src=x onerror=1>').includes('<'));
  assert.equal(sanitizeText('a'.repeat(5000), 100).length, 100);
  const ok = validateReadingRequest({ type: 'one-card', category: 'career', question: 'tes', cards: [{ id: 'the-fool', orientation: 'upright' }] });
  assert.ok(ok.ok);
  assert.equal(validateReadingRequest({ type: 'nope', cards: [] }).ok, false);
  assert.equal(validateReadingRequest({ type: 'three-card', cards: [{ id: 'the-fool', orientation: 'upright' }, { id: 'the-fool', orientation: 'upright' }, { id: 'the-sun', orientation: 'upright' }] }).ok, false);
  assert.equal(validateReadingRequest({ type: 'one-card', cards: [{ id: 'bukan-kartu', orientation: 'upright' }] }).ok, false);
  assert.equal(validateReadingRequest({ type: 'one-card', cards: [{ id: 'the-fool', orientation: 'sideways' }] }).ok, false);
});

t('fromDbRows jatuh kembali ke data lokal saat DB kosong', () => {
  const m = fromDbRows({ cards: [], links: [], templates: [] });
  assert.equal(Object.keys(m).length, 78);
  assert.equal(m['the-fool'].name, 'The Fool');
});

console.log(`\n${passed} tes lulus`);
