import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

const CH = { w: 120, h: 96 } as const;

/**
 * A chest of drawers in a flat (furniture, not a filing cabinet: no lock, no reader), left edge `x`, standing on
 * `y`. `open` 0–1 slides the top drawer out and lifts the previous tenant's papers (amber) out of it.
 */
export function DrawerChest({ x, y, open = 0, s = 1 }: { x: number; y: number; open?: number; s?: number }) {
  const o = clamp01(open);
  const w = CH.w * s;
  const h = CH.h * s;
  const top = y - h;
  const dh = h / 3;
  const slide = 34 * s * o;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={6 * s} fill="#3a2a1d" stroke="#8a6440" strokeWidth={3} />
      {[1, 2].map((k) => (
        <g key={k}>
          <rect x={x + 6 * s} y={top + k * dh + 4 * s} width={w - 12 * s} height={dh - 8 * s} rx={4 * s} fill="#4a3424" stroke="#7a5638" strokeWidth={2} />
          <rect x={x + w / 2 - 12 * s} y={top + k * dh + dh / 2 - 3 * s} width={24 * s} height={6 * s} rx={3 * s} fill="#d6a35c" />
        </g>
      ))}
      {/* the top drawer, sliding out to the left */}
      <g transform={`translate(${-slide} 0)`}>
        {o > 0.05
          ? [0, 1, 2].map((k) => {
              const px = x + 22 * s + k * 18 * s;
              const py = top - 40 * s * o - k * 6 * s;
              return (
                <g key={k} transform={`rotate(${(k - 1) * 9} ${px + 23 * s} ${py + 58 * s})`} opacity={Math.min(1, o * 1.6)}>
                  <rect x={px} y={py} width={46 * s} height={58 * s} rx={3 * s} fill={alpha('#fef3c7', 0.9)} stroke={C.amber} strokeWidth={2.5} />
                  <rect x={px + 8 * s} y={py + 14 * s} width={30 * s} height={5 * s} rx={2.5 * s} fill={alpha(C.amberDeep, 0.8)} />
                  <rect x={px + 8 * s} y={py + 26 * s} width={22 * s} height={5 * s} rx={2.5 * s} fill={alpha(C.amberDeep, 0.8)} />
                </g>
              );
            })
          : null}
        <rect x={x + 6 * s} y={top + 4 * s} width={w - 12 * s} height={dh - 8 * s} rx={4 * s} fill="#5a4030" stroke={o > 0.05 ? C.amber : '#7a5638'} strokeWidth={2.5} />
        <rect x={x + w / 2 - 12 * s} y={top + dh / 2 - 3 * s} width={24 * s} height={6 * s} rx={3 * s} fill="#d6a35c" />
      </g>
    </g>
  );
}

/** The drawer as a standalone icon (s08 rule-1), `size` px wide, open with its papers. */
export function DrawerIcon({ size, open = 1 }: { size: number; open?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="-30 -70 190 170" style={{ display: 'block', overflow: 'visible' }}>
      <DrawerChest x={10} y={96} open={open} />
    </svg>
  );
}
