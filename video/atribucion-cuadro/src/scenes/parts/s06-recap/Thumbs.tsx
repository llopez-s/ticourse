import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { LABEL_TEXT } from '../../../data/s06-recap';
import { MuseumLabel, Painting, SignatureCorner, paintingLayout, signatureCornerHeight } from '../Painting';

/**
 * The three thumbnails of the recap, cut from the video's one image (parts/Painting): the three bands of
 * the canvas, the corner with the signature and the date, and the museum label. Each waits, quiet, from the
 * `recap` cue and plays its own beat when its rule lights (`at`). Frames are local to the scene's Sequence.
 */

/** The slot every thumbnail is centred in. */
export const THUMB = { w: 236, h: 174 } as const;

const PAINTING_W = Math.floor(THUMB.h / 1.3);
const CORNER_W = 228;
const LABEL_W = 222;

/** A 0→1→0 swell that starts at `start`. */
const swell = (frame: number, start: number, hold = 14) => progress(frame, start, 8) * (1 - progress(frame, start + hold, 18, EASE.inOut));

/**
 * Rule 1 — the canvas in its three bands. They come out of the dark from the bottom up, one level at a time;
 * on `settleAt` («Tu red llega a la máquina») only the first one stays fully lit, as s03 left it.
 */
export function BandsThumb({ frame, at, settleAt }: { frame: number; at: number; settleAt: number }) {
  const L = paintingLayout(PAINTING_W);
  const up = [0, 1, 2].map((i) => progress(frame, at + i * 8, 12));
  const settle = progress(frame, settleAt - 2, 18, EASE.inOut);
  const ambient = [mix(0.3, 1, up[0]), mix(0.3, 1, up[1]) * mix(1, 0.48, settle), mix(0.3, 1, up[2]) * mix(1, 0.14, settle)] as [number, number, number];
  const focus = [Math.max(swell(frame, at), 0.95 * settle), swell(frame, at + 8), swell(frame, at + 16)] as [number, number, number];
  return (
    // The part's box reaches the easel's feet even without an easel: centre on the frame alone.
    <div style={{ width: L.w, height: L.h }}>
      <Painting width={PAINTING_W} easel={0} split={1} ambient={ambient} focus={focus} lineWeight={2.6} />
    </div>
  );
}

/**
 * Rule 2 — the corner of the canvas, enlarged. A flourish is already there; on `at` a hand adds the rest
 * (the underline and the date) in a moment, and all of it turns amber: cheap to forge.
 */
export function SignatureThumb({ frame, at }: { frame: number; at: number }) {
  const stroke = progress(frame, at + 2, 22, EASE.inOut);
  const hand = progress(frame, at - 2, 8) * (1 - progress(frame, at + 26, 10, EASE.inOut));
  const lit = progress(frame, at + 22, 14);
  const h = signatureCornerHeight(CORNER_W);
  return (
    <div style={{ position: 'relative', width: CORNER_W, height: h }}>
      {/* Half lit: at this size a fully amber stroke is lost on the canvas ground; the frame carries the amber. */}
      <SignatureCorner width={CORNER_W} paint={mix(0.68, 1, stroke)} hand={hand} lit={0.3 * lit} />
      <div style={{ position: 'absolute', inset: -2, boxSizing: 'border-box', borderRadius: 11, border: `4px solid ${alpha(C.amber, lit)}`, boxShadow: `0 0 ${Math.round(22 * lit)}px ${alpha(C.amber, 0.45 * lit)}` }} />
    </div>
  );
}

/** Rule 3 — the museum label; its edge turns emerald on `litAt` («con su confianza»). */
export function LabelThumb({ frame, litAt }: { frame: number; litAt: number }) {
  return <MuseumLabel width={LABEL_W} text={LABEL_TEXT} textSize={28} lit={progress(frame, litAt - 2, 14)} />;
}
