import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** The clock's own units (it scales to `width`). */
export const CLOCK = { w: 220, h: 300 } as const;

/**
 * The time clock at an entrance: a wall plate with a small screen (texture lines, no text, no brand) and a card
 * reader. `swipe` 0–1 moves a card across the reader; `beep` 0–1 lights the reader's LED emerald. `dim` 0–1 fades it.
 */
export function TimeClock({ width = CLOCK.w, swipe = 0, beep = 0, idSuffix = '' }: { width?: number; swipe?: number; beep?: number; idSuffix?: string }) {
  const h = (width * CLOCK.h) / CLOCK.w;
  const s = clamp01(swipe);
  const b = clamp01(beep);
  // The card slides in from the right, over the reader, and out to the left.
  const cardX = mix(250, -40, s);
  const cardOn = s > 0.001 && s < 0.999 ? 1 : 0;
  const glowId = `clock-glow${idSuffix}`;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${CLOCK.w} ${CLOCK.h}`} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={C.emerald} stopOpacity={0.7} />
          <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* wall plate */}
      <rect x={10} y={8} width={200} height={284} rx={26} fill={C.ink850} stroke={alpha(C.cyan, 0.65)} strokeWidth={3} />
      {/* screen */}
      <rect x={34} y={34} width={152} height={84} rx={10} fill={C.ink950} stroke={C.ink600} strokeWidth={2} />
      <rect x={50} y={54} width={70} height={10} rx={5} fill={alpha(C.cyan, 0.55)} />
      <rect x={50} y={74} width={110} height={8} rx={4} fill={alpha(C.cyan, 0.25)} />
      <rect x={50} y={92} width={86} height={8} rx={4} fill={alpha(C.cyan, 0.25)} />
      {/* reader: concentric arcs */}
      <circle cx={110} cy={196} r={48} fill={alpha(C.cyan, 0.06)} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} />
      {[16, 28, 40].map((r) => (
        <path key={r} d={`M ${110 - r * 0.7} ${196 - r * 0.7} A ${r} ${r} 0 0 1 ${110 + r * 0.7} ${196 - r * 0.7}`} fill="none" stroke={alpha(C.cyan, 0.6)} strokeWidth={3} strokeLinecap="round" />
      ))}
      <circle cx={110} cy={206} r={6} fill={alpha(C.cyan, 0.8)} />
      {/* LED */}
      {b > 0.01 ? <circle cx={110} cy={268} r={26 * b} fill={`url(#${glowId})`} /> : null}
      <circle cx={110} cy={268} r={8} fill={b > 0.01 ? C.emerald : C.ink600} opacity={0.4 + 0.6 * b} />
      {/* the card */}
      {cardOn ? (
        <g opacity={cardOn}>
          <rect x={cardX - 60} y={160} width={120} height={76} rx={10} fill={C.ink800} stroke={C.cyanSoft} strokeWidth={3} />
          <rect x={cardX - 46} y={176} width={30} height={30} rx={6} fill={alpha(C.cyan, 0.4)} />
          <rect x={cardX - 6} y={182} width={52} height={8} rx={4} fill={alpha(C.text, 0.5)} />
          <rect x={cardX - 6} y={200} width={38} height={8} rx={4} fill={alpha(C.text, 0.35)} />
        </g>
      ) : null}
    </svg>
  );
}
