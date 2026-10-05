import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { CollarCloseUp, Garment, collarCloseUpSize, garmentCollarSlot, garmentHeight } from './scenes/parts/Garment';

ensureFonts();

// The garment on the right, its collar flipped; the collar's inside, enlarged, under it (absolute 1920×1080).
const G = { x: 1262, y: 96, w: 440 };
const CU_LABEL = 520;
const CU = collarCloseUpSize(CU_LABEL);
const CU_POS = { x: G.x + G.w / 2 - CU.w / 2, y: G.y + garmentHeight(G.w) + 14 };

/**
 * Poster / YouTube thumbnail for «Lo que cuenta una muestra: triaje de malware en
 * sandbox». Big two-line title on the left for small-size legibility; on the right,
 * the video's closing image: the made-to-measure garment with its collar flipped
 * and the workshop label sewn inside, and that collar enlarged under it. The label's
 * field is left blank, as on V14's poster: the path is read in the video (s05), never
 * singled out on the thumbnail.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const slot = garmentCollarSlot(G.w);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* the connectors to the enlarged collar run behind the garment */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[
          [G.x + slot.x, G.y + slot.y + slot.h, CU_POS.x + 30, CU_POS.y + 40],
          [G.x + slot.x + slot.w, G.y + slot.y + slot.h, CU_POS.x + CU.w - 30, CU_POS.y + 40],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha('#efe6d2', 0.35)} strokeWidth={3} strokeDasharray="6 9" strokeLinecap="round" />
        ))}
      </svg>
      {/* the garment, collar flipped, label sewn */}
      <div style={{ position: 'absolute', left: G.x, top: G.y }}>
        {/* '' sews the label in with its field blank (undefined would leave it out) */}
        <Garment width={G.w} collar={1} labelPath="" labelGlow={0.6} />
      </div>
      {/* the collar's inside, enlarged */}
      <div style={{ position: 'absolute', left: CU_POS.x, top: CU_POS.y }}>
        <CollarCloseUp labelWidth={CU_LABEL} labelGlow={0.5} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 310, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Lo que cuenta</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
          una <span style={{ color: C.amber }}>muestra</span>
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>triaje de malware</div>
        <div style={{ color: C.muted }}>en sandbox</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Collection
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
