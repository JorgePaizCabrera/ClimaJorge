import type { Condicion } from './tipos';

export interface Tema {
  /** Degradado del cielo. */
  cielo: string;
  /** Color para la barra del navegador / PWA. */
  color: string;
  /** Color de las nubes. */
  nube: string;
  /** Texto corto que acompaña a la condición. */
  frase: string;
}

const TEMAS: Record<Condicion, { dia: Tema; noche: Tema }> = {
  despejado: {
    dia: {
      cielo: 'linear-gradient(180deg, #0b63ce 0%, #3b9cf5 45%, #8fd0ff 80%, #ffd89a 100%)',
      color: '#0b63ce',
      nube: 'rgba(255,255,255,0.9)',
      frase: 'Un día radiante. No olvides el bloqueador.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #01030d 0%, #0a1030 45%, #1b1f4b 80%, #2d2660 100%)',
      color: '#01030d',
      nube: 'rgba(148,163,184,0.35)',
      frase: 'Noche despejada, ideal para ver las estrellas.',
    },
  },
  parcial: {
    dia: {
      cielo: 'linear-gradient(180deg, #2563b8 0%, #5b9bd8 50%, #a9cdee 100%)',
      color: '#2563b8',
      nube: 'rgba(255,255,255,0.92)',
      frase: 'Sol entre nubes durante el día.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #050a1a 0%, #111a35 55%, #26304f 100%)',
      color: '#050a1a',
      nube: 'rgba(100,116,139,0.55)',
      frase: 'Algunas nubes cubren el cielo nocturno.',
    },
  },
  nublado: {
    dia: {
      cielo: 'linear-gradient(180deg, #4a5568 0%, #718096 50%, #a0aec0 100%)',
      color: '#4a5568',
      nube: 'rgba(226,232,240,0.85)',
      frase: 'Cielo cubierto, temperatura estable.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #0d1117 0%, #1f2933 55%, #323f4b 100%)',
      color: '#0d1117',
      nube: 'rgba(71,85,105,0.7)',
      frase: 'Noche cubierta de nubes.',
    },
  },
  lluvia: {
    dia: {
      cielo: 'linear-gradient(180deg, #1e2a3a 0%, #334155 50%, #546378 100%)',
      color: '#1e2a3a',
      nube: 'rgba(100,116,139,0.85)',
      frase: 'Lleva paraguas, hay lluvia en la zona.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #03060c 0%, #0f1723 55%, #1e293b 100%)',
      color: '#03060c',
      nube: 'rgba(51,65,85,0.85)',
      frase: 'Lluvia nocturna, maneja con precaución.',
    },
  },
  tormenta: {
    dia: {
      cielo: 'linear-gradient(180deg, #0c0a1d 0%, #1f1b3a 50%, #3a3358 100%)',
      color: '#0c0a1d',
      nube: 'rgba(40,36,64,0.92)',
      frase: 'Tormenta eléctrica: busca refugio.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #000000 0%, #0d0b1c 55%, #1d1833 100%)',
      color: '#000000',
      nube: 'rgba(30,27,50,0.95)',
      frase: 'Tormenta eléctrica: permanece bajo techo.',
    },
  },
  nieve: {
    dia: {
      cielo: 'linear-gradient(180deg, #7b8faa 0%, #a7b6ca 50%, #dbe4ee 100%)',
      color: '#7b8faa',
      nube: 'rgba(241,245,249,0.9)',
      frase: 'Está nevando, abrígate bien.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #121a2b 0%, #2a3a55 55%, #4b5d7a 100%)',
      color: '#121a2b',
      nube: 'rgba(148,163,184,0.6)',
      frase: 'Nevada nocturna, temperaturas bajas.',
    },
  },
  niebla: {
    dia: {
      cielo: 'linear-gradient(180deg, #7d8793 0%, #a3abb5 50%, #ccd2d8 100%)',
      color: '#7d8793',
      nube: 'rgba(229,231,235,0.85)',
      frase: 'Visibilidad reducida por niebla.',
    },
    noche: {
      cielo: 'linear-gradient(180deg, #14181f 0%, #2a3039 55%, #444c57 100%)',
      color: '#14181f',
      nube: 'rgba(107,114,128,0.6)',
      frase: 'Niebla nocturna, enciende las luces bajas.',
    },
  },
};

export function obtenerTema(condicion: Condicion, esDeDia: boolean): Tema {
  return TEMAS[condicion][esDeDia ? 'dia' : 'noche'];
}

export const NOMBRES_CONDICION: Record<Condicion, string> = {
  despejado: 'Soleado / Despejado',
  parcial: 'Parcialmente nublado',
  nublado: 'Nublado',
  lluvia: 'Lluvia',
  tormenta: 'Tormenta',
  nieve: 'Nieve',
  niebla: 'Niebla',
};
