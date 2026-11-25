'use client';
import { motion } from 'framer-motion';
import { CardBack } from './CardFace';

// Animasi mengocok: tumpukan kartu terbelah dan saling menyelip (riffle). Ringan: 7 kartu saja.
export default function ShuffleAnimation() {
  const cards = Array.from({ length: 7 });
  return (
    <div role="status" aria-live="polite" className="relative mx-auto h-64 w-full max-w-xs">
      {cards.map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        return (
          <motion.div key={i} className="absolute left-1/2 top-4 w-28 -ml-14"
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: [0, dir * 70, 0, dir * -30, 0], y: [0, -18 - i * 2, 0, -8, i * -1], rotate: [0, dir * 9, 0, dir * -5, 0] }}
            transition={{ duration: 1.8, delay: i * 0.06, repeat: 1, ease: 'easeInOut' }}
            style={{ zIndex: i }}>
            <CardBack />
          </motion.div>
        );
      })}
      <p className="font-head absolute inset-x-0 bottom-0 text-center text-xs uppercase tracking-[0.25em] text-brown">Mengocok kartu…</p>
    </div>
  );
}
