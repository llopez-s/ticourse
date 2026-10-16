import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Theatre, theatreSize } from './scenes/parts/Theatre';

ensureFonts();

/** The still frame the shared parts are drawn at. */
const F = 0;

/** The art on the right (absolute 1920×1080): the hot theatre on top, warm and cold below it. */
const RIGHT = 1920 - LAYOUT.marginX;
const BIG_W = 500;
const SMALL_W = 350;
const BIG = theatreSize(BIG_W, { label: true });
const ROW_GAP = 34;
const COL_GAP = 40;
const ART_W = SMALL_W * 2 + COL_GAP;
const ART_X = RIGHT - ART_W;
const TOP_Y = 196;
const LOW_Y = TOP_Y + BIG.h + ROW_GAP;

/**
 * Poster / YouTube thumbnail for «Recuperación ante desastres». The series' layout: the hand-set
 * «ALERTÓPOLIS» lockup, a big two-line title («Recuperación» white, «ante desastres» cyan), the subtitle
 * with the three site terms and the promise of the tests, the Security+ badge. On the right, the video's
 * three reserve theatres: the hot one on top (set built, «en cartel», full house), warm (lights ready, set
 * still in crates) and cold (an empty hall with one bulb) below it. No date, no figures, no duration chip
 * (the canon forbids figures), no adversary, no hostnames.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the art */}
      <div
        style={{
          position: 'absolute',
          left: ART_X - 140,
          top: 120,
          width: ART_W + 280,
          height: ART_W + 280,
          background: `radial-gradient(closest-side, ${alpha(C.sky, 0.13)} 0%, transparent 100%)`,
        }}
      />

      {/* hot, on top */}
      <div style={{ position: 'absolute', left: ART_X + (ART_W - BIG_W) / 2 + 30, top: TOP_Y }}>
        <Theatre kind="hot" width={BIG_W} audience="full" glow={0.55} label="HOT SITE" frame={F} />
      </div>
      {/* warm and cold, below */}
      <div style={{ position: 'absolute', left: ART_X, top: LOW_Y }}>
        <Theatre kind="warm" width={SMALL_W} audience="empty" label="WARM SITE" frame={F} />
      </div>
      <div style={{ position: 'absolute', left: ART_X + SMALL_W + COL_GAP, top: LOW_Y }}>
        <Theatre kind="cold" width={SMALL_W} label="COLD SITE" frame={F} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 282, fontWeight: 850, letterSpacing: -3, color: C.textStrong }}>
        <div style={{ fontSize: 118, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Recuperación</div>
        <div style={{ fontSize: 118, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>ante desastres</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 562, fontSize: 52, fontWeight: 700, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>hot, warm y cold site</div>
        <div>
          y cómo <span style={{ color: '#6ee7b7' }}>probarlo</span>
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 730, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <Chip accent="violet" icon="mortarboard" size={30}>
          Security+ · SY0-701 · 3.4
        </Chip>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}
