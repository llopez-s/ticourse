import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { StormIcon } from './scenes/parts/Icons';

ensureFonts();

/** The ICD 203 bands as proportions of the 0–100 bar (1–5, 5–20, 20–45, 45–55, 55–80, 80–95, 95–99). */
const BANDS = [4, 15, 25, 10, 25, 15, 4] as const;
const LIKELY = 4;
const BAR_X = 1040;
const BAR_W = 760;
const BAR_Y = 770;
const BAR_H = 70;

/**
 * Poster / YouTube thumbnail for «Escribir para quien decide». Big title on the left («Escribir»
 * huge in cyan, «para quien decide» under it) for small-size legibility; on the right, the video's
 * leading image: the storm and its forecast — a storm cloud over the probability bar with the
 * «probable» band lit and the pointer at «70 % de lluvia».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const ptr = BAR_X + 0.7 * BAR_W;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the storm */}
      <div style={{ position: 'absolute', left: BAR_X - 200, top: 150, width: BAR_W + 400, height: 760, background: `radial-gradient(closest-side, ${alpha(C.amber, 0.16)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: BAR_X + 40, top: 190, transform: 'rotate(-2deg)' }}>
        <StormIcon size={680} variant="warning" tone={C.amber} glow={0.8} />
      </div>

      {/* the forecast: the probability bar with «probable» lit */}
      <div style={{ position: 'absolute', left: BAR_X, top: BAR_Y, width: BAR_W, height: BAR_H, display: 'flex', gap: 4 }}>
        {BANDS.map((b, i) => {
          return (
            <div key={i} style={{ flex: b, borderRadius: 8, background: i === LIKELY ? C.cyan : alpha(C.cyan, 0.2), border: `3px solid ${alpha(C.cyan, i === LIKELY ? 1 : 0.45)}`, boxShadow: i === LIKELY ? `0 0 34px ${alpha(C.cyan, 0.5)}` : undefined }} />
          );
        })}
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={`M${ptr - 20} ${BAR_Y - 36} L${ptr + 20} ${BAR_Y - 36} L${ptr} ${BAR_Y - 6} Z`} fill={C.textStrong} />
      </svg>
      <div style={{ position: 'absolute', left: BAR_X, top: BAR_Y + BAR_H + 22, width: BAR_W, textAlign: 'center', fontSize: 62, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
        probable <span style={{ color: C.cyan }}>·</span> 70 % <span style={{ color: C.sky }}>de lluvia</span>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: «Escribir» huge, the rest under it */}
      <div style={{ position: 'absolute', left: left - 8, top: 252, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 196, lineHeight: 1, color: C.cyan, whiteSpace: 'nowrap', textShadow: `0 0 40px ${alpha(C.cyan, 0.3)}` }}>Escribir</div>
        <div style={{ marginTop: 14, fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>para quien</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>decide</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="cyan" icon="mortarboard" size={30}>
            GCTI · Dissemination
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
