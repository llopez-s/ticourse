import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The classroom's own units. */
export const CLASSROOM = { w: 560, h: 300 } as const;

/** Desks, two rows of three (desk centre x, desk top y). The last one is the pupil the list does not have. */
const DESKS: [number, number][] = [
  [250, 120],
  [370, 120],
  [490, 120],
  [250, 220],
  [370, 220],
  [490, 220],
];
const EXTRA = 5;
/** Names on the teacher's list: one per pupil but the extra one. */
const LIST_ROWS = 5;

/**
 * Concept 1's image («imagen · no es del puerto»): the teacher at the left with the list on a clipboard and two rows
 * of desks. `ticks` 0–1 ticks the list's five names (all present: nobody is missing); `look` 0–1 turns the teacher to
 * the desks and lights the one pupil who is not on the list (amber halo). Generic figures, no faces, no names.
 */
export function Classroom({ width = CLASSROOM.w, ticks = 0, look = 0 }: { width?: number; ticks?: number; look?: number }) {
  const t = clamp01(ticks);
  const l = clamp01(look);
  return (
    <svg width={width} height={(width * CLASSROOM.h) / CLASSROOM.w} viewBox={`0 0 ${CLASSROOM.w} ${CLASSROOM.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* the board behind */}
      <rect x={190} y={8} width={360} height={56} rx={8} fill={alpha(C.emeraldDeep, 0.55)} stroke={alpha(C.muted, 0.4)} strokeWidth={4} />
      {/* the teacher */}
      <g>
        <circle cx={70} cy={92} r={26} fill={C.ink600} stroke={alpha(C.cyan, 0.4)} strokeWidth={3} />
        <path d="M 26 230 Q 26 130 70 124 Q 114 130 114 230 Z" fill={C.ink600} stroke={alpha(C.cyan, 0.4)} strokeWidth={3} />
        {/* gaze towards the desks */}
        {l > 0.01 ? <path d={`M 96 92 L 470 ${200 - 40 * (1 - l)} L 470 ${236 + 30 * (1 - l)} Z`} fill={alpha(C.amber, 0.07 * l)} /> : null}
        {/* clipboard */}
        <g transform="translate(92 136)">
          <rect x={0} y={0} width={76} height={104} rx={6} fill={C.ink800} stroke={alpha(C.text, 0.55)} strokeWidth={3} />
          <rect x={24} y={-6} width={28} height={12} rx={3} fill={alpha(C.text, 0.5)} />
          {Array.from({ length: LIST_ROWS }, (_, k) => {
            const on = clamp01(t * LIST_ROWS - k);
            const y = 18 + k * 17;
            return (
              <g key={k}>
                <rect x={30} y={y - 3} width={36} height={6} rx={3} fill={alpha(C.text, 0.35)} />
                <path d={`M 10 ${y} l 5 5 l 9 -10`} fill="none" stroke={C.emerald} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={on} />
              </g>
            );
          })}
        </g>
      </g>
      {/* desks and pupils */}
      {DESKS.map(([x, y], i) => {
        const extra = i === EXTRA;
        const hl = extra ? l : 0;
        const col = extra && hl > 0.5 ? C.amber : C.ink600;
        return (
          <g key={i}>
            {hl > 0.01 ? <circle cx={x} cy={y - 14} r={48} fill={alpha(C.amber, 0.18 * hl)} stroke={alpha(C.amber, 0.7 * hl)} strokeWidth={3} /> : null}
            <circle cx={x} cy={y - 30} r={15} fill={col} stroke={alpha(extra && hl > 0.5 ? C.amber : C.text, 0.4)} strokeWidth={2} />
            <path d={`M ${x - 26} ${y + 4} Q ${x - 26} ${y - 14} ${x} ${y - 16} Q ${x + 26} ${y - 14} ${x + 26} ${y + 4} Z`} fill={col} />
            <rect x={x - 46} y={y} width={92} height={14} rx={4} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
            <rect x={x - 40} y={y + 14} width={8} height={30} fill={C.ink800} />
            <rect x={x + 32} y={y + 14} width={8} height={30} fill={C.ink800} />
          </g>
        );
      })}
    </svg>
  );
}
