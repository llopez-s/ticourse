import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { AppTile, TILE } from './parts/Software';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const COLS = 10;
const ROWS = 3;
const TW = 110;
const TH = (TW * TILE.h) / TILE.w;
const GX = 16;
const GY = 18;
const GRID_W = COLS * TW + (COLS - 1) * GX;
const GRID_X = (W - GRID_W) / 2;
const GRID_Y = 70;
const SLAB_X = GRID_X - 40;
const SLAB_W = GRID_W + 80;
const KERNEL_Y = GRID_Y + ROWS * (TH + GY) + 8;

/**
 * s05-p2 «Treinta contenedores». The engine's ExamQuestionLayer draws question 2 (scenario, question with «MEJOR»,
 * options, the 5 s countdown, the answer on `ok-2`, the trap on `trap-2`) over this scene from s05-01 to its end, so
 * the scene is only a still, dim, textless background, complete from the first frame: one schematic host with thirty
 * identical app tiles (the containers) over one shared slab and the hardware under it — no labels, no names. Plus
 * «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The train's line and the «kernel» of s04 lit in
 * the resolution are the voice's only.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <rect x={SLAB_X - 20} y={GRID_Y - 30} width={SLAB_W + 40} height={KERNEL_Y + 130 - GRID_Y} rx={26} fill="none" stroke={alpha(C.sky, 0.25)} strokeWidth={3} strokeDasharray="14 10" />
          <rect x={SLAB_X} y={KERNEL_Y} width={SLAB_W} height={46} rx={12} fill={alpha(C.sky, 0.2)} stroke={alpha(C.sky, 0.7)} strokeWidth={3} />
          <rect x={SLAB_X} y={KERNEL_Y + 56} width={SLAB_W} height={40} rx={12} fill={alpha(C.sky, 0.08)} stroke={alpha(C.sky, 0.45)} strokeWidth={3} />
          {Array.from({ length: 8 }, (_, k) => (
            <circle key={k} cx={SLAB_X + 60 + k * ((SLAB_W - 120) / 7)} cy={KERNEL_Y + 76} r={5} fill={alpha(C.sky, 0.5)} />
          ))}
        </svg>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: GRID_X + (i % COLS) * (TW + GX), top: GRID_Y + Math.floor(i / COLS) * (TH + GY) }}>
            <AppTile width={TW} />
          </div>
        ))}
      </QuestionStill>
    </Stage>
  );
}
