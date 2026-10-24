// Mismos tipos que expone el backend (clima-pwa/backend/src/types.ts).

export type Condicion =
  | 'despejado'
  | 'parcial'
  | 'nublado'
  | 'lluvia'
  | 'tormenta'
  | 'nieve'
  | 'niebla';

export interface Ubicacion {
  nombre: string;
  region?: string;
  pais?: string;
  lat: number;
  lon: number;
  zonaHoraria?: string;
}

export interface ClimaActual {
  hora: string;
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  rafagas: number;
  direccionViento: number;
  presion: number;
  nubosidad: number;
  precipitacion: number;
  visibilidad: number | null;
  codigo: number;
  condicion: Condicion;
  descripcion: string;
  esDeDia: boolean;
}

export interface PronosticoHora {
  hora: string;
  temperatura: number;
  codigo: number;
  condicion: Condicion;
  probLluvia: number;
  esDeDia: boolean;
}

export interface PronosticoDia {
  fecha: string;
  max: number;
  min: number;
  codigo: number;
  condicion: Condicion;
  descripcion: string;
  probLluvia: number;
  uv: number;
  amanecer: string;
  atardecer: string;
}

export interface RespuestaClima {
  ubicacion: Ubicacion;
  actual: ClimaActual;
  horas: PronosticoHora[];
  dias: PronosticoDia[];
  actualizado: string;
}
