import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const BOARD = { x: 264, y: 40, w: 1200, h: 520 } as const;
const ROW_H = 54;
const BAR_W = [420, 360, 470, 300, 390, 440, 330, 400];
/** The row whose dot is amber: waiting, nobody took it. */
const WAITING = 2;

/**
 * s05-p2 «El fallo del escaneo». The engine's ExamQuestionLayer draws question 2 (scenario, question, options,
 * countdown, answer on `ok-2`, trap on `trap-2`, then the exam card on `up`) over this scene from s05-01 to its end, so
 * the scene is only a still, dim background with no readable text, complete from the first frame: a Systems ticket
 * queue — a board of rows, each a status dot and grey bars, one row's dot amber (waiting) — plus the label «pregunta
 * tipo examen · ejemplo» (QuestionStill).
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill={C.ink900} />
          <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx={18} fill={C.ink850} stroke={alpha(C.sky, 0.45)} strokeWidth={3} />
          <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={56} rx={18} fill={alpha(C.sky, 0.12)} />
          <rect x={BOARD.x + 30} y={BOARD.y + 20} width={220} height={16} rx={8} fill={alpha(C.text, 0.3)} />
          {BAR_W.map((bw, i) => {
            const y = BOARD.y + 76 + i * ROW_H;
            const waiting = i === WAITING;
            return (
              <g key={i}>
                <rect x={BOARD.x + 20} y={y} width={BOARD.w - 40} height={ROW_H - 10} rx={8} fill={waiting ? alpha(C.amber, 0.08) : alpha(C.ink800, 0.8)} />
                <circle cx={BOARD.x + 50} cy={y + (ROW_H - 10) / 2} r={9} fill={waiting ? C.amber : alpha(C.emerald, 0.6)} />
                <rect x={BOARD.x + 80} y={y + 14} width={bw} height={14} rx={7} fill={alpha(C.text, 0.22)} />
                <rect x={BOARD.x + 640} y={y + 14} width={180} height={14} rx={7} fill={alpha(C.text, 0.14)} />
                <rect x={BOARD.x + 920} y={y + 10} width={120} height={22} rx={11} fill={waiting ? alpha(C.amber, 0.35) : alpha(C.text, 0.12)} />
              </g>
            );
          })}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
