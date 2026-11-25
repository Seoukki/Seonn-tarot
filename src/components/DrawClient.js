'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SPREADS } from '@/data/spreads';
import { CATEGORIES, CATEGORY_BY_ID } from '@/data/categories';
import { CATALOG_BY_ID } from '@/data/catalog';
import { shuffledDeck, randomOrientation } from '@/lib/rng';
import { session, saveReading, getPrefs, setPref } from '@/lib/storage';
import { requestReading } from '@/lib/client-api';
import { sanitizeText, MAX_QUESTION } from '@/lib/sanitize';
import { CardBack, FlipCard } from './CardFace';
import SpreadLayout from './SpreadLayout';
import ShuffleAnimation from './ShuffleAnimation';

const ROWS = 3;

export default function DrawClient() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type') || '';
  const spread = SPREADS[type];

  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState(null);
  const [step, setStep] = useState('setup'); // setup | shuffling | pick | reveal
  const [question, setQuestion] = useState('');
  const [lens, setLens] = useState('general');
  const [allowReversed, setAllowReversed] = useState(true);
  const [deck, setDeck] = useState([]);
  const [picks, setPicks] = useState([]); // [{ id, orientation, deckIndex }]
  const [flipped, setFlipped] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef(null);

  const isPersonalized = type.startsWith('personalized');
  const n = spread ? spread.positions.length : 0;

  useEffect(() => {
    if (isPersonalized) setDraft(session.get('draft'));
    const prefs = getPrefs();
    if (prefs.allowReversed === false) setAllowReversed(false);
    setReady(true);
    return () => clearTimeout(timer.current);
  }, [isPersonalized]);

  useEffect(() => { if (spread) setLens(spread.category); }, [spread]);

  const rows = useMemo(() => {
    const per = Math.ceil(deck.length / ROWS);
    return Array.from({ length: ROWS }, (_, r) => deck.slice(r * per, (r + 1) * per).map((id, i) => ({ id, index: r * per + i })));
  }, [deck]);

  if (!spread) {
    return <Notice title="Jenis pembacaan tidak dikenal" cta={{ href: '/reading', label: 'Pilih Pembacaan' }} />;
  }
  if (!ready) return <div className="px-4 py-20 text-center text-brown">Menyiapkan meja kartu…</div>;
  if (isPersonalized && !draft) {
    return <Notice title="Ceritamu belum ditulis" text="Tulis dulu situasimu agar kategori bisa ditentukan sebelum memilih kartu." cta={{ href: '/reading/personalized', label: 'Tulis Cerita' }} />;
  }

  const start = () => {
    setError('');
    if (!isPersonalized) setPref('allowReversed', allowReversed);
    setDeck(shuffledDeck()); // Fisher–Yates + crypto RNG
    setPicks([]);
    setFlipped([]);
    setStep('shuffling');
    timer.current = setTimeout(() => setStep('pick'), 2600);
  };

  const pick = (id, index) => {
    if (picks.length >= n || picks.some((p) => p.index === index)) return;
    const next = [...picks, { id, index, orientation: allowReversed ? randomOrientation() : 'upright' }];
    setPicks(next);
    if (next.length === n) {
      setFlipped(Array(n).fill(false));
      timer.current = setTimeout(() => setStep('reveal'), 700);
    }
  };

  const flip = (i) => setFlipped((f) => f.map((v, k) => (k === i ? true : v)));
  const flipAll = () => {
    picks.forEach((_, i) => { timer.current = setTimeout(() => flip(i), i * 350); });
  };
  const allFlipped = flipped.length === n && flipped.every(Boolean);

  const submit = async () => {
    setBusy(true); setError('');
    try {
      const payload = isPersonalized
        ? { type, category: draft.category, detected: draft.detected || null, question: draft.story }
        : { type, category: lens, question: sanitizeText(question, MAX_QUESTION) };
      payload.cards = picks.map((p) => ({ id: p.id, orientation: p.orientation }));
      const reading = await requestReading(payload);
      const saved = saveReading(reading);
      if (isPersonalized) session.del('draft');
      router.push(`/reading/result?id=${encodeURIComponent(saved.id)}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const lensChoices = ['general', ...CATEGORIES.map((c) => c.id)];
  const detectedTitle = isPersonalized ? (CATEGORY_BY_ID[draft.category]?.title || 'Umum') : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">{n} kartu</p>
        <h1 className="font-title text-4xl sm:text-5xl">{spread.title}</h1>
        <p className="mt-1 text-brown">{spread.short}</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.section key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="panel mt-8 space-y-5 p-5">
            {isPersonalized ? (
              <p className="text-sm leading-relaxed text-brown">Kategori untuk ceritamu: <strong className="text-ink">{detectedTitle}</strong>. Tarik napas sebentar, pegang pertanyaanmu dalam pikiran, lalu kocok kartunya.</p>
            ) : (
              <>
                <div>
                  <label htmlFor="q" className="font-head mb-1 block text-xs uppercase tracking-[0.14em] text-brown">Pertanyaan (opsional)</label>
                  <textarea id="q" className="input" rows={3} maxLength={MAX_QUESTION} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Tuliskan pertanyaan atau niatmu…" />
                  <p className="mt-1 text-xs text-brown-soft">Tidak dikirim ke database; hanya dipakai untuk menyusun hasil.</p>
                </div>
                {spread.lensChoice && (
                  <div>
                    <p className="font-head mb-2 text-xs uppercase tracking-[0.14em] text-brown">Fokus pembacaan</p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Fokus pembacaan">
                      {lensChoices.map((id) => (
                        <button key={id} type="button" className="chip" aria-pressed={lens === id} onClick={() => setLens(id)}>{id === 'general' ? 'Umum' : CATEGORY_BY_ID[id].title}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" className="h-5 w-5 accent-wine" checked={allowReversed} onChange={(e) => setAllowReversed(e.target.checked)} />
              Sertakan kartu terbalik (reversed)
            </label>
            <button type="button" className="btn btn-primary w-full" onClick={start}>Kocok Kartu</button>
          </motion.section>
        )}

        {step === 'shuffling' && (
          <motion.section key="shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10"><ShuffleAnimation /></motion.section>
        )}

        {step === 'pick' && (
          <motion.section key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
            <p className="text-center font-title text-2xl" aria-live="polite">Pilih {n - picks.length > 0 ? `${n - picks.length} kartu lagi` : 'selesai'}</p>
            <p className="mt-1 text-center text-sm text-brown">Geser ke samping, lalu ketuk kartu yang menarik perhatianmu.</p>
            <div className="mt-4 space-y-1" role="group" aria-label="Dek kartu">
              {rows.map((row, r) => (
                <div key={r} className="deck-row">
                  {row.map(({ id, index }) => {
                    const chosen = picks.some((p) => p.index === index);
                    return (
                      <button key={index} type="button" className="deck-card" aria-label={`Kartu tertutup ${index + 1}`} aria-disabled={chosen || picks.length >= n} onClick={() => pick(id, index)}>
                        <CardBack />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-2" aria-hidden="true">
              {Array.from({ length: n }).map((_, i) => (
                <span key={i} className={`h-3 w-3 rounded-full border border-brown ${i < picks.length ? 'bg-wine' : 'bg-transparent'}`} />
              ))}
            </div>
          </motion.section>
        )}

        {step === 'reveal' && (
          <motion.section key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <p className="text-center font-title text-2xl" aria-live="polite">{allFlipped ? 'Semua kartu terbuka' : 'Ketuk kartu untuk membukanya'}</p>
            <SpreadLayout className="mt-5" rows={spread.rows} items={picks.map((p, i) => (
              <div key={p.id}>
                <FlipCard card={CATALOG_BY_ID[p.id]} reversed={p.orientation === 'reversed'} flipped={flipped[i]} disabled={flipped[i]} onClick={() => flip(i)} label={`Buka kartu posisi ${spread.positions[i].label}`} />
                <p className="font-head mt-2 text-center text-[0.62rem] uppercase tracking-[0.14em] text-brown">{spread.positions[i].label}</p>
              </div>
            ))} />
            <div className="mt-8 flex flex-col items-center gap-3">
              {!allFlipped && <button type="button" className="btn btn-secondary" onClick={flipAll}>Buka Semua</button>}
              {allFlipped && <button type="button" className="btn btn-primary" disabled={busy} onClick={submit}>{busy ? 'Menyusun pembacaan…' : 'Lihat Pembacaan'}</button>}
              {error && <p role="alert" className="max-w-sm text-center text-sm text-wine">{error}</p>}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Notice({ title, text, cta }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-title text-3xl">{title}</h1>
      {text && <p className="mt-3 text-brown">{text}</p>}
      <Link href={cta.href} className="btn btn-primary mt-6 no-underline">{cta.label}</Link>
    </div>
  );
}
