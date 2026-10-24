# Atmósfera - App del clima

App web progresiva (PWA) para ver el clima actual, el pronóstico de 24 horas y de 7 días
de cualquier ciudad o de tu ubicación. El fondo cambia según el clima (sol, lluvia,
tormenta, nieve, niebla y noche). Se puede instalar como app y abre sin internet con los
últimos datos guardados.

## Frameworks

- Next.js (frontend)
- Express (backend)

## Herramientas

- TypeScript
- Tailwind CSS
- Lucide (íconos)
- Open-Meteo (datos del clima)

## Instalación

Necesitas Node.js 20 o superior.

```bash
git clone https://github.com/JorgePaizCabrera/ClimaJorge.git
cd ClimaJorge
npm run instalar
```

## Modo local

```bash
npm run dev
```

Abre http://localhost:3000

## Modo producción

```bash
npm run build
npm start
```

Abre http://localhost:3000 y verás un botón verde que dice Instalar en la parte
superior izquierda para instalar la app.
