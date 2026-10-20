import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const WATER_Y = 500;

/**
 * s07-p3 «Las nóminas del astillero». The engine's ExamQuestionLayer draws question 3 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`, then the exam card on `cloak-back`) over this scene
 * from s07-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame: the
 * silhouette of a nameless shipyard (a hull on its slipway under a gantry, a shed) and, on the right, an office block
 * joined to it by one dashed line. Plus «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The
 * cloakroom's line in the resolution is the voice's only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="s07-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1730" />
              <stop offset="100%" stopColor="#16294a" />
            </linearGradient>
          </defs>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill="url(#s07-sky)" />
          <rect x={0} y={WATER_Y} width={W} height={H - 20 - WATER_Y} fill="#0a1426" />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={80 + k * 260} y1={WATER_Y + 40 + k * 28} x2={260 + k * 260} y2={WATER_Y + 40 + k * 28} stroke={alpha(C.sky, 0.18)} strokeWidth={4} strokeLinecap="round" />
          ))}
          {/* the shipyard: a shed, a gantry over the slipway, a hull on it */}
          <rect x={60} y={300} width={240} height={200} fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <path d="M 60 300 L 180 240 L 300 300 Z" fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <rect x={340} y={140} width={26} height={360} fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <rect x={860} y={140} width={26} height={360} fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <rect x={320} y={120} width={590} height={34} fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <rect x={560} y={154} width={60} height={40} fill={C.ink950} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
          <line x1={590} y1={194} x2={590} y2={300} stroke={alpha(C.sky, 0.4)} strokeWidth={3} />
          <path d="M 400 330 L 830 330 L 790 470 L 450 470 Z" fill="#101c33" stroke={alpha(C.sky, 0.45)} strokeWidth={4} />
          <path d="M 380 500 L 900 440" stroke={alpha(C.sky, 0.35)} strokeWidth={6} />
          {/* the office block on the right, and the one line between them */}
          <rect x={1300} y={220} width={300} height={280} fill={C.ink950} stroke={alpha(C.sky, 0.35)} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, k) => (
            <rect key={k} x={1330 + (k % 4) * 66} y={250 + Math.floor(k / 4) * 74} width={40} height={36} fill={alpha(k === 5 ? C.amber : C.cyan, k === 5 ? 0.35 : 0.22)} />
          ))}
          <path d="M 920 260 Q 1100 180 1290 300" fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
          <circle cx={920} cy={260} r={8} fill={alpha(C.cyan, 0.6)} />
          <circle cx={1290} cy={300} r={8} fill={alpha(C.cyan, 0.6)} />
        </svg>
      </QuestionStill>
    </Stage>
  );
}
