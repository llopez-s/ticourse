import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/**
 * The software container, drawn the same in every scene (canon: out/scene-brief.md). Never a shipping container, a
 * crate or a box with corrugations: the IMAGE is a stack of three rounded layers, a COPY is a small app window.
 */

/** Mixes two #rrggbb colours (t 0–1). */
export function blend(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

/** The image's natural size (its own units); scale with `width`. */
export const IMAGE = { w: 300, h: 214 } as const;
const LAYER_Y = [10, 62, 114];

/**
 * The container image: three stacked layers seen from above at an angle. `flaw` 0–1 turns the middle layer rose (the
 * published fault the scan finds), `fixed` 0–1 turns it emerald again; `scan` 0–1 sweeps a beam across, `glow` lights it.
 */
export function ImageStack({
  width = IMAGE.w,
  glow = 0,
  flaw = 0,
  fixed = 0,
  scan = -1,
  ring = 0,
}: {
  width?: number;
  glow?: number;
  flaw?: number;
  fixed?: number;
  /** Beam position 0–1 (left to right); < 0 hides it. */
  scan?: number;
  /** A pulsing alarm ring round the flawed layer, 0–1. */
  ring?: number;
}) {
  const h = (width * IMAGE.h) / IMAGE.w;
  const layers = [2, 1, 0];
  return (
    <svg width={width} height={h} viewBox={`0 0 ${IMAGE.w} ${IMAGE.h}`} style={{ overflow: 'visible' }}>
      {layers.map((i) => {
        const y = LAYER_Y[i];
        const isFlaw = i === 1;
        const base = isFlaw ? blend(blend(C.cyan, C.rose, flaw), C.emerald, fixed) : C.cyan;
        const top = `M 150 ${y} L 290 ${y + 40} L 150 ${y + 80} L 10 ${y + 40} Z`;
        const side = `M 10 ${y + 40} L 150 ${y + 80} L 290 ${y + 40} L 290 ${y + 58} L 150 ${y + 98} L 10 ${y + 58} Z`;
        const lit = 0.16 + 0.14 * glow + (isFlaw ? 0.22 * Math.max(flaw * (1 - fixed), fixed) : 0);
        return (
          <g key={i}>
            <path d={side} fill={alpha(base, 0.28)} stroke={alpha(base, 0.75)} strokeWidth={3} strokeLinejoin="round" />
            <path d={top} fill={blend(C.ink850, base, lit)} stroke={alpha(base, 0.6 + 0.4 * glow)} strokeWidth={3.5} strokeLinejoin="round" />
          </g>
        );
      })}
      {ring > 0.01 ? (
        <ellipse cx={150} cy={LAYER_Y[1] + 48} rx={150 + 26 * ring} ry={56 + 14 * ring} fill="none" stroke={alpha(C.rose, 0.8 * (1 - ring * 0.6))} strokeWidth={5} />
      ) : null}
      {scan >= 0 && scan <= 1 ? (
        <g>
          <rect x={mix(0, 300, scan) - 4} y={-6} width={8} height={IMAGE.h + 8} rx={4} fill={alpha(C.sky, 0.85)} />
          <rect x={mix(0, 300, scan) - 26} y={-6} width={52} height={IMAGE.h + 8} fill={alpha(C.sky, 0.12)} />
        </g>
      ) : null}
    </svg>
  );
}

/** One copy of the image (a container) as a small app window. Natural size 160 × 110. */
export const TILE = { w: 160, h: 110 } as const;

export function AppTile({
  width = TILE.w,
  tone = C.cyan,
  fault = 0,
  fresh = 0,
  glow = 0,
}: {
  width?: number;
  tone?: string;
  /** Rose fault reaching it, 0–1 (the kernel's flaw spilling over, s04). */
  fault?: number;
  /** Emerald «new copy» border, 0–1. */
  fresh?: number;
  glow?: number;
}) {
  const h = (width * TILE.h) / TILE.w;
  const edge = blend(blend(tone, C.rose, fault), C.emerald, fresh);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${TILE.w} ${TILE.h}`} style={{ overflow: 'visible' }}>
      {glow > 0.01 ? <rect x={-6} y={-6} width={TILE.w + 12} height={TILE.h + 12} rx={20} fill={alpha(edge, 0.18 * glow)} /> : null}
      <rect x={2} y={2} width={TILE.w - 4} height={TILE.h - 4} rx={14} fill={blend(C.ink850, edge, 0.1 + 0.25 * fault)} stroke={edge} strokeWidth={4} />
      <rect x={2} y={2} width={TILE.w - 4} height={26} rx={12} fill={alpha(edge, 0.3)} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={20 + k * 16} cy={15} r={5} fill={alpha(C.text, 0.55)} />
      ))}
      <rect x={20} y={46} width={96} height={13} rx={6} fill={alpha(C.text, 0.4)} />
      <rect x={20} y={72} width={66} height={11} rx={5} fill={alpha(C.text, 0.25)} />
    </svg>
  );
}

/** A labelled slab (kernel, hypervisor, hardware) for the stacks below. */
export function Slab({ x, y, w, h, tone, label, size, fill = 0.16, stroke = 0.7 }: { x: number; y: number; w: number; h: number; tone: string; label?: string; size: number; fill?: number; stroke?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={alpha(tone, fill)} stroke={alpha(tone, stroke)} strokeWidth={3} />
      {label ? (
        <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontFamily={FONT.sans} fontSize={size} fontWeight={800} fill={C.textStrong}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * A host running containers: app tiles over ONE shared «kernel» slab over the «host» hardware. `kernelHot` 0–1 lights the
 * kernel amber (the word the voice stresses), `fault` 0–1 turns it rose (its flaw) and `spill` 0–1 carries the rose up
 * into the tiles, one after another.
 */
export function HostStack({
  width,
  tiles = 3,
  tileW,
  kernelHot = 0,
  fault = 0,
  spill = 0,
  labelSize = 26,
  hostLabel = 'host',
  kernelLabel = 'kernel',
}: {
  width: number;
  tiles?: number;
  tileW?: number;
  kernelHot?: number;
  fault?: number;
  spill?: number;
  labelSize?: number;
  hostLabel?: string;
  kernelLabel?: string;
}) {
  const gap = 12;
  const tw = tileW ?? (width - gap * (tiles + 1)) / tiles;
  const th = (tw * TILE.h) / TILE.w;
  const kH = Math.round(labelSize * 1.6);
  const hH = Math.round(labelSize * 1.4);
  const kY = th + 10;
  const hY = kY + kH + 6;
  const height = hY + hH;
  const kTone = blend(blend(C.sky, C.amber, kernelHot), C.rose, fault);
  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {fault > 0.01 ? <rect x={-8} y={kY - 8} width={width + 16} height={kH + 16} rx={16} fill={alpha(C.rose, 0.2 * fault)} /> : null}
        <Slab x={0} y={kY} w={width} h={kH} tone={kTone} label={kernelLabel} size={labelSize} fill={0.16 + 0.2 * Math.max(kernelHot, fault)} stroke={0.7 + 0.3 * Math.max(kernelHot, fault)} />
        <Slab x={0} y={hY} w={width} h={hH} tone={C.sky} label={hostLabel} size={labelSize - 2} fill={0.08} stroke={0.45} />
      </svg>
      {Array.from({ length: tiles }, (_, i) => {
        const reach = clamp01(spill * tiles - i);
        return (
          <div key={i} style={{ position: 'absolute', left: gap + i * (tw + gap), top: 0 }}>
            <AppTile width={tw} fault={reach} />
          </div>
        );
      })}
    </div>
  );
}

/** Height HostStack takes for a given width / tiles / labelSize (to lay rows out). */
export function hostStackHeight(width: number, tiles = 3, labelSize = 26, tileW?: number): number {
  const tw = tileW ?? (width - 12 * (tiles + 1)) / tiles;
  return (tw * TILE.h) / TILE.w + 10 + Math.round(labelSize * 1.6) + 6 + Math.round(labelSize * 1.4);
}

