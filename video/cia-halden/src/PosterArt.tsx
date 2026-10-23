import { C } from '../../engine/src/theme/tokens';
import { HARBOUR, Harbour } from './scenes/parts/Ship';
import { QUESTIONS, QuestionBadge, Sheet, sheetHeight } from './scenes/parts/Sheet';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 700, h: 560 } as const;

const SHEET_W = 290;
const BADGE = 104;
const HARBOUR_W = 700;

/**
 * The video in one image: the declaration sheet with its four question badges around it (read · changed · there when
 * needed · can't deny), in front of the harbour mouth with the unnamed ship coming in — so it is not one more «una hoja»
 * thumbnail (V30, V51). No words, names or figures.
 */
export function PosterArt() {
  const sh = sheetHeight(SHEET_W);
  const sx = (POSTER_ART.w - SHEET_W) / 2;
  const sy = 20;
  const pos = [
    { left: sx - BADGE - 26, top: sy + 20 },
    { left: sx + SHEET_W + 26, top: sy + 20 },
    { left: sx - BADGE - 26, top: sy + sh - BADGE - 30 },
    { left: sx + SHEET_W + 26, top: sy + sh - BADGE - 30 },
  ];
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2 - 40} r={400} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: POSTER_ART.h - (HARBOUR_W * HARBOUR.h) / HARBOUR.w + 40, opacity: 0.85 }}>
        <Harbour width={HARBOUR_W} approach={0.8} />
      </div>
      <div style={{ position: 'absolute', left: sx, top: sy }}>
        <Sheet width={SHEET_W} mini glow={0.8} />
      </div>
      {QUESTIONS.map((q, i) => (
        <div key={q.icon} style={{ position: 'absolute', ...pos[i] }}>
          <QuestionBadge icon={q.icon} size={BADGE} on={0.9} />
        </div>
      ))}
    </div>
  );
}
