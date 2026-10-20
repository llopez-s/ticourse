import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';
import { GuardDot } from './Person';

/** The concert venue seen from above, in its own units. */
export const CV = { w: 900, h: 600 } as const;
const FENCE = { x: 60, y: 40, w: 780, h: 480 } as const;
const STAGE_R = { x: 300, y: 60, w: 300, h: 80 } as const;
/** The entrance with its control (bottom centre) and the back door (right side). */
export const ENTRY = { x: 450, y: FENCE.y + FENCE.h } as const;
export const BACK = { x: FENCE.x + FENCE.w, y: 330 } as const;
/** Where the security staff stand, and the exit each one leaves by. */
const GUARDS: { at: [number, number]; exit: [number, number] }[] = [
  { at: [330, 170], exit: [FENCE.x - 40, 200] },
  { at: [570, 170], exit: [FENCE.x + FENCE.w + 40, 200] },
  { at: [180, 330], exit: [FENCE.x - 40, 330] },
  { at: [720, 300], exit: [FENCE.x + FENCE.w + 40, 300] },
  { at: [300, 440], exit: [ENTRY.x - 30, FENCE.y + FENCE.h + 50] },
  { at: [610, 440], exit: [ENTRY.x + 30, FENCE.y + FENCE.h + 50] },
];
/** The control at the entrance: one more guard, who never moves until `staffGone`. */
const CONTROL_GUARD: [number, number] = [ENTRY.x + 74, ENTRY.y - 34];
/** Doors in the fence: [x, y, vertical?]. The back door is the right-hand one. */
const DOORS: [number, number, boolean][] = [
  [FENCE.x, 330, true],
  [BACK.x, BACK.y, true],
  [FENCE.x, 160, true],
  [FENCE.x + FENCE.w, 160, true],
];
const DOOR_LEN = 60;

/** Deterministic crowd dots. */
const CROWD: [number, number][] = Array.from({ length: 70 }, (_, i) => {
  const c = i % 10;
  const r = Math.floor(i / 10);
  const jx = ((i * 37) % 23) - 11;
  const jy = ((i * 53) % 19) - 9;
  return [200 + c * 56 + jx, 200 + r * 38 + jy];
});

/**
 * The concert («imagen · no es del puerto»): the fenced venue from above, the stage at the back, the crowd as dots, the
 * security staff as emerald dots spread inside, the entrance with its control (an arch and a gate, one guard) and a
 * back door on the right. `sneak` 0–1 brings a rose figure in through the back door along a dashed path while the
 * staff stays; `staffGone` 0–1 walks every guard out and opens every door (amber). `labels` writes «control»,
 * «seguridad» and «puerta de atrás» (30 units).
 */
export function Concert({ width = CV.w, sneak = 0, staffGone = 0, labels = true, backLit = 0 }: { width?: number; sneak?: number; staffGone?: number; labels?: boolean; backLit?: number }) {
  const h = (width * CV.h) / CV.w;
  const sn = clamp01(sneak);
  const sg = clamp01(staffGone);
  const bl = clamp01(Math.max(backLit, sn));
  const path: [number, number][] = [
    [BACK.x + 70, BACK.y + 60],
    [BACK.x + 20, BACK.y],
    [BACK.x - 60, BACK.y - 4],
    [BACK.x - 140, BACK.y + 30],
  ];
  const seg = Math.min(2.999, sn * 3);
  const k = Math.floor(seg);
  const t = seg - k;
  const fig: [number, number] = [mix(path[k][0], path[k + 1][0], t), mix(path[k][1], path[k + 1][1], t)];
  const door = (x: number, y: number, back: boolean) => {
    // The back door opens while the figure slips through and closes behind it.
    const slip = clamp01(Math.min((sn - 0.1) / 0.15, (0.9 - sn) / 0.15));
    const open = back ? Math.max(slip, sg) : sg;
    const ang = 70 * open;
    const tone = open > 0.05 ? C.amber : alpha(C.sky, 0.8);
    return (
      <g key={`${x}-${y}`}>
        <rect x={x - 7} y={y - DOOR_LEN / 2} width={14} height={DOOR_LEN} fill={C.ink950} />
        <line x1={x} y1={y - DOOR_LEN / 2} x2={x} y2={y + DOOR_LEN / 2} stroke={tone} strokeWidth={8} strokeLinecap="round" transform={`rotate(${x < CV.w / 2 ? -ang : ang} ${x} ${y - DOOR_LEN / 2})`} />
        {back && bl > 0.02 ? <circle cx={x} cy={y} r={46} fill="none" stroke={alpha(C.rose, 0.5 * bl)} strokeWidth={4} strokeDasharray="8 7" /> : null}
      </g>
    );
  };
  return (
    <svg width={width} height={h} viewBox={`0 0 ${CV.w} ${CV.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={FENCE.x} y={FENCE.y} width={FENCE.w} height={FENCE.h} rx={36} fill={alpha(C.ink850, 0.95)} stroke={alpha(C.sky, 0.65)} strokeWidth={8} />
      {/* the stage and its lights */}
      <path d={`M ${STAGE_R.x + 40} ${STAGE_R.y + STAGE_R.h} L ${STAGE_R.x - 30} ${STAGE_R.y + 200} L ${STAGE_R.x + STAGE_R.w + 30} ${STAGE_R.y + 200} L ${STAGE_R.x + STAGE_R.w - 40} ${STAGE_R.y + STAGE_R.h} Z`} fill={alpha(C.violet, 0.07)} />
      <rect x={STAGE_R.x} y={STAGE_R.y} width={STAGE_R.w} height={STAGE_R.h} rx={10} fill={C.ink700} stroke={alpha(C.violet, 0.6)} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={STAGE_R.x + 45 + i * 70} cy={STAGE_R.y + 18} r={7} fill={alpha(C.violet, 0.8)} />
      ))}
      {CROWD.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={8} fill={alpha(C.cyan, 0.32)} />
      ))}
      {/* the entrance: a gap in the fence, an arch and a gate */}
      <rect x={ENTRY.x - 70} y={ENTRY.y - 8} width={140} height={16} fill={C.ink950} />
      <rect x={ENTRY.x - 78} y={ENTRY.y - 30} width={16} height={60} rx={4} fill={alpha(C.sky, 0.8)} />
      <rect x={ENTRY.x + 62} y={ENTRY.y - 30} width={16} height={60} rx={4} fill={alpha(C.sky, 0.8)} />
      <line x1={ENTRY.x - 62} y1={ENTRY.y} x2={ENTRY.x - 62 + 124 * (1 - 0.8 * sg)} y2={ENTRY.y + 40 * sg} stroke={sg > 0.05 ? C.amber : C.sky} strokeWidth={8} strokeLinecap="round" />
      <GuardDot x={mix(CONTROL_GUARD[0], ENTRY.x + 60, sg)} y={mix(CONTROL_GUARD[1], ENTRY.y + 70, sg)} tone={C.emerald} opacity={1 - sg} />
      {DOORS.map(([x, y], i) => door(x, y, i === 1))}
      {/* the security staff */}
      {GUARDS.map((g, i) => {
        const p = clamp01(sg * 1.3 - i * 0.05);
        return <GuardDot key={i} x={mix(g.at[0], g.exit[0], p)} y={mix(g.at[1], g.exit[1], p)} tone={C.emerald} opacity={1 - clamp01((p - 0.7) / 0.3)} />;
      })}
      {/* whoever slips in by the back door */}
      {sn > 0.01 ? (
        <g>
          <path d={`M ${path.map((p) => p.join(' ')).join(' L ')}`} fill="none" stroke={alpha(C.rose, 0.6)} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" />
          <circle cx={fig[0]} cy={fig[1]} r={20} fill={alpha(C.rose, 0.2)} />
          <circle cx={fig[0]} cy={fig[1]} r={12} fill={C.rose} />
        </g>
      ) : null}
      {labels ? (
        <g fontFamily={FONT.sans} fontWeight={800} fontSize={32}>
          <text x={ENTRY.x} y={CV.h - 8} textAnchor="middle" fill={alpha('#bae6fd', 0.95)}>
            control
          </text>
          <text x={GUARDS[0].at[0] - 30} y={GUARDS[0].at[1] + 50} textAnchor="end" fill={alpha('#6ee7b7', 0.95 * (1 - sg))}>
            seguridad
          </text>
        </g>
      ) : null}
    </svg>
  );
}
