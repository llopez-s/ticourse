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

/** The painting's frame on the right (absolute 1920×1080 coordinates); its lamp stands to its left. */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w - 28, y: 222 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Atribución: ¿quién fue? Los tres niveles y las pistas falsas». The
 * series' layout: the brand, the question as a big title for small-size legibility («¿Quién fue?»), the
 * rest of the title under it with its two halves in their colours (the levels cyan: what your network
 * gives you; the false clues amber: cheap to forge), the objective and length chips. On the right, the
 * video's ONE image: the painting on its easel, its three bands lit from the bottom up by the lamp «tu
 * telemetría», and the signed corner ringed in amber. It names nobody: no country, flag, map or language.
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

      {/* title: the question, big, for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 262, fontSize: 200, fontWeight: 850, letterSpacing: -7, lineHeight: 1.04, color: C.textStrong, whiteSpace: 'nowrap' }}>
        ¿Quién <span style={{ color: C.cyan }}>fue</span>?
      </div>

      {/* the rest of the title, its two halves in their colours */}
      <div style={{ position: 'absolute', left, top: 492, fontSize: 60, fontWeight: 700, letterSpacing: -1, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>
          Atribución: <Half color={C.cyanSoft}>tres niveles</Half>
        </div>
        <div>
          y <Half color="#fcd34d">pistas falsas</Half>
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Analysis
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

function Half({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, fontWeight: 850 }}>{children}</span>;
}
