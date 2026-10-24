import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A sea of data: a body of water from `surface` down to `bottom` (stage px) across `width`, its surface two
 * slow waves (one cycle per ~9 s: nothing flickers). `rise` 0–1 raises the water from the bottom edge.
 */
export function Sea({ width, surface, bottom, frame, rise = 1 }: { width: number; surface: number; bottom: number; frame: number; rise?: number }) {
  const top = bottom - (bottom - surface) * rise;
  const wave = (amp: number, len: number, speed: number, phase: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= width; x += 24) {
      const y = top + amp * Math.sin((x / len) * 2 * Math.PI + frame * speed + phase);
      pts.push(`${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const a = wave(7, 340, 0.025, 0);
  const b = wave(5, 220, -0.02, 1.7);
  return (
    <svg width={width} height={bottom + 20} viewBox={`0 0 ${width} ${bottom + 20}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise > 0.02 ? 1 : 0 }}>
      <defs>
        <linearGradient id="sea-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={alpha(C.cyan, 0.2)} />
          <stop offset="1" stopColor={alpha(C.cyanDeep, 0.1)} />
        </linearGradient>
      </defs>
      <path d={`${a} L ${width} ${bottom} L 0 ${bottom} Z`} fill="url(#sea-fill)" />
      <path d={a} fill="none" stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={4} strokeLinecap="round" />
      <path d={b} fill="none" stroke={alpha(C.cyan, 0.35)} strokeWidth={3} strokeLinecap="round" transform="translate(0 14)" />
    </svg>
  );
}
