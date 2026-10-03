import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The account lifecycle as a ring of three arcs, clockwise: «alta» (upper
 * left) · «cambio» (upper right) · «baja» (bottom), each with its exam name
 * (JOINER · MOVER · LEAVER, violet) under it and a user glyph in the middle.
 * `focus` lights one arc and dims the other two from `focusAt` on. Drawn in
 * design units (RING_BASE) and scaled to `size` (the width in px).
 */

export type RingArc = 'alta' | 'cambio' | 'baja';

export const RING_BASE = { w: 680, h: 470 } as const;

export const RING_TEXT: Record<RingArc, { es: string; en: string }> = {
  alta: { es: 'alta', en: 'JOINER' },
  cambio: { es: 'cambio', en: 'MOVER' },
  baja: { es: 'baja', en: 'LEAVER' },
};

const ARCS: RingArc[] = ['alta', 'cambio', 'baja'];
const CX = 340;
const CY = 200;
const R = 140;
const STROKE = 34;
/** Centre angle of each arc (degrees, SVG: 0 = +x, clockwise). */
const MID: Record<RingArc, number> = { alta: -150, cambio: -30, baja: 90 };
const HALF = 50; // each arc spans 100°, leaving 20° gaps

/** Height in px of the ring drawn at `size` px wide. */
export function ringHeight(size: number): number {
  return (RING_BASE.h * size) / RING_BASE.w;
}

/** Point on the ring (design units) at angle `deg`, radius `r`. */
function polar(deg: number, r = R): { x: number; y: number } {
  const a = (deg * Math.PI) / 180;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
}

function arcPath(from: number, to: number): string {
  const p0 = polar(from);
  const p1 = polar(to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${R} ${R} 0 ${large} 1 ${p1.x} ${p1.y}`;
}

/** Label anchor per arc: where the text block sits and how it aligns. */
const LABEL: Record<RingArc, { x: number; y: number; align: 'right' | 'left' | 'center' }> = {
  alta: { x: 172, y: 60, align: 'right' },
  cambio: { x: 508, y: 60, align: 'left' },
  baja: { x: CX, y: 372, align: 'center' },
};

export function LifecycleRing({
  at,
  focus = null,
  focusAt,
  focusW,
  size = RING_BASE.w,
  arcAt,
  enAt,
  lit: litW,
  frame: frameProp,
  style,
}: {
  /** Frame the ring appears. Undefined: already on screen. */
  at?: number;
  /** Arc to light (the others dim). */
  focus?: RingArc | null;
  /** Frame the focus ramps in (default: at, or immediately). */
  focusAt?: number;
  /** 0–1 focus strength, overriding the focusAt ramp (to fade a focus out or hand it over smoothly). */
  focusW?: number;
  /** Width in px (height = ringHeight(size)). */
  size?: number;
  /** Per-arc frame each arc draws (alta, cambio, baja). Default: staggered from `at`. */
  arcAt?: readonly [number, number, number];
  /** Per-arc frame its English name appears. Default: with its arc. */
  enAt?: readonly [number, number, number];
  /** Per-arc 0–1 halo (the arc the voice names), independent of `focus`. */
  lit?: readonly [number, number, number];
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const s = size / RING_BASE.w;
  const show = at === undefined ? 1 : progress(frame, at, 14);
  if (show <= 0) return null;

  const fAt = focusAt ?? at ?? Number.NEGATIVE_INFINITY;
  const fw = focus ? (focusW !== undefined ? clamp01(focusW) : Number.isFinite(fAt) ? progress(frame, fAt, 14, EASE.inOut) : 1) : 0;
  const beat = 0.8 + 0.2 * pulse(frame, fps, 0.6);

  return (
    <div style={{ position: 'relative', width: size, height: ringHeight(size), opacity: show, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: RING_BASE.w, height: RING_BASE.h, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        <svg width={RING_BASE.w} height={RING_BASE.h} viewBox={`0 0 ${RING_BASE.w} ${RING_BASE.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* Faint full track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={alpha(C.ink600, 0.45)} strokeWidth={STROKE} />
          {ARCS.map((id, i) => {
            const startAt = arcAt ? arcAt[i] : at === undefined ? Number.NEGATIVE_INFINITY : at + 4 + i * 8;
            const draw = Number.isFinite(startAt) ? progress(frame, startAt, 18, EASE.inOut) : 1;
            if (draw <= 0) return null;
            const isFocus = focus === id;
            const lit = focus ? (isFocus ? 1 : 1 - 0.7 * fw) : 1;
            const halo = Math.max(isFocus ? fw : 0, clamp01(litW?.[i] ?? 0));
            const from = MID[id] - HALF;
            const to = from + 2 * HALF * draw;
            const tip = polar(to);
            // Arrowhead pointing clockwise at the arc's end.
            const tang = ((to + 90) * Math.PI) / 180;
            const n = { x: Math.cos(tang), y: Math.sin(tang) };
            const o = { x: tip.x - CX, y: tip.y - CY };
            const ol = Math.hypot(o.x, o.y) || 1;
            const out = { x: o.x / ol, y: o.y / ol };
            const head = 24;
            const pts = [
              `${tip.x + n.x * head},${tip.y + n.y * head}`,
              `${tip.x + out.x * (STROKE / 2 + 8)},${tip.y + out.y * (STROKE / 2 + 8)}`,
              `${tip.x - out.x * (STROKE / 2 + 8)},${tip.y - out.y * (STROKE / 2 + 8)}`,
            ].join(' ');
            const color = halo > 0.05 ? C.cyan : alpha(C.cyan, 0.85);
            return (
              <g key={id} opacity={lit}>
                {halo > 0 ? (
                  <path d={arcPath(from, to)} fill="none" stroke={alpha(C.cyan, 0.3 * halo * beat)} strokeWidth={STROKE + 22} strokeLinecap="butt" />
                ) : null}
                <path d={arcPath(from, to)} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="butt" />
                {draw > 0.85 ? <polygon points={pts} fill={color} opacity={clamp01((draw - 0.85) / 0.15)} /> : null}
              </g>
            );
          })}
        </svg>

        {/* The account in the middle */}
        <div
          style={{
            position: 'absolute',
            left: CX - 56,
            top: CY - 56,
            width: 112,
            height: 112,
            borderRadius: '50%',
            background: alpha(C.cyan, 0.08),
            border: `3px solid ${alpha(C.cyan, 0.4)}`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="user" size={64} color={C.cyanSoft} />
        </div>

        {/* Labels */}
        {ARCS.map((id, i) => {
          const startAt = arcAt ? arcAt[i] : at === undefined ? Number.NEGATIVE_INFINITY : at + 4 + i * 8;
          const esIn = Number.isFinite(startAt) ? progress(frame, startAt + 4, 14) : 1;
          const eAt = enAt ? enAt[i] : startAt;
          const enIn = Number.isFinite(eAt) ? progress(frame, eAt, 14) : 1;
          const isFocus = focus === id;
          const lit = focus ? (isFocus ? 1 : 1 - 0.65 * fw) : 1;
          const halo = Math.max(isFocus ? fw : 0, clamp01(litW?.[i] ?? 0));
          const L = LABEL[id];
          const box = 260;
          const left = L.align === 'right' ? L.x - box : L.align === 'left' ? L.x : L.x - box / 2;
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left,
                top: L.y,
                width: box,
                textAlign: L.align,
                fontFamily: FONT.sans,
                opacity: lit,
                whiteSpace: 'nowrap',
              }}
            >
              <div
                style={{
                  fontSize: 50,
                  fontWeight: 850,
                  lineHeight: 1.05,
                  color: halo > 0.3 ? C.cyan : C.textStrong,
                  opacity: esIn,
                  textShadow: halo > 0 ? `0 0 ${Math.round(20 * halo)}px ${alpha(C.cyan, 0.5 * halo)}` : undefined,
                }}
              >
                {RING_TEXT[id].es}
              </div>
              <div style={{ marginTop: 4, fontSize: 30, fontWeight: 800, letterSpacing: 1.5, color: '#c4b5fd', opacity: enIn }}>{RING_TEXT[id].en}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
