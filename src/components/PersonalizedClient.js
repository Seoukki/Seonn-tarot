'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CATEGORY_BY_ID } from '@/data/categories';
import { detectCategory } from '@/lib/detect';
import { sanitizeText, MAX_STORY, MIN_STORY } from '@/lib/sanitize';
import { session } from '@/lib/storage';

export default function PersonalizedClient() {
  const router = useRouter();
  const [story, setStory] = useState('');
  const [manual, setManual] = useState(null); // kategori pilihan pengguna (override)
  const [count, setCount] = useState(3);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const d = session.get('draftForm');
    if (d) { setStory(d.story || ''); setManual(d.manual || null); setCount(d.count === 5 ? 5 : 3); }
  }, []);
  useEffect(() => { session.set('draftForm', { story, manual, count }); }, [story, manual, count]);

  const clean = useMemo(() => sanitizeText(story, MAX_STORY), [story]);
  const det = useMemo(() => (clean.length >= MIN_STORY ? detectCategory(clean) : null), [clean]);
  const tooShort = clean.length < MIN_STORY;
  const chosen = manual || (det && det.confidence === 'clear' ? det.primary : null);
  const needChoice = !tooShort && !manual && det && det.confidence !== 'clear';
  const suggestions = det?.ranking?.slice(0, 2).map((r) => r.id) || [];

  const go = () => {
    setTouched(true);
    if (tooShort || !chosen) return;
    session.set('draft', { story: clean, category: chosen, detected: det?.primary || null, manual: Boolean(manual), count });
    router.push(`/reading/draw?type=personalized-${count}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="text-center">
        <p className="font-head text-xs uppercase tracking-[0.3em] text-gold-dark">Personalized</p>
        <h1 className="font-title text-4xl sm:text-5xl">Ceritakan Situasimu</h1>
        <p className="mt-2 text-brown">Tulis dengan bahasamu sendiri. Ceritamu tidak disimpan di database; hanya ada di perangkatmu.</p>
      </header>

      <div className="panel mt-8 space-y-5 p-5">
        <div>
          <label htmlFor="story" className="font-head mb-1 block text-xs uppercase tracking-[0.14em] text-brown">Ceritamu</label>
          <textarea id="story" className="input" rows={7} maxLength={MAX_STORY} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Contoh: Aku bingung dengan hubunganku yang mulai terasa jauh, dan aku tidak tahu harus mulai bicara dari mana…" aria-describedby="story-help" />
          <p id="story-help" className="mt-1 flex justify-between text-xs text-brown-soft"><span>Minimal {MIN_STORY} karakter.</span><span>{story.length}/{MAX_STORY}</span></p>
          {touched && tooShort && <p role="alert" className="mt-1 text-sm text-wine">Ceritamu masih terlalu singkat. Tambahkan sedikit detail.</p>}
        </div>

        {det?.sensitive && (
          <p role="note" className="rounded border-l-4 border-wine bg-wine/10 p-3 text-sm leading-relaxed">Ceritamu terdengar berat. Kartu hanya bahan refleksi, bukan pengganti dukungan nyata. Jika kamu merasa tidak aman, hubungi orang tepercaya, tenaga profesional, atau layanan darurat di wilayahmu.</p>
        )}

        {!tooShort && det && (
          <div className="rounded border border-brown/40 bg-paper-deep/50 p-3 text-sm leading-relaxed" aria-live="polite">
            {manual ? (
              <p>Kategori dipilih manual: <strong>{CATEGORY_BY_ID[manual].title}</strong>.</p>
            ) : det.confidence === 'clear' ? (
              <p>Kategori terdeteksi: <strong>{CATEGORY_BY_ID[det.primary].title}</strong>{det.ranking[0]?.matches?.length ? <> (kata kunci: {det.ranking[0].matches.slice(0, 4).join(', ')})</> : null}.</p>
            ) : det.confidence === 'ambiguous' ? (
              <p>Ceritamu menyentuh lebih dari satu tema ({suggestions.map((s) => CATEGORY_BY_ID[s].title).join(' dan ')}). Pilih yang paling ingin kamu fokuskan di bawah.</p>
            ) : (
              <p>Ceritamu terlalu umum untuk dikenali. Pilih kategori yang paling dekat di bawah.</p>
            )}
            <p className="mt-1 text-xs text-brown-soft">Deteksi hanya mencocokkan kata kunci, bukan memahami konteks. Kamu selalu bisa mengubahnya.</p>
          </div>
        )}

        <fieldset>
          <legend className="font-head mb-2 text-xs uppercase tracking-[0.14em] text-brown">Kategori{needChoice ? ' (pilih satu)' : ''}</legend>
          <div className={`flex flex-wrap gap-2 ${needChoice ? 'rounded ring-2 ring-gold ring-offset-4 ring-offset-paper' : ''}`}>
            {CATEGORIES.map((c) => {
              const on = manual ? manual === c.id : chosen === c.id;
              return <button key={c.id} type="button" className="chip" aria-pressed={on} onClick={() => setManual(manual === c.id ? null : c.id)} title={c.description}>{c.title}</button>;
            })}
          </div>
          {manual && <button type="button" className="mt-2 text-xs text-brown underline" onClick={() => setManual(null)}>Kembali ke deteksi otomatis</button>}
        </fieldset>

        <fieldset>
          <legend className="font-head mb-2 text-xs uppercase tracking-[0.14em] text-brown">Jumlah kartu</legend>
          <div className="flex gap-2" role="group">
            {[3, 5].map((n) => <button key={n} type="button" className="chip" aria-pressed={count === n} onClick={() => setCount(n)}>{n} kartu</button>)}
          </div>
        </fieldset>

        {touched && !tooShort && !chosen && <p role="alert" className="text-sm text-wine">Pilih satu kategori terlebih dahulu.</p>}
        <button type="button" className="btn btn-primary w-full" onClick={go}>Lanjut Memilih Kartu</button>
      </div>
    </div>
  );
}
