import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // Evita que Next.js tome como raíz la carpeta padre (que tiene su propio package-lock.json).
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  // El navegador llama a /api/... en el mismo origen y Next.js lo reenvía al backend de Node.
  // Así el service worker puede guardar las respuestas en caché para el modo sin conexión.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
    ];
  },
};

export default nextConfig;
