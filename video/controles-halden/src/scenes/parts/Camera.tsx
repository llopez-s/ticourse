import { useId } from 'react';
import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/** The camera's box in its own units at width 1 (height = width × CAMERA_RATIO). */
export const CAMERA_RATIO = 0.62;
/**
 * Where the lens sits, as fractions of the camera's box when it faces right (mirror x for `facing="left"`).
 * Handy to aim a sight line or a playback frame at it.
 */
export const CAMERA_LENS = { x: 0.917, y: 0.737 } as const;

/**
 * The video's one security camera (s04's two vignettes, s05's background, s08's rule-2 icon): a plain bullet
 * camera on a wall bracket, drawn flat in SVG. Nothing is attached to it — no cable, no recorder, no name, no
 * «REC» dot — so it reads as «una cámara bien a la vista» and nothing more.
 *
 * Props:
 * - `width` (px): the whole drawing scales with it; height = `width × CAMERA_RATIO`.
 * - `empty`: s05's empty housing — the lens is a dark hollow ring with no glass and no light, the body a shade
 *   duller. Same silhouette, so the viewer recognises «the camera» but sees nothing inside.
 * - `glow` (0–1): a soft cyan halo behind the camera (to focus it).
 * - `light` (0–1, default 1): the lens light (a small cyan point in the lens). Ignored when `empty`.
 * - `facing`: 'right' (default; bracket on the left, lens on the right) or 'left' (mirrored).
 * - `style`: passed to the outer <svg> (position it with a wrapping div, as with the engine pieces).
 *
 * Gradient ids are per instance (useId), so several cameras can share a frame.
 */
export function Camera({
  width = 220,
  empty = false,
  glow = 0,
  light = 1,
  facing = 'right',
  style,
}: {
  width?: number;
  empty?: boolean;
  glow?: number;
  light?: number;
  facing?: 'left' | 'right';
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = { glow: `cam-glow-${uid}`, body: `cam-body-${uid}`, lens: `cam-lens-${uid}` };
  const w = width;
  const h = Math.round(width * CAMERA_RATIO);
  // Drawing units: a 200 × 124 box (CAMERA_RATIO = 0.62), scaled to `width` by the viewBox.
  const stroke = 1.6;
  const outline = alpha('#000000', 0.4);
  // The lens is drawn inside the tilted housing group, at the front ring.
  const lensX = 186;
  const lensY = 74;
  const lightOn = empty ? 0 : Math.max(0, Math.min(1, light));
  return (
    <svg width={w} height={h} viewBox="0 0 200 124" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={ids.glow}>
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.24} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={empty ? '#b6c2d1' : '#e2e8f0'} />
          <stop offset="60%" stopColor={empty ? '#8391a5' : '#a7b4c6'} />
          <stop offset="100%" stopColor={empty ? '#5d6b80' : '#728199'} />
        </linearGradient>
        <radialGradient id={ids.lens} cx="0.38" cy="0.36" r="0.7">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="70%" stopColor="#0b1626" />
          <stop offset="100%" stopColor="#050a12" />
        </radialGradient>
      </defs>
      <g transform={facing === 'left' ? 'translate(200 0) scale(-1 1)' : undefined}>
        {glow > 0.01 ? <circle cx={110} cy={64} r={130} fill={`url(#${ids.glow})`} opacity={glow} /> : null}
        {/* wall plate */}
        <rect x={2} y={10} width={20} height={56} rx={5} fill="#8391a5" stroke={outline} strokeWidth={stroke} />
        <circle cx={12} cy={20} r={2.6} fill={alpha('#000000', 0.35)} />
        <circle cx={12} cy={56} r={2.6} fill={alpha('#000000', 0.35)} />
        {/* bracket arm: out from the plate, then down to the housing's mount */}
        <path d="M 20 34 L 62 34 Q 74 34 74 46 L 74 58" fill="none" stroke="#728199" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 20 34 L 62 34 Q 74 34 74 46 L 74 58" fill="none" stroke={alpha('#ffffff', 0.18)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={74} cy={60} r={8} fill="#8391a5" stroke={outline} strokeWidth={stroke} />
        {/* housing, tilted a little down towards whoever approaches */}
        <g transform="rotate(9 74 66)">
          {/* sun hood over the top, a bit longer than the body */}
          <path d="M 40 50 L 196 50 L 190 58 L 44 58 Z" fill={empty ? '#6b7a90' : '#94a3b8'} stroke={outline} strokeWidth={stroke} strokeLinejoin="round" />
          {/* body */}
          <rect x={44} y={56} width={140} height={36} rx={10} fill={`url(#${ids.body})`} stroke={outline} strokeWidth={stroke} />
          <rect x={52} y={61} width={96} height={4} rx={2} fill={alpha('#ffffff', 0.35)} />
          {/* front ring */}
          <rect x={176} y={57} width={14} height={34} rx={5} fill={empty ? '#4b586b' : '#64748b'} stroke={outline} strokeWidth={stroke} />
          {/* lens, at the front ring */}
          {empty ? (
            <>
              <circle cx={lensX} cy={lensY} r={11.5} fill={C.ink950} stroke="#3b4658" strokeWidth={3} />
              <circle cx={lensX} cy={lensY} r={6} fill="none" stroke={alpha('#64748b', 0.35)} strokeWidth={1.5} strokeDasharray="2.5 3" />
            </>
          ) : (
            <>
              <circle cx={lensX} cy={lensY} r={11.5} fill={`url(#${ids.lens})`} stroke="#2b3647" strokeWidth={3} />
              <circle cx={lensX - 3.5} cy={lensY - 3.5} r={2.6} fill={alpha('#ffffff', 0.55)} />
              {lightOn > 0.01 ? (
                <>
                  <circle cx={lensX + 2} cy={lensY + 2} r={9} fill={C.cyan} opacity={0.22 * lightOn} />
                  <circle cx={lensX + 2} cy={lensY + 2} r={3.4} fill={C.cyanSoft} opacity={lightOn} />
                </>
              ) : null}
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
