import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

/** The five pieces of the ribbon, in the order the video lights them. */
const PIECES = ['DHCP', 'DNS', 'TCP', 'TLS', 'HTTP'];

/**
 * Poster / YouTube thumbnail for «Qué sucede al abrir una web». STUB (phase 1): big two-line title on the
 * left for small-size legibility and, on the right, the video's five-piece ribbon as a vertical stack, all lit.
 * Phase 2 replaces the right half with the video's closing image.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* the five pieces, lit */}
      <div style={{ position: 'absolute', left: 1180, top: 250, width: 640, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {PIECES.map((name) => (
          <div
            key={name}
            style={{
              height: 100,
              borderRadius: 20,
              border: `3px solid ${alpha(C.cyan, 0.7)}`,
              background: alpha(C.cyan, 0.14),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: 4,
              color: C.textStrong,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 116, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Qué sucede al</div>
        <div style={{ fontSize: 116, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>abrir una web</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 562, fontSize: 54, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>cinco piezas, una detrás de otra</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Fundamentos · Security+
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~9 min
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
