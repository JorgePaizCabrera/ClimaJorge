import type { RespuestaClima, Ubicacion } from './tipos';

async function pedir<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null);
    throw new Error(cuerpo?.error ?? 'No se pudo conectar con el servidor');
  }
  return res.json() as Promise<T>;
}

export function obtenerClima(lugar: Pick<Ubicacion, 'lat' | 'lon'> & Partial<Ubicacion>, signal?: AbortSignal) {
  const params = new URLSearchParams({ lat: String(lugar.lat), lon: String(lugar.lon) });
  if (lugar.nombre) params.set('nombre', lugar.nombre);
  if (lugar.region) params.set('region', lugar.region);
  if (lugar.pais) params.set('pais', lugar.pais);
  return pedir<RespuestaClima>(`/api/clima?${params}`, signal);
}

export function buscarCiudades(texto: string, signal?: AbortSignal) {
  return pedir<Ubicacion[]>(`/api/buscar?q=${encodeURIComponent(texto)}`, signal);
}
