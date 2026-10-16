import type { ReactNode } from 'react';
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

/** The airport on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 20, y: 1080 - 150 - POSTER_ART.h } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «YARA y Sigma: del indicador a la regla». The series' layout: the brand,
 * the two rule languages huge on two lines (cyan: the analyst's rules), the rest of the title under it, the
 * objective and length chips. On the right, the video's one image: the airport — the scanner that looks
 * inside the suitcase (YARA) and the gate's logbook read through a magnifying glass (Sigma). No hash, no
 * date, no host.
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

      {/* title: the two rule languages, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 262, fontSize: 184, fontWeight: 850, letterSpacing: -6, lineHeight: 1, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>
          <Word color={C.cyan}>YARA</Word>
        </div>
        <div>
          y <Word color={C.cyan}>Sigma</Word>
        </div>
      </div>

      {/* the rest of the title */}
      <div style={{ position: 'absolute', left, top: 646, fontSize: 60, fontWeight: 700, letterSpacing: -1, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        del indicador <Word color={C.cyanSoft}>a la regla</Word>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Dissemination
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
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

function Word({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, fontWeight: 850 }}>{children}</span>;
}
