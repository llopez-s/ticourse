import type { ReactNode } from 'react';
import { QuestionTag } from './Tags';

/**
 * Frame for the three question scenes (s03, s05, s07): a still, dim background (children, drawn at full stage size)
 * and V29's label «pregunta tipo examen · ejemplo», centred under the stage, below the engine's panel (which only
 * paints «EXAMEN · SY0-701 · 4.2»). Nothing here moves.
 */
export function QuestionStill({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>{children}</div>
      <QuestionTag />
    </>
  );
}
