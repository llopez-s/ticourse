import { useEffect, useState } from 'react';
import { continueRender, delayRender, interpolateColors, useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { CaptionPage, TimedWord } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, alpha } from '../theme/tokens';

/** Karaoke colours: already spoken / being spoken / still to come. */
const SPOKEN = '#f1f5f9';
const CURRENT = C.cyanSoft;
const UPCOMING = C.muted;

const SIZE_MAX = 46;
const SIZE_MIN = 40;
const LINE_HEIGHT = 1.3;
const WEIGHT = 600;
const MAX_WIDTH = 1500;
/** Last resort for a line that is too long even at 40 px: widen the panel up to the stage width rather than eat the padding. */
const OVERFLOW_WIDTH = LAYOUT.stage.right - LAYOUT.stage.left;
const MIN_WIDTH = 420;
const PAD_X = 36;
const PAD_Y = 14;
const BORDER = 2;
/** Page text fade in/out, in frames. */
const FADE = 4;
/** Pages closer than this share one panel (no panel blink between them). */
const RUN_GAP = 12;
/** Frames a just-spoken word takes to settle from cyan to white (it is already half-way on its `to` frame). */
const SETTLE = 2;
/** Panel bottom edge sits inside the captions zone (y 872–1046). */
const BOTTOM = LAYOUT.captions.bottom - 4;

/* ------------------------------------------------------------------ fonts */

function interLoaded(): boolean {
  if (typeof document === 'undefined' || !document.fonts) return true;
  let ok = false;
  document.fonts.forEach((face) => {
    if (face.family.replace(/["']/g, '') === 'IF Inter' && face.status === 'loaded') ok = true;
  });
  return ok;
}

/**
 * Text widths are measured with canvas, which must see the real Inter (not the
 * fallback) or the fit decisions would be wrong on the first frame a render tab
 * mounts. Holds the frame until the face registered by theme/fonts.ts is
 * available, then re-renders once. Shared by the other overlays that size
 * themselves to their text (exam card, think prompt).
 */
export function useFontsReady(): boolean {
  const [handle] = useState(() => (interLoaded() ? null : delayRender('Overlays: waiting for Inter to measure text')));
  const [ready, setReady] = useState(handle === null);
  useEffect(() => {
    if (handle === null) return undefined;
    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };
    const poll = () => {
      if (interLoaded()) {
        setReady(true);
        finish();
      } else {
        timer = setTimeout(poll, 20);
      }
    };
    poll();
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      finish();
    };
  }, [handle]);
  return ready;
}

let measureCtx: CanvasRenderingContext2D | null | undefined;
const widthCache = new Map<string, number>();

/**
 * Rendered width (px) of one unwrapped line of `text` in FONT.sans. Before the
 * fonts are ready it returns a deliberately generous estimate and caches nothing.
 */
export function textWidth(
  text: string,
  { size, weight, letterSpacing = 0 }: { size: number; weight: number; letterSpacing?: number },
  fontsReady: boolean,
): number {
  const key = `${weight}|${size}|${letterSpacing}|${text}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  if (measureCtx === undefined) {
    measureCtx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  if (!measureCtx || !fontsReady) return text.length * size * 0.58;
  measureCtx.font = `${weight} ${size}px ${FONT.sans}`;
  const width = measureCtx.measureText(text).width + letterSpacing * text.length;
  widthCache.set(key, width);
  return width;
}

/**
 * Splits `text` into one line (if it fits in `max`) or the two most even
 * lines, breaking only between words, and returns the width of the widest
 * line. Rendering the lines explicitly (one nowrap row each) guarantees the
 * box hugs them and nothing is ever clamped — a width guess plus
 * `textWrap: balance` can spill onto a third line.
 */
export function twoLines(
  text: string,
  style: { size: number; weight: number; letterSpacing?: number },
  fontsReady: boolean,
  max: number,
): { lines: string[]; width: number } {
  const natural = textWidth(text, style, fontsReady);
  if (natural <= max) return { lines: [text], width: Math.ceil(natural) + 2 };
  const words = text.split(' ');
  let best: { lines: string[]; width: number } | null = null;
  for (let i = 1; i < words.length; i++) {
    // Never open the second line with a bare separator ("·", "=", ":", "—").
    if (/^[·=:—-]$/.test(words[i])) continue;
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const width = Math.max(textWidth(a, style, fontsReady), textWidth(b, style, fontsReady));
    if (!best || width < best.width) best = { lines: [a, b], width };
  }
  if (!best) return { lines: [text], width: Math.ceil(natural) + 2 };
  return { lines: best.lines, width: Math.ceil(best.width) + 2 };
}

function measure(text: string, fontsReady: boolean): number {
  return textWidth(text, { size: SIZE_MAX, weight: WEIGHT }, fontsReady);
}

/* ----------------------------------------------------------------- layout */

interface Box {
  width: number;
  height: number;
}

interface PageLayout extends Box {
  size: number;
}

function lineText(line: TimedWord[]): string {
  return line.map((w) => w.text).join(' ');
}

/**
 * Font size and panel box of one page. Lines never wrap: if the widest line
 * does not fit at 46 px the whole page shrinks (down to 40 px). At 46 px a
 * line holds ~62 characters, at 40 px ~71; beyond that the panel widens.
 */
function layoutPage(page: CaptionPage, fontsReady: boolean): PageLayout {
  const inner = MAX_WIDTH - 2 * PAD_X - 2 * BORDER;
  // 2 % headroom: canvas and DOM can disagree by a pixel or two per line.
  const widest = Math.max(1, ...page.lines.map((l) => measure(lineText(l), fontsReady))) * 1.02;
  const size = widest <= inner ? SIZE_MAX : Math.max(SIZE_MIN, Math.floor((SIZE_MAX * inner) / widest));
  const textWidth = (widest * size) / SIZE_MAX;
  return {
    size,
    width: Math.round(Math.min(textWidth > inner ? OVERFLOW_WIDTH : MAX_WIDTH, Math.max(MIN_WIDTH, textWidth + 2 * PAD_X + 2 * BORDER))),
    height: Math.round(page.lines.length * size * LINE_HEIGHT + 2 * PAD_Y + 2 * BORDER),
  };
}

function mixBox(a: Box, b: Box, t: number): Box {
  return { width: a.width + (b.width - a.width) * t, height: a.height + (b.height - a.height) * t };
}

/** Panel morph into page `b` of a run: from the moment the previous text starts fading out until `b` has faded in. */
function morph(frame: number, b: CaptionPage): number {
  return progress(frame, b.from - FADE, 2 * FADE, EASE.inOut);
}

function wordColor(word: TimedWord, frame: number): string {
  if (frame < word.from) return UPCOMING;
  if (frame < word.to) return CURRENT;
  return interpolateColors(frame, [word.to - 1, word.to - 1 + SETTLE], [CURRENT, SPOKEN]);
}

/* ------------------------------------------------------------------- view */

/**
 * Pure view. Karaoke captions: one page (1–2 lines) at a time on a rounded
 * ink panel. Only colour changes per word, so nothing on the line moves.
 * Consecutive pages share the panel, which morphs to the next page's size
 * while the text fades out (4 frames) and in (4 frames).
 */
export function CaptionsView({ pages, frame }: { pages: CaptionPage[]; frame: number }) {
  const fontsReady = useFontsReady();
  if (pages.length === 0) return null;

  // Last page that has started.
  let a = -1;
  for (let k = 0; k < pages.length; k++) {
    if (pages[k].from <= frame) a = k;
    else break;
  }
  if (a < 0) return null;

  const joins = (k: number) => k + 1 < pages.length && pages[k + 1].from - pages[k].to <= RUN_GAP;
  const page = pages[a];
  // A page followed closely by another stays on screen (fully spoken, white)
  // until the next one starts, so the shared panel is never shown empty.
  const visibleTo = joins(a) ? pages[a + 1].from : page.to;
  if (frame >= visibleTo) return null;

  let runStart = a;
  while (runStart > 0 && joins(runStart - 1)) runStart--;
  let runEnd = a;
  while (joins(runEnd)) runEnd++;

  const panelOpacity = Math.min(
    progress(frame, pages[runStart].from, FADE, EASE.out),
    1 - progress(frame, pages[runEnd].to - FADE, FADE, EASE.inOut),
  );

  const layout = layoutPage(page, fontsReady);
  let box: Box = layout;
  if (a > runStart && frame < page.from + FADE) {
    box = mixBox(layoutPage(pages[a - 1], fontsReady), layout, morph(frame, page));
  } else if (joins(a) && frame >= visibleTo - FADE) {
    box = mixBox(layout, layoutPage(pages[a + 1], fontsReady), morph(frame, pages[a + 1]));
  }

  const textOpacity = Math.min(
    progress(frame, page.from, FADE, EASE.out),
    1 - progress(frame, visibleTo - FADE, FADE, EASE.inOut),
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.width / 2 - box.width / 2,
        top: BOTTOM - box.height,
        width: box.width,
        height: box.height,
        boxSizing: 'border-box',
        borderRadius: 20,
        background: alpha(C.ink950, 0.8),
        border: `${BORDER}px solid ${C.ink700}`,
        boxShadow: `0 12px 30px ${alpha('#000000', 0.3)}`,
        overflow: 'hidden',
        opacity: panelOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.sans,
        pointerEvents: 'none',
      }}
    >
      {textOpacity > 0 ? (
        <div style={{ opacity: textOpacity }}>
          {page.lines.map((line, li) => (
            <div
              key={li}
              style={{
                fontSize: layout.size,
                fontWeight: WEIGHT,
                lineHeight: LINE_HEIGHT,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                letterSpacing: 0,
              }}
            >
              {line.map((word, wi) => (
                <span key={wi} style={{ color: wordColor(word, frame) }}>
                  {wi > 0 ? ' ' : ''}
                  {word.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Timeline-driven captions mounted by LessonVideo (absolute frame). */
export function Captions() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <CaptionsView pages={timeline.captions} frame={frame} />;
}
