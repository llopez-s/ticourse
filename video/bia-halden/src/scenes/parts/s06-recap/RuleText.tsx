import type { ReactNode } from 'react';
import { C } from '../../../../../engine/src/theme/tokens';
import type { RecapLine } from '../../../data/s06-recap';

/** Exam names on screen (canon: violet). */
export const EXAM_TEXT = '#c4b5fd';

export const RULE_TYPE = { title: 54, sub: 38 } as const;

/** `text` with its exam terms (if any) in violet. */
function withExam(text: string, exam: readonly string[] | undefined): ReactNode {
  if (!exam || exam.length === 0) return text;
  const re = new RegExp(`(${exam.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
  return text.split(re).map((part, k) =>
    exam.includes(part) ? (
      <span key={k} style={{ color: EXAM_TEXT, fontWeight: 850 }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * One line of a rule. A big line is the rule itself (bright); the others are its other halves. `lit` 0–1: the voice
 * has said it (a line waits dimmed until then).
 */
export function RuleLine({ line, first, lit }: { line: RecapLine; first: boolean; lit: number }) {
  const rows = typeof line.text === 'string' ? [line.text] : [...line.text];
  const big = !!line.big;
  return (
    <div
      style={{
        marginTop: first ? 0 : big ? 8 : 6,
        fontSize: big ? RULE_TYPE.title : RULE_TYPE.sub,
        fontWeight: big ? 850 : 720,
        letterSpacing: big ? -1 : -0.2,
        lineHeight: big ? 1.08 : 1.2,
        color: big ? C.textStrong : C.text,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: (big ? 0.45 : 0.28) + (big ? 0.55 : 0.72) * lit,
      }}
    >
      {rows.map((row, k) => (
        <div key={k}>{withExam(row, line.exam)}</div>
      ))}
    </div>
  );
}
