import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Checkpoint, checkpointSize } from './scenes/parts/Checkpoint';
import { Napkin, napkinSize } from './scenes/parts/Napkin';
import { BlueprintPanel, ZoneBox, type ZoneId } from './scenes/parts/ZoneRow';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The still frame every shared part is drawn at (no `at`: fully drawn). */
const F = 0;

/** Today's napkin, behind and tilted, top right (absolute 1920×1080 coordinates). */
const NAP_W = 820;
const NAP = { x: 1018, y: 128, ...napkinSize(NAP_W) };

/** The new plan in front of it: three blueprint zones with a planned checkpoint between each two. */
const PANEL = { x: 940, y: 610, w: 890, h: 336 } as const;
const ZONE_IDS: readonly ZoneId[] = ['dmz', 'interna', 'gestion'];
const BOX = { w: 206, h: 236, top: 72 } as const;
const GAP = (PANEL.w - 60 - BOX.w * ZONE_IDS.length) / (ZONE_IDS.length - 1);
const GATE_W = 104;
const GATE_H = checkpointSize(GATE_W, { fence: false }).h;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Zonas de seguridad: dónde va cada cosa y qué
 * pasa si falla». Big two-line title on the left for small-size legibility,
 * «seguridad» in cyan; on the right, the video's story in two images: today's
 * hand-drawn napkin behind (tilted, pushed back) and, in front of it, the new
 * plan as a clean blueprint — three zones with their confidence (DMZ «baja»,
 * interna «media», gestión «máxima») and a planned checkpoint on each
 * frontier. Badge Security+ · SY0-701 · 3.2.
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

      {/* today: the napkin, behind */}
      <div style={{ position: 'absolute', left: NAP.x, top: NAP.y, transform: 'rotate(3.2deg)', transformOrigin: 'center', opacity: 0.9 }}>
        <Napkin width={NAP_W} frame={F} />
        {/* push it back: a dark wash heavier towards the plan */}
        <div
          style={{
            position: 'absolute',
            inset: -6,
            background: `linear-gradient(180deg, ${alpha(C.ink950, 0.18)} 0%, ${alpha(C.ink950, 0.5)} 70%, ${alpha(C.ink950, 0.7)} 100%)`,
            borderRadius: 10,
          }}
        />
      </div>

      {/* the plan: three zones on blueprint paper, a checkpoint on each frontier */}
      <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, transform: 'rotate(-1.4deg)', boxShadow: `0 40px 90px ${alpha('#000000', 0.55)}`, borderRadius: 16 }}>
        <BlueprintPanel width={PANEL.w} height={PANEL.h} glow={0.35}>
          {ZONE_IDS.map((z, i) => (
            <div key={z} style={{ position: 'absolute', left: 30 + i * (BOX.w + GAP), top: BOX.top }}>
              <ZoneBox zone={z} width={BOX.w} height={BOX.h} focus={z === 'dmz' ? 0.5 : 0.2} />
            </div>
          ))}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 30 + BOX.w + i * (BOX.w + GAP) + (GAP - GATE_W) / 2,
                top: BOX.top + BOX.h / 2 - GATE_H / 2,
              }}
            >
              <Checkpoint width={GATE_W} fence={false} look="plan" state="powered" frame={F} />
            </div>
          ))}
        </BlueprintPanel>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Zonas de</div>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>seguridad</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 572, fontSize: 52, fontWeight: 700, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>dónde va cada cosa</div>
        <div>
          y qué pasa <span style={{ color: '#fcd34d' }}>si falla</span>
        </div>
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
