import { Router } from 'express';
import { buscarCiudades, obtenerClima } from '../services/openMeteo.js';

export const climaRouter = Router();

function leerCoordenada(valor: unknown, limite: number): number | null {
  if (typeof valor !== 'string' || valor.trim() === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) && Math.abs(n) <= limite ? n : null;
}

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

// GET /api/clima?lat=14.63&lon=-90.51[&nombre=Guatemala&region=...&pais=...]
climaRouter.get('/clima', async (req, res) => {
  const lat = leerCoordenada(req.query.lat, 90);
  const lon = leerCoordenada(req.query.lon, 180);
  if (lat === null || lon === null) {
    res.status(400).json({ error: 'Parámetros lat y lon inválidos' });
    return;
  }

  try {
    const nombre = texto(req.query.nombre);
    const datos = await obtenerClima(
      lat,
      lon,
      nombre ? { nombre, region: texto(req.query.region), pais: texto(req.query.pais) } : undefined,
    );
    res.json(datos);
  } catch (error) {
    console.error('[clima]', error);
    res.status(502).json({ error: 'No se pudo obtener el clima en este momento' });
  }
});

// GET /api/buscar?q=Quetzaltenango
climaRouter.get('/buscar', async (req, res) => {
  const q = texto(req.query.q) ?? '';
  if (q.length < 2) {
    res.json([]);
    return;
  }
  try {
    res.json(await buscarCiudades(q));
  } catch (error) {
    console.error('[buscar]', error);
    res.status(502).json({ error: 'No se pudo buscar la ciudad' });
  }
});
