import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { ENVELOPES } from './data/niveles';
import { Envelope } from './scenes/parts/Envelope';
import { EnvelopeAsk } from './scenes/parts/EnvelopeCards';

ensureFonts();

const BOARD = { x: 960, y: 196, w: 480 };
const SOC = { x: 1360, y: 470, w: 480 };

/**
 * Poster / YouTube thumbnail for «Niveles de CTI y la Sliding Scale». Big title on the left for
 * small-size legibility; on the right, the video's image: the board's envelope and the SOC's, each
 * with its reader's question on the card that peeks out, and between them the rose swap badge of the
 * classic mistake (giving each the other's).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halos behind the envelopes */}
      <div style={{ position: 'absolute', left: BOARD.x - 160, top: BOARD.y - 40, width: 840, height: 640, background: `radial-gradient(closest-side, ${alpha(C.emerald, 0.12)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: SOC.x - 160, top: SOC.y - 40, width: 840, height: 640, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.14)} 0%, transparent 100%)` }} />

      <div style={{ position: 'absolute', left: BOARD.x, top: BOARD.y, transform: 'rotate(-6deg)', transformOrigin: '50% 50%' }}>
        <Envelope width={BOARD.w} label={ENVELOPES.board.label} tone={ENVELOPES.board.tone} icon="users" open={1} sealOpacity={0} glow={0.5} card={<EnvelopeAsk id="board" />} />
      </div>
      <div style={{ position: 'absolute', left: SOC.x, top: SOC.y, transform: 'rotate(5deg)', transformOrigin: '50% 50%' }}>
        <Envelope width={SOC.w} label={ENVELOPES.soc.label} tone={ENVELOPES.soc.tone} icon="bell" open={1} sealOpacity={0} glow={0.5} card={<EnvelopeAsk id="soc" />} />
      </div>

      {/* swap badge */}
      <svg width={190} height={190} viewBox="0 0 190 190" style={{ position: 'absolute', left: 1236, top: 640 }} aria-hidden>
        <circle cx={95} cy={95} r={86} fill={alpha(C.ink950, 0.92)} stroke={C.rose} strokeWidth={8} />
        <path d="M50 76 H128" stroke={C.rose} strokeWidth={10} strokeLinecap="round" />
        <path d="M110 54 L134 76 L110 98" fill="none" stroke={C.rose} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M140 116 H62" stroke={C.rose} strokeWidth={10} strokeLinecap="round" />
        <path d="M80 94 L56 116 L80 138" fill="none" stroke={C.rose} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 6, top: 296, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 112, lineHeight: 1.04 }}>Niveles de CTI</div>
        <div style={{ fontSize: 80, lineHeight: 1.1, color: '#c4b5fd', letterSpacing: -1.5 }}>y la Sliding Scale</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: 56, fontWeight: 700, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>el producto <span style={{ color: C.emerald }}>correcto</span></div>
        <div>para la persona <span style={{ color: C.cyan }}>correcta</span></div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Requirements
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
