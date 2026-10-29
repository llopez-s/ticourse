import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The TLS tube (s08 and s11): a horizontal tube with a label in the middle.
 *   - cover 1 = OPAQUE (s08): whatever travels inside (children) is hidden behind a frosted layer of drifting
 *     cipher-noise bars; cover 0 = see-through (s11: the viewer sees the packet go through, the network cannot).
 *   - noise 0-1 how visible the cipher noise is on the cover.
 *   - label is a ReactNode (a string is drawn as a pill); labelShow fades it.
 *   - children are in tube-local coordinates (0,0 = top-left, width x height), clipped to the tube.
 * Nothing positions itself: wrap it in an absolutely positioned div. The tube's frame never changes size.
 */
export const TUBE_W = 1208;
export const TUBE_H = 150;

export function TlsTube({
  width = TUBE_W,
  height = TUBE_H,
  label,
  labelShow = 1,
  cover = 1,
  noise = 1,
  tone = C.sky,
  glow = 0,
  children,
  style,
}: {
  width?: number;
  height?: number;
  label?: ReactNode;
  labelShow?: number;
  cover?: number;
  noise?: number;
  tone?: string;
  glow?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const cv = clamp01(cover);
  const nz = clamp01(noise);
  const g = clamp01(glow);
  const bars = Array.from({ length: 34 }, (_, i) => {
    const t = (((i * 0.0297 + frame * 0.0022 * (0.7 + ((i * 7) % 5) * 0.12)) % 1) + 1) % 1;
    return { left: t * (width - 30) + 6, top: 12 + ((i * 37) % (height - 48)), w: 18 + ((i * 11) % 6) * 9, h: 10 + ((i * 5) % 3) * 4 };
  });
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: height / 2.4,
          border: `4px solid ${alpha(tone, 0.7)}`,
          background: alpha(C.ink900, 0.9),
          boxShadow: `0 0 ${Math.round(14 + 34 * g)}px ${alpha(tone, 0.16 + 0.3 * g)}, inset 0 0 40px ${alpha(tone, 0.08)}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
        {cv > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: cv, background: `linear-gradient(180deg, ${alpha(C.ink850, 0.985)} 0%, ${alpha(C.ink900, 0.985)} 100%)` }}>
            {bars.map((b, i) => (
              <span key={i} style={{ position: 'absolute', left: b.left, top: b.top, width: b.w, height: b.h, borderRadius: 4, background: alpha(tone, 0.32 * nz) }} />
            ))}
          </div>
        ) : null}
      </div>
      {label ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp01(labelShow) }}>
          {typeof label === 'string' ? (
            <span
              style={{
                padding: '8px 36px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(tone, 0.85)}`,
                background: alpha(C.ink950, 0.96),
                fontSize: 44,
                fontWeight: 850,
                letterSpacing: 2,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          ) : (
            label
          )}
        </div>
      ) : null}
    </div>
  );
}
