import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideProps,
} from 'lucide-react';
import type { Condicion } from '@/lib/tipos';

interface Props extends LucideProps {
  condicion: Condicion;
  esDeDia?: boolean;
  codigo?: number;
}

export function IconoClima({ condicion, esDeDia = true, codigo, className = '', ...resto }: Props) {
  const llovizna = codigo !== undefined && codigo >= 51 && codigo <= 57;

  const [Icono, color] = (() => {
    switch (condicion) {
      case 'despejado':
        return esDeDia ? [Sun, 'text-amber-300'] : [Moon, 'text-indigo-100'];
      case 'parcial':
        return esDeDia ? [CloudSun, 'text-amber-200'] : [CloudMoon, 'text-indigo-100'];
      case 'nublado':
        return [Cloud, 'text-slate-200'];
      case 'lluvia':
        return [llovizna ? CloudDrizzle : CloudRain, 'text-sky-300'];
      case 'tormenta':
        return [CloudLightning, 'text-violet-300'];
      case 'nieve':
        return [CloudSnow, 'text-cyan-100'];
      case 'niebla':
        return [CloudFog, 'text-slate-200'];
    }
  })();

  return <Icono className={`${color} ${className}`} strokeWidth={1.6} aria-hidden {...resto} />;
}
