import { C } from '../../../../engine/src/theme/tokens';
import { SIL_RATIO, SILHOUETTES, Silhouette } from './Silhouettes';

/** Width and height of a resting row of the three silhouettes at silhouette width `w` (gap = w / 6). */
export function silhouetteRowSize(w: number) {
  const gap = Math.round(w / 6);
  return { w: 3 * w + 2 * gap, h: w * SIL_RATIO, gap };
}

/**
 * The video's image at rest (end card, poster): the three silhouettes in a row, eyes open, blind spots shaded, the door
 * onto the street in amber (the third look). `glow` brightens all three.
 */
export function SilhouetteRow({ width, glow = 0, id }: { width: number; glow?: number; id: string }) {
  const { w, h, gap } = silhouetteRowSize(width);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {SILHOUETTES.map((kind, k) => (
        <div key={kind} style={{ position: 'absolute', left: k * (width + gap), top: 0 }}>
          <Silhouette kind={kind} width={width} lit={glow} tone={kind === 'door' ? C.amber : C.cyan} id={`${id}-${k}`} />
        </div>
      ))}
    </div>
  );
}
