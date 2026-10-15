import { C, FONT } from '../../../../../engine/src/theme/tokens';
import { progress } from '../../../../../engine/src/theme/motion';
import { ALE_PARTS } from '../../../data/s03-ano';

const TERMS = new Set(['ALE', 'SLE', 'ARO']);

/**
 * «ALE = SLE × ARO = 100.000 × 0,5 = 50.000 € al año», one line. Every piece keeps its place (opacity only), so
 * nothing shifts when the next one arrives: the symbols at `headAt`, the numbers at `numsAt`, the result at `resAt`.
 */
export function Formula({ frame, headAt, numsAt, resAt, size = 52 }: { frame: number; headAt: number; numsAt: number; resAt: number; size?: number }) {
  const piece = (text: string, at: number, key: string, kind: 'term' | 'op' | 'num' | 'res', glow = 0) => {
    const p = progress(frame, at, 12);
    const color = kind === 'term' ? C.violet : kind === 'op' ? C.muted : kind === 'res' ? C.cyanSoft : C.textStrong;
    return (
      <span
        key={key}
        style={{
          color,
          opacity: p,
          transform: `translateY(${(1 - p) * 10}px)`,
          display: 'inline-block',
          textShadow: glow > 0.02 ? `0 0 ${Math.round(24 * glow)}px rgba(34,211,238,${0.55 * glow})` : undefined,
        }}
      >
        {text}
      </span>
    );
  };
  const resGlow = progress(frame, resAt, 18);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: size * 0.3,
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      {ALE_PARTS.head.map((t, i) => piece(t, headAt + i * 3, `h${i}`, TERMS.has(t) ? 'term' : 'op'))}
      {ALE_PARTS.numbers.map((t, i) => piece(t, numsAt + i * 3, `n${i}`, i % 2 === 0 ? 'op' : 'num'))}
      {ALE_PARTS.result.map((t, i) => piece(t, resAt + i * 4, `r${i}`, i === 0 ? 'op' : 'res', i === 1 ? resGlow : 0))}
    </div>
  );
}
