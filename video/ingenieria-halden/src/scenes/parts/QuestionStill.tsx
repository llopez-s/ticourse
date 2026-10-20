import type { ReactNode } from 'react';
import { C } from '../../../../engine/src/theme/tokens';
import { QuestionTag } from './Tags';

/**
 * Frame for the four question scenes (s04, s06, s09, s11): a still, dim, textless background (children, drawn at full
 * stage size, 1728×660) and V29's label «pregunta tipo examen · ejemplo», which the engine's panel does not paint,
 * centred under the stage. Nothing here moves: the engine's panel covers the stage from the question to the end.
 */
export function QuestionStill({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={1728} height={620} rx={18} fill={C.ink850} />
        </svg>
        {children}
      </div>
      <QuestionTag />
    </>
  );
}
