import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';

/**
 * The change committee's approval stamp, in V16's look (s09-camara's PlanStamp, same engine): the canon
 * string in two lines, emerald, inked with a double border and slightly rotated. It lands at `at`
 * (scale 1.35 → 1, a short settle). Not the engine `Stamp`: that one is single-line and uppercases.
 */
export function PlanStamp({ frame, at, lines, rotate = -3 }: { frame: number; at: number; lines: readonly [string, string]; rotate?: number }) {
  if (frame < at) return null;
  const p = progress(frame, at, 10, EASE.out);
  const ink = '#6ee7b7';
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '22px 40px 24px',
        borderRadius: 18,
        border: `5px solid ${C.emerald}`,
        outline: `2px solid ${alpha(C.emerald, 0.55)}`,
        outlineOffset: 7,
        background: alpha(C.ink950, 0.88),
        boxShadow: `0 0 ${Math.round(46 * p)}px ${alpha(C.emerald, 0.28 * p)}`,
        fontFamily: FONT.sans,
        color: ink,
        opacity: p,
        transform: `rotate(${rotate}deg) scale(${1.35 - 0.35 * p})`,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 800, letterSpacing: 0.2 }}>
        <Icon name="check" size={42} color={C.emerald} strokeWidth={3} />
        <span>{lines[0]}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, color: alpha(ink, 0.92) }}>{lines[1]}</div>
    </div>
  );
}
