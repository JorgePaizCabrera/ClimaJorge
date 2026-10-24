import type { Condicion } from '@/lib/tipos';
import { obtenerTema } from '@/lib/tema';
import { Particulas } from './Particulas';
import { Nubes } from './Nubes';
import { Luna, Niebla, Relampagos, Sol } from './Astros';

interface Props {
  condicion: Condicion;
  esDeDia: boolean;
}

/** Arma el fondo animado según el clima: sol, lluvia, tormenta, nieve, niebla, noche... */
export function FondoClima({ condicion, esDeDia }: Props) {
  const tema = obtenerTema(condicion, esDeDia);

  return (
    // La key fuerza una transición suave cada vez que cambia el clima.
    <div key={`${condicion}-${esDeDia}`} className="fondo-entrada fixed inset-0 -z-10 overflow-hidden" style={{ background: tema.cielo }}>
      {condicion === 'despejado' && (esDeDia ? <Sol /> : <><Particulas tipo="estrellas" /><Luna /></>)}

      {condicion === 'parcial' && (
        <>
          {esDeDia ? <Sol tenue /> : <><Particulas tipo="estrellas" /><Luna /></>}
          <Nubes color={tema.nube} cantidad={4} />
        </>
      )}

      {condicion === 'nublado' && <Nubes color={tema.nube} cantidad={8} />}

      {condicion === 'lluvia' && (
        <>
          <Nubes color={tema.nube} cantidad={7} pesadas />
          <Particulas tipo="lluvia" />
        </>
      )}

      {condicion === 'tormenta' && (
        <>
          <Relampagos />
          <Nubes color={tema.nube} cantidad={8} pesadas />
          <Particulas tipo="lluvia-fuerte" />
        </>
      )}

      {condicion === 'nieve' && (
        <>
          <Nubes color={tema.nube} cantidad={5} />
          <Particulas tipo="nieve" />
        </>
      )}

      {condicion === 'niebla' && (
        <>
          {esDeDia && <Sol tenue />}
          <Niebla />
        </>
      )}

      {/* Velo para que el texto siempre sea legible sobre cualquier fondo. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/5 to-black/45" />
    </div>
  );
}
