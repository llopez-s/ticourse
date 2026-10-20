import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

/**
 * s06-p2 «Cambio de banco». Exam question 2 is the ENGINE's (from s06-01 to the end; answer on `ok-2`, trap on
 * `trap-2`; the exam card on `sister-back` draws in the top band). Outside the port: a company and a supplier with no
 * name. The scene is a still, dim, textless background: a generic invoice whose lines are bars, plus the label
 * «pregunta tipo examen · ejemplo». The sister's line (`sister-back`) is the voice's only.
 */
export function S06P2(_props: SceneProps) {
  const X = 594;
  const Y = 50;
  return (
    <Stage>
      <QuestionStill>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={X + 24} y={Y + 18} width={540} height={560} rx={14} fill={C.ink950} opacity={0.6} />
          <rect x={X} y={Y} width={540} height={560} rx={14} fill={C.ink800} stroke={alpha(C.cyan, 0.4)} strokeWidth={4} />
          <rect x={X + 40} y={Y + 40} width={180} height={26} rx={6} fill={alpha(C.cyan, 0.5)} />
          <rect x={X + 360} y={Y + 40} width={140} height={60} rx={10} fill="none" stroke={alpha(C.cyan, 0.4)} strokeWidth={3} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={X + 40} y={Y + 150 + i * 52} width={280 - (i % 2) * 60} height={14} rx={7} fill={alpha(C.text, 0.35)} />
              <rect x={X + 400} y={Y + 150 + i * 52} width={100} height={14} rx={7} fill={alpha(C.text, 0.35)} />
            </g>
          ))}
          <line x1={X + 40} x2={X + 500} y1={Y + 420} y2={Y + 420} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
          <rect x={X + 300} y={Y + 446} width={200} height={22} rx={8} fill={alpha(C.text, 0.5)} />
          <rect x={X + 40} y={Y + 496} width={300} height={36} rx={8} fill="none" stroke={alpha(C.amber, 0.6)} strokeWidth={3} strokeDasharray="8 6" />
        </svg>
      </QuestionStill>
    </Stage>
  );
}
