/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // URL publik tetap /reading/draw dst., tetapi file halaman dibuat rata di folder pages.
  async rewrites() {
    return [
      { source: '/reading/personalized', destination: '/reading-personalized' },
      { source: '/reading/draw', destination: '/reading-draw' },
      { source: '/reading/result', destination: '/reading-result' },
      { source: '/library/:id', destination: '/card?id=:id' },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Ilustrasi kartu jarang berubah: cache panjang di browser & CDN.
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }, { key: 'Service-Worker-Allowed', value: '/' }] },
      { source: '/cards/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};
export default nextConfig;
