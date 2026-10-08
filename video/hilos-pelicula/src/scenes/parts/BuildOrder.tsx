import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../engine/src/ui';

// Owner: builder B1 (out/scene-brief.md «Ownership»). Read-only for everyone else (B3 imports it in s06).

/**
 * «El orden de construcción» — the analyst's steps as a row of pills joined by drawn chevrons (SVG; the engine fonts
 * are latin subsets, so no arrow characters). s02 `wrap-i` shows it half built, «eventos · hilo»; s06 `build-order`
 * complete, «eventos · hilos · comparar hilos · grupo» (s2m4q8). Steps that are not there yet are simply not drawn
 * (`show` 0) — never as greyed placeholders, never with tick marks (the video has no results to tick).
 *
 * Geometry is PURE and deterministic: `buildOrderLayout(labels, size, gap)` gives the box size and each pill's x/width
 * (the pill width comes from a generous per-character estimate, the text is centred in it). The component draws
 * inside that box; wrap it in an absolute div. Colours: cyan = the defender's method; a lit pill is filled.
 */

/** s02 (`wrap-i`): what is built so far. */
export const BUILD_STEPS_THREAD = ['eventos', 'hilo'] as const;
/** s06 (`build-order`): the whole order (s2m4q8). */
export const BUILD_STEPS = ['eventos', 'hilos', 'comparar hilos', 'grupo'] as const;

export interface BuildStep {
  label: string;
  /** 0–1: the pill (and the chevron before it) appears. Default 1. */
  show?: number;
  /** 0–1: the pill fills (the voice is on it / it is done). Default 0. */
  lit?: number;
}

/** Generous width estimate of `text` in the engine's Inter at weight ~700 (px). */
function textWidth(text: string, size: number): number {
  let em = 0;
  for (const ch of text) {
    if (ch === ' ') em += 0.28;
    else if ('ilj·.,;:'.includes(ch)) em += 0.3;
    else if ('mw'.includes(ch)) em += 0.86;
    else if (ch >= 'A' && ch <= 'Z') em += 0.68;
    else em += 0.57;
  }
  return em * size;
}

export interface BuildOrderLayout {
  width: number;
  height: number;
  /** Each pill's left edge and width (px from the box's left). */
  steps: { x: number; w: number; cx: number }[];
}

/** PURE geometry of a BuildOrder with these labels. */
export function buildOrderLayout(labels: readonly string[], size = 32, gap = 64): BuildOrderLayout {
  const padX = Math.round(size * 0.75);
  const height = Math.round(size * 1.9);
  const steps: { x: number; w: number; cx: number }[] = [];
  let x = 0;
  labels.forEach((l, i) => {
    if (i > 0) x += gap;
    const w = Math.ceil(textWidth(l, size) + padX * 2);
    steps.push({ x, w, cx: x + w / 2 });
    x += w;
  });
  return { width: x, height, steps };
}

export function BuildOrder({
  steps,
  size = 32,
  gap = 64,
  tone = C.cyan,
  dim = 0,
  style,
}: {
  steps: readonly BuildStep[];
  size?: number;
  gap?: number;
  tone?: string;
  dim?: number;
  style?: CSSProperties;
}) {
  const L = buildOrderLayout(
    steps.map((s) => s.label),
    size,
    gap,
  );
  const cy = L.height / 2;
  return (
    <div style={{ position: 'relative', width: L.width, height: L.height, fontFamily: FONT.sans, opacity: 1 - 0.6 * clamp01(dim), ...style }}>
      <svg width={L.width} height={L.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {steps.map((s, i) => {
          if (i === 0) return null;
          const p = EASE.out(clamp01(s.show ?? 1));
          if (p <= 0) return null;
          const x0 = L.steps[i - 1].x + L.steps[i - 1].w + gap * 0.22;
          const x1 = L.steps[i].x - gap * 0.22;
          const xe = x0 + (x1 - x0) * p;
          const hh = size * 0.32;
          return (
            <g key={`c${i}`} opacity={p}>
              <line x1={x0} y1={cy} x2={Math.max(x0, xe - hh * 0.5)} y2={cy} stroke={alpha(tone, 0.75)} strokeWidth={Math.max(2, size * 0.1)} strokeLinecap="round" />
              <polyline
                points={`${xe - hh},${cy - hh} ${xe},${cy} ${xe - hh},${cy + hh}`}
                fill="none"
                stroke={alpha(tone, 0.9)}
                strokeWidth={Math.max(2, size * 0.1)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {steps.map((s, i) => {
        const p = clamp01(s.show ?? 1);
        if (p <= 0) return null;
        const lit = clamp01(s.lit ?? 0);
        const g = L.steps[i];
        return (
          <div
            key={`s${i}`}
            style={{
              position: 'absolute',
              left: g.x,
              top: 0,
              width: g.w,
              height: L.height,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(tone, 0.5 + 0.4 * lit)}`,
              background: lit > 0.01 ? alpha(tone, 0.1 + 0.18 * lit) : alpha(tone, 0.06),
              boxShadow: lit > 0.01 ? `0 0 ${Math.round(size * 0.7 * lit)}px ${alpha(tone, 0.3 * lit)}` : undefined,
              color: lit > 0.3 ? C.textStrong : alpha(C.text, 0.95),
              fontSize: size,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              opacity: EASE.out(p),
              transform: `translateX(${(1 - EASE.out(p)) * -14}px)`,
            }}
          >
            {s.label}
          </div>
        );
      })}
    </div>
  );
}
