import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The suitcase image's own units. */
export const SUITCASE = { w: 460, h: 320 } as const;
/** Where a connector meets the name tag and the «frágil» sticker (own units). */
export const SUITCASE_TAG = { x: 52, y: 128 } as const;
export const SUITCASE_STICKER = { x: 300, y: 150 } as const;

/**
 * Concept 2's image («imagen · no es del puerto»): a suitcase on the airport belt. The name tag hanging from the
 * handle says whose it is (= owner; the name is grey bars, never legible) and the «frágil» sticker says how to handle
 * it (= classification). `tag` and `sticker` (0–1) show each piece on its own; `tagGlow` / `stickerGlow` light them
 * while the voice is on them; `roll` (frames) turns the belt's rollers. No airline, no person.
 */
export function Suitcase({
  width = SUITCASE.w,
  tag = 1,
  sticker = 1,
  tagGlow = 0,
  stickerGlow = 0,
  roll = 0,
}: {
  width?: number;
  tag?: number;
  sticker?: number;
  tagGlow?: number;
  stickerGlow?: number;
  roll?: number;
}) {
  const tg = clamp01(tagGlow);
  const sg = clamp01(stickerGlow);
  const st = clamp01(sticker);
  return (
    <svg width={width} height={(width * SUITCASE.h) / SUITCASE.w} viewBox={`0 0 ${SUITCASE.w} ${SUITCASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* the belt */}
      <rect x={0} y={262} width={SUITCASE.w} height={26} rx={13} fill={C.ink700} stroke={alpha(C.muted, 0.4)} strokeWidth={2} />
      {Array.from({ length: 9 }, (_, k) => {
        const x = 26 + k * 51 + ((roll * 1.5) % 51);
        return x < SUITCASE.w - 14 ? <circle key={k} cx={x} cy={275} r={7} fill={alpha(C.muted, 0.45)} /> : null;
      })}
      <rect x={20} y={288} width={14} height={30} fill={C.ink800} />
      <rect x={SUITCASE.w - 34} y={288} width={14} height={30} fill={C.ink800} />
      {/* the handle */}
      <path d="M 196 92 L 196 62 Q 196 52 206 52 L 254 52 Q 264 52 264 62 L 264 92" fill="none" stroke={alpha(C.text, 0.6)} strokeWidth={8} strokeLinecap="round" />
      {/* the suitcase */}
      <rect x={110} y={88} width={240} height={174} rx={22} fill={C.ink600} stroke={alpha(C.cyan, 0.55)} strokeWidth={4} />
      {[160, 230, 300].map((x) => (
        <line key={x} x1={x} y1={100} x2={x} y2={250} stroke={alpha(C.ink950, 0.45)} strokeWidth={5} />
      ))}
      {/* the name tag */}
      {tag > 0.01 ? (
        <g opacity={clamp01(tag)}>
          <path d={`M 206 70 Q 150 76 ${SUITCASE_TAG.x + 20} ${SUITCASE_TAG.y}`} fill="none" stroke={alpha(C.text, 0.6)} strokeWidth={3} />
          {tg > 0.01 ? <rect x={-4} y={SUITCASE_TAG.y - 8} width={122} height={88} rx={16} fill={alpha(C.cyan, 0.2 * tg)} /> : null}
          <rect x={4} y={SUITCASE_TAG.y} width={106} height={72} rx={10} fill={C.ink900} stroke={tg > 0.5 ? C.cyan : alpha(C.text, 0.6)} strokeWidth={4} />
          <circle cx={SUITCASE_TAG.x + 20} cy={SUITCASE_TAG.y + 12} r={5} fill={alpha(C.text, 0.6)} />
          <rect x={18} y={SUITCASE_TAG.y + 30} width={76} height={10} rx={5} fill={alpha(C.cyanSoft, 0.75)} />
          <rect x={18} y={SUITCASE_TAG.y + 50} width={54} height={10} rx={5} fill={alpha(C.text, 0.35)} />
        </g>
      ) : null}
      {/* the «frágil» sticker */}
      {st > 0.01 ? (
        <g opacity={st} transform={`rotate(-8 ${SUITCASE_STICKER.x} ${SUITCASE_STICKER.y + 26})`}>
          {sg > 0.01 ? <rect x={SUITCASE_STICKER.x - 84} y={SUITCASE_STICKER.y - 8} width={168} height={72} rx={14} fill={alpha(C.amber, 0.25 * sg)} /> : null}
          <rect x={SUITCASE_STICKER.x - 74} y={SUITCASE_STICKER.y} width={148} height={56} rx={8} fill={C.amber} stroke={sg > 0.5 ? '#ffffff' : C.amberDeep} strokeWidth={3} />
          <text
            x={SUITCASE_STICKER.x}
            y={SUITCASE_STICKER.y + 39}
            textAnchor="middle"
            fontFamily={FONT.sans}
            fontSize={34}
            fontWeight={900}
            fill={C.ink950}
          >
            frágil
          </text>
        </g>
      ) : null}
    </svg>
  );
}
