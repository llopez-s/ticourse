import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const COLS = 5;
const ROWS = 3;
const CW = 300;
const CH = 168;
const GX = 26;
const GY = 26;
const X0 = (1728 - (COLS * CW + (COLS - 1) * GX)) / 2;
const Y0 = 44;

/**
 * s11-p4 «Una noche de publicaciones». Exam question 4 is the ENGINE's (from s11-01 to the end; answer on `ok-4`,
 * trap on `trap-4`; no qualifier on purpose). Outside the port: a nameless bank, no date, nobody named behind it. The
 * scene is a still, dim, textless background: a grid of identical posts (same avatar circle, same bars), plus the
 * label «pregunta tipo examen · ejemplo». The family group's line (`family-back`) is the voice's only.
 */
export function S11P4(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const x = X0 + c * (CW + GX);
              const y = Y0 + r * (CH + GY);
              return (
                <g key={`${r}-${c}`}>
                  <rect x={x} y={y} width={CW} height={CH} rx={14} fill={C.ink800} stroke={alpha(C.rose, 0.3)} strokeWidth={3} />
                  <circle cx={x + 40} cy={y + 40} r={20} fill={alpha(C.muted, 0.5)} />
                  <rect x={x + 72} y={y + 30} width={120} height={12} rx={6} fill={alpha(C.text, 0.4)} />
                  <rect x={x + 24} y={y + 84} width={250} height={12} rx={6} fill={alpha(C.text, 0.35)} />
                  <rect x={x + 24} y={y + 108} width={200} height={12} rx={6} fill={alpha(C.text, 0.35)} />
                  <rect x={x + 24} y={y + 132} width={230} height={12} rx={6} fill={alpha(C.text, 0.35)} />
                </g>
              );
            }),
          )}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
