import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { OUTSIDE, PLACES } from '../../../data/s04-fuera';
import { Arrow } from '../Arrow';
import { Pill } from '../Labels';

/** Stage-local geometry of the network outside (shared with the scene). */
export const OUT = { x: 800, y: 70, w: 928, h: 310 } as const;
/** The laptop's resting centre outside, and its ring radius at the scene's laptop width. */
export const SPOT = { x: 1262, y: 236 } as const;
export const NEIGHBOURS: [number, number][] = [
  [880, 250],
  [1648, 150],
  [1640, 318],
];

/**
 * The network outside the office (s04): a dashed sky box «red de fuera», the three places as pills (each lit on its
 * word: `placeOn[i]`), and the neighbours — three devices in rose rings. Their dashed rose arrows reach for the
 * laptop (`reach` 0–1) and, once the laptop's ring has closed (`stop` 0–1), pull back to the ring's edge and turn
 * grey with a small cross: blocked.
 */
export function Outside({
  show,
  placeOn,
  reach,
  stop,
  ringR,
}: {
  show: number;
  placeOn: number[];
  reach: number;
  stop: number;
  ringR: number;
}) {
  const s = clamp01(show);
  const st = clamp01(stop);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 420, opacity: s }}>
      <svg width={1728} height={420} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={OUT.x} y={OUT.y} width={OUT.w} height={OUT.h} rx={28} fill={alpha(C.sky, 0.04)} stroke={alpha(C.sky, 0.55)} strokeWidth={3} strokeDasharray="14 12" />
        {NEIGHBOURS.map(([nx, ny], k) => {
          const dx = SPOT.x - nx;
          const dy = SPOT.y - ny;
          const d = Math.hypot(dx, dy);
          const ux = dx / d;
          const uy = dy / d;
          const from: [number, number] = [nx + ux * 44, ny + uy * 44];
          const deep: [number, number] = [SPOT.x - ux * 62, SPOT.y - uy * 62];
          const edge: [number, number] = [SPOT.x - ux * (ringR + 14), SPOT.y - uy * (ringR + 14)];
          const to: [number, number] = [deep[0] + (edge[0] - deep[0]) * st, deep[1] + (edge[1] - deep[1]) * st];
          const col = st > 0.5 ? alpha(C.muted, 0.8) : C.rose;
          return (
            <g key={k}>
              <Arrow points={[from, to]} draw={clamp01(reach * 1.2 - k * 0.1)} color={col} width={4} dashed />
              {st > 0.6 ? (
                <g transform={`translate(${edge[0] - ux * 18} ${edge[1] - uy * 18})`} opacity={(st - 0.6) / 0.4}>
                  <path d="M -9 -9 L 9 9 M 9 -9 L -9 9" stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {NEIGHBOURS.map(([nx, ny], k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: nx - 40,
            top: ny - 40,
            width: 80,
            height: 80,
            borderRadius: 40,
            border: `3px solid ${alpha(st > 0.5 ? C.muted : C.rose, 0.4 + 0.5 * clamp01(reach))}`,
            background: alpha(C.ink850, 0.9),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={k === 1 ? 'desktop' : 'laptop'} size={46} color={st > 0.5 ? C.muted : C.roseSoft} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: OUT.x + 22, top: OUT.y + 18, display: 'flex', gap: 12 }}>
        {PLACES.map((p, i) => (
          <div key={p.text} style={{ opacity: clamp01(placeOn[i] * 3), transform: `translateY(${(1 - clamp01(placeOn[i] * 3)) * 10}px)` }}>
            <Pill text={p.text} tone={C.sky} size={28} height={46} on={placeOn[i]} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: OUT.x + 24, top: OUT.y + OUT.h - 50, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.sky }}>{OUTSIDE}</div>
    </div>
  );
}
