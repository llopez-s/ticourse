import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { ListHands } from './scenes/parts/ListHands';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - 800 + 30, y: 270, w: 800 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Quién decide, quién aplica y quién responde». The series' layout: the brand, a big
 * two-line title («Quién» white, «decide» sky, as in s01), the subtitle, the objective and length chips. On the
 * right, ONE image from the video: its thread, the passenger list with five hands reaching for it, the one that
 * decides lit. No dates, no names.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: ART.x, top: ART.y }}>
        <ListHands width={ART.w} glow={1} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: two big lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 270, fontSize: 170, fontWeight: 900, letterSpacing: -6, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>Quién</div>
        <div style={{ color: C.sky }}>decide</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 640, fontSize: 56, fontWeight: 700, letterSpacing: -1, lineHeight: 1.12, color: C.text, whiteSpace: 'nowrap' }}>
        <div>Owner, custodian, steward,</div>
        <div>controller y processor</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 800, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 5.1
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
