/* Service worker de Atmósfera: hace la app instalable y le permite funcionar sin conexión. */

const VERSION = 'atmosfera-v1';
const CACHE_APP = `${VERSION}-app`;
const CACHE_API = `${VERSION}-api`;
const PRECARGA = ['/', '/manifest.webmanifest', '/icono/192', '/icono/512'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_APP).then((c) => c.addAll(PRECARGA)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function redPrimero(request, nombreCache) {
  const cache = await caches.open(nombreCache);
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok) cache.put(request, respuesta.clone());
    return respuesta;
  } catch (error) {
    const guardada = await cache.match(request, { ignoreSearch: false });
    if (guardada) return guardada;
    throw error;
  }
}

async function cachePrimero(request) {
  const cache = await caches.open(CACHE_APP);
  const guardada = await cache.match(request);
  const red = fetch(request)
    .then((r) => {
      if (r.ok) cache.put(request, r.clone());
      return r;
    })
    .catch(() => undefined);
  return guardada ?? (await red) ?? Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Datos del clima: siempre se intenta la red; si no hay conexión, la última respuesta guardada.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(redPrimero(request, CACHE_API));
    return;
  }

  // Navegación: red primero y, sin conexión, la página principal guardada.
  if (request.mode === 'navigate') {
    event.respondWith(redPrimero(request, CACHE_APP).catch(() => caches.match('/')));
    return;
  }

  // Archivos estáticos de Next.js, fuentes e íconos.
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/icono/')) {
    event.respondWith(cachePrimero(request));
  }
});
