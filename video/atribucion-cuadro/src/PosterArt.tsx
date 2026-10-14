import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { S03_SPOT } from './data/s03-techo';
import { Painting, paintingLayout } from './scenes/parts/Painting';

/** The painting's frame, px wide, and how far left of it the lamp stands (design units, frame = 400). */
const PW = 452;
const SPOT_GAP = 236;

/** The poster's image: the frame's box and what overflows it (the lamp on the left, the feet below). */
export const POSTER_ART = { w: PW, layout: paintingLayout(PW, { spotGap: SPOT_GAP }) } as const;

/**
 * The video in one image, the same painting every scene draws: on its easel, cut in its three bands, with
 * the lamp «tu telemetría» lighting them from the bottom up (the first fully, the second barely, the third
 * left in the dark), and in the corner the signature and the date, ringed in amber: the cheap clue.
 * No country, flag, map, language or date: the signature is a flourish and the date four dashes.
 */
export function PosterArt() {
  const L = POSTER_ART.layout;
  return (
    <div style={{ position: 'relative', width: L.w, height: L.totalH }}>
      {/* a soft halo behind the canvas, and a warmer one behind the signed corner */}
      <div style={{ position: 'absolute', left: -220, top: -40, width: L.w + 440, height: L.h + 160, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.13)} 0%, transparent 100%)` }} />
      <div
        style={{
          position: 'absolute',
          left: L.corner.x - 90,
          top: L.corner.y - 80,
          width: L.corner.w + 180,
          height: L.corner.h + 160,
          background: `radial-gradient(closest-side, ${alpha(C.amber, 0.3)} 0%, transparent 100%)`,
        }}
      />
      <Painting
        width={PW}
        split={1}
        ambient={[1, 0.6, 0.16]}
        focus={[1, 0, 0]}
        signatureLit={1}
        cornerMark={1}
        spot={1}
        beam={1}
        beamEdge={1}
        spotGap={SPOT_GAP}
        lineWeight={1.9}
      />
      {/* The lamp's name, drawn here (not by the part) so it ends at the lamp's mouth, clear of the beam's upper edge */}
      <div
        style={{
          position: 'absolute',
          right: L.w - L.lamp.x + 6,
          top: L.lamp.y - 46 * L.s,
          transform: 'translateY(-100%)',
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.1,
          color: C.cyanSoft,
          whiteSpace: 'nowrap',
        }}
      >
        {S03_SPOT}
      </div>
    </div>
  );
}
