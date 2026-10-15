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

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 26, y: 250 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide». The
 * series' layout: the brand, a big two-line title («Lo prometido» white, «y lo medido» cyan), the
 * subtitle with the four terms, the objective and length chips. On the right, ONE image from the
 * video: the café's clock, dead till and notebook over the promise bar (RTO 30 min) against the
 * measured one (MTTR 80 min). No adversary, no dates, no names, no euros.
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

      {/* title: two big lines for small-size legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 270, fontSize: 134, fontWeight: 850, letterSpacing: -4, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
        <div style={{ color: C.textStrong }}>Lo prometido</div>
        <div style={{ color: C.cyan }}>y lo medido</div>
      </div>

      {/* subtitle: the four terms */}
      <div style={{ position: 'absolute', left, top: 566, fontSize: 56, fontWeight: 750, letterSpacing: -1, color: C.text, whiteSpace: 'nowrap' }}>
        <Term color={C.amber}>RTO</Term>, <Term color={C.amber}>RPO</Term>, <Term color={C.roseSoft}>MTTR</Term> y <Term color={C.roseSoft}>MTBF</Term>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 5.2
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

function Term({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, fontWeight: 850 }}>{children}</span>;
}
