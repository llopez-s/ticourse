import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { STATION_KINDS, StationGlyph } from './scenes/parts/Glyphs';
import { Ticket } from './scenes/parts/Ticket';

ensureFonts();

/**
 * Poster / YouTube thumbnail for «Antes de recoger nada: la pregunta». Big title on the left («la pregunta» huge in
 * cyan under «Antes de recoger nada:») for small-size legibility; on the right the video's one image, the
 * restaurant: a blank comanda with a big question mark on it, and the six stations of the cycle waiting for it
 * (the first and the last in amber, «las que más se olvidan»).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const TILE = 136;
  const GAP = 14;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the image */}
      <div style={{ position: 'absolute', left: 900, top: 180, width: 1000, height: 760, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.14)} 0%, transparent 100%)` }} />

      {/* the blank comanda, tilted, and the six stations */}
      <div style={{ position: 'absolute', left: 1010, top: 330, transform: 'rotate(-3deg)', transformOrigin: '50% 50%' }}>
        <Ticket width={300} height={440} title="COMANDA" question={1} />
      </div>
      <div style={{ position: 'absolute', left: 1320, top: 475 }}>
        <Icon name="arrowRight" size={56} color={C.cyan} strokeWidth={2.8} />
      </div>
      <div style={{ position: 'absolute', left: 1388, top: 373, display: 'grid', gridTemplateColumns: `repeat(3, ${TILE}px)`, gap: GAP }}>
        {STATION_KINDS.map((k, i) => {
          const tone = i === 0 || i === 5 ? C.amber : C.cyan;
          return (
            <div key={k} style={{ width: TILE, height: TILE, boxSizing: 'border-box', display: 'grid', placeItems: 'center', borderRadius: 34, border: `4px solid ${alpha(tone, 0.8)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`, boxShadow: `0 0 36px ${alpha(tone, 0.22)}` }}>
              <StationGlyph kind={k} size={92} color={tone} strokeWidth={3} />
            </div>
          );
        })}
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 6, top: 262, fontWeight: 850, letterSpacing: -2, color: C.textStrong }}>
        <div style={{ fontSize: 72, lineHeight: 1.02, whiteSpace: 'nowrap' }}>Antes de recoger nada:</div>
        <div style={{ marginTop: 6, fontSize: 152, lineHeight: 1, whiteSpace: 'nowrap', color: C.cyan, textShadow: `0 0 40px ${alpha(C.cyan, 0.3)}` }}>la pregunta</div>
        <div style={{ marginTop: 26, fontSize: 48, fontWeight: 750, letterSpacing: -0.5, color: C.cyanSoft, whiteSpace: 'nowrap' }}>el ciclo de inteligencia y los PIRs</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="cyan" icon="mortarboard" size={30}>
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
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>Material independiente, no afiliado a SANS/GIAC.</div>
    </AbsoluteFill>
  );
}
