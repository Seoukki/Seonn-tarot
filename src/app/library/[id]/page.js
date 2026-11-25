import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCardList } from '@/lib/data-source';
import { CATALOG } from '@/data/catalog';
import CardFace from '@/components/CardFace';
import CardDetailTabs from '@/components/CardDetailTabs';
import { Rule } from '@/components/Ornaments';

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => CATALOG.map((c) => ({ id: c.id }));

export async function generateMetadata({ params }) {
  const { id } = await params;
  const card = CATALOG.find((c) => c.id === id);
  return card ? { title: card.name, description: `Makna ${card.name} dalam tarot: upright, reversed, dan interpretasi per kategori.` } : {};
}

export default async function CardPage({ params }) {
  const { id } = await params;
  const { cards } = await getCardList();
  const i = cards.findIndex((c) => c.id === id);
  if (i < 0) notFound();
  const card = cards[i];
  const prev = cards[(i + cards.length - 1) % cards.length];
  const next = cards[(i + 1) % cards.length];
  const sub = card.arcana === 'major' ? `Major Arcana · ${card.number}` : `Minor Arcana · ${card.suit[0].toUpperCase() + card.suit.slice(1)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Remah roti" className="mb-4 text-sm"><Link href="/library" className="text-brown underline">← Perpustakaan</Link></nav>
      <header className="grid items-start gap-6 sm:grid-cols-[minmax(0,240px)_1fr]">
        <div className="mx-auto w-[min(62vw,240px)] sm:w-full"><CardFace card={card} eager /></div>
        <div>
          <p className="font-head text-xs uppercase tracking-[0.25em] text-gold-dark">{sub}</p>
          <h1 className="font-title text-4xl leading-tight sm:text-5xl">{card.name}</h1>
          <p className="prose-tarot mt-3 text-brown">{card.description}</p>
        </div>
      </header>
      <div className="mt-8"><Rule>Makna</Rule></div>
      <CardDetailTabs card={{ keywords: card.keywords, meaning: card.meaning, guidance: card.guidance, interpretations: card.interpretations, name: card.name }} />
      <nav aria-label="Kartu lain" className="mt-10 flex justify-between gap-3 text-sm">
        <Link href={`/library/${prev.id}`} className="btn btn-secondary min-w-0 flex-1 no-underline"><span className="truncate">← {prev.name}</span></Link>
        <Link href={`/library/${next.id}`} className="btn btn-secondary min-w-0 flex-1 no-underline"><span className="truncate">{next.name} →</span></Link>
      </nav>
    </div>
  );
}
