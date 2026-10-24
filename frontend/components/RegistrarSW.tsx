'use client';

import { useEffect } from 'react';

/** Registra el service worker que permite instalar la app y usarla sin conexión. */
export function RegistrarSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // En desarrollo se omite para no interferir con la recarga en caliente de Next.js.
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((e) => {
      console.error('No se pudo registrar el service worker', e);
    });
  }, []);
  return null;
}
