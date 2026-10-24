# Atmósfera - App del clima

Atmósfera es una aplicación web progresiva (PWA) para consultar el clima. Se puede buscar
cualquier ciudad o usar la ubicación actual, y muestra el clima del momento, el pronóstico
de las próximas 24 horas y el de los próximos 7 días.

El fondo de la app cambia según el clima: sale el sol cuando está despejado, gotas cuando
llueve, relámpagos cuando hay tormenta, nieve, niebla, y la luna con estrellas en la noche.

Como es una PWA, se puede instalar en la computadora como si fuera una aplicación normal y
también abre sin internet mostrando los últimos datos que se descargaron.

## Frameworks

- **Next.js** (con React) para el frontend
- **Express** (con Node.js) para el backend

## Herramientas

- TypeScript
- Tailwind CSS para los estilos
- Lucide para los íconos
- API de Open-Meteo para los datos del clima (es gratis y no necesita API key)

## Cómo instalarla

Hay que tener instalado **Node.js 20 o superior**.

1. Clonar el repositorio y entrar a la carpeta:

   ```bash
   git clone https://github.com/TU_USUARIO/clima-pwa.git
   cd clima-pwa
   ```

2. Instalar las dependencias:

   ```bash
   npm run instalar
   ```

3. Ejecutar la app:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador: **http://localhost:3000**

Para poder instalarla como app y probar que funciona sin internet, hay que ejecutarla
en modo producción en lugar del paso 3:

```bash
npm run build
npm start
```

Después de eso, en Chrome o Edge aparece el botón **Instalar** en la barra de direcciones.
