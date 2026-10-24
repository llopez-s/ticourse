import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The property manager's big key ring (s09 and rule 3 of s11): a ring with `keys` keys fanned below it,
 * each one for a different building. `show` (0–1) draws the keys one by one; `hot` (0–1) turns them rose
 * (someone stole the ring). Box: 360×300.
 */
export function KeyRing({ keys = 5, show = 1, hot = 0, scale = 1 }: { keys?: number; show?: number; hot?: number; scale?: number }) {
  const col = hot > 0.5 ? C.rose : C.amber;
  const n = keys;
  return (
    <svg width={360 * scale} height={300 * scale} viewBox="0 0 360 300" style={{ display: 'block', overflow: 'visible' }}>
      {Array.from({ length: n }).map((_, i) => {
        const k = Math.max(0, Math.min(1, show * n - i));
        if (k <= 0) return null;
        const ang = -52 + (104 / Math.max(1, n - 1)) * i;
        return (
          <g key={i} transform={`translate(180 70) rotate(${ang})`} opacity={k}>
            <path d="M0 0 V190" stroke={col} strokeWidth={9} strokeLinecap="round" />
            <path d={`M0 ${150 + (i % 2) * 8} h22 M0 ${172 + (i % 2) * 8} h16`} stroke={col} strokeWidth={9} strokeLinecap="round" />
            <circle cx={0} cy={6} r={24} fill={C.ink900} stroke={col} strokeWidth={8} />
          </g>
        );
      })}
      <circle cx={180} cy={62} r={50} fill="none" stroke={C.text} strokeWidth={10} />
      <circle cx={180} cy={62} r={50} fill="none" stroke={alpha(C.ink950, 0.5)} strokeWidth={3} />
    </svg>
  );
}

/** A plain building (rows of windows), used for the managed buildings and the managed clients. */
export function Block({ w = 110, h = 150, tone = C.cyan, lit = 1, glow = 0 }: { w?: number; h?: number; tone?: string; lit?: number; glow?: number }) {
  const cols = 3;
  const rows = Math.max(2, Math.floor(h / 40));
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 10,
        border: `3px solid ${alpha(tone, 0.55 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.12)} 0%, ${C.ink900} 100%)`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(30 * glow)}px ${alpha(tone, 0.5 * glow)}` : undefined,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 8,
        padding: 12,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ borderRadius: 3, background: alpha(tone, ((i * 7) % 5 === 0 ? 0.15 : 0.5) * lit) }} />
      ))}
    </div>
  );
}
