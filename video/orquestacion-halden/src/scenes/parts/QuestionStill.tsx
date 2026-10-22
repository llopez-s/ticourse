import type { ReactNode } from 'react';
import { QuestionExampleTag } from './Labels';

/** Where the question label sits (stage-local): bottom-right, small. */
export const QUESTION_TAG = { right: 0, top: 606 } as const;

/**
 * Frame for the three question scenes (s03, s05, s07): a still, dim background (children, drawn at full stage size)
 * and the label «pregunta tipo examen · ejemplo», which the engine's panel does not paint. Nothing here moves.
 */
export function QuestionStill({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>{children}</div>
      <div style={{ position: 'absolute', right: QUESTION_TAG.right, top: QUESTION_TAG.top }}>
        <QuestionExampleTag />
      </div>
    </>
  );
}
