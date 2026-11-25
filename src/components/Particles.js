// Debu emas melayang + cahaya lilin. Murni CSS (ringan di ponsel, mati otomatis jika prefers-reduced-motion).
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 2 + (i % 3),
  dur: `${14 + ((i * 5) % 12)}s`,
  delay: `${-((i * 3) % 14)}s`,
  dx: `${((i % 5) - 2) * 14}px`,
}));

export default function Particles() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="candle" />
      {MOTES.map((m, i) => (
        <span key={i} className="mote" style={{ left: m.left, width: m.size, height: m.size, animationDuration: m.dur, animationDelay: m.delay, '--dx': m.dx }} />
      ))}
    </div>
  );
}
