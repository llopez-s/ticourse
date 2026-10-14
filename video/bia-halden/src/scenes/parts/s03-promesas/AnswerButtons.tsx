import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { ANSWERS } from '../../../data/s03-promesas';

/**
 * The think prompt's two answers, drawn as two EQUAL pills side by side (same width, same colours, same weight) until
 * the answer lands. `show` is the arrival weight; `reveal` (0–1) is the answer: «Más a menudo» lights up with a check
 * and «Basta una al día» steps back with a strike. Nothing positions itself.
 */
export const BTN_W = 350;
export const BTN_H = 72;
export const BTN_GAP = 28;
export const BUTTONS_W = 2 * BTN_W + BTN_GAP;

function Pill({ label, show, win, lose }: { label: string; show: number; win: number; lose: number }) {
  const s = clamp01(show);
  const base = win > 0.01 ? C.cyan : C.ink500;
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: BTN_W,
        height: BTN_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderRadius: RADIUS.pill,
        border: `3px solid ${win > 0.01 ? alpha(base, mix(0.6, 1, win)) : alpha(C.cyan, 0.6)}`,
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

export function AnswerButtons({ show = [1, 1], reveal = 0 }: { show?: readonly [number, number]; reveal?: number }) {
  const r = clamp01(reveal);
  return (
    <div style={{ display: 'flex', gap: BTN_GAP }}>
      <Pill label={ANSWERS.once} show={show[0]} win={0} lose={r} />
      <Pill label={ANSWERS.often} show={show[1]} win={r} lose={0} />
    </div>
  );
}
