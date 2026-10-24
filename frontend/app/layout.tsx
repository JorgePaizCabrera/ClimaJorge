import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { RegistrarSW } from '@/components/RegistrarSW';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Atmósfera · Clima en vivo',
  description: 'Aplicación web progresiva para consultar el clima actual y el pronóstico de cualquier ciudad.',
  applicationName: 'Atmósfera',
  appleWebApp: { capable: true, title: 'Atmósfera', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/icono/192', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icono/180', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0b63ce',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <RegistrarSW />
      </body>
    </html>
  );
}
