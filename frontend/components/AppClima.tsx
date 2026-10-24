'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CloudSun, LocateFixed, Palette, RefreshCw, WifiOff } from 'lucide-react';
import { obtenerClima } from '@/lib/api';
import { NOMBRES_CONDICION, obtenerTema } from '@/lib/tema';
import type { Condicion, RespuestaClima, Ubicacion } from '@/lib/tipos';
import { FondoClima } from './fondos/FondoClima';
import { BotonInstalar } from './BotonInstalar';
import { BuscadorCiudad } from './BuscadorCiudad';
import { CicloSolar, Detalles, PronosticoDias, PronosticoHoras, TarjetaActual } from './Tarjetas';

const CIUDAD_INICIAL: Ubicacion = { nombre: 'Ciudad de Guatemala', region: 'Guatemala', pais: 'Guatemala', lat: 14.6349, lon: -90.5069 };
const CLAVE_LUGAR = 'clima:lugar';
const CLAVE_DATOS = 'clima:datos';
const REFRESCO_MS = 10 * 60 * 1000;

type Simulacion = { condicion: Condicion; esDeDia: boolean } | null;

const OPCIONES_SIMULACION: { etiqueta: string; valor: Simulacion }[] = [
  { etiqueta: 'Clima real', valor: null },
  ...(Object.keys(NOMBRES_CONDICION) as Condicion[]).flatMap((c) => [
    { etiqueta: `${NOMBRES_CONDICION[c]} · día`, valor: { condicion: c, esDeDia: true } },
    { etiqueta: `${NOMBRES_CONDICION[c]} · noche`, valor: { condicion: c, esDeDia: false } },
  ]),
];

export function AppClima() {
  const [lugar, setLugar] = useState<Ubicacion | null>(null);
  const [datos, setDatos] = useState<RespuestaClima | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [simulacion, setSimulacion] = useState<Simulacion>(null);

  // Recupera la última ciudad y los últimos datos guardados (sirve también sin conexión).
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_LUGAR);
      const previos = localStorage.getItem(CLAVE_DATOS);
      if (previos) setDatos(JSON.parse(previos));
      setLugar(guardado ? JSON.parse(guardado) : CIUDAD_INICIAL);
    } catch {
      setLugar(CIUDAD_INICIAL);
    }

    // Permite abrir directo una vista previa, p. ej. /?fondo=lluvia o /?fondo=tormenta&noche
    const url = new URLSearchParams(window.location.search);
    const fondo = url.get('fondo') as Condicion | null;
    if (fondo && fondo in NOMBRES_CONDICION) setSimulacion({ condicion: fondo, esDeDia: !url.has('noche') });

    const actualizarRed = () => setSinConexion(!navigator.onLine);
    actualizarRed();
    window.addEventListener('online', actualizarRed);
    window.addEventListener('offline', actualizarRed);
    return () => {
      window.removeEventListener('online', actualizarRed);
      window.removeEventListener('offline', actualizarRed);
    };
  }, []);

  const cargar = useCallback(async (u: Ubicacion, signal?: AbortSignal) => {
    setCargando(true);
    setError(null);
    try {
      const r = await obtenerClima(u, signal);
      setDatos(r);
      localStorage.setItem(CLAVE_DATOS, JSON.stringify(r));
    } catch (e) {
      if (signal?.aborted) return;
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!lugar) return;
    localStorage.setItem(CLAVE_LUGAR, JSON.stringify(lugar));
    const control = new AbortController();
    cargar(lugar, control.signal);
    const intervalo = setInterval(() => cargar(lugar), REFRESCO_MS);
    return () => {
      control.abort();
      clearInterval(intervalo);
    };
  }, [lugar, cargar]);

  const usarUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no permite obtener la ubicación');
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizando(false);
        // Sin nombre: el backend lo resuelve a partir de las coordenadas.
        setLugar({ nombre: '', lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) });
      },
      () => {
        setLocalizando(false);
        setError('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const condicion = simulacion?.condicion ?? datos?.actual.condicion ?? 'despejado';
  const esDeDia = simulacion?.esDeDia ?? datos?.actual.esDeDia ?? true;

  // Ajusta el color de la barra del navegador / app instalada al clima.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', obtenerTema(condicion, esDeDia).color);
  }, [condicion, esDeDia]);

  const indiceSimulacion = OPCIONES_SIMULACION.findIndex(
    (o) => o.valor?.condicion === simulacion?.condicion && o.valor?.esDeDia === simulacion?.esDeDia,
  );

  return (
    <main className="relative min-h-dvh text-white">
      <FondoClima condicion={condicion} esDeDia={esDeDia} />

      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
        <BotonInstalar />

        {/* Encabezado */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:mr-auto">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 to-indigo-600 shadow-lg shadow-indigo-900/40">
              <CloudSun className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-lg leading-tight font-semibold tracking-tight">Atmósfera</p>
              <p className="text-xs text-white/60">Pronóstico del tiempo en vivo</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="flex-1 sm:w-80">
              <BuscadorCiudad onElegir={setLugar} />
            </div>
            <button type="button" className="boton-icono" onClick={usarUbicacion} disabled={localizando} title="Usar mi ubicación" aria-label="Usar mi ubicación">
              <LocateFixed className={`h-5 w-5 ${localizando ? 'animate-pulse' : ''}`} />
            </button>
            <button type="button" className="boton-icono" onClick={() => lugar && cargar(lugar)} disabled={cargando || !lugar} title="Actualizar" aria-label="Actualizar">
              <RefreshCw className={`h-5 w-5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
            <label className="boton-icono relative cursor-pointer" title="Vista previa de fondos">
              <Palette className="h-5 w-5" />
              <span className="sr-only">Vista previa de fondos</span>
              <select
                className="absolute inset-0 cursor-pointer opacity-0"
                value={Math.max(0, indiceSimulacion)}
                onChange={(e) => setSimulacion(OPCIONES_SIMULACION[Number(e.target.value)].valor)}
              >
                {OPCIONES_SIMULACION.map((o, i) => (
                  <option key={o.etiqueta} value={i} className="bg-slate-900">
                    {o.etiqueta}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {/* Avisos */}
        {sinConexion && (
          <Aviso icono={<WifiOff className="h-4 w-4" />}>Sin conexión: mostrando los últimos datos guardados.</Aviso>
        )}
        {error && <Aviso icono={<AlertTriangle className="h-4 w-4" />}>{error}</Aviso>}
        {simulacion && (
          <Aviso icono={<Palette className="h-4 w-4" />}>
            Vista previa del fondo «{OPCIONES_SIMULACION[indiceSimulacion]?.etiqueta}».{' '}
            <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setSimulacion(null)}>
              Volver al clima real
            </button>
          </Aviso>
        )}

        {/* Contenido */}
        {datos ? (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <TarjetaActual datos={datos} />
              <div className="flex min-w-0 flex-col gap-5">
                <Detalles datos={datos} />
                <CicloSolar datos={datos} />
              </div>
            </div>
            <PronosticoHoras datos={datos} />
            <PronosticoDias datos={datos} />
            <footer className="pb-4 text-center text-xs text-white/55">
              Actualizado {new Date(datos.actualizado).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })} · Datos de{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                Open-Meteo
              </a>
            </footer>
          </>
        ) : (
          <Esqueleto />
        )}
      </div>
    </main>
  );
}

function Aviso({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <div role="status" className="vidrio aparecer flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
      <span className="text-amber-200">{icono}</span>
      <p>{children}</p>
    </div>
  );
}

function Esqueleto() {
  const bloque = 'vidrio animate-pulse';
  return (
    <div className="grid gap-5" aria-label="Cargando clima">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className={`${bloque} h-80`} />
        <div className={`${bloque} h-80`} />
      </div>
      <div className={`${bloque} h-44`} />
      <div className={`${bloque} h-96`} />
    </div>
  );
}
