import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { SCREEN } from '../../data/s01-hook';

/** Native size of the exam screen drawing. */
export const SCREEN_ART = { w: 820, h: 520, header: 84 } as const;

/** Body area inside the screen (below the header), for callers that put their own art in it. */
export const SCREEN_BODY = { x: 22, y: SCREEN_ART.header + 8, w: SCREEN_ART.w - 44, h: SCREEN_ART.h - SCREEN_ART.header - 30 } as const;

/**
 * A generic, blank exam screen: question counter «1 / 90» at the left of the header, the «90:00» timer at the right,
 * and an empty body (skeleton lines and four empty option bars). Invented chrome: nothing of CompTIA's or Pearson's.
 * s01 fades the night port into it; the poster and the question scenes' still reuse it. With `children` the skeleton
 * body is replaced (the poster puts the port inside the screen).
 */
export function ExamScreenArt({ children, glow = 0.5 }: { children?: ReactNode; glow?: number }) {
  const { w, h, header } = SCREEN_ART;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.violet, 0.65)}`,
        background: C.ink900,
        boxShadow: `0 0 ${Math.round(60 * glow)}px ${alpha(C.violetStrong, 0.28 * glow)}, 0 24px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.mono,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: header,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          background: alpha(C.violetDeep, 0.75),
          borderBottom: `3px solid ${alpha(C.violet, 0.45)}`,
        }}
      >
        <span style={{ fontSize: 48, fontWeight: 800, color: C.textStrong, letterSpacing: 1 }}>{SCREEN.counter}</span>
        <span style={{ fontSize: 48, fontWeight: 800, color: C.cyanSoft, letterSpacing: 1 }}>{SCREEN.timer}</span>
      </div>
      {children ?? (
        <div style={{ position: 'absolute', left: 36, right: 36, top: header + 34 }}>
          {[0.92, 0.7, 0.48].map((k, i) => (
            <div key={i} style={{ height: 16, width: `${k * 100}%`, borderRadius: 8, background: alpha(C.ink500, 0.55), marginBottom: 18 }} />
          ))}
          <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  borderRadius: RADIUS.md,
                  border: `2px solid ${alpha(C.ink600, 0.9)}`,
                  background: alpha(C.ink800, 0.8),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '0 16px',
                }}
              >
                <div style={{ width: 26, height: 26, borderRadius: 13, border: `2px solid ${alpha(C.ink500, 0.9)}` }} />
                <div style={{ height: 12, width: `${[56, 44, 62, 38][i]}%`, borderRadius: 6, background: alpha(C.ink500, 0.45) }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
