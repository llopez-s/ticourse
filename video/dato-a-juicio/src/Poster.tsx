import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { IP } from './data/canon';
import { IpChip, StairsArt } from './scenes/parts/Stairs';

ensureFonts();

const ART = { x: 1010, y: 330, w: 780 } as const;

/**
 * Poster / YouTube thumbnail for «De un dato a un juicio». Big two-line title on the left for small-size legibility («De un
 * dato» in cyan, «a un juicio» in white); on the right the video's central image: the three rungs from a loose datum to a
 * judgment, the IP waiting at the bottom one and the top rung lit as «JUICIO».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the stairs */}
      <div
        style={{
          position: 'absolute',
          left: ART.x - 200,
          top: ART.y - 220,
          width: ART.w + 400,
          height: 900,
          background: `radial-gradient(closest-side, ${alpha(C.emerald, 0.13)} 0%, transparent 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: ART.x, top: ART.y }}>
        <StairsArt width={ART.w} labels labelSize={46} lit={3} dotAt={0} />
        <div style={{ position: 'absolute', left: 10, top: -22 }}>
          <IpChip ip={IP} size={36} />
        </div>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 8, top: 262, fontWeight: 900, letterSpacing: -4, color: C.textStrong }}>
        <div style={{ fontSize: 158, lineHeight: 1.02, color: C.cyan, whiteSpace: 'nowrap', textShadow: `0 0 40px ${alpha(C.cyan, 0.3)}` }}>De un dato</div>
        <div style={{ fontSize: 158, lineHeight: 1.02, whiteSpace: 'nowrap' }}>a un juicio</div>
        <div style={{ marginTop: 22, fontSize: 52, fontWeight: 750, letterSpacing: -0.5, color: C.muted, lineHeight: 1.15, whiteSpace: 'nowrap' }}>inteligencia, amenaza y riesgo</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Requirements
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
