'use client';
import { motion } from 'framer-motion';

// Transisi halaman: fade + geser tipis (ringan di ponsel).
export default function Template({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
