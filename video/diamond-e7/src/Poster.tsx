import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Diamond } from './scenes/parts/Diamond';

ensureFonts();

/**
 * Poster / YouTube thumbnail for «El Diamond Model en acción». Big two-line
 * title on the left for small-size legibility; the diamond of event E7 on the
 * right, with the Adversary corner left UNKNOWN (the video's thesis).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* the diamond sits in stage-local coordinates, shifted right */}
      <div style={{ position: 'absolute', left: 960, top: 190, width: 1728, height: 660 }}>
        <Diamond
          cx={430}
          cy={330}
          hw={300}
          hh={290}
          cardW={290}
          vertices={{
            adv: { unknown: true, question: false, glow: 0.6 },
            cap: { items: ['GLASS VIPER'], question: false },
            infra: { items: ['update-svc-cdn…'], question: false },
            vic: { items: ['ENG-WS-041'], question: false },
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
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Diamond</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>Model</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>en acción:</div>
        <div style={{ color: C.muted }}>el evento E7</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Intrusion Analysis
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~7 min
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
