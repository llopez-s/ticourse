import type { RecapThumb } from '../../../data/s08-cierre';
import { Illustration } from '../../../../../engine/src/ui/Illustration';

export const THUMB = { w: 390, h: 176 } as const;

/** Zoom origin (image fraction) that brings image point `t` to the middle of the plate at scale `z` (focus 0.5). */
const originFor = (t: number, z: number) => (z === 1 ? 0.5 : (t * z - 0.5) / (z - 1));

/**
 * One idea's image: a small still crop of the art it was told with (no text of its own, nothing readable in it). The
 * crop is a constant zoom of <Illustration> about a computed origin, so it never moves.
 */
export function Thumb({ thumb, glow = 0 }: { thumb: RecapThumb; glow?: number }) {
  const z = thumb.zoom;
  return (
    <Illustration
      src={thumb.src}
      width={THUMB.w}
      height={THUMB.h}
      radius={16}
      saturate={thumb.saturate ?? 1}
      mono={thumb.mono ?? false}
      dim={0.12 * (1 - glow)}
      zoom={{ from: z, to: z, start: 0, end: 1 }}
      zoomOrigin={{ x: originFor(thumb.u, z), y: originFor(thumb.v, z) }}
    />
  );
}
