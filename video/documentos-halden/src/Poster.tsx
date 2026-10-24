import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { POSTER_ART, PosterArt } from './PosterArt';
import { PLAQUE, POSTER_TITLE } from './data/canon';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 10, y: 300 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Cuatro papeles: qué obliga y qué solo aconseja». The series' layout: the brand, a big
 * title in three lines (the last two in cyan, so it stays legible small), the subtitle in two lines, the objective and
 * length chips. On the right, ONE image from the video: the four sheets, each with its real name and whether it
 * obliges. No dates, no names.
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
      <div style={{ position: 'absolute', left: left - 6, top: 262, fontSize: 104, fontWeight: 850, letterSpacing: -3, lineHeight: 1.04, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>{POSTER_TITLE[0]}</div>
        <div style={{ color: C.cyan }}>{POSTER_TITLE[1]}</div>
        <div style={{ color: C.cyan }}>{POSTER_TITLE[2]}</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 640, fontSize: 52, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: C.text, whiteSpace: 'nowrap' }}>
        <div>Policy, standard,</div>
        <div>procedure y guideline</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 836, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · {PLAQUE}
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
