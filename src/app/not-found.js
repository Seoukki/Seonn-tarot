import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="font-title text-6xl text-wine">404</p>
      <h1 className="font-title mt-2 text-3xl">Kartu ini tidak ditemukan</h1>
      <p className="mt-3 text-brown">Halaman yang kamu cari tidak ada atau sudah berpindah.</p>
      <Link href="/" className="btn btn-primary mt-6 no-underline">Kembali ke Beranda</Link>
    </div>
  );
}
