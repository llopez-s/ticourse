import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Camera, CAMERA_RATIO } from '../Camera';
import { ControlTag } from '../ControlTag';
import { Recipe } from '../Recipe';

/** Height of the art slot of a rule card. */
export const ART_H = 190;

const TAG_W = 250;

/**
 * Rule 1 (the category): the video's two-box tag, compact, with only the top box filled — «Physical» lands a beat
 * after the card lights, so the eye goes to the box the rule is about; the type box stays empty (its question
 * faint).
 */
export function TagArt({ frame, at }: { frame: number; at: number }) {
  return <ControlTag frame={frame} width={TAG_W} hole={false} top="Physical" topAt={at + 10} />;
}

const TILE = { w: 196, h: 150, gap: 18 } as const;
const CAM_W = 132;

/** One sky: night (moon, a few stars) or day (a soft sun), the depot's palette from s04. */
function Tile({ mode, show }: { mode: 'night' | 'day'; show: number }) {
  const night = mode === 'night';
  const camH = CAM_W * CAMERA_RATIO;
  return (
    <div
      style={{
        position: 'relative',
        width: TILE.w,
        height: TILE.h,
        borderRadius: 18,
        overflow: 'hidden',
        background: night ? 'linear-gradient(180deg, #050913 0%, #0f1a30 100%)' : 'linear-gradient(180deg, #3b5585 0%, #8aa4c8 100%)',
        border: `2px solid ${alpha(C.text, 0.2)}`,
        boxShadow: `0 10px 26px ${alpha('#000000', 0.4)}`,
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      <svg width={TILE.w} height={TILE.h} style={{ position: 'absolute', left: 0, top: 0 }}>
        {night ? (
          <>
            <circle cx={TILE.w - 36} cy={32} r={15} fill="#e2e8f0" opacity={0.85} />
            <circle cx={TILE.w - 29} cy={27} r={13} fill="#08101f" />
            {[
              [26, 22],
              [62, 40],
              [104, 18],
              [140, 46],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill="#e2e8f0" opacity={0.7} />
            ))}
          </>
        ) : (
          <>
            <circle cx={TILE.w - 36} cy={32} r={24} fill={alpha('#fde68a', 0.25)} />
            <circle cx={TILE.w - 36} cy={32} r={14} fill="#fde68a" opacity={0.9} />
          </>
        )}
        {/* the ground */}
        <rect x={0} y={TILE.h - 22} width={TILE.w} height={22} fill={night ? '#0b1220' : '#334155'} />
      </svg>
      <div style={{ position: 'absolute', left: 14, top: TILE.h - 24 - camH - 8 }}>
        <Camera width={CAM_W} glow={night ? 0.35 : 0} />
      </div>
    </div>
  );
}

/**
 * Rule 2 (the type): the same camera twice, by night and by day — s04's two vignettes in miniature, textless (it
 * deters at night, it detects next morning: what it does depends on the case).
 */
export function CameraArt({ frame, at }: { frame: number; at: number }) {
  const night = progress(frame, at + 2, 14, EASE.out);
  const day = progress(frame, at + 12, 14, EASE.out);
  return (
    <div style={{ display: 'flex', gap: TILE.gap, alignItems: 'center' }}>
      <Tile mode="night" show={night} />
      <Tile mode="day" show={day} />
    </div>
  );
}

/** Rule 3 (compensating): the recipe without egg, a spoon of something else in its place (as in s06). */
export function RecipeArt({ frame, at }: { frame: number; at: number }) {
  return <Recipe width={220} egg="missing" substitute frame={frame} at={at + 2} />;
}
