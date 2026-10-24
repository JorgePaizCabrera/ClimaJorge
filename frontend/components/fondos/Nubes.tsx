interface Props {
  color: string;
  cantidad: number;
  /** Nubes más grandes y bajas para lluvia/tormenta. */
  pesadas?: boolean;
}

// Posiciones fijas (no aleatorias) para que el render del servidor y del cliente coincidan.
const BASE = [
  { top: 6, escala: 1.25, duracion: 95, retraso: -10 },
  { top: 18, escala: 0.85, duracion: 120, retraso: -60 },
  { top: 2, escala: 1.6, duracion: 140, retraso: -95 },
  { top: 28, escala: 1.05, duracion: 105, retraso: -35 },
  { top: 12, escala: 0.7, duracion: 85, retraso: -70 },
  { top: 36, escala: 1.35, duracion: 160, retraso: -120 },
  { top: 22, escala: 1.9, duracion: 180, retraso: -20 },
  { top: 0, escala: 2.2, duracion: 200, retraso: -150 },
];

export function Nubes({ color, cantidad, pesadas = false }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BASE.slice(0, cantidad).map((n, i) => (
        <div
          key={i}
          className="nube absolute"
          style={{
            top: `${pesadas ? n.top * 0.6 - 6 : n.top}%`,
            animationDuration: `${n.duracion}s`,
            animationDelay: `${n.retraso}s`,
            ['--escala' as string]: pesadas ? n.escala * 1.4 : n.escala,
            ['--color-nube' as string]: color,
          }}
        />
      ))}
    </div>
  );
}
