import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../engine/src/ui';

/**
 * The two answers of a think prompt, drawn as two EQUAL pills side by side (same width, colours and weight) until the
 * answer lands. show[i] is each pill's arrival; reveal (0-1) lights the winner (a check) and steps the other back.
 * s09: «Sí, todo» / «No, casi nada» (winner 1).  s10: «Sí» / «No basta» (winner 1).
 * Not positioned; PILL_W is the pill width so a scene can centre the row.
 */
export const PILL_W = 350;
export const PILL_H = 72;
export const PILL_GAP = 28;
export const PILLS_W = 2 * PILL_W + PILL_GAP;

function AnswerPill({ label, show, win, lose }: { label: string; show: number; win: number; lose: number }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: PILL_W,
        height: PILL_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderRadius: RADIUS.pill,
        border: `3px solid ${win > 0.01 ? alpha(C.cyan, mix(0.6, 1, win)) : alpha(C.cyan, 0.6)}`,
        background: win > 0.01 ? alpha(C.cyan, mix(0.1, 0.22, win)) : alpha(C.ink800, 0.95),
        boxShadow: win > 0.05 ? `0 0 ${Math.round(30 * win)}px ${alpha(C.cyan, 0.4 * win)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 36,
        fontWeight: 800,
        color: lose > 0.5 ? C.muted : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s * (1 - 0.55 * clamp01(lose)),
        transform: `translateY(${(1 - s) * 18}px)`,
      }}
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {label}
        <span
          style={{
            position: 'absolute',
            left: -6,
            top: '54%',
            height: 5,
            width: `calc(${clamp01(lose * 1.3) * 100}% + ${12 * clamp01(lose * 1.3)}px)`,
            borderRadius: 3,
            background: C.muted,
          }}
        />
      </span>
      {win > 0.05 ? (
        <span style={{ display: 'inline-flex', opacity: win, transform: `scale(${0.6 + 0.4 * win})` }}>
          <Icon name="check" size={40} color={C.cyanSoft} strokeWidth={3} />
        </span>
      ) : null}
    </div>
  );
}

export function Answers({
  labels,
  show = [1, 1],
  reveal = 0,
  winner = 1,
  vertical = false,
}: {
  labels: readonly [string, string];
  show?: readonly [number, number];
  reveal?: number;
  winner?: 0 | 1;
  /** Stack the pills (s10 has room for a column only). */
  vertical?: boolean;
}) {
  const r = clamp01(reveal);
  return (
    <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 14 : PILL_GAP }}>
      <AnswerPill label={labels[0]} show={show[0]} win={winner === 0 ? r : 0} lose={winner === 1 ? r : 0} />
      <AnswerPill label={labels[1]} show={show[1]} win={winner === 1 ? r : 0} lose={winner === 0 ? r : 0} />
    </div>
  );
}
