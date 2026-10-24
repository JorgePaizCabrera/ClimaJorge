export function Sol({ tenue = false }: { tenue?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute right-[8%] top-[8%] h-40 w-40 sm:h-56 sm:w-56"
      style={{ opacity: tenue ? 0.75 : 1 }}
      aria-hidden
    >
      <div className="sol-rayos absolute -inset-[70%] rounded-full" />
      <div className="sol-halo absolute -inset-[40%] rounded-full" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fffbe6_0%,#ffe066_40%,#ffb627_100%)] shadow-[0_0_80px_30px_rgba(255,200,60,0.55)]" />
    </div>
  );
}

export function Luna() {
  return (
    <div className="pointer-events-none absolute right-[10%] top-[9%] h-28 w-28 sm:h-36 sm:w-36" aria-hidden>
      <div className="absolute -inset-[60%] rounded-full bg-[radial-gradient(circle,rgba(226,232,255,0.22)_0%,transparent_65%)]" />
      <div className="luna absolute inset-0 rounded-full" />
    </div>
  );
}

export function Relampagos() {
  return <div className="relampago pointer-events-none absolute inset-0" aria-hidden />;
}

export function Niebla() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="niebla-capa absolute bottom-[5%] h-[45%]" style={{ animationDuration: '38s' }} />
      <div className="niebla-capa absolute bottom-[25%] h-[40%] opacity-70" style={{ animationDuration: '55s', animationDirection: 'reverse' }} />
      <div className="niebla-capa absolute bottom-[-10%] h-[50%]" style={{ animationDuration: '70s' }} />
    </div>
  );
}
