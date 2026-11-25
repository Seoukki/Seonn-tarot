'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ReadingResult from './ReadingResult';
import { getReading, deleteReading } from '@/lib/storage';

export default function ResultClient() {
  const id = useSearchParams().get('id');
  const router = useRouter();
  const [state, setState] = useState({ loading: true, reading: null });

  useEffect(() => { setState({ loading: false, reading: id ? getReading(id) : null }); }, [id]);

  if (state.loading) return <div className="px-4 py-20 text-center text-brown">Memuat hasil…</div>;
  if (!state.reading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-title text-3xl">Pembacaan tidak ditemukan</h1>
        <p className="mt-3 text-brown">Riwayat disimpan di perangkat ini. Mungkin pembacaan sudah dihapus atau dibuka dari browser lain.</p>
        <Link href="/reading" className="btn btn-primary mt-6 no-underline">Mulai Pembacaan Baru</Link>
      </div>
    );
  }
  const remove = () => {
    if (window.confirm('Hapus pembacaan ini dari riwayat?')) { deleteReading(state.reading.id); router.push('/history'); }
  };
  return (
    <ReadingResult reading={state.reading}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/reading" className="btn btn-primary no-underline">Baca Lagi</Link>
        <Link href="/history" className="btn btn-secondary no-underline">Lihat Riwayat</Link>
        <button type="button" className="btn btn-secondary" onClick={remove}>Hapus</button>
      </div>
    </ReadingResult>
  );
}
