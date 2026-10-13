import type { ReactNode } from 'react';
import { C } from '../../../../../engine/src/theme/tokens';
import type { RecapLine, RecapTone } from '../../../data/s06-recap';

/** This video's colour meanings, soft enough for text (canon: cyan looks, emerald stops, amber costs). */
export const TINT: Record<RecapTone, string> = { cyan: C.cyanSoft, emerald: '#6ee7b7', amber: '#fcd34d' };

const STYLE = {
  if: { size: 40, weight: 750, color: C.text, spacing: -0.6, height: 1.12, rest: 0.4 },
  then: { size: 50, weight: 850, color: C.textStrong, spacing: -1.2, height: 1.1, rest: 0.4 },
  sub: { size: 34, weight: 700, color: C.text, spacing: -0.2, height: 1.2, rest: 0.3 },
} as const;

/** `text` with its tinted pieces coloured. */
function tinted(text: string, tint: RecapLine['tint']): ReactNode {
  if (!tint?.length) return text;
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest) {
    let best = -1;
    let hit: (typeof tint)[number] | undefined;
    for (const t of tint) {
      const i = rest.indexOf(t[0]);
      if (i >= 0 && (best < 0 || i < best)) {
        best = i;
        hit = t;
      }
    }
    if (best < 0 || !hit) break;
    if (best > 0) out.push(rest.slice(0, best));
    out.push(
      <span key={key++} style={{ color: TINT[hit[1]], fontWeight: 850 }}>
        {hit[0]}
      </span>,
    );
    rest = rest.slice(best + hit[0].length);
  }
  if (rest) out.push(rest);
  return out;
}

/**
 * One line of a rule card. `lit` 0–1: the voice has said it (a line waits dimmed until then).
 * `gap` adds room over the line (the first small-print line of a card).
 */
export function RuleLine({ line, lit, gap = 0 }: { line: RecapLine; lit: number; gap?: number }) {
  const s = STYLE[line.kind];
  return (
    <div
      style={{
        marginTop: gap,
        fontSize: s.size,
        fontWeight: s.weight,
        letterSpacing: s.spacing,
        lineHeight: s.height,
        color: s.color,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: s.rest + (1 - s.rest) * lit,
      }}
    >
      {tinted(line.text, line.tint)}
    </div>
  );
}
