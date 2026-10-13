import type { ReactNode } from 'react';
import { C } from '../../../../../engine/src/theme/tokens';
import type { RecapLine } from '../../../data/s06-recap';

/** Exam names on screen (canon: violet). */
export const EXAM_TEXT = '#c4b5fd';

export const RULE_TYPE = { title: 54, sub: 38, note: 26 } as const;

/** `text` with its exam name (if any) in violet. */
function withExam(text: string, exam: string | undefined): ReactNode {
  if (!exam) return text;
  const i = text.indexOf(exam);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: EXAM_TEXT, fontWeight: 850 }}>{exam}</span>
      {text.slice(i + exam.length)}
    </>
  );
}

/**
 * One line of a rule. The first line of a card is the rule itself (big, bright); the others are
 * its other halves. `lit` 0–1: the voice has said it (a line waits dimmed until then).
 */
export function RuleLine({ line, first, lit }: { line: RecapLine; first: boolean; lit: number }) {
  const rows = typeof line.text === 'string' ? [line.text] : [...line.text];
  return (
    <div
      style={{
        marginTop: first ? 0 : 6,
        fontSize: first ? RULE_TYPE.title : RULE_TYPE.sub,
        fontWeight: first ? 850 : 720,
        letterSpacing: first ? -1 : -0.2,
        lineHeight: first ? 1.08 : 1.2,
        color: first ? C.textStrong : C.text,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: (first ? 0.45 : 0.28) + (first ? 0.55 : 0.72) * lit,
      }}
    >
      {rows.map((row, k) => (
        <div key={k}>{withExam(row, line.exam)}</div>
      ))}
    </div>
  );
}

/**
 * The card's small print (the voice does not say it): wrapped, left-aligned, with the exam
 * acronyms in violet and its opening words a little brighter.
 */
export function RuleNote({ text, show }: { text: string; show: number }) {
  const colon = text.indexOf(':');
  const lead = colon > 0 ? text.slice(0, colon + 1) : '';
  const rest = colon > 0 ? text.slice(colon + 1) : text;
  return (
    <div style={{ opacity: show, paddingTop: 12 }}>
      <div style={{ fontSize: RULE_TYPE.note, fontWeight: 600, lineHeight: 1.22, color: '#cbd5e1', textAlign: 'left', whiteSpace: 'normal' }}>
        {lead ? <span style={{ color: C.textStrong, fontWeight: 750 }}>{lead}</span> : null}
        {rest.split(' ').map((w, k) => {
          const m = /^([A-Z]{2,})(\W*)$/.exec(w);
          return (
            <span key={k}>
              {k ? ' ' : ''}
              {m ? (
                <>
                  <span style={{ color: EXAM_TEXT, fontWeight: 800 }}>{m[1]}</span>
                  {m[2]}
                </>
              ) : (
                w
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
