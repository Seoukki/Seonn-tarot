import Link from 'next/link';
import CardFace from '@/components/CardFace';
import { Rule, Star } from '@/components/Ornaments';
import { CATALOG_BY_ID } from '@/data/catalog';
import { READING_MENU, SPREADS } from '@/data/spreads';

const PREVIEW = ['the-fool', 'the-star', 'the-sun'];

const STEPS = [
  ['I', 'Pilih Pembacaan', 'Tentukan jenis pembacaan yang sesuai dengan pertanyaanmu.'],
  ['II', 'Kocok & Pilih Kartu', 'Dek dikocok dengan pengacak yang adil, lalu kamu memilih sendiri kartunya.'],
  ['III', 'Baca Refleksinya', 'Setiap kartu dibaca menurut posisi, orientasi, dan kategori yang kamu pilih.'],
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-6 pt-10 sm:pt-16">
        <div className="panel overflow-hidden px-5 py-10 text-center sm:px-10 sm:py-14">
          <p className="font-head flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-dark"><Star className="text-gold" />Tarot Reveal<Star className="text-gold" /></p>
          <h1 className="font-title mx-auto mt-4 max-w-2xl text-5xl leading-[1.05] sm:text-7xl">Discover What the Cards Reveal</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown">Seperti membuka buku tarot tua: 78 kartu, satu cermin untuk melihat dirimu dengan lebih jernih. Tanpa AI, tanpa akun.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/reading" className="btn btn-primary no-underline">Start Reading</Link>
            <Link href="/daily" className="btn btn-secondary no-underline">Daily Tarot</Link>
          </div>
          <div className="mx-auto mt-12 flex max-w-md items-end justify-center" aria-label="Pratinjau kartu">
            {PREVIEW.map((id, i) => (
              <div key={id} className="card-hover w-[30%] max-w-[130px]" style={{ transform: `rotate(${(i - 1) * 9}deg) translateY(${i === 1 ? -14 : 0}px)`, marginLeft: i ? '-4%' : 0, zIndex: i === 1 ? 2 : 1 }}>
                <CardFace card={CATALOG_BY_ID[id]} eager={i === 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="jenis">
        <h2 id="jenis" className="sr-only">Jenis pembacaan</h2>
        <Rule>Jenis Pembacaan</Rule>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {READING_MENU.map((m) => (
            <li key={m.id}>
              <Link href={m.href} className="panel card-hover flex h-full flex-col items-center gap-1 px-2 py-4 text-center no-underline">
                <span className="font-title text-3xl text-wine" aria-hidden="true">{m.icon}</span>
                <span className="font-head text-[0.68rem] uppercase leading-tight tracking-[0.1em] text-ink">{m.title || SPREADS[m.id].title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10" aria-labelledby="tentang">
        <Rule>Tentang Tarot</Rule>
        <h2 id="tentang" className="font-title mt-4 text-center text-4xl">Cermin, Bukan Ramalan</h2>
        <div className="prose-tarot mt-5 text-lg">
          <p>Tarot terdiri dari 78 kartu: 22 Major Arcana yang menggambarkan tema besar perjalanan hidup, dan 56 Minor Arcana dalam empat suit (Wands, Cups, Swords, Pentacles) yang berbicara tentang keseharian.</p>
          <p>Di sini, kartu dibaca sebagai simbol untuk berefleksi. Makna tiap kartu berasal dari database dan template yang ditulis manual, bukan dari AI, dan hasilnya tidak dimaksudkan sebagai prediksi pasti.</p>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <li key={n} className="panel p-4 text-center">
              <span className="font-title text-4xl text-gold">{n}</span>
              <p className="font-head mt-1 text-xs uppercase tracking-[0.14em]">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-brown">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center"><Link href="/library" className="btn btn-gold no-underline">Jelajahi 78 Kartu</Link></div>
      </section>
    </>
  );
}
