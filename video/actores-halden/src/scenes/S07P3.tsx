import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const FLOOR_Y = 560;
const DESK = { x: 470, y: 380, w: 760 } as const;
const MON = { x: 650, y: 130, w: 400, h: 240 } as const;

/**
 * s07-p3 «Un usuario y un foro». The engine's ExamQuestionLayer draws question 3 (scenario, question with «MEJOR»,
 * options, the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`, then the exam card on `kitchen-back`) over this
 * scene from s07-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame:
 * a generic office workstation — a desk with a monitor showing grey table rows, a keyboard, an office chair and a
 * window behind — no phone, no pendrive, no name, plus «pregunta tipo examen · ejemplo» under the stage. The «MEJOR: …»
 * line and the kitchen's line in the resolution are the voice's only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill="#0e182b" />
          <rect x={0} y={FLOOR_Y} width={W} height={H - 20 - FLOOR_Y} fill="#0a1222" />
          {/* window behind */}
          <rect x={160} y={70} width={300} height={220} rx={8} fill="#13284a" stroke={alpha(C.sky, 0.3)} strokeWidth={4} />
          <line x1={310} y1={70} x2={310} y2={290} stroke={alpha(C.sky, 0.3)} strokeWidth={4} />
          <line x1={160} y1={180} x2={460} y2={180} stroke={alpha(C.sky, 0.3)} strokeWidth={4} />
          {/* desk */}
          <rect x={DESK.x} y={DESK.y} width={DESK.w} height={20} rx={6} fill="#5b4632" />
          <rect x={DESK.x + 20} y={DESK.y + 20} width={18} height={FLOOR_Y - DESK.y - 20} fill="#4a3828" />
          <rect x={DESK.x + DESK.w - 38} y={DESK.y + 20} width={18} height={FLOOR_Y - DESK.y - 20} fill="#4a3828" />
          <rect x={DESK.x + DESK.w - 230} y={DESK.y + 20} width={200} height={120} rx={6} fill="#4a3828" />
          {/* monitor with grey table rows */}
          <rect x={MON.x} y={MON.y} width={MON.w} height={MON.h} rx={12} fill={C.ink950} stroke="#475569" strokeWidth={6} />
          <rect x={MON.x + 18} y={MON.y + 18} width={MON.w - 36} height={30} rx={6} fill={alpha(C.cyan, 0.25)} />
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <rect x={MON.x + 18} y={MON.y + 64 + k * 32} width={80} height={14} rx={7} fill={alpha(C.text, 0.3)} />
              <rect x={MON.x + 112} y={MON.y + 64 + k * 32} width={180 - (k % 3) * 30} height={14} rx={7} fill={alpha(C.text, 0.22)} />
              <rect x={MON.x + 310} y={MON.y + 64 + k * 32} width={60} height={14} rx={7} fill={alpha(C.text, 0.3)} />
            </g>
          ))}
          <rect x={MON.x + MON.w / 2 - 14} y={MON.y + MON.h} width={28} height={DESK.y - MON.y - MON.h} fill="#475569" />
          <rect x={MON.x + MON.w / 2 - 80} y={DESK.y - 10} width={160} height={10} rx={5} fill="#475569" />
          {/* keyboard */}
          <rect x={MON.x + 70} y={DESK.y - 18} width={260} height={16} rx={5} fill="#334155" />
          {/* office chair */}
          <rect x={520} y={300} width={150} height={150} rx={30} fill="#1e293b" stroke="#475569" strokeWidth={4} />
          <rect x={500} y={440} width={190} height={34} rx={14} fill="#1e293b" stroke="#475569" strokeWidth={4} />
          <rect x={587} y={474} width={16} height={60} fill="#475569" />
          <path d="M 530 552 L 595 534 L 660 552" fill="none" stroke="#475569" strokeWidth={8} strokeLinecap="round" />
        </svg>
      </QuestionStill>
    </Stage>
  );
}
