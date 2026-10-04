import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { S02_BIASES } from '../../../data/s02-fuera';

/**
 * s02's head in profile (facing right): a cyan outline, a tangle of thought inside the
 * skull that keeps knotting over itself, and the two bias names peeking out, faint
 * («confirmation bias», «anchoring»). Nobody's head in particular — no face details.
 *
 * Design box 500 × 560, scaled to `width`. Props: `frame` (drives the tangle's slow
 * crawl), `tangle` (0–1: how knotted/visible the tangle is; it calms as the ideas leave),
 * `biases` (0–1 visibility of the two names, already faint at 1), `glow` (0–1), `dim`,
 * `style`. `HEAD_EXIT` is where the ideas leave the head (design units), for the scene.
 */

export const HEAD_BASE = { w: 500, h: 560 } as const;
/** Front of the forehead, where the scene's idea strands start (design units). */
export const HEAD_EXIT = { x: 430, y: 200 } as const;

const OUTLINE =
  'M 150 548 C 150 480 122 438 112 392 C 84 312 88 176 178 116 C 258 62 378 72 420 150 C 440 186 442 218 436 246 ' +
  'L 474 302 C 478 310 472 316 464 318 L 444 322 C 448 334 448 346 442 356 C 450 366 448 382 436 392 ' +
  'C 420 410 392 420 362 422 C 352 452 348 500 352 548';

/** A Lissajous knot inside the skull: deterministic, loops over itself. */
function tanglePath(amount: number): string {
  const pts: string[] = [];
  const steps = 360;
  const k = 0.35 + 0.65 * amount;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 268 + k * (74 * Math.sin(5 * t) + 42 * Math.cos(3 * t + 0.4) + 16 * Math.sin(11 * t));
    const y = 232 + k * (60 * Math.sin(4 * t + 0.5) + 34 * Math.cos(7 * t) + 12 * Math.sin(13 * t));
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export function ProfileHead({
  width = HEAD_BASE.w,
  frame,
  tangle = 1,
  biases = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  width?: number;
  frame: number;
  tangle?: number;
  biases?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const s = width / HEAD_BASE.w;
  const t = clamp01(tangle);
  const b = clamp01(biases);
  const g = clamp01(glow);
  const d = clamp01(dim);
  // The tangle crawls along itself (dash offset), slowly: no flicker.
  const crawl = (frame * 0.0025) % 1;
  return (
    <div style={{ position: 'relative', width, height: HEAD_BASE.h * s, opacity: 1 - 0.6 * d, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: HEAD_BASE.w, height: HEAD_BASE.h, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <svg width={HEAD_BASE.w} height={HEAD_BASE.h} viewBox={`0 0 ${HEAD_BASE.w} ${HEAD_BASE.h}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <defs>
            <radialGradient id="s02-head-fill" cx="0.5" cy="0.4" r="0.7">
              <stop offset="0" stopColor={C.ink800} />
              <stop offset="1" stopColor={C.ink900} />
            </radialGradient>
          </defs>
          <path
            d={OUTLINE}
            fill="url(#s02-head-fill)"
            stroke={alpha(C.cyan, 0.85)}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={g > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(C.cyan, 0.6 * g)})` } : undefined}
          />
          {/* Ear (a curl, no face details) */}
          <path d="M 236 262 C 216 244 196 262 204 286 C 210 304 230 306 238 296" fill="none" stroke={alpha(C.cyan, 0.45)} strokeWidth={4} strokeLinecap="round" />
          {/* The tangle: two passes of the same knot, one under the other, crawling */}
          {t > 0.01 ? (
            <>
              <path
                d={tanglePath(t)}
                fill="none"
                stroke={alpha(C.amber, 0.16 * t)}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={tanglePath(t)}
                fill="none"
                stroke={alpha(C.cyanSoft, 0.85 * t)}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="0.62 0.38"
                strokeDashoffset={-crawl}
              />
            </>
          ) : null}
        </svg>
        {/* The bias names, faint, half out of the skull */}
        {b > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: 64, top: 104, transform: 'rotate(-8deg)', fontSize: 34, fontWeight: 700, fontStyle: 'italic', color: C.muted, opacity: 0.55 * b, whiteSpace: 'nowrap' }}>
              {S02_BIASES[0]}
            </div>
            <div style={{ position: 'absolute', left: 206, top: 344, transform: 'rotate(5deg)', fontSize: 34, fontWeight: 700, fontStyle: 'italic', color: C.muted, opacity: 0.5 * b, whiteSpace: 'nowrap' }}>
              {S02_BIASES[1]}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
