import { NextResponse } from 'next/server';
import { getDataset } from '@/lib/data-source';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { cards, source } = await getDataset();
  return NextResponse.json({ ok: true, source, cards: Object.keys(cards).length }, { headers: { 'Cache-Control': 'no-store' } });
}
