import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-brown/40 bg-paper-deep/60 px-4 py-10 text-center text-sm text-brown">
      <p className="font-title text-2xl text-ink">Tarot Reveal</p>
      <p className="mx-auto mt-2 max-w-md leading-relaxed">Tarot sebagai cermin refleksi diri. Bukan ramalan pasti, bukan nasihat medis, hukum, atau keuangan.</p>
      <nav aria-label="Footer" className="font-head mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.14em]">
        <Link href="/reading" className="text-brown no-underline hover:text-wine">Reading</Link>
        <Link href="/daily" className="text-brown no-underline hover:text-wine">Daily</Link>
        <Link href="/library" className="text-brown no-underline hover:text-wine">Library</Link>
        <Link href="/history" className="text-brown no-underline hover:text-wine">Riwayat</Link>
      </nav>
      <p className="mt-5 text-xs text-brown-soft">Ilustrasi kartu adalah karya orisinal bergaya vintage. Riwayat bacaanmu hanya tersimpan di perangkat ini.</p>
    </footer>
  );
}
