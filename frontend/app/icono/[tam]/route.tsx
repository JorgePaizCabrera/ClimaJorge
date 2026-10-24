import { ImageResponse } from 'next/og';

const TAMANOS = new Set([180, 192, 512]);

/** Genera los íconos PNG de la PWA (192, 512 y 180 para iOS). */
export async function GET(req: Request, { params }: { params: Promise<{ tam: string }> }) {
  const { tam } = await params;
  const lado = TAMANOS.has(Number(tam)) ? Number(tam) : 192;
  const maskable = new URL(req.url).searchParams.has('maskable');
  const u = lado / 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #38bdf8 0%, #2563eb 50%, #4338ca 100%)',
          borderRadius: maskable ? 0 : 22 * u,
          position: 'relative',
        }}
      >
        {/* Sol */}
        <div
          style={{
            position: 'absolute',
            top: 22 * u,
            right: 22 * u,
            width: 34 * u,
            height: 34 * u,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #fff7d6, #fcd34d 55%, #f59e0b)',
            boxShadow: `0 0 ${10 * u}px ${3 * u}px rgba(252,211,77,0.6)`,
          }}
        />
        {/* Nube */}
        <div style={{ position: 'absolute', bottom: 26 * u, left: 18 * u, display: 'flex' }}>
          <div style={{ width: 60 * u, height: 22 * u, borderRadius: 11 * u, background: 'white' }} />
          <div style={{ position: 'absolute', left: 10 * u, top: -14 * u, width: 26 * u, height: 26 * u, borderRadius: '50%', background: 'white' }} />
          <div style={{ position: 'absolute', left: 26 * u, top: -20 * u, width: 30 * u, height: 30 * u, borderRadius: '50%', background: 'white' }} />
        </div>
      </div>
    ),
    { width: lado, height: lado },
  );
}
