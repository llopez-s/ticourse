import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const WIN = { x: 364, y: 44, w: 1000, h: 572 } as const;
const COLS = 4;
const CARD = { w: 214, h: 196, gx: 26, gy: 26 } as const;
const GRID_X = WIN.x + (WIN.w - (COLS * CARD.w + (COLS - 1) * CARD.gx)) / 2;
const GRID_Y = WIN.y + 140;
const TINTS = ['#2f5f7a', '#5b4a7a', '#3f6b52', '#7a5a3a', '#4a5f7a', '#6b3f52', '#3a6b6b', '#5a5a3a'];

/**
 * s03-p1 «La tienda en internet». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the scene is
 * only a still, dim, textless background, complete from the first frame: a nameless online shop in a browser window
 * (an empty address bar, a header with a cart, a grid of eight product cards — a tinted picture and two grey bars
 * each). Not a checkout page (V35's). Plus «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The
 * «MEJOR: …» gloss and the mould's line in the resolution are the voice's only.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {/* the browser window */}
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={20} fill={C.ink850} stroke={alpha(C.text, 0.3)} strokeWidth={4} />
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={54} rx={20} fill={C.ink800} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={WIN.x + 32 + k * 26} cy={WIN.y + 27} r={8} fill={alpha(C.text, 0.4)} />
          ))}
          <rect x={WIN.x + 130} y={WIN.y + 14} width={560} height={26} rx={13} fill={alpha(C.text, 0.12)} />
          {/* the shop's header: a logo blob, three menu bars, the cart */}
          <rect x={WIN.x + 40} y={WIN.y + 78} width={110} height={34} rx={10} fill={alpha(C.cyan, 0.35)} />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={WIN.x + 210 + k * 120} y={WIN.y + 88} width={90} height={14} rx={7} fill={alpha(C.text, 0.25)} />
          ))}
          <g transform={`translate(${WIN.x + WIN.w - 90} ${WIN.y + 76})`}>
            <path d="M 0 6 L 10 6 L 18 30 L 44 30 L 50 12 L 14 12" fill="none" stroke={alpha(C.text, 0.6)} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={22} cy={38} r={4} fill={alpha(C.text, 0.6)} />
            <circle cx={40} cy={38} r={4} fill={alpha(C.text, 0.6)} />
          </g>
          {/* eight product cards */}
          {TINTS.map((t, i) => {
            const x = GRID_X + (i % COLS) * (CARD.w + CARD.gx);
            const y = GRID_Y + Math.floor(i / COLS) * (CARD.h + CARD.gy);
            return (
              <g key={i}>
                <rect x={x} y={y} width={CARD.w} height={CARD.h} rx={14} fill={C.ink800} stroke={alpha(C.text, 0.15)} strokeWidth={2} />
                <rect x={x + 12} y={y + 12} width={CARD.w - 24} height={110} rx={10} fill={alpha(t, 0.9)} />
                <circle cx={x + CARD.w - 50} cy={y + 46} r={14} fill={alpha('#ffffff', 0.25)} />
                <path d={`M ${x + 24} ${y + 112} L ${x + 80} ${y + 60} L ${x + 120} ${y + 96} L ${x + 150} ${y + 74} L ${x + CARD.w - 24} ${y + 112} Z`} fill={alpha('#ffffff', 0.18)} />
                <rect x={x + 14} y={y + 136} width={150} height={14} rx={7} fill={alpha(C.text, 0.35)} />
                <rect x={x + 14} y={y + 162} width={80} height={14} rx={7} fill={alpha(C.cyan, 0.4)} />
              </g>
            );
          })}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
