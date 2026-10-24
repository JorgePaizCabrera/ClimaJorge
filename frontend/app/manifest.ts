import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atmósfera · Clima en vivo',
    short_name: 'Atmósfera',
    description: 'Clima actual y pronóstico con fondos animados según el tiempo.',
    lang: 'es',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b1220',
    theme_color: '#0b63ce',
    categories: ['weather', 'utilities'],
    icons: [
      { src: '/icono/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icono/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icono/512?maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
