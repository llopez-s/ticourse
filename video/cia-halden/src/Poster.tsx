import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { POSTER_ART, PosterArt } from './PosterArt';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 30, y: 290 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Qué se rompe, quién toca y cuánto falta». The series' layout: the brand, a big title
 * («Qué se rompe, quién toca» white, «y cuánto falta» cyan, in three lines so it stays legible small), the subtitle, the objective
 * and length chips. On the right, ONE image from the video: the declaration sheet with its four question badges, in
 * front of the harbour mouth. No dates, no names, no figures.
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
      <div style={{ position: 'absolute', left: left - 6, top: 262, fontSize: 118, fontWeight: 850, letterSpacing: -4, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>Qué se rompe,</div>
        <div>quién toca</div>
        <div style={{ color: C.cyan }}>y cuánto falta</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 668, fontSize: 60, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: C.text, whiteSpace: 'nowrap' }}>
        CIA, AAA y gap analysis
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 786, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 1.2
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
