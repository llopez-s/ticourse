import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui/Focus';

/**
 * The Pyramid of Pain (lesson s2m5), shared by s01, s04, s05, s06 and the Poster.
 *
 * Contract (stable; agent A builds s01 against it):
 * - The pyramid fills a `width` × `height` box: a truncated triangle (top edge
 *   `TOP_RATIO` of the base) cut into six trapezoid rungs, bottom to top
 *   hash, ip, domain, artifacts, tools, ttps. Each rung shows its name (bold)
 *   with its pain word on a second line, centred inside the rung.
 * - `show` (0–1) is draw progress: the rungs rise in bottom-up. Default 1.
 * - `grey` (0–1) turns everything to neutral grey (an «empty map»). It may also
 *   be a per-rung record (missing rungs = 0) to colour the rungs in one by one.
 * - `focus` lights rungs (0–1 each): brighter fill, thicker stroke, a halo.
 * - `off` rungs stay grey whatever `grey` says (s04: ['ip']).
 * - `slots` are drawn just RIGHT of each rung's slanted right edge, vertically
 *   centred on the rung; they overflow the box, so leave room on the right.
 * - `labels`: 'full' (name + pain word, default), 'name' (name only) or 'none'
 *   (shapes only — use it when the pyramid is small art, < ~300 px wide).
 * - `rungAnchor(id, width, height)` → `{ x, y, w }`: x = the pyramid's
 *   horizontal centre, y = the rung's vertical centre, w = the rung's width
 *   at that y (so its right edge is x + w / 2). Box-local coordinates.
 */

export type RungId = 'hash' | 'ip' | 'domain' | 'artifacts' | 'tools' | 'ttps';

/** Names and paths / «el acento»: a desaturated sky. */
export const STEEL = '#8aa6c1';

export const RUNGS: { id: RungId; name: string; pain: string; color: string }[] = [
  { id: 'hash', name: 'Hash values', pain: 'Trivial', color: C.amber },
  { id: 'ip', name: 'IP addresses', pain: 'Easy', color: STEEL },
  { id: 'domain', name: 'Domain names', pain: 'Simple', color: STEEL },
  { id: 'artifacts', name: 'Network/Host artifacts', pain: 'Annoying', color: STEEL },
  { id: 'tools', name: 'Tools', pain: 'Challenging', color: C.sky },
  { id: 'ttps', name: 'TTPs', pain: 'Tough', color: C.emerald },
];

/** Top edge width as a fraction of the base. */
const TOP_RATIO = 0.36;
/** Vertical gap between rungs as a fraction of a rung's height. */
const GAP = 0.07;
const GREY = '#5b6b84';

const indexOf = (id: RungId) => RUNGS.findIndex((r) => r.id === id);

/** Pyramid width at box-local `y` (0 = apex edge). */
function widthAt(y: number, width: number, height: number): number {
  return width * (TOP_RATIO + (1 - TOP_RATIO) * Math.max(0, Math.min(1, y / height)));
}

/** Centre (x = pyramid centre, y = rung centre) and width of rung `id`, box-local. */
export function rungAnchor(id: RungId, width: number, height: number): { x: number; y: number; w: number } {
  const h = height / RUNGS.length;
  const i = indexOf(id);
  const y = height - (i + 0.5) * h;
  return { x: width / 2, y, w: widthAt(y, width, height) };
}

function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((o) => parseInt(a.slice(o, o + 2), 16));
  const pb = [1, 3, 5].map((o) => parseInt(b.slice(o, o + 2), 16));
  return `#${pa.map((v, j) => Math.round(v + (pb[j] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

export function Pyramid({
  width,
  height,
  frame: frameProp,
  show = 1,
  grey = 0,
  focus,
  off,
  slots,
  labels = 'full',
}: {
  width: number;
  height: number;
  frame?: number;
  show?: number;
  grey?: number | Partial<Record<RungId, number>>;
  focus?: Partial<Record<RungId, number>>;
  off?: RungId[];
  slots?: Partial<Record<RungId, ReactNode>>;
  labels?: 'full' | 'name' | 'none';
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const n = RUNGS.length;
  const h = height / n;
  const gap = h * GAP;
  const cx = width / 2;
  const nameSize = Math.max(8, Math.round(h * 0.36));
  const painSize = Math.max(7, Math.round(h * 0.25));
  const anyFocus = focus ? Math.max(0, ...Object.values(focus).map((v) => clamp01(v ?? 0))) : 0;
  // A slow breathing on the focused rung's halo (well under 1 Hz).
  const breath = 0.85 + 0.15 * Math.sin((frame / 30) * Math.PI * 0.9);

  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans }}>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {RUNGS.map((r, i) => {
          const appear = clamp01((show - i / 8) * (8 / 3));
          if (appear <= 0) return null;
          const g = off?.includes(r.id) ? 1 : clamp01(typeof grey === 'number' ? grey : (grey[r.id] ?? 0));
          const f = clamp01(focus?.[r.id] ?? 0) * (1 - g);
          const color = mixHex(r.color, GREY, g);
          const yTop = height - (i + 1) * h + gap / 2;
          const yBot = height - i * h - gap / 2;
          const wTop = widthAt(yTop, width, height);
          const wBot = widthAt(yBot, width, height);
          const rise = (1 - appear) * h * 0.35;
          const pts = [
            [cx - wTop / 2, yTop + rise],
            [cx + wTop / 2, yTop + rise],
            [cx + wBot / 2, yBot + rise],
            [cx - wBot / 2, yBot + rise],
          ]
            .map((p) => p.join(','))
            .join(' ');
          // Rungs not in focus step back while another one is.
          const dimK = anyFocus * (1 - f);
          const fillA = (0.13 + 0.22 * f) * (1 - 0.5 * g);
          return (
            <g key={r.id} opacity={appear * (1 - 0.45 * dimK)}>
              {f > 0.01 ? (
                <polygon points={pts} fill="none" stroke={alpha(color, 0.35 * f * breath)} strokeWidth={Math.max(6, h * 0.16)} strokeLinejoin="round" />
              ) : null}
              <polygon
                points={pts}
                fill={alpha(color, fillA)}
                stroke={alpha(color, 0.5 + 0.5 * f - 0.15 * g)}
                strokeWidth={Math.max(1.5, h * (0.025 + 0.02 * f))}
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {labels !== 'none'
        ? RUNGS.map((r, i) => {
            const appear = clamp01((show - i / 8) * (8 / 3));
            if (appear <= 0) return null;
            const g = off?.includes(r.id) ? 1 : clamp01(typeof grey === 'number' ? grey : (grey[r.id] ?? 0));
            const f = clamp01(focus?.[r.id] ?? 0) * (1 - g);
            const a = rungAnchor(r.id, width, height);
            const color = mixHex(r.color, GREY, g);
            // Shrink a long name to fit the rung (bold Inter ≈ 0.58 em per character).
            const room = widthAt(a.y - h * 0.3, width, height) * 0.86;
            const size = Math.min(nameSize, Math.floor(room / (0.58 * r.name.length)));
            const dimK = anyFocus * (1 - f);
            return (
              <div
                key={r.id}
                style={{
                  position: 'absolute',
                  left: a.x - a.w / 2,
                  top: a.y - h / 2 + (1 - appear) * h * 0.35,
                  width: a.w,
                  height: h,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: Math.round(h * 0.02),
                  opacity: appear * (1 - 0.45 * dimK),
                  whiteSpace: 'nowrap',
                  lineHeight: 1.05,
                }}
              >
                <div style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.3, color: mixHex('#f8fafc', '#8794a8', g * 0.9) }}>{r.name}</div>
                {labels === 'full' ? (
                  <div style={{ fontSize: painSize, fontWeight: 700, letterSpacing: 0.4, color: alpha(color, 0.9 + 0.1 * f) }}>{r.pain}</div>
                ) : null}
              </div>
            );
          })
        : null}
      {slots
        ? RUNGS.map((r) => {
            const node = slots[r.id];
            if (node === undefined || node === null) return null;
            const a = rungAnchor(r.id, width, height);
            return (
              <div
                key={`slot-${r.id}`}
                style={{
                  position: 'absolute',
                  left: a.x + a.w / 2 + Math.max(8, h * 0.18),
                  top: a.y,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                {node}
              </div>
            );
          })
        : null}
    </div>
  );
}
