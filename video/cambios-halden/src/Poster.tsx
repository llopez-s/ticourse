import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { POSTER_ART, PosterArt } from './PosterArt';
import { TITLE } from './data/canon';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 30, y: 360 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Antes, durante y después de un cambio». The series' layout: the brand, a big title
 * (three lines, the last in cyan, so it stays legible small), the subtitle in two lines, the objective and length chips.
 * On the right, ONE image from the video: the change request, ticked and stamped «cerrado». No dates, no names.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: ART.x, top: ART.y }}>
        <PosterArt />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: three big lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 262, fontSize: 128, fontWeight: 850, letterSpacing: -4, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>{TITLE[0]}</div>
        <div>{TITLE[1]}</div>
        <div style={{ color: C.cyan }}>{TITLE[2]}</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 694, fontSize: 52, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: C.text, whiteSpace: 'nowrap' }}>
        <div>Change management:</div>
        <div>proceso, impacto y documentación</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 836, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 1.3
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
