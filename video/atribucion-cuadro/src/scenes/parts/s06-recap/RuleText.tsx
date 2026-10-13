import type { CSSProperties } from 'react';
import { C } from '../../../../../engine/src/theme/tokens';
import type { RecapLine, RecapTone } from '../../../data/s06-recap';

/** Type of each kind of line: the title is what the voice is on (focus size); the rest stays ≥ 32 px. */
const KIND = {
  title: { size: 54, weight: 850, color: C.textStrong, spacing: -1.2, height: 1.12, rest: 0.45 },
  rest: { size: 38, weight: 700, color: C.text, spacing: -0.3, height: 1.24, rest: 0.35 },
  ask: { size: 38, weight: 850, color: '#fcd34d', spacing: -0.3, height: 1.24, rest: 0.35 },
} as const;

/** This video's colours for a span (see the brief, «Colour meanings»). */
const TONE: Record<RecapTone, CSSProperties> = {
  strong: {},
  soft: { color: C.text, fontWeight: 750 },
  cyan: { color: C.cyanSoft },
  amber: { color: '#fcd34d' },
  emerald: { color: '#6ee7b7' },
  exam: { color: '#c4b5fd' },
  // A parenthesis: quieter, never under 32 px.
  aside: { color: C.muted, fontWeight: 600, fontSize: 33 },
};

/**
 * One line of a rule card, on a single row (the cards are wide: nothing wraps). `lit` 0–1: the voice has
 * reached it — until then the line waits dimmed, so the whole rule is on screen from the moment its card lights.
 * `gap` adds room over the line.
 */
export function RuleLine({ line, lit, gap = 0 }: { line: RecapLine; lit: number; gap?: number }) {
  const k = KIND[line.kind];
  return (
    <div
      style={{
        marginTop: gap,
        fontSize: k.size,
        fontWeight: k.weight,
        letterSpacing: k.spacing,
        lineHeight: k.height,
        color: k.color,
        whiteSpace: 'nowrap',
        opacity: k.rest + (1 - k.rest) * lit,
      }}
    >
      {line.spans.map((s, i) => (
        <span key={i} style={{ whiteSpace: 'pre', ...(s.tone ? TONE[s.tone] : null) }}>
          {s.text}
        </span>
      ))}
    </div>
  );
}
