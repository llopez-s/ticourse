import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { mix } from '../../../../engine/src/ui';
import { BLOCKS, BLUF_CONFIDENCE, FLASH_LINES, type BlockId } from '../../data/flash';

/**
 * The lesson's flash alert as ONE sheet the camera moves over (s04 and s05 share it): a fixed-size
 * page of 23 mono lines, a camera (`cam`: scale and where the page's top-left lands in the stage), a
 * lit weight per block (the rest steps back), optional bands and outlines per block, a highlight bar
 * per line and the phrase «moderate confidence». Nothing here reads the timeline: the scene drives
 * every weight from its cues.
 */

export const SHEET = { w: 1300, lh: 46, pad: 36, padX: 44, fs: 34 } as const;
export const SHEET_H = SHEET.pad * 2 + FLASH_LINES.length * SHEET.lh;

export interface Cam {
  sc: number;
  tx: number;
  ty: number;
}

/** Centre (sheet px) of a line range. */
export function lineCenter(from: number, to = from): number {
  return SHEET.pad + ((from + to + 1) / 2) * SHEET.lh;
}

/**
 * A camera that puts the centre of `lines` (a block or a line) at stage point (`x`, `y`) at scale `sc`.
 * `x` defaults to the middle of the sheet landing at the stage's middle.
 */
export function camOn(lines: [number, number] | number, sc: number, y: number, x = STAGE.width / 2): Cam {
  const [a, b] = typeof lines === 'number' ? [lines, lines] : lines;
  return { sc, tx: x - (SHEET.w / 2) * sc, ty: y - lineCenter(a, b) * sc };
}

/** Whole page, centred in the stage band [top, bottom]. */
export function camWhole(top: number, bottom: number): Cam {
  const sc = Math.min((bottom - top) / SHEET_H, 1);
  return { sc, tx: (STAGE.width - SHEET.w * sc) / 2, ty: top + (bottom - top - SHEET_H * sc) / 2 };
}

export function mixCam(a: Cam, b: Cam, t: number): Cam {
  return { sc: mix(a.sc, b.sc, t), tx: mix(a.tx, b.tx, t), ty: mix(a.ty, b.ty, t) };
}

/** Which block a line belongs to (null for blank lines). */
function blockOf(i: number): BlockId | null {
  for (const id of Object.keys(BLOCKS) as BlockId[]) {
    const [a, b] = BLOCKS[id];
    if (i >= a && i <= b) return id;
  }
  return null;
}

const TLP = 'TLP:AMBER';
const DIM_FLOOR = 0.3;

export function FlashSheet({
  cam,
  lit = {},
  bands = {},
  boxes = {},
  lineHl = {},
  conf = 0,
  clipTop = 0,
  clipBottom = 660,
  fade = 28,
  opacity = 1,
  style,
}: {
  cam: Cam;
  /** 0–1 per block; missing = 1. The rest of the page steps back. */
  lit?: Partial<Record<BlockId, number>>;
  /** Tinted band behind a block (0–1). */
  bands?: Partial<Record<BlockId, number>>;
  /** Outline around a block (0–1). */
  boxes?: Partial<Record<BlockId, number>>;
  /** Highlight bar behind a single line (0–1). */
  lineHl?: Record<number, number>;
  /** 0–1: marks the phrase «moderate confidence» in the BLUF. */
  conf?: number;
  /** The visible window of the page in stage coordinates (top fades in, bottom fades out). */
  clipTop?: number;
  clipBottom?: number;
  fade?: number;
  opacity?: number;
  style?: CSSProperties;
}) {
  const bandTone = (id: BlockId) => (id === 'unknown' ? C.amber : C.cyan);
  const mask = `linear-gradient(to bottom, transparent ${clipTop}px, #000 ${clipTop + fade}px, #000 ${clipBottom - fade}px, transparent ${clipBottom}px)`;
  return (
    <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask, opacity, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SHEET.w, height: SHEET_H, transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.sc})`, transformOrigin: '0 0' }}>
        {/* the page */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `3px solid ${C.ink600}`, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`, boxShadow: `0 30px 80px ${alpha('#000000', 0.5)}` }} />
        {/* bands and outlines */}
        {(Object.keys(BLOCKS) as BlockId[]).map((id) => {
          const [a, b] = BLOCKS[id];
          const band = bands[id] ?? 0;
          const box = boxes[id] ?? 0;
          if (band <= 0.002 && box <= 0.002) return null;
          const tone = bandTone(id);
          return (
            <div key={id} style={{ position: 'absolute', left: 18, right: 18, top: SHEET.pad + a * SHEET.lh - 8, height: (b - a + 1) * SHEET.lh + 16, borderRadius: 12, background: alpha(tone, 0.1 * band), border: `${Math.max(3, 3 / cam.sc)}px solid ${alpha(tone, 0.85 * Math.max(box, band * 0.6))}`, boxShadow: band > 0.05 ? `0 0 ${Math.round(30 * band)}px ${alpha(tone, 0.18 * band)}` : undefined }} />
          );
        })}
        {/* line highlights */}
        {Object.entries(lineHl).map(([k, v]) => {
          const i = Number(k);
          if (v <= 0.002) return null;
          const tone = blockOf(i) === 'unknown' ? C.amber : C.cyan;
          return <div key={k} style={{ position: 'absolute', left: 26, right: 26, top: SHEET.pad + i * SHEET.lh + 3, height: SHEET.lh - 6, borderRadius: 8, background: alpha(tone, 0.2 * v) }} />;
        })}
        {/* the text */}
        {FLASH_LINES.map((text, i) => {
          if (!text) return null;
          const id = blockOf(i);
          const w = id ? (lit[id] ?? 1) : 1;
          return (
            <div key={i} style={{ position: 'absolute', left: SHEET.padX, top: SHEET.pad + i * SHEET.lh, height: SHEET.lh, display: 'flex', alignItems: 'center', fontFamily: FONT.mono, fontSize: SHEET.fs, whiteSpace: 'pre', color: C.text, opacity: DIM_FLOOR + (1 - DIM_FLOOR) * w }}>
              {renderLine(i, text, conf)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Colours and weights of one line. The text is the lesson's, split only to colour a part of it. */
function renderLine(i: number, text: string, conf: number): ReactNode {
  if (i === 0) {
    const at = text.indexOf(TLP);
    return (
      <>
        <span style={{ fontWeight: 800, color: C.textStrong }}>{text.slice(0, at)}</span>
        <span style={{ fontWeight: 800, color: C.amber }}>{TLP}</span>
      </>
    );
  }
  if (i === 1) return <span style={{ color: C.muted }}>{text}</span>;
  if (i === 3) {
    const at = text.indexOf(BLUF_CONFIDENCE);
    const lab = 'BLUF:';
    return (
      <>
        <span style={{ fontWeight: 800, color: C.cyan }}>{lab}</span>
        <span style={{ color: C.textStrong }}>{text.slice(lab.length, at)}</span>
        <span style={{ color: C.textStrong, fontWeight: conf > 0.5 ? 800 : 400, background: alpha(C.cyan, 0.28 * conf), boxShadow: conf > 0.02 ? `0 0 0 4px ${alpha(C.cyan, 0.28 * conf)}` : undefined, borderRadius: 4 }}>{BLUF_CONFIDENCE}</span>
        <span style={{ color: C.textStrong }}>{text.slice(at + BLUF_CONFIDENCE.length)}</span>
      </>
    );
  }
  if (i >= 4 && i <= 6) return <span style={{ color: C.textStrong }}>{text}</span>;
  if (i === 8) return <span style={{ fontWeight: 800, color: C.cyanSoft }}>{text}</span>;
  if (i === 13) return <span style={{ fontWeight: 800, color: C.amber }}>{text}</span>;
  if (i === 14) return <span style={{ color: '#fde68a' }}>{text}</span>;
  if (i === 16) return <span style={{ fontWeight: 800, color: C.cyanSoft }}>{text}</span>;
  if (i === 21) {
    const lab = 'NEXT UPDATE:';
    return (
      <>
        <span style={{ fontWeight: 800, color: C.cyanSoft }}>{lab}</span>
        <span style={{ color: C.textStrong }}>{text.slice(lab.length)}</span>
      </>
    );
  }
  if (i === 22) return <span style={{ color: C.muted }}>{text}</span>;
  return <span>{text}</span>;
}
