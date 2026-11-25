import { Suspense } from 'react';
import ResultClient from '@/components/ResultClient';

export const metadata = { title: 'Hasil Pembacaan' };

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-brown">Memuat hasil…</div>}>
      <ResultClient />
    </Suspense>
  );
}
