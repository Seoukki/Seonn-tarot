// LocalStorage aman (try/catch, SSR-safe). Hanya berjalan di browser. Cerita pengguna TIDAK dikirim ke database publik.
import { mulberry32, hashString, randomInt, randomOrientation } from './rng.js';
import { ALL_IDS } from './rng.js';

const P = 'tarot:v1:';
const K = { history: P + 'history', daily: P + 'daily', recent: P + 'dailyRecent', seed: P + 'deviceSeed', prefs: P + 'prefs' };
export const HISTORY_LIMIT = 200;

const canUse = () => typeof window !== 'undefined';
const read = (store, key, fallback) => {
  if (!canUse()) return fallback;
  try { const v = window[store].getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const write = (store, key, value) => {
  if (!canUse()) return false;
  try { window[store].setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};
const remove = (store, key) => { if (canUse()) { try { window[store].removeItem(key); } catch { /* abaikan */ } } };

// --- Sesi (sementara, hilang saat tab ditutup) ---
export const session = {
  get: (k, fb = null) => read('sessionStorage', P + k, fb),
  set: (k, v) => write('sessionStorage', P + k, v),
  del: (k) => remove('sessionStorage', P + k),
};

// --- Riwayat ---
const newId = () => `${Date.now().toString(36)}-${randomInt(0xffffff).toString(36)}`;
export const getHistory = () => {
  const h = read('localStorage', K.history, []);
  return Array.isArray(h) ? h : [];
};
export const saveReading = (reading) => {
  const item = { ...reading, id: reading.id || newId(), createdAt: reading.createdAt || new Date().toISOString() };
  const list = [item, ...getHistory().filter((r) => r.id !== item.id)].slice(0, HISTORY_LIMIT);
  write('localStorage', K.history, list);
  return item;
};
export const getReading = (id) => getHistory().find((r) => r.id === id) || null;
export const deleteReading = (id) => { write('localStorage', K.history, getHistory().filter((r) => r.id !== id)); };
export const clearHistory = () => remove('localStorage', K.history);

// --- Daily card ---
export const localDateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const deviceSeed = () => {
  let s = read('localStorage', K.seed, null);
  if (!s) { s = `${Date.now().toString(36)}${randomInt(0xffffffff).toString(36)}`; write('localStorage', K.seed, s); }
  return s;
};

// Satu kartu per hari: konsisten untuk browser + tanggal lokal, menghindari 7 kartu terakhir.
export const getDailyDraw = () => {
  const today = localDateKey();
  const saved = read('localStorage', K.daily, null);
  if (saved && saved.date === today && ALL_IDS.includes(saved.cardId)) return saved;
  const recent = read('localStorage', K.recent, []);
  const blocked = new Set(Array.isArray(recent) ? recent.slice(0, 7) : []);
  const pool = ALL_IDS.filter((id) => !blocked.has(id));
  const rand = mulberry32(hashString(`${deviceSeed()}|${today}`));
  const cardId = pool[Math.floor(rand() * pool.length)];
  const orientation = rand() < 0.5 ? 'upright' : 'reversed';
  const draw = { date: today, cardId, orientation };
  write('localStorage', K.daily, draw);
  write('localStorage', K.recent, [cardId, ...(Array.isArray(recent) ? recent.filter((x) => x !== cardId) : [])].slice(0, 14));
  return draw;
};
export const getDailyReadingId = () => read('localStorage', K.daily, null)?.readingId || null;
export const setDailyReadingId = (readingId) => {
  const d = read('localStorage', K.daily, null);
  if (d) write('localStorage', K.daily, { ...d, readingId });
};

// --- Preferensi ---
export const getPrefs = () => read('localStorage', K.prefs, {});
export const setPref = (k, v) => write('localStorage', K.prefs, { ...getPrefs(), [k]: v });
export { randomOrientation };
