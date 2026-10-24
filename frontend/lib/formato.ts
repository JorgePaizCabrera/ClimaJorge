// Open-Meteo devuelve las horas en la hora local de la ciudad ("2026-10-23T16:00"),
// así que se leen como texto para no mezclarlas con la zona horaria del navegador.

function partes(iso: string) {
  const [fecha, hora = '00:00'] = iso.split('T');
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  return { a, m, d, h, min };
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function diaSemana(iso: string) {
  const { a, m, d } = partes(iso);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay();
}

export function horaCorta(iso: string) {
  const { h, min } = partes(iso);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${sufijo}`;
}

export function soloHora(iso: string) {
  const { h } = partes(iso);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

export function fechaLarga(iso: string) {
  const { m, d } = partes(iso);
  return `${DIAS[diaSemana(iso)]}, ${d} de ${MESES[m - 1]}`;
}

export function nombreDia(iso: string, indice: number) {
  if (indice === 0) return 'Hoy';
  if (indice === 1) return 'Mañana';
  return DIAS[diaSemana(iso)];
}

export function puntoCardinal(grados: number) {
  const puntos = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return puntos[Math.round(grados / 45) % 8];
}

export function nivelUV(uv: number) {
  if (uv < 3) return 'Bajo';
  if (uv < 6) return 'Moderado';
  if (uv < 8) return 'Alto';
  if (uv < 11) return 'Muy alto';
  return 'Extremo';
}

/** Minutos desde la medianoche, para comparar con amanecer/atardecer. */
export function minutosDelDia(iso: string) {
  const { h, min } = partes(iso);
  return h * 60 + min;
}
