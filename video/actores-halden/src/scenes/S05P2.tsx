import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const WIN = { x: 314, y: 34, w: 1100, h: 592 } as const;
const LINES = [0.62, 0.48, 0.7];

/**
 * s05-p2 «Una web de pagos». The engine's ExamQuestionLayer draws question 2 (scenario, question, options, the 5 s
 * countdown, the answer on `ok-2`, the trap on `trap-2`, then the exam card on `thief-back`) over this scene from s05-01
 * to its end, so the scene is only a still, dim, textless background, complete from the first frame: a nameless
 * checkout page in a browser window with an empty address bar — an order summary drawn as item rows (a small box and a
 * bar each), a total line and a big pay button — plus «pregunta tipo examen · ejemplo» under the stage. Not a card form
 * (V34's fake web). The thief's line in the resolution is the voice's only.
 */
export function S05P2(_props: SceneProps) {
  const sx = WIN.x + 70;
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {/* browser window, empty address bar */}
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={18} fill="#e8edf4" stroke="#94a3b8" strokeWidth={3} />
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={60} rx={18} fill="#cbd5e1" />
          <rect x={WIN.x} y={WIN.y + 40} width={WIN.w} height={20} fill="#cbd5e1" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={WIN.x + 34 + k * 30} cy={WIN.y + 30} r={9} fill={['#f87171', '#fbbf24', '#34d399'][k]} />
          ))}
          <rect x={WIN.x + 150} y={WIN.y + 14} width={WIN.w - 200} height={32} rx={16} fill="#f8fafc" />
          {/* page header bar */}
          <rect x={sx} y={WIN.y + 96} width={300} height={26} rx={10} fill="#475569" />
          {/* the order summary: item rows */}
          {LINES.map((w, k) => (
            <g key={k}>
              <rect x={sx} y={WIN.y + 156 + k * 82} width={56} height={56} rx={10} fill="#cbd5e1" />
              <rect x={sx + 80} y={WIN.y + 166 + k * 82} width={520 * w} height={16} rx={8} fill="#94a3b8" />
              <rect x={sx + 80} y={WIN.y + 192 + k * 82} width={240 * w} height={12} rx={6} fill="#cbd5e1" />
              <rect x={sx + 880} y={WIN.y + 172 + k * 82} width={80} height={18} rx={8} fill="#64748b" />
            </g>
          ))}
          <line x1={sx} y1={WIN.y + 410} x2={WIN.x + WIN.w - 70} y2={WIN.y + 410} stroke="#94a3b8" strokeWidth={3} />
          <rect x={sx} y={WIN.y + 432} width={180} height={22} rx={10} fill="#475569" />
          <rect x={sx + 840} y={WIN.y + 428} width={120} height={28} rx={10} fill="#334155" />
          {/* the pay button */}
          <rect x={WIN.x + WIN.w / 2 - 210} y={WIN.y + 488} width={420} height={70} rx={35} fill={alpha('#0e7490', 0.95)} />
          <rect x={WIN.x + WIN.w / 2 - 80} y={WIN.y + 516} width={160} height={14} rx={7} fill={alpha('#ffffff', 0.8)} />
        </svg>
      </QuestionStill>
    </Stage>
  );
}
