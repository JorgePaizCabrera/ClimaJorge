import type { PronosticoDia, PronosticoHora, RespuestaClima, Ubicacion } from '../types.js';
import { interpretarCodigo } from '../utils/condicion.js';
import { CacheTTL } from '../utils/cache.js';

const URL_PRONOSTICO = 'https://api.open-meteo.com/v1/forecast';
const URL_GEOCODIFICACION = 'https://geocoding-api.open-meteo.com/v1/search';
const URL_GEO_INVERSA = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const cacheClima = new CacheTTL<RespuestaClima>(10 * 60 * 1000);
const cacheBusqueda = new CacheTTL<Ubicacion[]>(60 * 60 * 1000);

async function pedirJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Servicio externo respondió ${res.status}`);
  return (await res.json()) as T;
}

interface OpenMeteoPronostico {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: (number | null)[];
    precipitation_probability_max: (number | null)[];
  };
}

/** Obtiene el nombre de la ciudad a partir de coordenadas (cuando se usa el GPS). */
async function nombrarCoordenadas(lat: number, lon: number): Promise<Partial<Ubicacion>> {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      localityLanguage: 'es',
    });
    const r = await pedirJson<{
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      countryName?: string;
    }>(`${URL_GEO_INVERSA}?${params}`);
    return {
      nombre: r.city || r.locality || 'Mi ubicación',
      region: r.principalSubdivision || undefined,
      pais: r.countryName || undefined,
    };
  } catch {
    return { nombre: 'Mi ubicación' };
  }
}

export async function obtenerClima(
  lat: number,
  lon: number,
  lugarConocido?: Partial<Ubicacion>,
): Promise<RespuestaClima> {
  const clave = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const enCache = cacheClima.obtener(clave);
  if (enCache) return enCache;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
    ].join(','),
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const [datos, lugar] = await Promise.all([
    pedirJson<OpenMeteoPronostico>(`${URL_PRONOSTICO}?${params}`),
    lugarConocido?.nombre ? Promise.resolve(lugarConocido) : nombrarCoordenadas(lat, lon),
  ]);

  const c = datos.current;
  const actual = interpretarCodigo(c.weather_code);

  // Las próximas 24 horas a partir de la hora local actual.
  const horaActual = c.time.slice(0, 13) + ':00';
  const inicio = Math.max(0, datos.hourly.time.findIndex((t) => t >= horaActual));
  const horas: PronosticoHora[] = datos.hourly.time.slice(inicio, inicio + 24).map((hora, i) => {
    const j = inicio + i;
    const codigo = datos.hourly.weather_code[j];
    return {
      hora,
      temperatura: Math.round(datos.hourly.temperature_2m[j]),
      codigo,
      condicion: interpretarCodigo(codigo).condicion,
      probLluvia: datos.hourly.precipitation_probability[j] ?? 0,
      esDeDia: datos.hourly.is_day[j] === 1,
    };
  });

  const dias: PronosticoDia[] = datos.daily.time.map((fecha, i) => {
    const codigo = datos.daily.weather_code[i];
    const info = interpretarCodigo(codigo);
    return {
      fecha,
      max: Math.round(datos.daily.temperature_2m_max[i]),
      min: Math.round(datos.daily.temperature_2m_min[i]),
      codigo,
      condicion: info.condicion,
      descripcion: info.descripcion,
      probLluvia: datos.daily.precipitation_probability_max[i] ?? 0,
      uv: datos.daily.uv_index_max[i] ?? 0,
      amanecer: datos.daily.sunrise[i],
      atardecer: datos.daily.sunset[i],
    };
  });

  const respuesta: RespuestaClima = {
    ubicacion: {
      nombre: lugar.nombre ?? 'Mi ubicación',
      region: lugar.region,
      pais: lugar.pais,
      lat,
      lon,
      zonaHoraria: datos.timezone,
    },
    actual: {
      hora: c.time,
      temperatura: Math.round(c.temperature_2m),
      sensacion: Math.round(c.apparent_temperature),
      humedad: c.relative_humidity_2m,
      viento: Math.round(c.wind_speed_10m),
      rafagas: Math.round(c.wind_gusts_10m),
      direccionViento: c.wind_direction_10m,
      presion: Math.round(c.pressure_msl),
      nubosidad: c.cloud_cover,
      precipitacion: c.precipitation,
      visibilidad: c.visibility ?? null,
      codigo: c.weather_code,
      condicion: actual.condicion,
      descripcion: actual.descripcion,
      esDeDia: c.is_day === 1,
    },
    horas,
    dias,
    actualizado: new Date().toISOString(),
  };

  cacheClima.guardar(clave, respuesta);
  return respuesta;
}

export async function buscarCiudades(texto: string): Promise<Ubicacion[]> {
  const clave = texto.toLowerCase();
  const enCache = cacheBusqueda.obtener(clave);
  if (enCache) return enCache;

  const params = new URLSearchParams({ name: texto, count: '8', language: 'es', format: 'json' });
  const r = await pedirJson<{
    results?: {
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }[];
  }>(`${URL_GEOCODIFICACION}?${params}`);

  const lista: Ubicacion[] = (r.results ?? []).map((x) => ({
    nombre: x.name,
    region: x.admin1,
    pais: x.country,
    lat: x.latitude,
    lon: x.longitude,
    zonaHoraria: x.timezone,
  }));
  cacheBusqueda.guardar(clave, lista);
  return lista;
}
