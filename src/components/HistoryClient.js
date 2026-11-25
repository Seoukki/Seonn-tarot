'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistory, deleteReading, clearHistory } from '@/lib/storage';
import { formatDateTime } from '@/lib/format';
import { CATALOG_BY_ID } from '@/data/catalog';
import CardFace from './CardFace';

export default function HistoryClient() {
  const [items, setItems] = useState(null);
  useEffect(() => { setItems(getHistory()); }, []);

  const remove = (id) => {
    if (!window.confirm('Hapus pembacaan ini?')) return;
    deleteReading(id);
    setItems(getHistory());
  };
  const removeAll = () => {
    if (!window.confirm('Hapus SEMUA riwayat pembacaan di perangkat ini?')) return;
    clearHistory();
    setItems([]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">Tersimpan di perangkat ini</p>
        <h1 className="font-title text-4xl sm:text-5xl">Riwayat Pembacaan</h1>
      </header>

      {items === null ? (
        <p className="py-16 text-center text-brown">Memuat riwayat…</p>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-brown">Belum ada pembacaan. Riwayat muncul di sini setelah kamu menyelesaikan satu pembacaan.</p>
          <Link href="/reading" className="btn btn-primary mt-6 no-underline">Mulai Pembacaan</Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((r) => (
              <li key={r.id} className="panel p-4">
                <div className="flex gap-3">
                  <div className="flex shrink-0 -space-x-6" aria-hidden="true">
                    {r.cards.slice(0, 3).map((c) => (
                      <div key={c.id} className="w-12 sm:w-14"><CardFace card={CATALOG_BY_ID[c.id] || c} reversed={c.orientation === 'reversed'} /></div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-title text-xl leading-tight">{r.title}{r.category?.id !== 'general' ? ` · ${r.category.title}` : ''}</p>
                    <p className="font-head text-[0.62rem] uppercase tracking-[0.14em] text-gold-dark">{formatDateTime(r.createdAt)} · {r.cards.length} kartu</p>
                    {r.question && <p className="mt-1 line-clamp-2 text-sm italic text-brown">{r.question}</p>}
                    <p className="mt-1 truncate text-xs text-brown-soft">{r.cards.map((c) => c.name).join(', ')}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/reading/result?id=${encodeURIComponent(r.id)}`} className="btn btn-primary flex-1 no-underline">Buka</Link>
                  <button type="button" className="btn btn-secondary flex-1" onClick={() => remove(r.id)} aria-label={`Hapus pembacaan ${r.title}`}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center"><button type="button" className="text-sm text-wine underline" onClick={removeAll}>Hapus semua riwayat</button></div>
        </>
      )}
    </div>
  );
}
