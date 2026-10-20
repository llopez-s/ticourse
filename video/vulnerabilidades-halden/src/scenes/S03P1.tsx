import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Disk, SERVER, Server, vmRect } from './parts/Server';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const SRV_W = 1000;
const SRV_X = (W - SRV_W) / 2;
const SRV_Y = 170;
const K = SRV_W / SERVER.w;

/**
 * s03-p1 «El disco de segunda mano». The engine's ExamQuestionLayer draws question 1 (scenario, question with
 * «MEJOR», options, the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its
 * end, so the scene is only a still, dim, textless background, complete from the first frame: a server in schematic
 * (no name, no place) with three machines, the middle one dashed (dada de baja) with its disk still inside — plus
 * «pregunta tipo examen · ejemplo» under the stage. The «MEJOR: …» line and the drawer's line are voice-only.
 */
export function S03P1(_props: SceneProps) {
  const r = vmRect(1, 3);
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {[0, 1, 2, 3, 4].map((k) => (
            <line key={k} x1={60} y1={110 + k * 110} x2={W - 60} y2={110 + k * 110} stroke={alpha(C.sky, 0.05)} strokeWidth={2} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: SRV_X, top: SRV_Y }}>
          <Server width={SRV_W} hvLabel={false} vms={[{}, { dashed: true, tone: C.muted }, {}]}>
            <Disk cx={r.x + r.w / 2} cy={r.y + r.h / 2 + 8} scale={1 / K + 0.2} residue={1} tone={C.muted} />
          </Server>
        </div>
      </QuestionStill>
    </Stage>
  );
}
