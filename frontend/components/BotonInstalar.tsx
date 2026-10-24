'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Info } from 'lucide-react';

/** Evento que lanzan Chrome y Edge cuando la app se puede instalar (no viene en los tipos de TypeScript). */
type EventoInstalacion = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface Window {
    /** Lo guarda el script del <head> en app/layout.tsx. */
    __eventoInstalacion?: EventoInstalacion | null;
  }
}

const DURACION_MENSAJE_MS = 4000;

type Mensaje = { exito: boolean; texto: string } | null;

/** Botón verde para instalar la app. Si ya está instalada, al presionarlo lo avisa. */
export function BotonInstalar() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [dentroDeLaApp, setDentroDeLaApp] = useState(true);
  const [rechazada, setRechazada] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);

  useEffect(() => {
    // Abierta como app instalada (en su propia ventana): ahí no se muestra el botón.
    setDentroDeLaApp(window.matchMedia('(display-mode: standalone)').matches);

    const disponible = () => setEvento(window.__eventoInstalacion ?? null);
    const alInstalar = () => {
      window.__eventoInstalacion = null;
      setEvento(null);
      setMensaje({ exito: true, texto: '¡Listo! La app se instaló correctamente.' });
    };
    disponible();
    window.addEventListener('instalacion-disponible', disponible);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('instalacion-disponible', disponible);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, []);

  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), DURACION_MENSAJE_MS);
    return () => clearTimeout(t);
  }, [mensaje]);

  if (dentroDeLaApp) return null;

  const instalar = async () => {
    if (evento) {
      await evento.prompt();
      const { outcome } = await evento.userChoice;
      // El evento solo se puede usar una vez.
      window.__eventoInstalacion = null;
      setEvento(null);
      if (outcome === 'dismissed') setRechazada(true);
      return;
    }

    // Chrome y Edge siempre ofrecen instalar una app que no está instalada (en modo producción,
    // con el service worker activo). Si no la ofrecen, es porque ya está instalada.
    const navegadorCompatible = 'onbeforeinstallprompt' in window;
    const modoProduccion = Boolean(navigator.serviceWorker?.controller);

    if (rechazada) {
      setMensaje({ exito: false, texto: 'Cancelaste la instalación. Recarga la página para intentarlo de nuevo.' });
    } else if (navegadorCompatible && modoProduccion) {
      setMensaje({ exito: true, texto: 'Ya tienes la app instalada. Búscala como «Atmósfera» en tu escritorio o menú Inicio.' });
    } else if (!navegadorCompatible) {
      setMensaje({ exito: false, texto: 'Tu navegador no permite instalar apps. Usa Chrome o Edge.' });
    } else {
      setMensaje({ exito: false, texto: 'Para instalarla, ejecuta la app en modo producción (npm run build y npm start).' });
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 self-start sm:fixed sm:top-4 sm:left-4 sm:z-50">
      <button
        type="button"
        onClick={instalar}
        className="aparecer inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-950/40 transition hover:bg-green-500 focus-visible:ring-4 focus-visible:ring-green-300/50 focus-visible:outline-none"
      >
        <Download className="h-5 w-5" />
        Instalar
      </button>
      {mensaje && (
        <p role="status" className="vidrio aparecer flex max-w-xs items-start gap-2 rounded-2xl px-4 py-3 text-sm">
          {mensaje.exito ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
          )}
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}
