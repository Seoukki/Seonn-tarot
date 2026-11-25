'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import CardFace from './CardFace';
import { SUIT_LABEL, SUITS } from '@/data/catalog';

const norm = (s) => String(s).toLowerCase();

export default function LibraryClient({ cards }) {
  const [q, setQ] = useState('');
  const [arcana, setArcana] = useState('all');
  const [suit, setSuit] = useState('all');

  const list = useMemo(() => {
    const term = norm(q.trim());
    return cards.filter((c) => {
      if (arcana !== 'all' && c.arcana !== arcana) return false;
      if (suit !== 'all' && c.suit !== suit) return false;
      if (!term) return true;
      return norm(c.name).includes(term) || c.keywords.some((k) => norm(k).includes(term));
    });
  }, [cards, q, arcana, suit]);

  const pickArcana = (a) => { setArcana(a); if (a === 'major') setSuit('all'); };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">78 kartu</p>
        <h1 className="font-title text-4xl sm:text-5xl">Perpustakaan Tarot</h1>
      </header>

      <div className="panel mx-auto mt-6 max-w-2xl space-y-3 p-4">
        <div>
          <label htmlFor="cari" className="sr-only">Cari kartu</label>
          <input id="cari" type="search" className="input" placeholder="Cari nama atau kata kunci…" value={q} maxLength={60} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter arcana">
          {[['all', 'Semua'], ['major', 'Major Arcana'], ['minor', 'Minor Arcana']].map(([id, label]) => (
            <button key={id} type="button" className="chip" aria-pressed={arcana === id} onClick={() => pickArcana(id)}>{label}</button>
          ))}
        </div>
        {arcana !== 'major' && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter suit">
            <button type="button" className="chip" aria-pressed={suit === 'all'} onClick={() => setSuit('all')}>Semua suit</button>
            {SUITS.map((s) => <button key={s} type="button" className="chip" aria-pressed={suit === s} onClick={() => { setSuit(s); if (arcana === 'major') setArcana('all'); }}>{SUIT_LABEL[s]}</button>)}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-brown" aria-live="polite">{list.length} kartu ditemukan</p>
      {list.length === 0 ? (
        <p className="py-16 text-center text-brown">Tidak ada kartu yang cocok. Coba kata kunci lain.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4">
          {list.map((c) => (
            <li key={c.id}>
              <Link href={`/library/${c.id}`} className="card-hover block no-underline" aria-label={c.name}>
                <CardFace card={c} />
                <p className="font-head mt-2 text-center text-[0.65rem] uppercase tracking-[0.1em] text-brown">{c.keywords.slice(0, 2).join(' · ')}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
