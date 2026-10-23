import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Finger } from './scenes/parts/Finger';
import { Scale, scaleGeometry } from './scenes/parts/Scale';

ensureFonts();

/** The scale on the right half (absolute 1920×1080 coordinates) and the finger that presses its platform. */
const SC = { x: 1010, y: 330, w: 780 };

/**
 * Poster / YouTube thumbnail for «Sesgos del analista: el instrumento de medida eres tú». Big three-line title on
 * the left for small-size legibility; on the right, the video's one image: a kitchen scale that marks two kilos
 * too many with nothing on it, and a finger pressing its platform without changing a thing.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const g = scaleGeometry(SC.w);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the scale */}
      <div style={{ position: 'absolute', left: SC.x - 220, top: SC.y - 260, width: SC.w + 440, height: 900, background: `radial-gradient(closest-side, ${alpha(C.amber, 0.12)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: SC.x, top: SC.y, transform: 'rotate(-4deg)', transformOrigin: '50% 100%' }}>
        <Scale width={SC.w} reading="2,0" glow={0.25} />
      </div>
      <div style={{ position: 'absolute', left: SC.x + g.plat.cx - 72 + 60, top: SC.y + g.plat.top - 4 - 260, transform: 'rotate(-4deg)' }}>
        <Finger length={260} width={86} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, three lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 244, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>El instrumento</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>de medida</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>eres tú</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 612, fontSize: 52, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        Sesgos del analista: <span style={{ color: '#fcd34d' }}>cuatro atajos</span>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 716, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
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
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
