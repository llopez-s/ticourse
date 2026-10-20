import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

/**
 * s09-p3 «Un perfil muy oficial». Exam question 3 is the ENGINE's (from s09-01 to the end; answer on `ok-3`, trap on
 * `trap-3`). Outside the port: a well-known shipping line and a social network, both nameless. The scene is a still,
 * dim, textless background: the silhouette of a social profile (banner, round avatar with no logo, bars for posts),
 * plus the label «pregunta tipo examen · ejemplo». The disguise's line (`disguise-back`) is the voice's only.
 */
export function S09P3(_props: SceneProps) {
  const X = 474;
  const Y = 40;
  const Wd = 780;
  return (
    <Stage>
      <QuestionStill>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={X} y={Y} width={Wd} height={580} rx={18} fill={C.ink800} stroke={alpha(C.sky, 0.4)} strokeWidth={4} />
          <path d={`M${X} ${Y + 18} Q${X} ${Y} ${X + 18} ${Y} H${X + Wd - 18} Q${X + Wd} ${Y} ${X + Wd} ${Y + 18} V${Y + 150} H${X} Z`} fill={alpha(C.sky, 0.25)} />
          <circle cx={X + 120} cy={Y + 160} r={66} fill={C.ink900} stroke={alpha(C.sky, 0.7)} strokeWidth={6} />
          <circle cx={X + 120} cy={Y + 160} r={34} fill="none" stroke={alpha(C.sky, 0.5)} strokeWidth={4} strokeDasharray="8 7" />
          <rect x={X + 210} y={Y + 176} width={240} height={22} rx={8} fill={alpha(C.text, 0.5)} />
          <rect x={X + 210} y={Y + 210} width={160} height={14} rx={7} fill={alpha(C.text, 0.3)} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={X + 40} y={Y + 270 + i * 96} width={Wd - 80} height={80} rx={12} fill={C.ink900} />
              <rect x={X + 64} y={Y + 290 + i * 96} width={380 - i * 50} height={12} rx={6} fill={alpha(C.text, 0.35)} />
              <rect x={X + 64} y={Y + 314 + i * 96} width={260 + i * 40} height={12} rx={6} fill={alpha(C.text, 0.25)} />
            </g>
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
