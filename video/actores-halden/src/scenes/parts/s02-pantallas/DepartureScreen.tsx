import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { BOARD } from '../../../data/s02-pantallas';

/** Glitch length in frames (the sfx «glitch» is 12 f): one burst, no strobing. */
export const GLITCH_F = 14;

const ROWS = [
  [0.62, 0.2],
  [0.48, 0.2],
  [0.7, 0.2],
  [0.55, 0.2],
];

/** The normal board: «Salidas» and four rows drawn as bars (no destinations, no times). */
function Board({ w, h }: { w: number; h: number }) {
  const rowH = (h - 86) / ROWS.length;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a1a33' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: alpha(C.cyan, 0.16), borderBottom: `2px solid ${alpha(C.cyan, 0.4)}`, fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: C.cyanSoft }}>
        {BOARD}
      </div>
      {ROWS.map(([dest, gate], k) => (
        <div key={k} style={{ position: 'absolute', left: 24, top: 78 + k * rowH, width: w - 48, height: rowH - 10, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 70, height: 18, borderRadius: 6, background: alpha(C.amber, 0.55) }} />
          <div style={{ width: (w - 48 - 220) * dest, height: 18, borderRadius: 6, background: alpha(C.text, 0.4) }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 90 * gate * 4, height: 18, borderRadius: 6, background: alpha(C.cyan, 0.45) }} />
        </div>
      ))}
    </div>
  );
}

/** A tiny deterministic jitter per slice and frame. */
function jitter(k: number, f: number): number {
  const s = Math.sin(k * 12.9898 + f * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/**
 * One departure screen of the passenger terminal. Before `swapAt` it shows the normal board; for GLITCH_F frames from
 * `swapAt` the picture tears into shifted slices under a fading rose tint (the «glitch»; one burst, no flashing); after that the screen is dark
 * with a rose frame and `children` (the changed message) fade in with `reveal` 0–1.
 */
export function DepartureScreen({ w, h, frame, swapAt, reveal, children }: { w: number; h: number; frame: number; swapAt: number; reveal: number; children?: ReactNode }) {
  const t = frame - swapAt;
  const glitching = t >= 0 && t < GLITCH_F;
  const changed = t >= GLITCH_F;
  const slices = 6;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {/* the casing */}
      <div
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: RADIUS.lg,
          background: C.ink950,
          border: `3px solid ${changed ? alpha(C.rose, 0.7) : C.ink600}`,
          boxShadow: changed ? `0 0 26px ${alpha(C.rose, 0.25)}` : `0 14px 30px ${alpha('#000000', 0.4)}`,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, overflow: 'hidden' }}>
        {!glitching && !changed ? <Board w={w} h={h} /> : null}
        {glitching
          ? Array.from({ length: slices }, (_, k) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `inset(${(k * 100) / slices}% 0 ${100 - ((k + 1) * 100) / slices}% 0)`,
                  transform: `translateX(${jitter(k, Math.floor(t / 3)) * 46}px)`,
                }}
              >
                <Board w={w} h={h} />
              </div>
            ))
          : null}
        {glitching ? <div style={{ position: 'absolute', inset: 0, background: alpha(C.rose, 0.24 * (1 - t / GLITCH_F)) }} /> : null}
        {changed ? (
          <div style={{ position: 'absolute', inset: 0, background: '#12070c' }}>
            <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(180deg, ${alpha('#ffffff', 0.03)} 0px, ${alpha('#ffffff', 0.03)} 2px, transparent 2px, transparent 6px)` }} />
            <div style={{ position: 'absolute', inset: 0, opacity: clamp01(reveal) }}>{children}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
