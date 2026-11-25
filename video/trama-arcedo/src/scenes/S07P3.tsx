import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { LAYER } from '../data/case';
import { Device } from './parts/Net';
import { QuestionTagFallback } from './parts/Tags';
import { Stage } from './kit';

// Stage-local geometry of the still background.
const PATH_Y = 380;
const SERVER = { x: 1380, size: 150 } as const;
const ENV = { w: 190, h: 124 } as const;
/** The two envelopes on the way, crossed: the second (two dots) is already at the server, the first still behind. */
const ENVELOPES = [
  { dots: 2, x: 1060, y: PATH_Y - ENV.h / 2 },
  { dots: 1, x: 640, y: PATH_Y - ENV.h / 2 },
] as const;

/** A closed envelope in the segment's emerald, numbered with dots (no text on this background). */
function Envelope({ x, y, dots }: { x: number; y: number; dots: number }) {
  const tone = LAYER.segment.tone;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={ENV.w} height={ENV.h} rx={10} fill={alpha(tone, 0.22)} stroke={tone} strokeWidth={5} />
      <path d={`M 4 6 L ${ENV.w / 2} ${ENV.h * 0.58} L ${ENV.w - 4} 6`} fill="none" stroke={tone} strokeWidth={5} strokeLinejoin="round" />
      {Array.from({ length: dots }, (_, k) => (
        <circle key={k} cx={ENV.w - 30 - k * 30} cy={ENV.h - 26} r={10} fill={C.cyan} />
      ))}
    </g>
  );
}

/**
 * s07-p3 «Dos segmentos cruzados». The engine's question panel covers the stage from s07-01 to the end of the scene
 * (question, options, countdown, answer, trap, its «pregunta tipo test · ejemplo» label and the rule card are all the
 * engine's), so this scene is ONLY a still, half-lit background drawn in code, complete from the first frame and never
 * moving: the workstation on the left, the server on the right, and two numbered envelopes on the way in reverse
 * order — the second already at the server, the first still behind. No text.
 */
export function S07P3(_props: SceneProps) {
  const line = alpha(C.text, 0.3);
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity: 0.5 }}>
        <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={60} width={1728} height={560} rx={18} fill={C.ink900} />
          {/* the way from the workstation to the server */}
          <line x1={300} y1={PATH_Y} x2={SERVER.x - 20} y2={PATH_Y} stroke={line} strokeWidth={5} strokeDasharray="18 14" strokeLinecap="round" />
          {/* a crossing mark: the two envelopes swapped places on the way */}
          <path d={`M 870 ${PATH_Y - 120} C 980 ${PATH_Y - 190}, 1100 ${PATH_Y - 160}, 1150 ${PATH_Y - 90}`} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={5} strokeLinecap="round" />
          <path d={`M 1150 ${PATH_Y + 90} C 1050 ${PATH_Y + 170}, 860 ${PATH_Y + 170}, 760 ${PATH_Y + 90}`} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={5} strokeLinecap="round" />
          {ENVELOPES.map((e) => (
            <Envelope key={e.dots} x={e.x} y={e.y} dots={e.dots} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 140, top: PATH_Y - 65 }}>
          <Device icon="desktop" tone={C.cyan} size={130} on={0.2} />
        </div>
        <div style={{ position: 'absolute', left: SERVER.x, top: PATH_Y - SERVER.size / 2 }}>
          <Device icon="server" tone={LAYER.segment.tone} size={SERVER.size} on={0.4} />
        </div>
      </div>
      <QuestionTagFallback scene="s07-p3" />
    </Stage>
  );
}
