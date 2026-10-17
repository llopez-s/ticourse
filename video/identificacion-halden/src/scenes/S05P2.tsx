import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionTag } from './parts/Tags';
import { Stage } from './kit';

const WIN = { x: 364, y: 30, w: 1000, h: 540 } as const;
const BAR_H = 54;

/**
 * s05-p2 «Ya publicada». The engine's ExamQuestionLayer draws question 2 over this scene from s05-01 to its end
 * (scenario, question with «MÁS probable», options, countdown, answer `ok-2` and trap `trap-2`), so the scene is only a
 * still, textless background, present from the first frame: a published web page answering with a generic error — a
 * browser window, a big warning mark and a block of internal-looking detail drawn as unreadable bars. The only text is
 * «pregunta tipo examen · ejemplo» under the stage. The `house-back` line is voice only (the panel still covers it).
 */
export function S05P2(_props: SceneProps) {
  const x0 = WIN.x;
  const y0 = WIN.y;
  return (
    <Stage>
      <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0, opacity: 0.75 }}>
        <rect x={x0} y={y0} width={WIN.w} height={WIN.h} rx={20} fill={C.ink850} stroke={alpha(C.text, 0.28)} strokeWidth={3} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={x0 + 34 + i * 28} cy={y0 + 27} r={8} fill={alpha(C.muted, 0.45)} />
        ))}
        <rect x={x0 + 150} y={y0 + 12} width={WIN.w - 300} height={30} rx={15} fill={C.ink900} stroke={alpha(C.text, 0.15)} strokeWidth={2} />
        <line x1={x0} y1={y0 + BAR_H} x2={x0 + WIN.w} y2={y0 + BAR_H} stroke={alpha(C.text, 0.18)} strokeWidth={2} />
        <rect x={x0 + 2} y={y0 + BAR_H} width={WIN.w - 4} height={WIN.h - BAR_H - 2} fill={C.ink900} />

        {/* the warning mark */}
        <g transform={`translate(${x0 + 190} ${y0 + 200})`}>
          <path d="M 0 -96 L 96 70 L -96 70 Z" fill={alpha(C.amber, 0.14)} stroke={alpha(C.amber, 0.8)} strokeWidth={8} strokeLinejoin="round" />
          <rect x={-8} y={-44} width={16} height={66} rx={8} fill={alpha(C.amber, 0.9)} />
          <circle cx={0} cy={44} r={10} fill={alpha(C.amber, 0.9)} />
        </g>
        {/* a big blank heading and a short blank line */}
        <rect x={x0 + 360} y={y0 + 120} width={420} height={36} rx={8} fill={alpha(C.text, 0.45)} />
        <rect x={x0 + 360} y={y0 + 176} width={300} height={18} rx={6} fill={alpha(C.text, 0.22)} />

        {/* the internal detail it should never show: a monospace-looking block of bars */}
        <rect x={x0 + 360} y={y0 + 226} width={580} height={250} rx={12} fill={C.ink950} stroke={alpha(C.rose, 0.45)} strokeWidth={3} />
        {Array.from({ length: 10 }, (_, k) => {
          const a = 120 + ((k * 73) % 260);
          const b = 60 + ((k * 41) % 120);
          return (
            <g key={k}>
              <rect x={x0 + 384 + (k % 3) * 18} y={y0 + 246 + k * 22} width={a} height={9} rx={4} fill={alpha(C.roseSoft, 0.45)} />
              <rect x={x0 + 396 + a + (k % 3) * 18} y={y0 + 246 + k * 22} width={b} height={9} rx={4} fill={alpha(C.text, 0.2)} />
            </g>
          );
        })}
      </svg>
      <QuestionTag />
    </Stage>
  );
}
