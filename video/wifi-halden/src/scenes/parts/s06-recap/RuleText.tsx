import type { ReactNode } from 'react';
import { C } from '../../../../../engine/src/theme/tokens';
import type { RecapLine } from '../../../data/s06-recap';

/** Exam names on screen (canon: violet). */
export const EXAM_TEXT = '#c4b5fd';

const STYLE = {
  if: { size: 40, weight: 750, color: C.text, spacing: -0.6, height: 1.12, rest: 0.4 },
  then: { size: 56, weight: 850, color: C.textStrong, spacing: -1.2, height: 1.1, rest: 0.4 },
  sub: { size: 32, weight: 700, color: C.text, spacing: -0.2, height: 1.2, rest: 0.3 },
  but: { size: 32, weight: 750, color: '#fcd34d', spacing: -0.2, height: 1.2, rest: 0.3 },
} as const;

/** `text` with its exam names in violet. */
function withExam(text: string, exam: readonly string[] | undefined): ReactNode {
  if (!exam?.length) return text;
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest) {
    let best = -1;
    let term = '';
    for (const e of exam) {
      const i = rest.indexOf(e);
      if (i >= 0 && (best < 0 || i < best)) {
        best = i;
        term = e;
      }
    }
    if (best < 0) break;
    if (best > 0) out.push(rest.slice(0, best));
    out.push(
      <span key={key++} style={{ color: EXAM_TEXT, fontWeight: 850 }}>
        {term}
      </span>,
    );
    rest = rest.slice(best + term.length);
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
      {withExam(line.text, line.exam)}
    </div>
  );
}
