import { C } from '../../../../engine/src/theme/tokens';
import { Hand } from './Hand';
import { ListSheet, SHEET } from './Sheet';

/** The passenger list and the five hands around it, in the coordinates of s01's group (1728×660). */
export const SHEET_W = 560;
export const SHEET_H = (SHEET.h * SHEET_W) / SHEET.w;
export const CENTER = { x: 864, y: 316 } as const;
export const HANDS = [
  { cx: 440, cy: 300, angle: 84 },
  { cx: 540, cy: 138, angle: 129 },
  { cx: 1188, cy: 138, angle: -129 },
  { cx: 1288, cy: 300, angle: -84 },
  { cx: 864, cy: 590, angle: 0 },
] as const;
/** The hand that decides. */
export const THE_ONE = 1;
export const HAND_SIZE = 128;

/** The cropped box (in group coordinates) that holds the sheet and the hands. */
const CROP = { x: 380, y: 66, w: 968, h: 596 } as const;

/**
 * The video's image in one picture (poster and end card): the passenger list with five hands reaching for it, one of
 * them lit — the one that decides. Drawn at `width` px; the other hands are dim.
 */
export function ListHands({ width, glow = 0.8 }: { width: number; glow?: number }) {
  const k = width / CROP.w;
  return (
    <div style={{ position: 'relative', width, height: CROP.h * k }}>
      <div style={{ position: 'absolute', left: -CROP.x * k, top: -CROP.y * k, width: 1728, height: 660, transformOrigin: '0 0', transform: `scale(${k})` }}>
        <div style={{ position: 'absolute', left: CENTER.x - SHEET_W / 2, top: CENTER.y - SHEET_H / 2 }}>
          <ListSheet width={SHEET_W} glow={0.5} />
        </div>
        {HANDS.map((h, i) => (
          <Hand key={i} cx={h.cx} cy={h.cy} angle={h.angle} size={HAND_SIZE} tone={i === THE_ONE ? C.cyan : C.sky} glow={i === THE_ONE ? glow : 0} opacity={i === THE_ONE ? 1 : 0.55} />
        ))}
      </div>
    </div>
  );
}

export const LIST_HANDS_ASPECT = CROP.h / CROP.w;
