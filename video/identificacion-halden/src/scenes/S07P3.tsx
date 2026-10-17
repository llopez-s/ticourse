import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionTag } from './parts/Tags';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const SEA_Y = 470;

/** A port's silhouette on its stretch of coast: sheds, a stack of containers and a lighthouse (no cranes, no name). */
function Port({ x, flip = false }: { x: number; flip?: boolean }) {
  const sx = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} 0) scale(${sx} 1)`}>
      {/* the land */}
      <path d={`M -40 ${SEA_Y} L 520 ${SEA_Y} L 560 ${SEA_Y + 26} L -40 ${SEA_Y + 26} Z`} fill={C.ink700} />
      <rect x={-40} y={SEA_Y - 6} width={560} height={8} fill={C.ink600} />
      {/* two sheds */}
      <path d={`M 20 ${SEA_Y - 6} L 20 ${SEA_Y - 120} L 110 ${SEA_Y - 160} L 200 ${SEA_Y - 120} L 200 ${SEA_Y - 6} Z`} fill={C.ink800} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
      <path d={`M 220 ${SEA_Y - 6} L 220 ${SEA_Y - 96} L 300 ${SEA_Y - 126} L 380 ${SEA_Y - 96} L 380 ${SEA_Y - 6} Z`} fill={C.ink800} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
      {/* containers */}
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={396 + c * 58}
            y={SEA_Y - 6 - (r + 1) * 30}
            width={54}
            height={28}
            rx={2}
            fill={[alpha(C.sky, 0.35), alpha(C.amber, 0.3), alpha(C.cyan, 0.3)][(r + c) % 3]}
            stroke={alpha(C.text, 0.25)}
            strokeWidth={2}
          />
        )),
      )}
      {/* the lighthouse at the end of the quay */}
      <path d={`M 488 ${SEA_Y - 6} L 496 ${SEA_Y - 170} L 516 ${SEA_Y - 170} L 524 ${SEA_Y - 6} Z`} fill={alpha(C.text, 0.4)} />
      <rect x={490} y={SEA_Y - 196} width={32} height={26} rx={4} fill={alpha(C.amber, 0.7)} />
      <path d={`M 486 ${SEA_Y - 196} L 506 ${SEA_Y - 216} L 526 ${SEA_Y - 196} Z`} fill={alpha(C.text, 0.5)} />
    </g>
  );
}

/**
 * s07-p3 «Dos puertos, la misma lista». The engine's exam question panel covers the stage from s07-01 to the end of
 * the scene (question, options, countdown, answer `ok-3` and trap `trap-3` are the engine's), so this scene is ONLY a
 * still, textless background, complete from the first frame: two port silhouettes on the same coast — no name, no
 * country — and between them, over the water, a closed sheet with a seal (the list they share, never shown). The only
 * text is «pregunta tipo examen · ejemplo» under the stage. The `shops` line is voice only.
 */
export function S07P3(_props: SceneProps) {
  const sheet = { x: W / 2 - 80, y: 150, w: 160, h: 200 };
  return (
    <Stage>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.75 }}>
        <defs>
          <linearGradient id="s07-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1630" />
            <stop offset="100%" stopColor="#15294a" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={SEA_Y} rx={18} fill="url(#s07-sky)" />
        <rect x={0} y={SEA_Y} width={W} height={H - SEA_Y} fill="#0b2034" />
        {[0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d={`M ${560 + k * 40} ${SEA_Y + 50 + k * 34} q 40 -12 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
            fill="none"
            stroke={alpha(C.sky, 0.25)}
            strokeWidth={3}
          />
        ))}
        <Port x={40} />
        <Port x={W - 40} flip />

        {/* the shared list, closed and sealed, with the two ways it travels */}
        <path d={`M 560 ${SEA_Y - 150} Q 700 120 ${sheet.x} ${sheet.y + 80}`} fill="none" stroke={alpha(C.emerald, 0.6)} strokeWidth={4} strokeDasharray="10 9" />
        <path d={`M ${W - 560} ${SEA_Y - 150} Q ${W - 700} 120 ${sheet.x + sheet.w} ${sheet.y + 80}`} fill="none" stroke={alpha(C.emerald, 0.6)} strokeWidth={4} strokeDasharray="10 9" />
        <rect x={sheet.x} y={sheet.y} width={sheet.w} height={sheet.h} rx={8} fill="#e2e8f0" opacity={0.9} />
        <path d={`M ${sheet.x} ${sheet.y + 70} L ${sheet.x + sheet.w / 2} ${sheet.y + 120} L ${sheet.x + sheet.w} ${sheet.y + 70}`} fill="none" stroke="#94a3b8" strokeWidth={4} />
        <circle cx={sheet.x + sheet.w / 2} cy={sheet.y + 120} r={24} fill="#047857" />
        <circle cx={sheet.x + sheet.w / 2} cy={sheet.y + 120} r={14} fill="none" stroke="#a7f3d0" strokeWidth={3} />
      </svg>
      <QuestionTag />
    </Stage>
  );
}
