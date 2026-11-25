import Link from 'next/link';
import { READING_MENU, SPREADS } from '@/data/spreads';

export const metadata = { title: 'Pilih Pembacaan', description: 'Sepuluh jenis pembacaan tarot: Daily, One Card, Three Card, Love, Friendship, Career, Finance, Yes/No, Deep, dan Personalized.' };

export default function ReadingMenu() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">Pilih jalanmu</p>
        <h1 className="font-title text-4xl sm:text-5xl">Jenis Pembacaan</h1>
        <p className="mx-auto mt-2 max-w-md text-brown">Pilih satu yang paling sesuai dengan yang sedang kamu pikirkan.</p>
      </header>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {READING_MENU.map((m) => {
          const s = SPREADS[m.id];
          const title = m.title || s.title;
          const short = m.short || s.short;
          const count = s ? `${s.positions.length} kartu` : '3 atau 5 kartu';
          return (
            <li key={m.id}>
              <Link href={m.href} className="panel card-hover flex h-full gap-4 p-4 no-underline">
                <span className="font-title flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold-dark text-3xl text-wine" aria-hidden="true">{m.icon}</span>
                <span className="min-w-0">
                  <span className="font-title block text-2xl leading-tight text-ink">{title}</span>
                  <span className="font-head block text-[0.62rem] uppercase tracking-[0.18em] text-gold-dark">{count}</span>
                  <span className="mt-1 block text-sm leading-snug text-brown">{short}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
