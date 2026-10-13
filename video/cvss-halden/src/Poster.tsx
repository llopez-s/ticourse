import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Hull, hullSize } from './scenes/parts/Hull';

ensureFonts();

/** The ship on the right, low (absolute 1920 × 1080 coordinates): the title owns the left and ends at x ≈ 1100. */
const HULL_W = 880;
const HULL_X = 1010;
const HULL_Y = 440;

/**
 * Poster / YouTube thumbnail for «Triaje de vulnerabilidades: el contexto manda sobre el número». Big two-line title
 * on the left for small-size legibility («vulnerabilidades» in rose); on the right the video's image: the cargo ship
 * with the hole labelled 9.8 in a storm (the score is the hole, the sea is the context). The frame is frozen at one
 * point of the storm; rain and waves read the poster's frame 0.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const hs = hullSize(HULL_W);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halos: the sea under the ship, the red of the hole */}
      <div
        style={{
          position: 'absolute',
          left: HULL_X - 60,
          top: HULL_Y - 120,
          width: HULL_W + 120,
          height: hs.h + 260,
          background: `radial-gradient(closest-side, ${alpha(C.sky, 0.1)} 0%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: HULL_X + HULL_W * 0.64 - 190,
          top: HULL_Y + hs.h * 0.67 - 190,
          width: 380,
          height: 380,
          background: `radial-gradient(closest-side, ${alpha(C.rose, 0.26)} 0%, transparent 100%)`,
        }}
      />

      <div style={{ position: 'absolute', left: HULL_X, top: HULL_Y }}>
        <Hull width={HULL_W} sea={1} storm={0.85} hole={1} holeLabel="9.8" labelSize={74} frame={37} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 200, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 248, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 120, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Triaje de</div>
        <div style={{ fontSize: 120, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.roseSoft }}>vulnerabilidades</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 548, fontSize: 46, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        el <span style={{ color: C.cyan }}>contexto</span> manda sobre el número
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 4.3
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
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}
