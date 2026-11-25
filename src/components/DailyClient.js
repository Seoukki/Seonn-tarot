'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATALOG_BY_ID } from '@/data/catalog';
import { CATEGORY_BY_ID } from '@/data/categories';
import { SPREADS } from '@/data/spreads';
import { getDailyDraw, getHistory, saveReading, getDailyReadingId, setDailyReadingId, localDateKey } from '@/lib/storage';
import { requestReading } from '@/lib/client-api';
import { FlipCard } from './CardFace';
import ReadingResult from './ReadingResult';

const LENSES = SPREADS.daily.lensChoice ? ['general', 'relationship', 'friendship', 'career', 'finance', 'self-discovery'] : ['general'];

export default function DailyClient() {
  const [draw, setDraw] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [lens, setLens] = useState('general');
  const [reading, setReading] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = getDailyDraw();
    setDraw(d);
    const rid = getDailyReadingId();
    if (rid && getHistory().some((r) => r.id === rid)) setFlipped(true); // sudah dibuka hari ini
  }, []);

  useEffect(() => {
    if (!draw || !flipped) return;
    let cancelled = false;
    setLoading(true); setError('');
    requestReading({ type: 'daily', category: lens, question: '', cards: [{ id: draw.cardId, orientation: draw.orientation }] })
      .then((r) => {
        if (cancelled) return;
        const rid = getDailyReadingId();
        const existing = rid ? getHistory().find((h) => h.id === rid) : null;
        if (lens === 'general' && !existing) {
          const saved = saveReading({ ...r, daily: draw.date });
          setDailyReadingId(saved.id);
          setReading(saved);
        } else {
          setReading({ ...r, createdAt: existing?.createdAt || new Date().toISOString() });
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [draw, flipped, lens]);

  if (!draw) return <div className="px-4 py-20 text-center text-brown">Menyiapkan kartu hari ini…</div>;
  const card = CATALOG_BY_ID[draw.cardId];
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {!flipped || !reading ? (
        <div className="text-center">
          <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">{today}</p>
          <h1 className="font-title mt-1 text-4xl sm:text-5xl">Kartu Hari Ini</h1>
          <p className="mx-auto mt-2 max-w-sm text-brown">Satu kartu per hari untuk perangkat ini. Tarik napas, lalu ketuk untuk membukanya.</p>
          <div className="mx-auto mt-8 w-[min(62vw,230px)]">
            <FlipCard card={card} reversed={draw.orientation === 'reversed'} flipped={flipped} onClick={() => setFlipped(true)} disabled={flipped} label="Buka kartu hari ini" />
          </div>
          {!flipped && <button type="button" className="btn btn-primary mt-8" onClick={() => setFlipped(true)}>Buka Kartu</button>}
          {flipped && loading && <p className="mt-6 text-brown" role="status">Menyusun pesan hari ini…</p>}
          {error && (
            <div role="alert" className="mt-6"><p className="text-wine">{error}</p><button type="button" className="btn btn-secondary mt-3" onClick={() => { setFlipped(false); setTimeout(() => setFlipped(true), 50); }}>Coba Lagi</button></div>
          )}
        </div>
      ) : (
        <ReadingResult reading={reading}>
          <div className="mt-8">
            <p className="font-head mb-2 text-center text-xs uppercase tracking-[0.14em] text-brown">Lihat dari sudut lain</p>
            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Sudut pandang">
              {LENSES.map((id) => <button key={id} type="button" className="chip" aria-pressed={lens === id} onClick={() => setLens(id)}>{id === 'general' ? 'Umum' : CATEGORY_BY_ID[id].title}</button>)}
            </div>
            <p className="mt-6 text-center text-sm text-brown">Kartu hari ini berganti besok ({localDateKey()}). <Link href="/history" className="underline">Lihat riwayat</Link></p>
          </div>
        </ReadingResult>
      )}
    </div>
  );
}
