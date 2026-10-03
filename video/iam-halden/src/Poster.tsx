import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { KeyCabinet, cabinetHeight } from './scenes/parts/Cabinet';

ensureFonts();

/** The still frame the cabinet is drawn at: its key already lent (takeAt far in the past). */
const F = 0;

/** The guardhouse cabinet on the right half (absolute 1920×1080 coordinates). */
const CAB = { x: 1004, w: 860 };
const CAB_Y = Math.round((1080 - cabinetHeight(CAB.w)) / 2) + 20;

/**
 * Poster / YouTube thumbnail for «Identidad y acceso: quién entra y hasta
 * dónde». Big two-line title on the left for small-size legibility; on the
 * right, the video's closing image: the guardhouse key cabinet with its
 * logbook, one master key lent out and glowing — nobody keeps the keys.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the cabinet */}
      <div
        style={{
          position: 'absolute',
          left: CAB.x - 80,
          top: CAB_Y - 60,
          width: CAB.w + 160,
          height: cabinetHeight(CAB.w) + 120,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.16)} 0%, transparent 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: CAB.x, top: CAB_Y }}>
        <KeyCabinet width={CAB.w} takeAt={-100} glow={0.6} keyGlow={1} logLines={['sale · 22:00', 'vuelve · 23:00']} frame={F} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 116, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Identidad</div>
        <div style={{ fontSize: 116, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>y acceso</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 562, fontSize: 54, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>quién entra y hasta dónde</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 4.6
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
