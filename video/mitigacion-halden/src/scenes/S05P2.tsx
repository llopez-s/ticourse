import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Laptop } from './parts/Laptop';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const FLOOR_Y = 500;
const STANDS = [60, 470, 880, 1290];
const AWNING = ['#0e7490', '#7c3aed', '#b45309', '#0e7490'];

/** One trade-fair stand: a striped awning, two posts and a counter (x of its left edge). */
function Stand({ x, color }: { x: number; color: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={10} y={150} width={12} height={FLOOR_Y - 150} fill={C.ink700} />
      <rect x={348} y={150} width={12} height={FLOOR_Y - 150} fill={C.ink700} />
      <path d="M 0 150 L 370 150 L 370 110 L 0 110 Z" fill={color} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <path key={k} d={`M ${k * 62} 150 l 31 0 l 0 -40 l -31 0 Z`} fill={alpha('#f8fafc', 0.18)} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <path key={k} d={`M ${k * 53} 150 q 26 26 53 0`} fill={color} />
      ))}
      <rect x={30} y={FLOOR_Y - 110} width={310} height={110} rx={6} fill={C.ink800} stroke={alpha(C.muted, 0.3)} strokeWidth={3} />
      <rect x={60} y={FLOOR_Y - 80} width={140} height={12} rx={6} fill={alpha('#e2e8f0', 0.2)} />
    </g>
  );
}

/**
 * s05-p2 «Tres días en una feria». The engine's ExamQuestionLayer draws question 2 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-2`, the trap on `trap-2`, then the exam card on `coat-back`) over this scene from
 * s05-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame: a nameless
 * trade-fair hall — four stands with striped awnings, bunting overhead — and a laptop open on one counter. Plus
 * «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The coat's line is the voice's only.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill="#0d1830" />
          <rect x={0} y={FLOOR_Y} width={W} height={H - 20 - FLOOR_Y} fill={C.ink850} />
          {/* bunting */}
          <path d={`M 0 60 Q ${W / 2} 110 ${W} 60`} fill="none" stroke={alpha(C.muted, 0.4)} strokeWidth={3} />
          {Array.from({ length: 22 }, (_, k) => {
            const x = 30 + k * 78;
            const t = x / W;
            const y = 60 + 4 * 50 * t * (1 - t);
            return <path key={k} d={`M ${x - 16} ${y} L ${x + 16} ${y} L ${x} ${y + 30} Z`} fill={alpha([C.cyan, C.amber, C.violet][k % 3], 0.55)} />;
          })}
          {STANDS.map((x, i) => (
            <Stand key={x} x={x} color={AWNING[i]} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 1010, top: FLOOR_Y - 110 - 92 }}>
          <Laptop width={130} frame={0} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
