import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { KillChain, killChainLayout, type PhaseId } from './scenes/parts/KillChain';

ensureFonts();

// The chain on the right half (absolute 1920×1080 coordinates): four links of the seven, the box that nobody opens.
const IDS: readonly PhaseId[] = ['delivery', 'exploitation', 'installation', 'c2'];
const CHAIN = { x: 990, y: 380, w: 860 } as const;
const LAYOUT_CHAIN = killChainLayout(CHAIN.w, { ids: IDS });

/**
 * Poster / YouTube thumbnail for «La Cyber Kill Chain: basta con romper un eslabón». Big two-line title on the left
 * for small-size legibility; on the right, the video's thesis in one glance, drawn with the shared KillChain part:
 * the box at the door (Delivery), the box nobody opens (Exploitation, the link snapped in emerald) and the steps
 * after it gone grey — «esta se queda en la puerta».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const brk = LAYOUT_CHAIN.slot('exploitation')!;
  const ringX = CHAIN.x + brk.x + brk.w + LAYOUT_CHAIN.gap / 2;
  const ringY = CHAIN.y + LAYOUT_CHAIN.slotH / 2;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft emerald halo on the broken link */}
      <div
        style={{
          position: 'absolute',
          left: ringX - 260,
          top: ringY - 260,
          width: 520,
          height: 520,
          background: `radial-gradient(closest-side, ${alpha(C.emerald, 0.16)} 0%, transparent 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: CHAIN.x, top: CHAIN.y }}>
        <KillChain
          width={CHAIN.w}
          ids={IDS}
          frame={0}
          links={1}
          names={1}
          looks={{
            delivery: { tone: C.cyan, lit: 0.6 },
            exploitation: { broken: 1, tone: C.emerald, lit: 0.8 },
            installation: { grey: 1 },
            c2: { grey: 1 },
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
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>La Cyber</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>Kill Chain</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 650, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>basta con romper</div>
        <div style={{ color: '#6ee7b7' }}>un eslabón</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Intrusion Analysis
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
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
