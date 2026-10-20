import type { ReactNode } from 'react';
import { QuestionTag } from './Tags';

/**
 * Frame for the three question scenes (s03, s05, s07): a still, dim background (children, drawn at full stage size)
 * and V29's label «pregunta tipo examen · ejemplo» (plus «· no es del puerto» when `outside`), centred just under the
 * stage, below the engine's question panel, which only paints «EXAMEN · SY0-701 · 3.1». Nothing here moves.
 */
export function QuestionStill({ children, outside = false }: { children: ReactNode; outside?: boolean }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>{children}</div>
      <QuestionTag outside={outside} />
    </>
  );
}
