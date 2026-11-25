import { NextResponse } from 'next/server';
import { getDataset } from '@/lib/data-source';
import { buildReading } from '@/lib/interpret';
import { validateReadingRequest } from '@/lib/sanitize';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 8 * 1024;

// Tidak ada data yang disimpan: cerita/pertanyaan hanya diproses di memori lalu dikembalikan sebagai hasil.
export async function POST(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX_BYTES) return NextResponse.json({ error: 'Permintaan terlalu besar.' }, { status: 413 });
  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) return NextResponse.json({ error: 'Permintaan terlalu besar.' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Format permintaan tidak valid.' }, { status: 400 });
  }
  const v = validateReadingRequest(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  try {
    const { cards } = await getDataset();
    const reading = buildReading(v.value, cards);
    return NextResponse.json({ reading }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[interpret]', e);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menyusun pembacaan.' }, { status: 500 });
  }
}
