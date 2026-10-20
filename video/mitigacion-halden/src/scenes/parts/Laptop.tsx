import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export const LAPTOP = { w: 200, h: 140 } as const;
/** The shield ring's centre and radius, in the laptop's units. */
export const RING = { cx: 100, cy: 72, r: 122 } as const;

/**
 * The laptop that leaves the office (s04): screen, bezel and keyboard base, cyan. `glitch` 0–1 makes the screen flicker
 * in rose and cyan slices (the neighbours reaching it); `shield` 0–1 draws an emerald ring round it that closes like a
 * clasp (the host-based firewall: the lock sound lands when it closes), `snap` 0–1 is the brief flash when it does.
 */
export function Laptop({
  width = LAPTOP.w,
  glitch = 0,
  shield = 0,
  snap = 0,
  dim = 0,
  frame: frameProp,
}: {
  width?: number;
  glitch?: number;
  shield?: number;
  snap?: number;
  dim?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const s = width / LAPTOP.w;
  const g = clamp01(glitch);
  const sh = clamp01(shield);
  const sn = clamp01(snap);
  const circ = 2 * Math.PI * RING.r;
  const jitter = g > 0.02 ? Math.sin(frame * 2.7) * 5 * g : 0;
  return (
    <svg width={LAPTOP.w * s} height={LAPTOP.h * s} viewBox={`0 0 ${LAPTOP.w} ${LAPTOP.h}`} style={{ display: 'block', overflow: 'visible', opacity: 1 - 0.55 * clamp01(dim) }}>
      {sh > 0.01 ? (
        <g>
          <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill={alpha(C.emerald, 0.06 * sh + 0.1 * sn)} />
          <circle
            cx={RING.cx}
            cy={RING.cy}
            r={RING.r}
            fill="none"
            stroke={C.emerald}
            strokeWidth={6 + 4 * sn}
            strokeDasharray={`${circ * sh} ${circ}`}
            transform={`rotate(-90 ${RING.cx} ${RING.cy})`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 ${8 + 14 * sn}px ${alpha(C.emerald, 0.6)})` }}
          />
        </g>
      ) : null}
      {/* screen */}
      <rect x={22} y={4} width={156} height={100} rx={10} fill={C.ink900} stroke={C.cyan} strokeWidth={4} />
      <rect x={32} y={14} width={136} height={80} rx={4} fill={alpha(C.cyan, 0.12)} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={44} y={28 + k * 20} width={[90, 70, 104][k]} height={8} rx={4} fill={alpha(C.cyan, 0.45)} />
      ))}
      {g > 0.02
        ? [0, 1, 2, 3].map((k) => {
            const y = 16 + ((frame * 7 + k * 23) % 72);
            return (
              <rect key={k} x={32 + (k % 2 ? jitter : -jitter)} y={y} width={136} height={6 + (k % 3) * 3} fill={alpha(k % 2 ? C.rose : C.cyanSoft, 0.55 * g)} />
            );
          })
        : null}
      {/* base */}
      <path d="M 6 112 L 194 112 L 182 132 L 18 132 Z" fill={C.ink800} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
      <rect x={84} y={116} width={32} height={6} rx={3} fill={alpha(C.cyan, 0.5)} />
    </svg>
  );
}
