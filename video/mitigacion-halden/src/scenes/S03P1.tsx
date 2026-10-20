import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Server } from './parts/Server';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const FLOOR_Y = 520;

/** A plain office desk with a dark monitor (x of its left edge). */
function Desk({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={FLOOR_Y - 120} width={320} height={18} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
      <rect x={20} y={FLOOR_Y - 102} width={14} height={102} fill={C.ink800} />
      <rect x={286} y={FLOOR_Y - 102} width={14} height={102} fill={C.ink800} />
      <rect x={90} y={FLOOR_Y - 250} width={180} height={116} rx={10} fill={C.ink900} stroke={alpha(C.text, 0.3)} strokeWidth={4} />
      <rect x={170} y={FLOOR_Y - 134} width={20} height={14} fill={C.ink700} />
    </g>
  );
}

/**
 * s03-p1 «La intranet de una empresa». The engine's ExamQuestionLayer draws question 1 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`, then the exam card on `sensor`) over this scene from
 * s03-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame: a nameless
 * office with two desks and, at the back, a server rack (the intranet's) — plus «pregunta tipo examen · ejemplo · no es
 * del puerto» under the stage. The «impedido»/«MEJOR» lines and the moisture sensor's line are the voice's only.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <rect x={0} y={FLOOR_Y} width={W} height={H - 20 - FLOOR_Y} fill={C.ink850} />
          {/* a window with blinds at the back */}
          <rect x={120} y={80} width={420} height={220} rx={8} fill="#13233f" stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <line key={k} x1={124} y1={108 + k * 32} x2={536} y2={108 + k * 32} stroke={alpha(C.sky, 0.18)} strokeWidth={4} />
          ))}
          <Desk x={90} />
          <Desk x={520} />
        </svg>
        <div style={{ position: 'absolute', left: 1180, top: 150 }}>
          <Server width={210} frame={0} />
        </div>
        <div style={{ position: 'absolute', left: 1420, top: 210 }}>
          <Server width={160} on={0.6} frame={0} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
