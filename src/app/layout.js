import { Cormorant_Garamond, Cinzel, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-cormorant', display: 'swap' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-cinzel', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' });

export const metadata = {
  title: { default: 'Tarot Reveal — Discover What the Cards Reveal', template: '%s · Tarot Reveal' },
  description: 'Pembacaan tarot bergaya vintage Rider–Waite: 78 kartu, 10 jenis pembacaan, tanpa AI dan tanpa login. Tarot sebagai cermin refleksi diri.',
  applicationName: 'Tarot Reveal',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#f3e7c9' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${cinzel.variable} ${lora.variable}`}>
      <body>
        <Particles />
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
