# Tarot Reveal — Discover What the Cards Reveal

Situs Tarot Reading bergaya buku tarot vintage (Rider–Waite). **Tanpa AI, tanpa login, tanpa dashboard admin.**
Next.js (App Router) · Tailwind CSS v4 · JavaScript · Framer Motion · Supabase (opsional) · Vercel.

- 78 kartu lengkap (22 Major + 56 Minor), dengan ilustrasi **orisinal** (SVG buatan sendiri, bukan karya berhak cipta).
- 10 jenis pembacaan: Daily, One Card, Three Card, Love, Friendship, Career, Finance, Yes/No (reflektif), Deep (7 kartu), Personalized.
- Interpretasi disusun dari **database + template JavaScript** (`src/lib/interpret.js`), bukan AI.
- Deteksi kategori cerita memakai **kata kunci, sinonim, dan stemming ringan** (`src/lib/detect.js`) dan tidak mengklaim memahami konteks.
- Pengacakan: `crypto.getRandomValues` + Fisher–Yates, tanpa duplikat. Riwayat & kartu harian hanya di LocalStorage.
- Cerita/pertanyaan pengguna **tidak disimpan** di database mana pun.

## 1. Instalasi lokal

Butuh Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local     # opsional, lihat bagian Supabase
npm run dev                    # http://localhost:3000
```

Tanpa Supabase pun situs langsung jalan: data kartu diambil dari `src/data/cards/*.js`.

Perintah lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` / `npm start` | Build & jalankan produksi |
| `npm test` | Tes engine (RNG, deteksi, interpretasi, validasi) |
| `npm run data:validate` | Validasi isi 78 kartu |
| `npm run data:build` | Hasilkan ulang `supabase/seed-*.sql` dari data lokal |
| `npm run art` | Hasilkan ulang 78 ilustrasi di `public/cards/` |
| `npm run seed:supabase` | Isi Supabase via API (lokal saja) |

## 2. Konfigurasi Supabase (opsional)

1. Buat project di [supabase.com](https://supabase.com).
2. **SQL Editor** → tempel dan jalankan `supabase/schema.sql` (tabel, FK, indeks, RLS).
3. Isi data. Pilih salah satu:
   - **SQL Editor**: jalankan berurutan `seed-1-cards.sql`, `seed-2-templates.sql`, `seed-3-templates.sql`.
   - **Skrip**: isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`, lalu `npm run seed:supabase`.
4. **Project Settings → API**: salin *Project URL* dan *anon public key* ke `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

5. Cek: buka `/api/health` → `{"ok":true,"source":"supabase","cards":78}`.

Keamanan:
- RLS aktif di semua tabel dengan kebijakan **SELECT saja**; anon tidak bisa menulis.
- Server hanya memakai **anon key**. `SUPABASE_URL`/`SUPABASE_ANON_KEY` tidak diawali `NEXT_PUBLIC_`, jadi tidak masuk bundle browser.
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk skrip seed di komputermu. **Jangan** dimasukkan ke Vercel.
- Jika Supabase gagal/tidak terisi lengkap, aplikasi otomatis memakai data lokal.

Tabel: `tarot_cards`, `tarot_categories`, `tarot_card_categories` (relasi kartu↔kategori), `reading_templates` (interpretasi per kartu × kategori × orientasi).

## 3. Deploy ke Vercel

1. Push proyek ke GitHub.
2. Di [vercel.com](https://vercel.com): **Add New → Project** → impor repo. Framework terdeteksi otomatis (Next.js).
3. (Opsional) **Settings → Environment Variables**: tambahkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` (Production + Preview).
4. **Deploy**. Setelah selesai, cek `https://domainmu/api/health`.

## 4. Struktur folder

```
src/
  app/                    halaman (App Router)
    page.js               /
    reading/              /reading, /personalized, /draw, /result
    daily/ library/ library/[id]/ history/
    api/interpret/        POST: susun pembacaan (tidak menyimpan apa pun)
    api/health/           GET: status sumber data
  components/             TarotCard (CardFace/FlipCard), DrawClient, ReadingResult, dll.
  data/
    catalog.js            78 id/nama/suit
    categories.js         8 kategori + kamus kata kunci + sinonim
    spreads.js            definisi 10 jenis pembacaan
    cards/*.js            konten 78 kartu (makna, interpretasi, guidance)
  lib/                    rng, detect, interpret, sanitize, storage, data-source, supabase
public/cards/             78 ilustrasi SVG + back.svg
scripts/                  art generator, validator, build-data, seed, test
supabase/                 schema.sql + seed
```

## 5. Catatan

- **Privasi**: riwayat (maks. 200) & kartu harian di LocalStorage (`tarot:v1:*`). Menghapus data browser menghapus riwayat.
- **Kartu harian**: satu per hari per browser (tanggal lokal), diundi deterministik dan menghindari 7 kartu terakhir.
- **Konten sensitif**: bila cerita memuat frasa krisis, UI menampilkan catatan peduli (tanpa nomor hotline yang bisa usang).
- **Disclaimer**: tarot di sini adalah alat refleksi, bukan prediksi pasti ataupun nasihat medis/hukum/keuangan.
