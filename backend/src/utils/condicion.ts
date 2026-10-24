import type { Condicion } from '../types.js';

/** Traduce los códigos WMO que devuelve Open-Meteo a una condición y descripción en español. */
const TABLA: Record<number, { condicion: Condicion; descripcion: string }> = {
  0: { condicion: 'despejado', descripcion: 'Cielo despejado' },
  1: { condicion: 'despejado', descripcion: 'Mayormente despejado' },
  2: { condicion: 'parcial', descripcion: 'Parcialmente nublado' },
  3: { condicion: 'nublado', descripcion: 'Nublado' },
  45: { condicion: 'niebla', descripcion: 'Niebla' },
  48: { condicion: 'niebla', descripcion: 'Niebla con escarcha' },
  51: { condicion: 'lluvia', descripcion: 'Llovizna ligera' },
  53: { condicion: 'lluvia', descripcion: 'Llovizna' },
  55: { condicion: 'lluvia', descripcion: 'Llovizna intensa' },
  56: { condicion: 'lluvia', descripcion: 'Llovizna helada' },
  57: { condicion: 'lluvia', descripcion: 'Llovizna helada intensa' },
  61: { condicion: 'lluvia', descripcion: 'Lluvia ligera' },
  63: { condicion: 'lluvia', descripcion: 'Lluvia' },
  65: { condicion: 'lluvia', descripcion: 'Lluvia intensa' },
  66: { condicion: 'lluvia', descripcion: 'Lluvia helada' },
  67: { condicion: 'lluvia', descripcion: 'Lluvia helada intensa' },
  71: { condicion: 'nieve', descripcion: 'Nevada ligera' },
  73: { condicion: 'nieve', descripcion: 'Nevada' },
  75: { condicion: 'nieve', descripcion: 'Nevada intensa' },
  77: { condicion: 'nieve', descripcion: 'Granizo fino' },
  80: { condicion: 'lluvia', descripcion: 'Chubascos ligeros' },
  81: { condicion: 'lluvia', descripcion: 'Chubascos' },
  82: { condicion: 'lluvia', descripcion: 'Chubascos violentos' },
  85: { condicion: 'nieve', descripcion: 'Chubascos de nieve' },
  86: { condicion: 'nieve', descripcion: 'Chubascos de nieve intensos' },
  95: { condicion: 'tormenta', descripcion: 'Tormenta eléctrica' },
  96: { condicion: 'tormenta', descripcion: 'Tormenta con granizo' },
  99: { condicion: 'tormenta', descripcion: 'Tormenta fuerte con granizo' },
};

export function interpretarCodigo(codigo: number) {
  return TABLA[codigo] ?? { condicion: 'nublado' as Condicion, descripcion: 'Sin datos' };
}
