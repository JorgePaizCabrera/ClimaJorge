'use client';

import { useEffect, useRef } from 'react';

export type TipoParticula = 'lluvia' | 'lluvia-fuerte' | 'nieve' | 'estrellas';

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tam: number;
  alfa: number;
  fase: number;
}

const CANTIDAD: Record<TipoParticula, number> = {
  lluvia: 260,
  'lluvia-fuerte': 520,
  nieve: 180,
  estrellas: 220,
};

/** Lienzo animado para gotas de lluvia, copos de nieve o estrellas. */
export function Particulas({ tipo }: { tipo: TipoParticula }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let ancho = 0;
    let alto = 0;
    let particulas: Particula[] = [];
    let animacion = 0;

    const crear = (alInicio: boolean): Particula => {
      const x = Math.random() * ancho;
      const y = alInicio ? Math.random() * alto : -20;
      switch (tipo) {
        case 'lluvia':
        case 'lluvia-fuerte': {
          const fuerte = tipo === 'lluvia-fuerte';
          const vy = (fuerte ? 18 : 13) + Math.random() * 8;
          return { x, y, vx: fuerte ? -3.5 : -1.5, vy, tam: 10 + Math.random() * 18, alfa: 0.25 + Math.random() * 0.45, fase: 0 };
        }
        case 'nieve':
          return { x, y, vx: 0, vy: 0.6 + Math.random() * 1.4, tam: 1 + Math.random() * 3.2, alfa: 0.55 + Math.random() * 0.45, fase: Math.random() * Math.PI * 2 };
        case 'estrellas':
          return { x, y: Math.random() * alto * 0.75, vx: 0, vy: 0, tam: Math.random() * 1.4 + 0.3, alfa: Math.random(), fase: Math.random() * Math.PI * 2 };
      }
    };

    const redimensionar = () => {
      ancho = window.innerWidth;
      alto = window.innerHeight;
      canvas.width = ancho * dpr;
      canvas.height = alto * dpr;
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const escala = Math.min(1, (ancho * alto) / (1440 * 900));
      const n = Math.max(40, Math.round(CANTIDAD[tipo] * escala));
      particulas = Array.from({ length: n }, () => crear(true));
    };

    const dibujar = (t: number) => {
      ctx.clearRect(0, 0, ancho, alto);

      for (const p of particulas) {
        if (tipo === 'estrellas') {
          const brillo = 0.35 + 0.65 * Math.abs(Math.sin(t / 1400 + p.fase));
          ctx.globalAlpha = brillo * 0.9;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        if (tipo === 'nieve') {
          p.fase += 0.01;
          p.x += Math.sin(p.fase) * 0.6;
          p.y += p.vy;
          ctx.globalAlpha = p.alfa;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.x += p.vx;
          p.y += p.vy;
          ctx.globalAlpha = p.alfa;
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = tipo === 'lluvia-fuerte' ? 1.4 : 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * (p.tam / p.vy), p.y + p.tam);
          ctx.stroke();

          // Pequeña salpicadura al llegar al suelo.
          if (p.y > alto - 4) {
            ctx.globalAlpha = p.alfa * 0.6;
            ctx.beginPath();
            ctx.ellipse(p.x, alto - 2, 4, 1.2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (p.y > alto + 20 || p.x < -40 || p.x > ancho + 40) {
          Object.assign(p, crear(false));
        }
      }
      ctx.globalAlpha = 1;

      if (!reducido) animacion = requestAnimationFrame(dibujar);
    };

    redimensionar();
    animacion = requestAnimationFrame(dibujar);
    window.addEventListener('resize', redimensionar);
    return () => {
      cancelAnimationFrame(animacion);
      window.removeEventListener('resize', redimensionar);
    };
  }, [tipo]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0" aria-hidden />;
}
