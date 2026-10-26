import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { ACCENT, C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { TITLE } from './data/shared';
import { DRAFT_BOX, DRAFT_RING, DraftSheet } from './scenes/parts/Paper';
import { RedPen } from './scenes/parts/Pen';
import { Stroke, ellipsePoints, partial } from './scenes/parts/strokes';

ensureFonts();

/** The draft on the right half (absolute 1920x1080 coordinates), tilted a little, with its red ring and the pen. */
const SHEET = { x: 1010, y: 262, s: 1.04, tilt: -3 } as const;
const RING = ellipsePoints(DRAFT_RING.cx, DRAFT_RING.cy, DRAFT_RING.rx, DRAFT_RING.ry, { start: -0.55, turns: 1.08 });

/**
 * Poster / YouTube thumbnail for «Falacias lógicas en CTI: el paso que no se sostiene». Big two-line title on the left for
 * small-size legibility; on the right, the video's one image: the draft report with green ticks on its pruebas and a red
 * ring round the step that does not hold, and the red pen that drew it. No date, no name, no host.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const tip = partial(RING, 1).tip;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the sheet */}
      <div style={{ position: 'absolute', left: SHEET.x - 200, top: SHEET.y - 240, width: DRAFT_BOX.w * SHEET.s + 400, height: 960, background: `radial-gradient(closest-side, ${alpha(C.rose, 0.13)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, width: DRAFT_BOX.w, height: DRAFT_BOX.h, transform: `rotate(${SHEET.tilt}deg) scale(${SHEET.s})`, transformOrigin: '0 0' }}>
        <DraftSheet scale={1} checks={[1, 1, 1]} pill={1} q={0} crooked={1} notice={false} glow={0.2} />
        <svg width={DRAFT_BOX.w} height={DRAFT_BOX.h} viewBox={`0 0 ${DRAFT_BOX.w} ${DRAFT_BOX.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
          <Stroke points={RING} p={1} width={10} glow={0.6} />
        </svg>
        <RedPen x={tip.x} y={tip.y} angle={-62} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 244, fontWeight: 850, letterSpacing: -2.6, color: C.textStrong }}>
        <div style={{ fontSize: 100, lineHeight: 1.04, whiteSpace: 'nowrap' }}>{TITLE.lead}</div>
        <div style={{ fontSize: 100, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>{TITLE.rest}</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 500, fontSize: 56, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        <span style={{ color: ACCENT.rose.soft }}>el paso</span> que no se sostiene
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="muted" icon="mortarboard" size={30}>
            GCTI · Analysis
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~4 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>Material independiente, no afiliado a SANS/GIAC.</div>
    </AbsoluteFill>
  );
}
