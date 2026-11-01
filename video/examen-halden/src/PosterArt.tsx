import { ExamScreenArt, SCREEN_ART } from './scenes/parts/ExamScreenArt';
import { PortArt } from './scenes/parts/PortArt';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: SCREEN_ART.w, h: SCREEN_ART.h } as const;

/**
 * The video in one image: the blank exam screen («1 / 90», «90:00») with the night port in its body, as if the port were
 * the question. No dates, no names, no text beyond the screen's own counter and timer.
 */
export function PosterArt() {
  const bodyH = SCREEN_ART.h - SCREEN_ART.header - 6;
  return (
    <ExamScreenArt glow={1}>
      <div style={{ position: 'relative', width: SCREEN_ART.w - 6, height: bodyH, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: -64 }}>
          <PortArt frame={false} />
        </div>
      </div>
    </ExamScreenArt>
  );
}
