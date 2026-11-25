import { getCardList } from '@/lib/data-source';
import LibraryClient from '@/components/LibraryClient';

export const revalidate = 3600;
export const metadata = { title: 'Library', description: 'Perpustakaan 78 kartu tarot: cari, saring Major/Minor dan suit, lalu baca makna lengkapnya.' };

export default async function LibraryPage() {
  const { cards } = await getCardList();
  const light = cards.map((c) => ({ id: c.id, name: c.name, number: c.number, arcana: c.arcana, suit: c.suit, keywords: c.keywords.upright.slice(0, 3) }));
  return <LibraryClient cards={light} />;
}
