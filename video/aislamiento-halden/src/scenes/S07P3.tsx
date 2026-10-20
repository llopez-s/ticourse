import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
/** Twelve offices, no names; the five the same fake mail reached carry an amber ring (nobody joined them up). */
const DOTS: { x: number; y: number; hit?: boolean }[] = [
  { x: 520, y: 170 }, { x: 690, y: 120, hit: true }, { x: 860, y: 200 }, { x: 1040, y: 150 },
  { x: 1190, y: 240, hit: true }, { x: 610, y: 320, hit: true }, { x: 780, y: 360 }, { x: 960, y: 310 },
  { x: 1130, y: 400 }, { x: 700, y: 490, hit: true }, { x: 900, y: 470 }, { x: 1060, y: 530, hit: true },
];

/**
 * s07-p3 «Doce oficinas». The engine's ExamQuestionLayer draws question 3 (scenario, question, options, the 5 s
 * countdown, the answer on `ok-3`, the trap on `trap-3`) over this scene from s07-01 to its end, so the scene is only a
 * still, dim, textless background, complete from the first frame: a schematic land mass with twelve office dots, each
 * with its own small gear (its own way of configuring), five of them ringed amber; no city names, no lines between
 * them. Plus «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The football line and the vertical
 * axis lit in the resolution are the voice's only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill="#0a1426" />
          <path
            d="M 430 140 C 520 60 700 70 820 90 C 980 70 1130 80 1250 150 C 1330 200 1300 300 1260 360 C 1240 450 1200 540 1100 590 C 980 630 800 600 680 570 C 560 540 470 470 450 390 C 420 300 360 220 430 140 Z"
            fill="#16294a"
            stroke={alpha(C.sky, 0.35)}
            strokeWidth={4}
          />
          {DOTS.map((d, i) => (
            <g key={i}>
              {d.hit ? <circle cx={d.x} cy={d.y} r={30} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={4} /> : null}
              <circle cx={d.x} cy={d.y} r={14} fill={C.cyan} stroke={C.ink900} strokeWidth={4} />
              {/* each office's own settings: a small gear-like mark, turned a different way */}
              <g transform={`rotate(${i * 37} ${d.x + 30} ${d.y - 26})`}>
                <circle cx={d.x + 30} cy={d.y - 26} r={8} fill="none" stroke={alpha(C.text, 0.45)} strokeWidth={3} />
                <line x1={d.x + 30} y1={d.y - 38} x2={d.x + 30} y2={d.y - 14} stroke={alpha(C.text, 0.45)} strokeWidth={3} />
              </g>
            </g>
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
