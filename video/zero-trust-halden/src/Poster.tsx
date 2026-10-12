import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Warehouse } from './scenes/parts/Warehouse';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The warehouse on the right (absolute 1920×1080 coordinates). */
const NAVE = { x: 1040, y: 250, w: 796, h: 576 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Zero Trust: quién decide, quién comunica y quién aplica». V12's
 * layout: the brand, a big title for small-size legibility («Zero Trust»), the question under it
 * with its three verbs bright, the objective and length chips. On the right, ONE image from the
 * video: the port warehouse in section — the oficina upstairs with the pedido on its desk and
 * the only tick, the administrativo at his printer, and downstairs the mozo in his hi-vis vest
 * with the printed order in his tray, between quien recoge and the shelf. No adversary, no
 * dates, no names.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the warehouse: the control plane's cyan */}
      <div
        style={{
          position: 'absolute',
          left: NAVE.x + NAVE.w / 2 - 560,
          top: NAVE.y + NAVE.h / 2 - 520,
          width: 1120,
          height: 1040,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.1)} 0%, transparent 100%)`,
        }}
      />

      <div style={{ position: 'absolute', left: NAVE.x, top: NAVE.y }}>
        <Warehouse
          width={NAVE.w}
          height={NAVE.h}
          variant="icon"
          requester={1}
          shelf={1}
          deskSlip={1}
          verdict={1}
          flows={{ request: 1, consult: 1, decision: 1, issue: 1 }}
          order={{ travel: 1, glow: 0.5 }}
          trayGlow={0.6}
        />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: one big line for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 280, fontSize: 176, fontWeight: 850, letterSpacing: -5, lineHeight: 1.04, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Zero <span style={{ color: C.cyan }}>Trust</span>
      </div>

      {/* the question, its three verbs bright */}
      <div style={{ position: 'absolute', left, top: 488, fontSize: 60, fontWeight: 700, letterSpacing: -1, lineHeight: 1.16, color: C.text, whiteSpace: 'nowrap' }}>
        <div>
          quién <Verb>decide</Verb>, quién <Verb>comunica</Verb>
        </div>
        <div>
          y quién <Verb>aplica</Verb>
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 1.2
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            {durationLabel()}
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

function Verb({ children }: { children: string }) {
  return <span style={{ color: C.textStrong, fontWeight: 850 }}>{children}</span>;
}
