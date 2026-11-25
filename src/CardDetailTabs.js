'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/data/categories';

export default function CardDetailTabs({ card }) {
  const [o, setO] = useState('upright');
  return (
    <div className="mt-4">
      <div className="flex gap-2" role="group" aria-label="Orientasi">
        <button type="button" className="chip" aria-pressed={o === 'upright'} onClick={() => setO('upright')}>Upright</button>
        <button type="button" className="chip" aria-pressed={o === 'reversed'} onClick={() => setO('reversed')}>Reversed</button>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Kata kunci">
        {card.keywords[o].map((k) => <li key={k} className="rounded-full border border-brown/50 px-3 py-1 text-sm text-brown">{k}</li>)}
      </ul>
      <p className="prose-tarot mt-4">{card.meaning[o]}</p>
      <div className="panel mt-5 p-4"><p className="font-head text-[0.65rem] uppercase tracking-[0.2em] text-gold-dark">Guidance</p><p className="mt-1 leading-relaxed">{card.guidance[o]}</p></div>
      <h2 className="font-title mt-8 text-2xl">Menurut kategori</h2>
      <dl className="mt-3 space-y-4">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="border-l-2 border-gold pl-4">
            <dt className="font-head text-xs uppercase tracking-[0.16em] text-wine">{c.title}</dt>
            <dd className="mt-1 leading-relaxed">{card.interpretations[o][c.id]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
