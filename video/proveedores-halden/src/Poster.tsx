import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { RopeScene } from './scenes/parts/RopeScene';
import { FULL_TITLE, PLAQUE } from './data/canon';
import { TIMELINE } from './timeline/load';

ensureFonts();

const ART_SCALE = 0.7;
/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - 800 * ART_SCALE + 8, y: 400 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Proveedores: antes de firmar, al firmar y después». The series' layout: the brand, a
 * big title (three lines, the last in cyan, so it stays legible small), the subtitle in two lines, the objective and
 * length chips. On the right, ONE image from the video: the port, the crate of documents that left and the rope that
 * still ties them, with «responsabilidad» on it. No dates, no names.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: ART.x, top: ART.y }}>
        <RopeScene scale={ART_SCALE} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: three big lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 262, fontSize: 104, fontWeight: 850, letterSpacing: -3.5, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>{FULL_TITLE[0]}</div>
        <div>{FULL_TITLE[1]}</div>
        <div style={{ color: C.cyan }}>{FULL_TITLE[2]}</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 694, fontSize: 52, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: C.text, whiteSpace: 'nowrap' }}>
        <div>Riesgo de terceros: vendor assessment,</div>
        <div>SLA, MSA, SOW y NDA</div>
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
