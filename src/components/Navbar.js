'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star } from './Ornaments';

const LINKS = [
  { href: '/reading', label: 'Reading' },
  { href: '/daily', label: 'Daily' },
  { href: '/library', label: 'Library' },
  { href: '/history', label: 'Riwayat' },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  const active = (href) => path === href || path.startsWith(href + '/');

  return (
    <header className="relative z-20 border-b border-brown/40 bg-paper/85 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-title text-xl text-ink no-underline">
          <Star className="text-gold" /> Tarot Reveal
        </Link>
        <nav aria-label="Navigasi utama" className="hidden gap-1 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}
              className={`font-head rounded px-3 py-2 text-xs uppercase tracking-[0.14em] no-underline ${active(l.href) ? 'bg-brown text-paper' : 'text-brown hover:bg-gold/20'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="font-head min-h-11 rounded border border-brown px-3 text-xs uppercase tracking-widest text-brown sm:hidden" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((o) => !o)}>
          {open ? 'Tutup' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" aria-label="Navigasi utama" className="border-t border-brown/30 px-4 pb-3 sm:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-head block border-b border-brown/15 py-3 text-sm uppercase tracking-[0.14em] text-brown no-underline last:border-0">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
