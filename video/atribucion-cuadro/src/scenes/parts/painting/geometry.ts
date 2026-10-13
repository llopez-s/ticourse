/**
 * Geometry of V23's one image, the painting («el cuadro»). Everything is drawn in DESIGN UNITS whose origin
 * is the top-left corner of the picture frame (400 × 520); `paintingLayout(width)` converts every anchor to
 * px for a frame `width` px wide, so scenes can hang their own text and connectors on the drawing.
 */

/** Band index: 0 = band 1 (bottom, «¿con qué se hizo?»), 1 = band 2 (middle), 2 = band 3 (top). */
export type BandIndex = 0 | 1 | 2;
export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

/** The picture frame, the easel under it and what stands around it (design units). */
export const PD = {
  w: 400,
  h: 520,
  /** Frame moulding thickness. */
  t: 12,
  /** How far the easel's mast sticks out above the frame. */
  mastUp: 12,
  ledgeH: 16,
  /** Where the easel's feet stand. */
  legsBottom: 606,
} as const;

export const CANVAS: Rect = { x: PD.t, y: PD.t, w: PD.w - 2 * PD.t, h: PD.h - 2 * PD.t };
export const BAND_H = CANVAS.h / 3;

/** Top of band `i` (design units). */
export function bandTop(i: BandIndex): number {
  return CANVAS.y + (2 - i) * BAND_H;
}

/** The corner that carries the signature and the date (bottom right of the canvas). */
export const CORNER: Rect = { x: 232, y: 438, w: 156, h: 70 };

/** The archive box with the contract: OUTSIDE the painting, level with band 3. */
export const ARCHIVE = { w: 124, h: 96, gap: 26 } as const;

/** The spotlight «tu telemetría»: a lamp left of the painting, level with band 1. */
export const LAMP = { gap: 250, y: bandTop(0) + BAND_H * 0.56, head: 54 } as const;

/** Where the beam's upper edge meets the canvas: it only grazes band 2. This line is the «ceiling». */
export const CEILING_Y = bandTop(1) + BAND_H * 0.72;

/** How much of the beam each band receives (band 1 fully, band 2 grazed, band 3 nothing). */
export const BEAM_REACH = [1, 0.28, 0] as const;

/** The museum label («la cartela»), right of the frame, low. */
export const CARTELA = { gap: 24, w: 168, h: 104, y: 388 } as const;

export type PaintingLayoutOptions = {
  /** Distance from the frame's left edge to the lamp's mouth, in design units (default 250). */
  spotGap?: number;
  /** Which side of the frame the archive box stands on (default 'left'). */
  archiveSide?: 'left' | 'right';
};

export type PaintingLayout = {
  /** px per design unit. */
  s: number;
  /** The frame's box, px (the part's origin is its top-left). */
  w: number;
  h: number;
  /** Bottom of the easel's feet, px (the part's full height below the origin). */
  totalH: number;
  /** Top of the easel's mast, px (negative: it sticks out above the frame). */
  top: number;
  canvas: Rect;
  /** bands[0] = band 1 (bottom), bands[2] = band 3 (top). */
  bands: [Rect, Rect, Rect];
  corner: Rect;
  archive: Rect;
  /** The lamp's mouth (where the beam starts) and its whole box. */
  lamp: Point;
  lampBox: Rect;
  /** y of the beam's upper edge on the canvas, px: the «ceiling». */
  ceilingY: number;
  cartela: Rect;
};

const scaleRect = (r: Rect, s: number): Rect => ({ x: r.x * s, y: r.y * s, w: r.w * s, h: r.h * s });

/** Design-unit rect of the archive box for a side. */
export function archiveRect(side: 'left' | 'right' = 'left'): Rect {
  const y = bandTop(2) + (BAND_H - ARCHIVE.h) / 2 + 8;
  return { x: side === 'left' ? -ARCHIVE.gap - ARCHIVE.w : PD.w + ARCHIVE.gap, y, w: ARCHIVE.w, h: ARCHIVE.h };
}

/** Every anchor of the painting in px, for a frame `width` px wide. */
export function paintingLayout(width: number, opts: PaintingLayoutOptions = {}): PaintingLayout {
  const s = width / PD.w;
  const gap = opts.spotGap ?? LAMP.gap;
  const band = (i: BandIndex): Rect => scaleRect({ x: CANVAS.x, y: bandTop(i), w: CANVAS.w, h: BAND_H }, s);
  return {
    s,
    w: width,
    h: PD.h * s,
    totalH: PD.legsBottom * s,
    top: -PD.mastUp * s,
    canvas: scaleRect(CANVAS, s),
    bands: [band(0), band(1), band(2)],
    corner: scaleRect(CORNER, s),
    archive: scaleRect(archiveRect(opts.archiveSide), s),
    lamp: { x: -gap * s, y: LAMP.y * s },
    lampBox: scaleRect({ x: -gap - 96, y: LAMP.y - 40, w: 96, h: PD.legsBottom - LAMP.y + 40 }, s),
    ceilingY: CEILING_Y * s,
    cartela: scaleRect({ x: PD.w + CARTELA.gap, y: CARTELA.y, w: CARTELA.w, h: CARTELA.h }, s),
  };
}
