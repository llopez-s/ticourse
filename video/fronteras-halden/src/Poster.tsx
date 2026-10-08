import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { EntranceGate, entranceGateSize } from './scenes/parts/EntranceGate';
import { ContainerIcon } from './scenes/parts/Shipment';
import { Sites, sitesLayout } from './scenes/parts/Sites';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The still frame every shared part is drawn at (no `at`: fully drawn). */
const F = 0;

/** The two sites and the corridor between them, behind and tilted, top right (absolute 1920×1080 coordinates). */
const SITES = { x: 1000, y: 100, width: 860, height: 370 } as const;
/** The Sites drawing is rendered larger than the panel and centred on the corridor (a close-up). */
const SITES_ZOOM = 1300;
const ZL = sitesLayout(SITES_ZOOM);
const SITES_CROP = {
  dx: SITES.width / 2 - (ZL.corridor.x0 + ZL.corridor.x1) / 2,
  dy: SITES.height / 2 - ZL.corridor.cy + 10,
} as const;

/** The compound's entrance gate in front of it, on its own dark panel. */
const GATE_W = 780;
const GATE = entranceGateSize(GATE_W);
const PANEL = { x: 930, y: 586, pad: 30, w: GATE_W + 60, h: GATE.h + 60 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Por dónde se entra: 802.1X, VPN e IPSec», the pair of V16's: same left
 * column (brand, big two-line title with its second line cyan, subtitle, chips, disclaimer) and, on the
 * right, the video's own images: the two sites with the covered corridor across the street and the
 * container travelling in it (site-to-site VPN, IPSec in tunnel mode), behind and tilted; in front, the
 * compound's entrance gate (802.1X) — the office said yes and the gate rolls open. Badge Security+ ·
 * SY0-701 · 3.2. No dates, no hostnames.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the art */}
      <div
        style={{
          position: 'absolute',
          left: 940,
          top: 80,
          width: 980,
          height: 980,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.12)} 0%, transparent 100%)`,
        }}
      />

      {/* the two sites and the corridor, behind */}
      <div
        style={{
          position: 'absolute',
          left: SITES.x,
          top: SITES.y,
          width: SITES.width,
          height: SITES.height,
          transform: 'rotate(3deg)',
          transformOrigin: 'center',
          borderRadius: 18,
          background: C.ink900,
          border: `2px solid ${alpha(C.cyan, 0.35)}`,
          boxShadow: `0 30px 80px ${alpha('#000000', 0.5)}`,
          overflow: 'hidden',
        }}
      >
        {/* A close-up on the corridor (the drawing is larger than the panel and clipped). No labels: the
            picture reads on its own, and the names would be cut */}
        <div style={{ position: 'absolute', left: SITES_CROP.dx, top: SITES_CROP.dy }}>
          <Sites
            width={SITES_ZOOM}
            labels={false}
            packet={0.5}
            cargo={(s) => <ContainerIcon width={205 * s} glow={0.5} />}
            focus={{ corridor: 0.6 }}
            autoDim={false}
            frame={F}
          />
        </div>
        {/* push it back: a dark wash heavier towards the gate */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${alpha(C.ink950, 0.08)} 0%, ${alpha(C.ink950, 0.35)} 70%, ${alpha(C.ink950, 0.6)} 100%)`,
          }}
        />
      </div>

      {/* the compound's entrance gate, in front */}
      <div
        style={{
          position: 'absolute',
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          transform: 'rotate(-1.4deg)',
          borderRadius: 20,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          border: `3px solid ${alpha(C.cyan, 0.6)}`,
          boxShadow: `0 40px 90px ${alpha('#000000', 0.55)}, 0 0 40px ${alpha(C.cyan, 0.18)}`,
        }}
      >
        <div style={{ position: 'absolute', left: PANEL.pad, top: PANEL.pad }}>
          <EntranceGate width={GATE_W} card={1} call={1} check={1} answer={1} open={1} result={1} glow={0.25} frame={F} />
        </div>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Por dónde</div>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>se entra</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 572, fontSize: 60, fontWeight: 750, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap', letterSpacing: -0.8 }}>
        802.1X, VPN e IPSec
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 730, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 3.2
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
