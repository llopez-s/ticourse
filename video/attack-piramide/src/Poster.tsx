import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Pyramid } from './scenes/parts/Pyramid';

ensureFonts();

// The pyramid on the right half (absolute 1920×1080 coordinates).
const PYR = { x: 990, y: 214, w: 640, h: 660 };

/**
 * Poster / YouTube thumbnail for «Del comando al TTP». Big two-line title on
 * the left for small-size legibility; on the right, the video's thesis in one
 * glance: the Pyramid of Pain with the hash chip at its base in amber (cheap
 * to change) and the TTP rung lit emerald (what hurts to change).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* the pyramid, TTPs lit, the hash at the base */}
      <div style={{ position: 'absolute', left: PYR.x, top: PYR.y }}>
        <Pyramid
          width={PYR.w}
          height={PYR.h}
          frame={0}
          focus={{ ttps: 1, hash: 0.6 }}
          off={['ip']}
          slots={{
            hash: (
              <div
                style={{
                  padding: '8px 18px',
                  borderRadius: RADIUS.sm,
                  border: `3px solid ${C.amber}`,
                  background: `linear-gradient(180deg, ${alpha(C.amber, 0.24)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                  boxShadow: `0 0 30px ${alpha(C.amber, 0.45)}`,
                  fontFamily: FONT.mono,
                  fontSize: 36,
                  fontWeight: 800,
                  color: C.textStrong,
                }}
              >
                4c81...b3
              </div>
            ),
            ttps: (
              <div
                style={{
                  padding: '8px 18px',
                  borderRadius: RADIUS.sm,
                  border: `3px solid ${C.emerald}`,
                  background: `linear-gradient(180deg, ${alpha(C.emerald, 0.24)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                  boxShadow: `0 0 30px ${alpha(C.emerald, 0.45)}`,
                  fontFamily: FONT.mono,
                  fontSize: 36,
                  fontWeight: 800,
                  color: C.textStrong,
                }}
              >
                T1053.005
              </div>
            ),
          }}
        />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 310, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Del comando</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
          al <span style={{ color: C.emerald }}>TTP</span>
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>ATT&amp;CK y la</div>
        <div style={{ color: C.muted }}>Pyramid of Pain</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Intrusion Analysis
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
