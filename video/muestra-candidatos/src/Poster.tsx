import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { CAND } from './scenes/parts/bits';
import { LetterTile } from './scenes/parts/Ficha';

ensureFonts();

// Candidates around the sample: the line style says how much the evidence sustains (solid / dashed / dotted / open).
const LINES = [
  { l: 'B', y: 40, dash: undefined, w: 9 },
  { l: 'C', y: 250, dash: '26 18', w: 7 },
  { l: 'D', y: 460, dash: '5 20', w: 7 },
  { l: 'E', y: 670, dash: '2 24', w: 6 },
] as const;

/**
 * Poster / YouTube thumbnail for «Del hash a los candidatos: pivotar sin inventar parentescos». Title on the
 * left; on the right the sample A with four lines to candidates B–E, each drawn differently — a lead, not a
 * verdict. No hashes, no family names.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 960, top: 150, width: 800, height: 790 }}>
        <svg width={800} height={790} style={{ position: 'absolute', left: 0, top: 0 }}>
          {LINES.map((n) => {
            const col = CAND[n.l];
            return <line key={n.l} x1={176} y1={395} x2={560} y2={n.y + 52} stroke={alpha(col, 0.9)} strokeWidth={n.w} strokeDasharray={n.dash} strokeLinecap="round" />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 315, display: 'grid', placeItems: 'center', gap: 10 }}>
          <LetterTile letter="A" tone={C.cyan} size={160} />
        </div>
        {LINES.map((n) => (
          <div key={n.l} style={{ position: 'absolute', left: 570, top: n.y, display: 'flex', alignItems: 'center', gap: 22 }}>
            <LetterTile letter={n.l} tone={CAND[n.l]} size={104} />
            <span style={{ fontSize: 36, fontWeight: 750, color: C.text }}>{n.l === 'B' ? 'probable' : n.l === 'E' ? 'pendiente' : 'débil'}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left, top: 230, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 278, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Del hash a</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>los candidatos</div>
      </div>
      <div style={{ position: 'absolute', left, top: 542, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>pivotar sin inventar parentescos</div>
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~9 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
