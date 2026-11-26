# Tarot Reveal by Seon — Discover What the Cards Reveal

Situs Tarot Reading bergaya buku tarot vintage (Rider–Waite). **Tanpa AI, tanpa login, tanpa dashboard admin.**
Next.js (Pages Router, struktur rata) · Tailwind CSS v4 · JavaScript · Framer Motion · Supabase (opsional) · Vercel.

- 78 kartu lengkap (22 Major + 56 Minor) memakai **kartu asli Rider–Waite–Smith edisi 1909 (domain publik)**, sudah dikonversi ke webp ringan.
- 10 jenis pembacaan: Daily, One Card, Three Card, Love, Friendship, Career, Finance, Yes/No (reflektif), Deep (7 kartu), Personalized.
- Interpretasi disusun dari **database + template JavaScript** (`lib/engine.js`), bukan AI.
- Deteksi kategori cerita memakai **kata kunci, sinonim, dan stemming ringan** (`lib/engine.js`) dan tidak mengklaim memahami konteks.
- Pengacakan: `crypto.getRandomValues` + Fisher–Yates, tanpa duplikat. Riwayat & kartu harian hanya di LocalStorage.
- Cerita/pertanyaan pengguna **tidak disimpan** di database mana pun.

## 1. Instalasi lokal

Butuh Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local     # opsional, lihat bagian Supabase
npm run dev                    # http://localhost:3000
```

Tanpa Supabase pun situs langsung jalan: data kartu diambil dari `lib/card-*.js`.

Perintah lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` / `npm start` | Build & jalankan produksi |
| `npm test` | Tes engine (RNG, deteksi, interpretasi, validasi) |
| `npm run data:validate` | Validasi isi 78 kartu |
| `npm run data:build` | Hasilkan ulang `supabase/seed-*.sql` dari data lokal |
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

## 4. Struktur folder (sengaja rata)

```
pages/                    1 file = 1 halaman
  index.js                /
  reading.js              /reading
  reading-personalized.js /reading/personalized
  reading-draw.js         /reading/draw
  reading-result.js       /reading/result
  daily.js  library.js  history.js  widget.js  404.js
  card.js                 /library/<id>  (detail kartu)
  _app.js  _document.js
  api/interpret.js        POST: susun pembacaan (tidak menyimpan apa pun)
  api/health.js           GET: status sumber data
lib/                      semua kode lain, satu folder
  engine.js               RNG, deteksi kategori, interpretasi, sanitasi
  storage.js              LocalStorage + pemanggil API (browser)
  server.js               Supabase opsional + sumber data (server)
  ui.js  motion.js        komponen tampilan / animasi
  catalog.js categories.js spreads.js   data 78 kartu, 8 kategori, 10 pembacaan
  cards.js card-*.js      konten 78 kartu (makna, interpretasi, guidance)
public/cards/             <id>.webp, <id>-t.webp (thumbnail), back.webp
public/                   manifest.webmanifest, sw.js, ikon PWA
scripts/                  validator, build-data, seed, test
supabase/                 schema.sql + seed
globals.css  next.config.mjs  package.json  .env.example
```

URL seperti `/reading/draw` dan `/library/the-fool` tetap berfungsi lewat `rewrites` di `next.config.mjs`, jadi tidak perlu folder bersarang.

## 5. Widget kartu harian (PWA)

Menu **Widget** (`/widget`) menampilkan pratinjau widget kartu hari ini (ukuran kecil/sedang) dan tombol **Pasang ke Layar Utama**.
- Memakai `public/manifest.webmanifest` dan `public/sw.js` (service worker kecil yang menyimpan gambar kartu di perangkat).
- Setelah dipasang, ikon membuka `/widget?source=pwa` (tampilan ringkas kartu hari ini) dengan pintasan ke Daily dan Reading.
- Ini pintasan aplikasi web, **bukan** widget bawaan sistem. Widget native hanya bisa dibuat lewat aplikasi native.
- PWA butuh HTTPS (otomatis di Vercel) dan hanya aktif di build produksi.

## 6. Tanpa Supabase

Supabase **tidak wajib**. Jika `SUPABASE_URL` / `SUPABASE_ANON_KEY` kosong, server langsung memakai data lokal (`lib/card-*.js`) tanpa memuat paket Supabase sama sekali. Isi lengkap 78 kartu, interpretasi, dan semua fitur tetap berjalan. Supabase hanya berguna jika kamu ingin mengubah teks kartu lewat database tanpa deploy ulang.

## 7. Gambar kartu & lisensi

Gambar adalah pindaian kartu Rider–Waite–Smith terbitan 1909 (Pamela Colman Smith, ilustrator; A. E. Waite), domain publik. Sumber pindaian: Steve-P.org (lewat repo publik `mixvlad/TarotCards`). Yang dipakai adalah edisi 1909; edisi modern U.S. Games diklaim penerbitnya, jadi jangan menukar dengan scan edisi modern.
Ukuran: ±40 KB per kartu (360px) dan ±13 KB untuk thumbnail 200px (`<id>-t.webp`, dipakai library dan riwayat), dimuat lazy.

## 8. Catatan

- **Privasi**: riwayat (maks. 200) & kartu harian di LocalStorage (`tarot:v1:*`). Menghapus data browser menghapus riwayat.
- **Kartu harian**: satu per hari per browser (tanggal lokal), diundi deterministik dan menghindari 7 kartu terakhir.
- **Konten sensitif**: bila cerita memuat frasa krisis, UI menampilkan catatan peduli (tanpa nomor hotline yang bisa usang).
- **Disclaimer**: tarot di sini adalah alat refleksi, bukan prediksi pasti ataupun nasihat medis/hukum/keuangan.
