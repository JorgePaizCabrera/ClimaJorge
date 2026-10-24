import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { climaRouter } from './routes/clima.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'clima-backend', hora: new Date().toISOString() });
});

app.use('/api', climaRouter);

app.listen(PORT, () => {
  console.log(`API del clima escuchando en http://localhost:${PORT}`);
});
