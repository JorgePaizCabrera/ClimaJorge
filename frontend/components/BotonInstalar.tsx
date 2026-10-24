'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

/** Evento que lanzan Chrome y Edge cuando la app se puede instalar (no viene en los tipos de TypeScript). */
type EventoInstalacion = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

// Se escucha desde que carga el script, porque el navegador puede lanzar el evento antes de que React monte el botón.
let eventoGuardado: EventoInstalacion | null = null;
const avisar = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    eventoGuardado = e as EventoInstalacion;
    avisar.forEach((f) => f());
  });
  window.addEventListener('appinstalled', () => {
    eventoGuardado = null;
    avisar.forEach((f) => f());
  });
}

/** Botón verde para instalar la app; solo aparece cuando el navegador permite instalarla. */
export function BotonInstalar() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);

  useEffect(() => {
    const actualizar = () => setEvento(eventoGuardado);
    actualizar();
    avisar.add(actualizar);
    return () => {
      avisar.delete(actualizar);
    };
  }, []);

  if (!evento) return null;

  const instalar = async () => {
    await evento.prompt();
    await evento.userChoice;
    // El evento solo se puede usar una vez.
    eventoGuardado = null;
    setEvento(null);
  };

  return (
    <button
      type="button"
      onClick={instalar}
      className="aparecer inline-flex items-center gap-2 self-start rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-950/40 transition hover:bg-green-500 focus-visible:ring-4 focus-visible:ring-green-300/50 focus-visible:outline-none sm:fixed sm:top-4 sm:left-4 sm:z-50"
    >
      <Download className="h-5 w-5" />
      Instalar
    </button>
  );
}
