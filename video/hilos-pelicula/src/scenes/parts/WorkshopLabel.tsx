import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

// COPY of V13's part (video/kill-chain-eslabon/src/scenes/parts/WorkshopLabel.tsx at 21acb01), never imported across
// videos. In V14 it belongs to the builder named in out/scene-brief.md «Ownership»; any change is made here, in this
// copy, by that builder. V14 fills the field: path={'D:\\proj\\cicada\\loader\\Release\\ldr.pdb'}.

/**
 * «La etiqueta del taller» — the image of the PDB path shared by V13, V14 and
 * V15 (V13 draws it; V14 puts it inside the box, V15 sews it in a collar).
 * A small cloth tag sewn in place: stitched border, two stitch marks at the
 * ends, a tiny bench glyph and ONE mono field for the path.
 *
 *   <WorkshopLabel width={120} />                    // V13: the field is BLANK
 *   <WorkshopLabel width={360} path={'D:\\…\\x.pdb'} /> // a later video fills it
 *
 * Props
 * - `path`  — the path to print in the field. `undefined` = blank field: nothing
 *             is drawn in it (no placeholder, no dots, no fragment).
 * - `width` — px; the height follows the design aspect (WORKSHOP_LABEL_BASE).
 *             A given path is shrunk to fit the field, never cut.
 * - `show`  — 0–1 appearance (fade + a small «sewn on» settle).
 * - `glow`  — 0–1 halo in `tone` (the voice is on it).
 * - `tone`  — halo / stitch accent colour (#hex). Default: warm thread.
 *
 * No caption is drawn: «la etiqueta del taller» (the voice's words), if wanted,
 * is scene text. Nothing reads the timeline; nothing is positioned — wrap it in
 * an absolutely positioned div (or a TrapBox's children slot).
 */

export const WORKSHOP_LABEL_BASE = { w: 200, h: 64 } as const;

/** Height in px of a WorkshopLabel `width` px wide. */
export function workshopLabelHeight(width: number): number {
  return (WORKSHOP_LABEL_BASE.h * width) / WORKSHOP_LABEL_BASE.w;
}

const CLOTH = '#efe6d2';
const CLOTH_EDGE = '#c9b892';
const THREAD = '#8a7454';
const FIELD = { x: 46, y: 18, w: 140, h: 28 } as const;

export function WorkshopLabel({
  path,
  width,
  show = 1,
  glow = 0,
  tone = '#fcd34d',
  style,
}: {
  path?: string;
  width: number;
  show?: number;
  glow?: number;
  tone?: string;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const g = clamp01(glow);
  const s = width / WORKSHOP_LABEL_BASE.w;
  const h = workshopLabelHeight(width);
  // Mono field text: 15 design units, shrunk so the whole path fits the field.
  const room = (FIELD.w - 10) * s;
  const size = path ? Math.min(15 * s, room / Math.max(1, path.length * 0.6)) : 0;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: sh,
        transform: `translateY(${(1 - sh) * 6}px) rotate(${(1 - sh) * -4}deg)`,
        filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 14 * g)}px ${alpha(tone, 0.7 * g)})` : undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${WORKSHOP_LABEL_BASE.w} ${WORKSHOP_LABEL_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Cloth, with the ends folded under (slightly darker strips) */}
        <rect x={2} y={4} width={196} height={56} rx={5} fill={CLOTH} stroke={CLOTH_EDGE} strokeWidth={2} />
        <rect x={2} y={4} width={10} height={56} rx={3} fill={alpha(CLOTH_EDGE, 0.55)} />
        <rect x={188} y={4} width={10} height={56} rx={3} fill={alpha(CLOTH_EDGE, 0.55)} />
        {/* Stitching: dashed border + the two seams that hold it */}
        <rect x={16} y={9} width={168} height={46} rx={3} fill="none" stroke={alpha(THREAD, 0.75)} strokeWidth={1.6} strokeDasharray="4 3" />
        {[7, 193].map((x) => (
          <path key={x} d={`M ${x} 12 L ${x} 52`} stroke={g > 0.05 ? tone : THREAD} strokeWidth={2.4} strokeDasharray="3 4" strokeLinecap="round" />
        ))}
        {/* Bench glyph: a small vice on a bench, the «taller» mark */}
        <g stroke={THREAD} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 40 L 40 40 M 23 40 L 23 47 M 37 40 L 37 47" />
          <path d="M 25 40 L 25 30 L 30 30 L 30 40 M 30 33 L 35 33 L 35 40" />
          <path d="M 27 26 L 27 30" />
        </g>
        {/* The mono field for the path */}
        <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} rx={4} fill="#1b2232" stroke={alpha('#0b1220', 0.9)} strokeWidth={1.5} />
        <rect x={FIELD.x + 2} y={FIELD.y + 2} width={FIELD.w - 4} height={3} rx={1.5} fill={alpha('#000000', 0.35)} />
      </svg>
      {path ? (
        <div
          style={{
            position: 'absolute',
            left: (FIELD.x + 5) * s,
            top: FIELD.y * s,
            width: (FIELD.w - 10) * s,
            height: FIELD.h * s,
            display: 'flex',
            alignItems: 'center',
            fontFamily: FONT.mono,
            fontSize: size,
            fontWeight: 600,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {path}
        </div>
      ) : null}
    </div>
  );
}
