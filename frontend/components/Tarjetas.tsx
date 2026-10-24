import {
  Droplets,
  Eye,
  Gauge,
  Navigation,
  Sunrise,
  Sunset,
  SunMedium,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react';
import type { RespuestaClima } from '@/lib/tipos';
import { obtenerTema } from '@/lib/tema';
import { fechaLarga, horaCorta, minutosDelDia, nivelUV, nombreDia, puntoCardinal, soloHora } from '@/lib/formato';
import { IconoClima } from './IconoClima';

type Datos = RespuestaClima;

/* ---------------- Tarjeta principal ---------------- */

export function TarjetaActual({ datos }: { datos: Datos }) {
  const { actual, ubicacion, dias } = datos;
  const hoy = dias[0];
  const tema = obtenerTema(actual.condicion, actual.esDeDia);

  return (
    <section className="vidrio aparecer relative overflow-hidden p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="etiqueta">{fechaLarga(actual.hora)} · {horaCorta(actual.hora)}</p>
          <h1 className="texto-sombra mt-2 truncate text-3xl font-semibold tracking-tight sm:text-4xl">{ubicacion.nombre}</h1>
          <p className="mt-1 truncate text-sm text-white/70">{[ubicacion.region, ubicacion.pais].filter(Boolean).join(', ')}</p>
        </div>
        <IconoClima
          condicion={actual.condicion}
          esDeDia={actual.esDeDia}
          codigo={actual.codigo}
          className="h-20 w-20 shrink-0 drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24"
        />
      </div>

      <div className="mt-6 flex items-end gap-4">
        <p className="texto-sombra text-[6.5rem] leading-none font-extralight tracking-tighter sm:text-[8.5rem]">
          {actual.temperatura}
          <span className="align-top text-5xl font-light text-white/80 sm:text-6xl">°</span>
        </p>
        <div className="mb-4 space-y-1 text-sm text-white/80">
          <p className="text-xl font-medium text-white">{actual.descripcion}</p>
          <p>
            Máx. <strong className="font-semibold text-white">{hoy.max}°</strong> · Mín.{' '}
            <strong className="font-semibold text-white">{hoy.min}°</strong>
          </p>
          <p>Sensación térmica {actual.sensacion}°</p>
        </div>
      </div>

      <p className="mt-6 border-t border-white/10 pt-4 text-sm text-white/75">{tema.frase}</p>
    </section>
  );
}

/* ---------------- Detalles ---------------- */

function Dato({ icono, titulo, valor, extra }: { icono: React.ReactNode; titulo: string; valor: React.ReactNode; extra?: string }) {
  return (
    <div className="vidrio-suave flex flex-col justify-between gap-3 p-4">
      <p className="etiqueta flex items-center gap-1.5">
        {icono}
        {titulo}
      </p>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{valor}</p>
        {extra && <p className="mt-0.5 text-xs text-white/60">{extra}</p>}
      </div>
    </div>
  );
}

export function Detalles({ datos }: { datos: Datos }) {
  const a = datos.actual;
  const uv = datos.dias[0]?.uv ?? 0;
  const icono = 'h-3.5 w-3.5';

  return (
    <section className="vidrio aparecer grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5" style={{ animationDelay: '80ms' }}>
      <Dato icono={<Thermometer className={icono} />} titulo="Sensación" valor={`${a.sensacion}°`} extra={a.sensacion < a.temperatura ? 'Se siente más frío' : a.sensacion > a.temperatura ? 'Se siente más cálido' : 'Igual a la real'} />
      <Dato icono={<Droplets className={icono} />} titulo="Humedad" valor={`${a.humedad}%`} extra={`Nubosidad ${a.nubosidad}%`} />
      <Dato
        icono={<Wind className={icono} />}
        titulo="Viento"
        valor={
          <span className="flex items-center gap-2">
            {a.viento} <span className="text-sm font-normal text-white/70">km/h</span>
            <Navigation className="h-4 w-4 text-sky-200" style={{ rotate: `${a.direccionViento + 180}deg` }} aria-label={`Dirección ${puntoCardinal(a.direccionViento)}`} />
          </span>
        }
        extra={`${puntoCardinal(a.direccionViento)} · ráfagas ${a.rafagas} km/h`}
      />
      <Dato icono={<Gauge className={icono} />} titulo="Presión" valor={<>{a.presion} <span className="text-sm font-normal text-white/70">hPa</span></>} extra={a.presion >= 1013 ? 'Alta presión' : 'Baja presión'} />
      <Dato
        icono={<Eye className={icono} />}
        titulo="Visibilidad"
        valor={a.visibilidad === null ? '—' : <>{(a.visibilidad / 1000).toFixed(a.visibilidad < 10000 ? 1 : 0)} <span className="text-sm font-normal text-white/70">km</span></>}
        extra={`Precipitación ${a.precipitacion} mm`}
      />
      <Dato icono={<SunMedium className={icono} />} titulo="Índice UV" valor={Math.round(uv)} extra={nivelUV(uv)} />
    </section>
  );
}

/* ---------------- Amanecer / atardecer ---------------- */

export function CicloSolar({ datos }: { datos: Datos }) {
  const hoy = datos.dias[0];
  const salida = minutosDelDia(hoy.amanecer);
  const puesta = minutosDelDia(hoy.atardecer);
  const ahora = minutosDelDia(datos.actual.hora);
  const avance = Math.min(1, Math.max(0, (ahora - salida) / (puesta - salida)));

  // Punto sobre un arco semicircular (de izquierda a derecha).
  const angulo = Math.PI * (1 - avance);
  const x = 100 + 80 * Math.cos(angulo);
  const y = 90 - 80 * Math.sin(angulo);

  return (
    <section className="vidrio aparecer p-5" style={{ animationDelay: '120ms' }}>
      <p className="etiqueta">Ciclo solar</p>
      <svg viewBox="0 0 200 100" className="mx-auto mt-2 w-full max-w-xs" aria-hidden>
        <defs>
          <linearGradient id="arco" x1="0" x2="1">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 5" />
        <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="url(#arco)" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={`${avance} 1`} />
        <line x1="10" x2="190" y1="90" y2="90" stroke="rgba(255,255,255,0.25)" />
        {datos.actual.esDeDia && <circle cx={x} cy={y} r="7" fill="#fde68a" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />}
      </svg>
      <div className="mt-2 flex justify-between text-sm">
        <span className="flex items-center gap-2"><Sunrise className="h-4 w-4 text-amber-300" />{horaCorta(hoy.amanecer)}</span>
        <span className="flex items-center gap-2">{horaCorta(hoy.atardecer)}<Sunset className="h-4 w-4 text-orange-300" /></span>
      </div>
    </section>
  );
}

/* ---------------- Próximas horas ---------------- */

export function PronosticoHoras({ datos }: { datos: Datos }) {
  return (
    <section className="vidrio aparecer p-5" style={{ animationDelay: '160ms' }}>
      <p className="etiqueta">Próximas 24 horas</p>
      <ol className="sin-barra mt-4 flex gap-2 overflow-x-auto pb-2">
        {datos.horas.map((h, i) => (
          <li
            key={h.hora}
            className={`flex min-w-[4.75rem] flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center ${i === 0 ? 'bg-white/15 ring-1 ring-white/25' : ''}`}
          >
            <span className="text-xs font-medium text-white/70">{i === 0 ? 'Ahora' : soloHora(h.hora)}</span>
            <IconoClima condicion={h.condicion} esDeDia={h.esDeDia} codigo={h.codigo} className="h-7 w-7" />
            <span className="text-lg font-semibold">{h.temperatura}°</span>
            <span className={`flex items-center gap-0.5 text-[11px] ${h.probLluvia >= 30 ? 'text-sky-300' : 'text-white/40'}`}>
              <Umbrella className="h-3 w-3" />
              {h.probLluvia}%
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Próximos días ---------------- */

export function PronosticoDias({ datos }: { datos: Datos }) {
  const minimo = Math.min(...datos.dias.map((d) => d.min));
  const maximo = Math.max(...datos.dias.map((d) => d.max));
  const rango = Math.max(1, maximo - minimo);

  return (
    <section className="vidrio aparecer p-5" style={{ animationDelay: '200ms' }}>
      <p className="etiqueta">Pronóstico de 7 días</p>
      <ul className="mt-3 divide-y divide-white/10">
        {datos.dias.map((d, i) => (
          <li key={d.fecha} className="grid grid-cols-[5.5rem_2rem_3rem_1fr] items-center gap-3 py-3 sm:grid-cols-[7rem_2rem_3.5rem_1fr]">
            <span className="font-medium">{nombreDia(d.fecha, i)}</span>
            <IconoClima condicion={d.condicion} codigo={d.codigo} className="h-6 w-6" aria-label={d.descripcion} />
            <span className={`text-xs ${d.probLluvia >= 30 ? 'text-sky-300' : 'text-white/40'}`}>{d.probLluvia}%</span>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-8 text-right text-white/60">{d.min}°</span>
              <div className="relative h-1.5 flex-1 rounded-full bg-white/15">
                <div
                  className="absolute inset-y-0 rounded-full bg-linear-to-r from-sky-300 via-amber-200 to-orange-400"
                  style={{ left: `${((d.min - minimo) / rango) * 100}%`, right: `${((maximo - d.max) / rango) * 100}%` }}
                />
              </div>
              <span className="w-8 font-semibold">{d.max}°</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
