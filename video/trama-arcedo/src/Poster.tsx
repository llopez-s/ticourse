import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { PLAQUE } from './data/case';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The thumbnail background: the van with the open amber box under a warm spotlight. No text in it. */
const BACKGROUND = 'art/thumb/miniatura-fondo.png';

/**
 * The track's own disclaimer: the affiliation the engine uses for `opo` (AFFILIATION.opo in
 * video/engine/scripts/lib/profiles.mjs, a Node module the composition cannot import). Keep the two in step.
 */
const DISCLAIMER = 'Material independiente, no afiliado a ninguna administración pública.';

/** How far right the picture is pushed, so the van sits clear of the text column. */
const SHIFT = 300;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «De la trama al segmento: tres envoltorios y una pregunta en voz alta». The series'
 * layout (brand, a big title, the subtitle, the track and length chips, the disclaimer) over ONE image: the delivery van
 * with the letter, envelope and box in its open back, pushed right and darkened on the left so the text reads at
 * thumbnail size. Every letter is drawn here; the image
 * carries none. No dates, no names, no addresses.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text, background: C.ink950 }}>
      {/* 2752×1536 on 1920×1080 (cropped 4 px top and bottom), pushed right; its left edge falls under the dense veil */}
      <Img src={staticFile(BACKGROUND)} style={{ position: 'absolute', left: SHIFT, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* night veil: dense under the text, open over the lit zone on the right */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${alpha(C.ink950, 0.94)} 0%, ${alpha(C.ink950, 0.88)} 38%, ${alpha(C.ink950, 0.45)} 62%, ${alpha(C.ink950, 0.05)} 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${alpha(C.ink950, 0.55)} 0%, ${alpha(C.ink950, 0)} 22%, ${alpha(C.ink950, 0)} 80%, ${alpha(C.ink950, 0.7)} 100%)` }} />

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: two big lines for thumbnail legibility */}
      <div
        style={{
          position: 'absolute',
          left: left - 8,
          top: 262,
          fontSize: 120,
          fontWeight: 850,
          letterSpacing: -5,
          lineHeight: 1.02,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          textShadow: `0 6px 40px ${alpha(C.ink950, 0.9)}`,
        }}
      >
        <div style={{ fontSize: 210, letterSpacing: -6 }}>TRAMA</div>
        <div style={{ color: C.cyan }}>y segmento</div>
      </div>

      {/* subtitle */}
      <div
        style={{
          position: 'absolute',
          left,
          top: 620,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: -1,
          lineHeight: 1.1,
          color: C.text,
          whiteSpace: 'nowrap',
          textShadow: `0 4px 24px ${alpha(C.ink950, 0.95)}`,
        }}
      >
        tres envoltorios y una pregunta
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30} style={{ background: alpha(C.ink950, 0.8) }}>
            {PLAQUE}
          </Chip>
          <Chip accent="muted" icon="clock" size={30} style={{ background: alpha(C.ink950, 0.8) }}>
            {durationLabel()}
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted, background: alpha(C.ink950, 0.8) }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.muted }}>{DISCLAIMER}</div>
    </AbsoluteFill>
  );
}
