'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { buscarCiudades } from '@/lib/api';
import type { Ubicacion } from '@/lib/tipos';

export function BuscadorCiudad({ onElegir }: { onElegir: (u: Ubicacion) => void }) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState<Ubicacion[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);

  // Búsqueda con retardo para no llamar a la API en cada tecla.
  useEffect(() => {
    const q = texto.trim();
    if (q.length < 2) {
      setResultados([]);
      return;
    }
    const control = new AbortController();
    const temporizador = setTimeout(async () => {
      setBuscando(true);
      try {
        const lista = await buscarCiudades(q, control.signal);
        setResultados(lista);
        setActivo(0);
        setAbierto(true);
      } catch {
        if (!control.signal.aborted) setResultados([]);
      } finally {
        if (!control.signal.aborted) setBuscando(false);
      }
    }, 350);
    return () => {
      clearTimeout(temporizador);
      control.abort();
    };
  }, [texto]);

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const elegir = (u: Ubicacion) => {
    onElegir(u);
    setTexto('');
    setResultados([]);
    setAbierto(false);
  };

  const teclado = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!abierto || resultados.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActivo((a) => (a + 1) % resultados.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActivo((a) => (a - 1 + resultados.length) % resultados.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      elegir(resultados[activo]);
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  };

  return (
    <div ref={contenedor} className="relative w-full">
      <label className="flex h-11 items-center gap-2.5 rounded-2xl border border-white/15 bg-slate-950/25 px-4 backdrop-blur-xl transition focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/15">
        {buscando ? (
          <Loader2 className="h-4.5 w-4.5 shrink-0 animate-spin text-white/70" />
        ) : (
          <Search className="h-4.5 w-4.5 shrink-0 text-white/70" />
        )}
        <span className="sr-only">Buscar ciudad</span>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={() => resultados.length > 0 && setAbierto(true)}
          onKeyDown={teclado}
          placeholder="Buscar ciudad…"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/55 outline-none"
          role="combobox"
          aria-expanded={abierto}
          aria-controls="resultados-ciudad"
          autoComplete="off"
        />
        {texto && (
          <button type="button" onClick={() => setTexto('')} className="text-white/60 hover:text-white" aria-label="Limpiar">
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {abierto && texto.trim().length >= 2 && !buscando && (
        <ul
          id="resultados-ciudad"
          role="listbox"
          className="aparecer absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/85 py-1.5 shadow-2xl backdrop-blur-2xl"
        >
          {resultados.length === 0 && <li className="px-4 py-3 text-sm text-white/60">Sin resultados</li>}
          {resultados.map((u, i) => (
            <li key={`${u.lat},${u.lon}`} role="option" aria-selected={i === activo}>
              <button
                type="button"
                onMouseEnter={() => setActivo(i)}
                onClick={() => elegir(u)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${i === activo ? 'bg-white/12' : ''}`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white">{u.nombre}</span>
                  <span className="block truncate text-xs text-white/55">
                    {[u.region, u.pais].filter(Boolean).join(', ')}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
