// RNG yang adil: crypto.getRandomValues + rejection sampling (tanpa modulo bias), Fisher–Yates, tanpa duplikat.
import { CATALOG } from '../data/catalog.js';

const cryptoObj = () => (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues ? globalThis.crypto : null);

export const randomInt = (max) => {
  if (!Number.isInteger(max) || max <= 0) throw new RangeError('max harus bilangan bulat positif');
  const c = cryptoObj();
  if (!c) return Math.floor(Math.random() * max);
  const range = 0x100000000;
  const limit = range - (range % max);
  const buf = new Uint32Array(1);
  let x;
  do { c.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
};

export const shuffle = (arr, rand = randomInt) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const randomOrientation = () => (randomInt(2) === 0 ? 'upright' : 'reversed');

export const ALL_IDS = CATALOG.map((c) => c.id);

// Urutan dek acak untuk satu sesi menarik kartu.
export const shuffledDeck = () => shuffle(ALL_IDS);

// Menarik n kartu unik, masing-masing dengan orientasi acak.
export const drawCards = (n) => shuffledDeck().slice(0, n).map((id) => ({ id, orientation: randomOrientation() }));

// --- RNG deterministik (untuk Daily Card & variasi teks yang stabil) ---
export const hashString = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

export const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const seededPick = (arr, seedStr) => arr[hashString(seedStr) % arr.length];
