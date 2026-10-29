import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Bus, Rider, StopPost } from './scenes/parts/Figures';
import { Odometer } from './scenes/parts/Odometer';

ensureFonts();

/** The image on the right half (absolute 1920×1080 coordinates). */
const ART = { x: 990, roadY: 800 };
const BUS_W = 640;

/**
 * Poster / YouTube thumbnail for «Métricas, feedback y madurez». Big two-line
 * title on the left for small-size legibility; on the right, the video's
 * image: a counter that only blurs and rises, struck out, above a bus whose
 * windows are full and whose travellers have arrived. Counting is not proving.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the image */}
      <div
        style={{
          position: 'absolute',
          left: ART.x - 140,
          top: 180,
          width: 1000,
          height: 760,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.14)} 0%, transparent 100%)`,
        }}
      />

      {/* the struck counter */}
      <div style={{ position: 'absolute', left: ART.x + 40, top: 236, padding: '26px 34px', borderRadius: 28, border: `3px solid ${alpha(C.rose, 0.6)}`, background: alpha(C.ink900, 0.92) }}>
        <Odometer frame={50} startAt={0} digits={6} size={92} color={C.cyan} grow={1} blur={11} />
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
          <line x1="4" y1="92" x2="96" y2="8" stroke={C.rose} strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* road, stop, bus and travellers */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <line x1={ART.x - 20} y1={ART.roadY} x2={1860} y2={ART.roadY} stroke={C.ink600} strokeWidth="16" strokeLinecap="round" />
        <line x1={ART.x - 20} y1={ART.roadY} x2={1860} y2={ART.roadY} stroke={C.ink500} strokeWidth="3.5" strokeDasharray="18 24" />
      </svg>
      <div style={{ position: 'absolute', left: ART.x, top: ART.roadY - (BUS_W * 139) / 320 - 2 }}>
        <Bus width={BUS_W} riders={[1, 1, 0, 1, 1]} />
      </div>
      <div style={{ position: 'absolute', left: 1784, top: ART.roadY - 170 }}>
        <StopPost size={160} color={C.emerald} lit={1} />
      </div>
      <div style={{ position: 'absolute', left: 1650, top: ART.roadY + 6 - 150 }}>
        <Rider size={150} />
      </div>
      <div style={{ position: 'absolute', left: 1722, top: ART.roadY + 6 - 132, opacity: 0.9 }}>
        <Rider size={132} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: ART.x + 520,
          top: ART.roadY - 360,
          width: 84,
          height: 84,
          borderRadius: 42,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.emerald, 0.2),
          border: `5px solid ${C.emerald}`,
          boxShadow: `0 0 40px ${alpha(C.emerald, 0.4)}`,
        }}
      >
        <Icon name="check" size={52} color={C.emerald} strokeWidth={3} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 292, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 138, lineHeight: 1.04 }}>Métricas,</div>
        <div style={{ fontSize: 86, lineHeight: 1.12 }}>
          feedback y <span style={{ color: C.cyanSoft }}>madurez</span>
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 590, fontSize: 48, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        <div>cómo demuestra su valor</div>
        <div>un equipo de inteligencia</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 744, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Dissemination
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
