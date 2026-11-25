'use client';
import { motion } from 'framer-motion';
import CardFace from './CardFace';
import SpreadLayout from './SpreadLayout';
import { Rule } from './Ornaments';
import { formatDateTime } from '@/lib/format';

const ORI = { upright: 'Upright', reversed: 'Reversed' };

export default function ReadingResult({ reading, children }) {
  const lensTitle = reading.category.id === 'general' ? null : reading.category.title;
  const items = reading.cards.map((c, i) => (
    <motion.div key={c.id} initial={{ opacity: 0, y: 24, rotateY: 90 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ delay: 0.15 * i, duration: 0.6, ease: 'easeOut' }}>
      <a href={`#kartu-${i}`} className="block no-underline" aria-label={`${c.position.label}: ${c.name}, ${ORI[c.orientation]}`}>
        <CardFace card={c} reversed={c.orientation === 'reversed'} eager />
      </a>
      <p className="font-head mt-2 text-center text-[0.62rem] uppercase tracking-[0.14em] text-brown">{c.position.label}</p>
    </motion.div>
  ));

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">Hasil Pembacaan</p>
        <h1 className="font-title mt-1 text-4xl sm:text-5xl">{reading.title}</h1>
        <p className="font-head mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-brown">
          {lensTitle ? `Kategori: ${lensTitle}` : 'Kategori: Umum'}
          {reading.createdAt ? ` · ${formatDateTime(reading.createdAt)}` : ''}
        </p>
        {reading.question && (
          <blockquote className="panel mx-auto mt-5 max-w-xl whitespace-pre-line p-4 text-left italic text-brown">
            <span className="font-head mb-1 block text-[0.62rem] not-italic uppercase tracking-[0.2em] text-gold-dark">Pertanyaan / cerita</span>
            {reading.question}
          </blockquote>
        )}
      </header>

      {reading.notices?.map((n, i) => (
        <p key={i} role="note" className="mt-5 rounded border-l-4 border-wine bg-wine/10 p-4 text-sm leading-relaxed">{n}</p>
      ))}

      <section aria-label="Susunan kartu" className="my-8"><SpreadLayout rows={reading.rows} items={items} /></section>

      {reading.yesNo && (
        <section className="panel my-6 p-5 text-center">
          <p className="font-head text-[0.65rem] uppercase tracking-[0.25em] text-gold-dark">Jawaban Refleksi</p>
          <p className={`font-title mt-1 text-4xl ${reading.yesNo.answer === 'yes' ? 'text-olive' : reading.yesNo.answer === 'no' ? 'text-wine' : 'text-vblue'}`}>{reading.yesNo.label}</p>
          <p className="prose-tarot mt-3 text-left">{reading.yesNo.explanation}</p>
        </section>
      )}

      <div className="space-y-6">
        {reading.cards.map((c, i) => (
          <section key={c.id} id={`kartu-${i}`} className="panel scroll-mt-4 p-4 sm:p-5">
            <div className="flex gap-4">
              <div className="w-24 shrink-0 sm:w-32"><CardFace card={c} reversed={c.orientation === 'reversed'} /></div>
              <div className="min-w-0 flex-1">
                <p className="font-head text-[0.65rem] uppercase tracking-[0.2em] text-gold-dark">{c.position.label} · {ORI[c.orientation]}</p>
                <h2 className="font-title text-2xl leading-tight sm:text-3xl">{c.name}</h2>
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Kata kunci">
                  {c.keywords.map((k) => <li key={k} className="rounded-full border border-brown/50 px-2.5 py-0.5 text-xs text-brown">{k}</li>)}
                </ul>
              </div>
            </div>
            <div className="prose-tarot mt-4 text-[0.97rem]">
              <p className="italic text-brown">{c.positionNote}</p>
              <p><strong className="font-head text-xs uppercase tracking-wider">Makna. </strong>{c.meaning}</p>
              {c.contextual && <p><strong className="font-head text-xs uppercase tracking-wider">Untuk {lensTitle?.toLowerCase()}. </strong>{c.contextual}</p>}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <Rule>Overall Interpretation</Rule>
        <div className="prose-tarot mt-4">{reading.overall.map((p, i) => <p key={i}>{p}</p>)}</div>
      </section>

      <section className="mt-8">
        <Rule>Guidance</Rule>
        <ul className="mt-4 space-y-3">
          {reading.guidance.map((g, i) => (
            <li key={i} className="panel flex gap-3 p-4"><span className="font-title text-2xl leading-none text-gold" aria-hidden="true">{['I', 'II', 'III', 'IV'][i]}</span><span className="leading-relaxed">{g}</span></li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-xs leading-relaxed text-brown-soft">Pembacaan ini disusun dari data kartu dan template, bukan AI, dan bukan prediksi pasti. Gunakan sebagai bahan refleksi dan tetap ambil keputusan dengan pertimbanganmu sendiri.</p>
      {children}
    </article>
  );
}
