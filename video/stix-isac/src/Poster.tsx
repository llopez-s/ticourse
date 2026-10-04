import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { S05_LETTER_DATE, S05_MARKING } from './data/s05-taxii';
import { Envelope, LETTER, Letter } from './scenes/parts/Letter';
import { StixJson } from './scenes/parts/StixJson';

ensureFonts();

/** The letter and its envelope on the right half (absolute 1920×1080 coordinates). */
const LET = { x: 1210, y: 196, w: 500 };
const ENV = { x: 1010, y: 610, w: 430 };

/**
 * Poster / YouTube thumbnail for «¿Bloqueo este dominio? Indicadores, STIX y
 * TAXII». Big two-line title on the left for small-size legibility; on the
 * right, the video's third image: the letter (the STIX indicator in
 * miniature, dated 11-03, its sharing mark lit amber INSIDE it) with the
 * envelope that carried it.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the letter */}
      <div
        style={{
          position: 'absolute',
          left: LET.x - 200,
          top: LET.y - 80,
          width: LET.w + 400,
          height: 860,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.14)} 0%, transparent 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: ENV.x, top: ENV.y, transform: 'rotate(-9deg)', transformOrigin: '50% 50%' }}>
        <Envelope width={ENV.w} open={1} glow={0.45} />
      </div>
      <div style={{ position: 'absolute', left: LET.x, top: LET.y, transform: 'rotate(4deg)', transformOrigin: '50% 50%' }}>
        <Letter width={LET.w} date={S05_LETTER_DATE} markingText={S05_MARKING} marking={1} glow={0.5}>
          <StixJson mini width={LETTER.content.w} focus={[{ key: 'object_marking_refs', from: -100, tone: 'amber' }]} frame={0} />
        </Letter>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>¿Bloqueo este</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
          <span style={{ color: C.rose }}>dominio</span>?
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: 54, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        Indicadores, <span style={{ color: '#c4b5fd' }}>STIX</span> y <span style={{ color: '#c4b5fd' }}>TAXII</span>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
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
