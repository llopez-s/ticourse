import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export const SERVER = { w: 180, h: 300 } as const;
const UNITS = 6;

/**
 * A nameless server in a rack (s03 and s07 stills, s06's new server): six units with slots and status lights. `on`
 * 0–1 lights them (blinking softly with the frame); `db` adds a database cylinder on the front (s07); `tone` colours
 * the frame. No labels, no names.
 */
export function Server({
  width = SERVER.w,
  on = 1,
  db = false,
  tone = C.cyan,
  frame: frameProp,
}: {
  width?: number;
  on?: number;
  db?: boolean;
  tone?: string;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const s = width / SERVER.w;
  const o = clamp01(on);
  return (
    <svg width={SERVER.w * s} height={SERVER.h * s} viewBox={`0 0 ${SERVER.w} ${SERVER.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={4} y={4} width={SERVER.w - 8} height={SERVER.h - 8} rx={14} fill={C.ink850} stroke={alpha(tone, 0.85)} strokeWidth={4} />
      {Array.from({ length: UNITS }, (_, k) => {
        const y = 22 + k * 44;
        const blink = 0.45 + 0.55 * Math.abs(Math.sin((frame + k * 11) / 9));
        return (
          <g key={k}>
            <rect x={18} y={y} width={SERVER.w - 36} height={34} rx={6} fill={C.ink800} stroke={alpha(tone, 0.35)} strokeWidth={2} />
            <rect x={30} y={y + 13} width={70} height={8} rx={4} fill={alpha(tone, 0.25)} />
            <circle cx={128} cy={y + 17} r={5} fill={alpha(C.emerald, o * blink)} />
            <circle cx={146} cy={y + 17} r={5} fill={alpha(tone, o * (k % 2 ? 0.8 : 0.4))} />
          </g>
        );
      })}
      {db ? (
        <g transform={`translate(${SERVER.w / 2} 150)`}>
          <ellipse cx={0} cy={-34} rx={46} ry={14} fill={C.ink900} stroke={tone} strokeWidth={4} />
          <path d="M -46 -34 L -46 34 A 46 14 0 0 0 46 34 L 46 -34" fill={C.ink900} stroke={tone} strokeWidth={4} />
          <path d="M -46 0 A 46 14 0 0 0 46 0" fill="none" stroke={alpha(tone, 0.7)} strokeWidth={3} />
          <ellipse cx={0} cy={-34} rx={46} ry={14} fill="none" stroke={tone} strokeWidth={4} />
        </g>
      ) : null}
    </svg>
  );
}
