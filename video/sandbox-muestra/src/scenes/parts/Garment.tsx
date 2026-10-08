import type { CSSProperties, ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { WorkshopLabel, workshopLabelHeight } from './WorkshopLabel';

/**
 * «La prenda a medida» — what the sample carries written in it (s05, s06 rule 3,
 * the poster). ONE drawing every time it comes back: a jacket on a hanger, with
 * lapels, a lining in the V, three buttons, two pocket flaps and a back collar
 * that can flip over to show its inside, where the workshop label is sewn.
 *
 * States (each 0–1, all optional):
 * - `whole`   the whole garment in amber: the hash, «esta prenda exacta»;
 * - `pieces`  buttons and lining lit: the imports;
 * - `family`  the pieces' set outlined in emerald (and the pieces turn emerald): the imphash;
 * - `pattern` the cutting pattern drawn over the garment (dashed, emerald);
 * - `twin`    a second, almost identical pattern overlaid, slightly offset: the ssdeep match;
 * - `collar`  the back collar flips over; past half-way its inside shows, with the
 *             workshop label sewn in when `labelPath` is given (never on `variant="new"`).
 *
 * `variant="new"` is the new garment of s05 `close`: another cloth, the same cut,
 * the same pieces — and no workshop label. `mini` is the static rule-3 miniature
 * (collar flipped, label sewn, slightly heavier strokes); size it with `height`.
 * Nothing reads the timeline; wrap it in an absolutely positioned div.
 */

/** Design box of the drawing (viewBox units). */
export const GARMENT_BASE = { w: 400, h: 500 } as const;

export function garmentHeight(width: number): number {
  return (GARMENT_BASE.h * width) / GARMENT_BASE.w;
}

export function garmentWidth(height: number): number {
  return (GARMENT_BASE.w * height) / GARMENT_BASE.h;
}

/** Where the label sits on the flipped collar (design units). */
const SLOT = { cx: 200, top: 84, w: 74 } as const;
/** The collar's fold line (design units). */
const FOLD_Y = 72;

/** Px geometry of the label's slot inside a garment `width` px wide (relative to its top-left). */
export function garmentCollarSlot(width: number): { x: number; y: number; w: number; h: number; cx: number; cy: number } {
  const s = width / GARMENT_BASE.w;
  const w = SLOT.w * s;
  const h = workshopLabelHeight(w);
  const x = (SLOT.cx - SLOT.w / 2) * s;
  const y = SLOT.top * s;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/** Px centre of the button set (for a connector or a callout). */
export function garmentPiecesAnchor(width: number): { x: number; y: number } {
  const s = width / GARMENT_BASE.w;
  return { x: 200 * s, y: 300 * s };
}

const CLOTH = {
  old: { fill: '#2b3a52', edge: '#6b81a6', shade: '#22304a', collar: '#25334a' },
  // Graphite, not violet: violet means exam in this video.
  new: { fill: '#3b3e44', edge: '#8a909b', shade: '#303338', collar: '#34373c' },
} as const;
const LINING = '#4a3f33';
const LINING_EDGE = '#7a6a55';
const LIT = '#f1f5f9';

/** Linear blend of two #rrggbb colours. */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

// Jacket outline (front view), symmetric about x = 200.
const BODY =
  'M 160 70 L 82 96 Q 56 104 50 140 L 34 326 L 82 334 L 100 196 L 102 466 Q 200 480 298 466 ' +
  'L 300 196 L 318 334 L 366 326 L 350 140 Q 344 104 318 96 L 240 70 Q 200 84 160 70 Z';
// The almost identical pattern of the earlier variant: same cut, a touch longer and wider.
const BODY_TWIN =
  'M 160 70 L 80 97 Q 53 106 47 142 L 30 332 L 80 341 L 99 198 L 100 472 Q 200 487 300 472 ' +
  'L 301 198 L 320 341 L 370 332 L 353 142 Q 347 106 320 97 L 240 70 Q 200 84 160 70 Z';
const LINING_V = 'M 163 74 L 200 238 L 237 74 Q 200 89 163 74 Z';
const LAPEL_L = 'M 161 72 L 200 238 L 186 182 L 132 110 Q 138 90 161 72 Z';
const LAPEL_R = 'M 239 72 L 200 238 L 214 182 L 268 110 Q 262 90 239 72 Z';
const COLLAR_OUT = 'M 154 72 Q 200 88 246 72 L 236 42 Q 200 54 164 42 Z';
const COLLAR_IN = 'M 154 72 Q 200 88 246 72 L 238 112 Q 200 124 162 112 Z';
const BACK_NECK = 'M 164 42 Q 200 54 236 42 L 246 72 Q 200 88 154 72 Z';
const BUTTONS = [276, 330, 384] as const;
/** Notch marks on the cutting pattern (design units): shoulders, armpits, hem. */
const NOTCHES: ReadonlyArray<readonly [number, number]> = [
  [82, 96],
  [318, 96],
  [100, 196],
  [300, 196],
  [150, 474],
  [250, 474],
];

export function Garment({
  width: widthProp,
  height: heightProp,
  variant = 'old',
  whole = 0,
  pieces = 0,
  family = 0,
  pattern = 0,
  twin = 0,
  collar = 0,
  labelPath,
  labelGlow = 0,
  show = 1,
  mini = false,
  children,
  style,
}: {
  /** Px width (the height follows the design aspect). Give this or `height`. */
  width?: number;
  height?: number;
  variant?: 'old' | 'new';
  whole?: number;
  pieces?: number;
  family?: number;
  pattern?: number;
  twin?: number;
  collar?: number;
  /** The PDB path printed on the workshop label (sewn only on `variant="old"`). */
  labelPath?: string;
  labelGlow?: number;
  /** 0–1 appearance. */
  show?: number;
  /** Static rule-3 miniature: collar flipped, label sewn, heavier strokes. */
  mini?: boolean;
  /** Extra absolutely positioned overlays in garment px (callouts, connectors). */
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const width = widthProp ?? (heightProp !== undefined ? garmentWidth(heightProp) : 400);
  const height = garmentHeight(width);
  const cloth = CLOTH[variant];
  const w = clamp01(whole);
  const pc = clamp01(pieces);
  const fam = clamp01(family);
  const pat = clamp01(pattern);
  const tw = clamp01(twin);
  const col = clamp01(mini ? 1 : collar);
  // Strokes are in design units; a miniature needs them heavier to survive the scale.
  const k = mini ? 1.9 : 1;
  const fill = mixHex(cloth.fill, '#5a4413', w * 0.85);
  const edge = mixHex(cloth.edge, C.amber, w);
  const pieceColor = mixHex(mixHex(LINING_EDGE, LIT, pc), C.emerald, fam);
  const liningFill = mixHex(LINING, mixHex('#8d7a5c', '#2f6f58', fam), pc);
  const outerK = col < 0.5 ? 1 - 2 * col : 0;
  const innerK = col > 0.5 ? 2 * col - 1 : 0;
  const glow = Math.max(w * 0.8, fam * 0.5);
  const glowColor = w >= fam ? C.amber : C.emerald;
  const slot = garmentCollarSlot(width);
  const sewn = variant === 'old' && labelPath !== undefined && innerK > 0.02;
  const flipAt = (kk: number) => `translate(0 ${FOLD_Y}) scale(1 ${Math.max(0.001, kk)}) translate(0 ${-FOLD_Y})`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        opacity: sh,
        filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round((mini ? 6 : 18) * glow)}px ${alpha(glowColor, 0.55 * glow)})` : undefined,
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${GARMENT_BASE.w} ${GARMENT_BASE.h}`}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
      >
        {/* Hanger: hook and the wire under the shoulders */}
        <g fill="none" stroke="#9aa6b8" strokeWidth={4 * k} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 200 44 L 200 30 C 200 18 212 10 222 16 C 231 22 228 34 218 36" />
          <path d="M 200 44 L 86 94 L 314 94 Z" opacity={0.6} />
        </g>

        {/* Back of the neck: only seen while the collar is flipped */}
        <path d={BACK_NECK} fill={mixHex(LINING, '#000000', 0.25)} stroke={alpha(LINING_EDGE, 0.6)} strokeWidth={1.5 * k} />

        {/* Body */}
        <path d={BODY} fill={fill} stroke={edge} strokeWidth={3 * k} strokeLinejoin="round" />
        {/* Sleeve folds and cuffs */}
        <g fill="none" stroke={alpha(edge, 0.55)} strokeWidth={2 * k} strokeLinecap="round">
          <path d="M 36 312 L 82 320 M 364 312 L 318 320" />
          <path d="M 100 196 Q 92 150 82 112 M 300 196 Q 308 150 318 112" opacity={0.7} />
        </g>
        {/* Lining in the V */}
        <path d={LINING_V} fill={liningFill} stroke={alpha(pieceColor, 0.5 + 0.5 * pc)} strokeWidth={2 * k} />
        {/* Lapels */}
        <path d={LAPEL_L} fill={mixHex(cloth.shade, '#4a3a12', w * 0.8)} stroke={edge} strokeWidth={2.4 * k} strokeLinejoin="round" />
        <path d={LAPEL_R} fill={mixHex(cloth.shade, '#4a3a12', w * 0.8)} stroke={edge} strokeWidth={2.4 * k} strokeLinejoin="round" />
        {/* Front opening and pocket flaps */}
        <g fill="none" stroke={alpha(edge, 0.7)} strokeWidth={2 * k} strokeLinecap="round">
          <path d="M 200 238 L 200 470" />
          <path d="M 116 360 L 174 356 L 172 372 L 118 376 Z M 284 360 L 226 356 L 228 372 L 282 376 Z" />
        </g>
        {/* Buttons (the pieces) */}
        {BUTTONS.map((y) => (
          <g key={y}>
            {pc > 0.02 ? <circle cx={200} cy={y} r={18} fill={alpha(pieceColor, 0.22 * pc)} /> : null}
            <circle cx={200} cy={y} r={10} fill={mixHex('#55657d', pieceColor, pc)} stroke={mixHex(edge, pieceColor, pc)} strokeWidth={2 * k} />
            {!mini ? (
              <g fill={mixHex(cloth.fill, '#0b1220', 0.5)}>
                <circle cx={196.5} cy={y - 3} r={1.6} />
                <circle cx={203.5} cy={y - 3} r={1.6} />
                <circle cx={196.5} cy={y + 3} r={1.6} />
                <circle cx={203.5} cy={y + 3} r={1.6} />
              </g>
            ) : null}
          </g>
        ))}
        {/* The pieces' set (imphash): one outline around lining and buttons */}
        {fam > 0.01 ? (
          <path
            d="M 156 66 L 244 66 L 214 246 L 222 252 L 222 402 Q 222 410 214 410 L 186 410 Q 178 410 178 402 L 178 252 L 186 246 Z"
            fill="none"
            stroke={C.emerald}
            strokeWidth={3 * k}
            strokeDasharray="9 7"
            strokeLinejoin="round"
            opacity={fam}
          />
        ) : null}

        {/* Collar: the outer face folds away about FOLD_Y, then the inside shows */}
        {outerK > 0.001 ? (
          <path d={COLLAR_OUT} transform={flipAt(outerK)} fill={mixHex(cloth.collar, '#5a4413', w * 0.85)} stroke={edge} strokeWidth={2.4 * k} strokeLinejoin="round" />
        ) : null}
        {innerK > 0.001 ? (
          <g transform={flipAt(innerK)}>
            <path d={COLLAR_IN} fill={mixHex(LINING, '#000000', 0.1)} stroke={mixHex(LINING_EDGE, edge, 0.4)} strokeWidth={2.4 * k} strokeLinejoin="round" />
            <path d="M 160 106 Q 200 117 240 106" fill="none" stroke={alpha(LINING_EDGE, 0.7)} strokeWidth={1.4 * k} strokeDasharray="3 3" />
          </g>
        ) : null}

        {/* Cutting pattern (and its almost identical twin) over the garment */}
        {tw > 0.01 ? (
          <path
            d={BODY_TWIN}
            transform="translate(9 7)"
            fill="none"
            stroke={alpha(C.emerald, 0.75)}
            strokeWidth={2.4 * k}
            strokeDasharray="4 7"
            strokeLinejoin="round"
            opacity={tw}
          />
        ) : null}
        {pat > 0.01 ? (
          <g opacity={pat}>
            <path d={BODY} fill="none" stroke={C.emerald} strokeWidth={3 * k} strokeDasharray="12 8" strokeLinejoin="round" />
            {NOTCHES.map(([x, y]) => (
              <path key={`${x}-${y}`} d={`M ${x - 6} ${y - 7} L ${x + 6} ${y - 7} L ${x} ${y + 3} Z`} fill={C.emerald} />
            ))}
          </g>
        ) : null}
      </svg>

      {/* The workshop label, sewn on the inside of the flipped collar */}
      {sewn ? (
        <div
          style={{
            position: 'absolute',
            left: slot.x,
            top: slot.y,
            width: slot.w,
            transformOrigin: `50% ${FOLD_Y * (width / GARMENT_BASE.w) - slot.y}px`,
            transform: `scaleY(${innerK})`,
          }}
        >
          <WorkshopLabel width={slot.w} path={labelPath} glow={labelGlow} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Px size of a CollarCloseUp drawn for a label `labelWidth` px wide. */
export function collarCloseUpSize(labelWidth: number): { w: number; h: number } {
  const lh = workshopLabelHeight(labelWidth);
  return { w: Math.round(labelWidth * 1.24), h: Math.round(lh + 150) };
}

/**
 * The s05 close-up of the flipped collar: the band of the collar's inside (the
 * garment's lining cloth), its fold on top in the jacket's cloth, and the
 * workshop label sewn in the middle at `labelWidth` (≥ 960 so the path reads at
 * about 28 px). `show` opens the band; `labelShow` sews the label on.
 */
export function CollarCloseUp({
  labelWidth = 960,
  path,
  show = 1,
  labelShow = 1,
  labelGlow = 0,
  style,
}: {
  labelWidth?: number;
  path?: string;
  show?: number;
  labelShow?: number;
  labelGlow?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const { w, h } = collarCloseUpSize(labelWidth);
  const lh = workshopLabelHeight(labelWidth);
  const fold = 46;
  const cloth = CLOTH.old;
  return (
    <div style={{ position: 'relative', width: w, height: h, opacity: sh, ...style }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="collar-closeup-band">
            <path d={`M 0 ${fold} Q ${w / 2} ${fold + 26} ${w} ${fold} L ${w - 30} ${h} Q ${w / 2} ${h + 30} 30 ${h} Z`} />
          </clipPath>
        </defs>
        {/* The inside of the collar (lining cloth), with a faint weave */}
        <path
          d={`M 0 ${fold} Q ${w / 2} ${fold + 26} ${w} ${fold} L ${w - 30} ${h} Q ${w / 2} ${h + 30} 30 ${h} Z`}
          fill={mixHex(LINING, '#000000', 0.1)}
          stroke={LINING_EDGE}
          strokeWidth={3}
        />
        <g clipPath="url(#collar-closeup-band)" stroke={alpha('#000000', 0.18)} strokeWidth={2}>
          {Array.from({ length: Math.ceil(w / 22) }, (_, i) => (
            <path key={i} d={`M ${i * 22} ${fold} L ${i * 22 - 60} ${h + 30}`} />
          ))}
        </g>
        {/* Stitching along the band's bottom edge */}
        <path d={`M 44 ${h - 18} Q ${w / 2} ${h + 8} ${w - 44} ${h - 18}`} fill="none" stroke={alpha(LINING_EDGE, 0.9)} strokeWidth={3} strokeDasharray="8 7" />
        {/* The fold: the jacket's own cloth, on top */}
        <path
          d={`M 0 ${fold} Q ${w / 2} ${fold + 26} ${w} ${fold} L ${w - 16} 0 Q ${w / 2} 22 16 0 Z`}
          fill={cloth.collar}
          stroke={cloth.edge}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d={`M 26 ${fold - 12} Q ${w / 2} ${fold + 12} ${w - 26} ${fold - 12}`} fill="none" stroke={alpha(cloth.edge, 0.6)} strokeWidth={2.4} strokeDasharray="8 7" />
      </svg>
      <div style={{ position: 'absolute', left: (w - labelWidth) / 2, top: fold + 26 + (h - fold - 26 - lh) / 2 - 6 }}>
        <WorkshopLabel width={labelWidth} path={path} show={labelShow} glow={labelGlow} />
      </div>
    </div>
  );
}
