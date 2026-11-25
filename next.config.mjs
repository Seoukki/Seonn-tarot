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
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Ilustrasi kartu jarang berubah: cache panjang di browser & CDN.
      { source: '/cards/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};
export default nextConfig;
