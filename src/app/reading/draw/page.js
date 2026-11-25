import { Suspense } from 'react';
import DrawClient from '@/components/DrawClient';

export const metadata = { title: 'Tarik Kartu' };

export default function DrawPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-brown">Menyiapkan meja kartu…</div>}>
      <DrawClient />
    </Suspense>
  );
}
