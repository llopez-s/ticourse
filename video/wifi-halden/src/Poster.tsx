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
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 26, y: 240 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «WPA3-Enterprise: de una clave para todos a una identidad para cada
 * uno». The series' layout: the brand, a big title for small-size legibility («WPA3»), the rest of
 * the title under it with its two halves in their colours (the shared key amber, the identity
 * emerald), the objective and length chips. On the right, ONE image from the video: three tablets
 * that share one combination padlock, and the same three with a carné each. No adversary, no dates,
 * no network name, and the padlock is closed.
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

      {/* title: one big word for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 10, top: 262, fontSize: 236, fontWeight: 850, letterSpacing: -8, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        WPA<span style={{ color: C.cyan }}>3</span>
      </div>

      {/* the rest of the title, its two halves in their colours */}
      <div style={{ position: 'absolute', left, top: 518, fontSize: 56, fontWeight: 700, letterSpacing: -1, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>
          de <Half color="#fcd34d">una clave</Half> para todos
        </div>
        <div>
          a <Half color="#6ee7b7">una identidad</Half> para cada uno
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 4.1
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

function Half({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, fontWeight: 850 }}>{children}</span>;
}
