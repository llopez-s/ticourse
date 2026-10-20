import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { TRAIN_ANCHORS, TRAIN_H, Train, trainWidth } from './scenes/parts/Train';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 640, h: 520 } as const;

const CARS = 2;
const SCALE = 600 / trainWidth(CARS);
const TRAIN_X = 20;
const TRAIN_Y = 250;

/**
 * The video in one image: the train — its locomotive lit as «kernel» (the part every carriage shares) and its
 * carriages as «contenedores». No dates, no names, no port.
 */
export function PosterArt() {
  const cars = TRAIN_ANCHORS.cars(CARS);
  const label = (text: string, x: number, color: string) => (
    <div style={{ position: 'absolute', left: TRAIN_X + x * SCALE, top: TRAIN_Y - 78, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-cyan">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={TRAIN_Y + 40} r={360} fill="url(#poster-cyan)" />
      </svg>
      <div style={{ position: 'absolute', left: TRAIN_X, top: TRAIN_Y, filter: `drop-shadow(0 0 22px ${alpha(C.cyan, 0.25)})` }}>
        <Train cars={CARS} scale={SCALE} loco={1} carsLit={1} />
      </div>
      {label('kernel', TRAIN_ANCHORS.loco, '#7dd3fc')}
      {label('contenedores', (cars.from + cars.to) / 2, C.cyanSoft)}
      <div style={{ position: 'absolute', left: TRAIN_X, top: TRAIN_Y + TRAIN_H * SCALE + 30, width: 600, height: 4, borderRadius: 2, background: alpha(C.muted, 0.25) }} />
    </div>
  );
}
