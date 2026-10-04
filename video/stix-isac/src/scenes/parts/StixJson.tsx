import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, tone as toneOf, windowWeight, type Tone } from '../../../../engine/src/ui';

/**
 * The incoming STIX 2.1 indicator (lesson s3m5, `src/data/s3.ts`), exactly as
 * the lesson prints it, as a code card with the header «Indicador STIX 2.1 ·
 * ISAC aeroespacial». Identical wherever it comes back: full size in s02
 * (one field in focus at a time, the rest dimmed), `mini` inside the letter of
 * s05 and the rule card of s06 (the same focus API lights the marking there).
 *
 * Drawn in design units (STIX_BASE.w wide) and scaled to `width`. All frames
 * are Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const STIX_HEADER = 'Indicador STIX 2.1 · ISAC aeroespacial';

/** The JSON, verbatim (two-space indent). */
export const STIX_JSON = `{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--7c1e0a44-2b9f-4d18-a6e3-meridian0052",
  "created": "2026-03-11T08:00:00Z",
  "modified": "2026-03-11T08:00:00Z",
  "created_by_ref": "identity--aero-isac-share-0001",
  "name": "GLASS VIPER phishing domain",
  "pattern_type": "stix",
  "pattern": "[domain-name:value = 'cdn-sync-status.example']",
  "valid_from": "2026-03-11T00:00:00Z",
  "valid_until": "2026-06-25T00:00:00Z",
  "confidence": 70,
  "object_marking_refs": ["marking-definition--tlp-amber-strict"]
}`;

export type StixKey =
  | 'type'
  | 'spec_version'
  | 'id'
  | 'created'
  | 'modified'
  | 'created_by_ref'
  | 'name'
  | 'pattern_type'
  | 'pattern'
  | 'valid_from'
  | 'valid_until'
  | 'confidence'
  | 'object_marking_refs';

interface StixLine {
  key: StixKey | null;
  text: string;
}

export const STIX_LINES: StixLine[] = STIX_JSON.split('\n').map((text) => {
  const m = /^\s*"([^"]+)":/.exec(text);
  return { key: m ? (m[1] as StixKey) : null, text };
});

/** One focus window: line `key` is enlarged and lit from `from` to `to` (exclusive; open-ended if absent). */
export interface StixFocus {
  key: StixKey;
  from: number;
  to?: number;
  /** Highlight colour (default sky: the ISAC's object). */
  tone?: Tone;
}

/** Design units. */
export const STIX_BASE = {
  w: 1000,
  header: 60,
  padTop: 14,
  padBottom: 16,
  padX: 28,
  font: 24,
  line: 34,
} as const;
/** JetBrains Mono advance (em). */
const ADV = 0.6;
const BASE_H = STIX_BASE.header + STIX_BASE.padTop + STIX_LINES.length * STIX_BASE.line + STIX_BASE.padBottom;
/** Default px width of the mini (inside a letter). */
export const STIX_MINI_W = 340;

/** Height in px of the card drawn at `width`. */
export function stixJsonHeight(width: number = STIX_BASE.w): number {
  return (BASE_H * width) / STIX_BASE.w;
}

/**
 * Box of one line's text in px from the card's top-left, at `width`: `x`/`y`
 * top-left of the text, `w` its width at rest, `h` the line height, `cy` its
 * vertical centre, `right` where the text ends (to hang a callout or a connector).
 */
export function stixLineBox(key: StixKey, width: number = STIX_BASE.w): { x: number; y: number; w: number; h: number; cy: number; right: number } {
  const i = STIX_LINES.findIndex((l) => l.key === key);
  if (i < 0) throw new Error(`no STIX line ${key}`);
  const s = width / STIX_BASE.w;
  const textW = STIX_LINES[i].text.length * ADV * STIX_BASE.font;
  const x = STIX_BASE.padX * s;
  const y = (STIX_BASE.header + STIX_BASE.padTop + i * STIX_BASE.line) * s;
  return { x, y, w: textW * s, h: STIX_BASE.line * s, cy: y + (STIX_BASE.line * s) / 2, right: x + textW * s };
}

const KEY = '#7dd3fc';
const PUNCT = C.faint;

/** Syntax-coloured spans of one line. `lit` (0–1) brightens it to the focus tone. */
function Tokens({ text, lit, litTone }: { text: string; lit: number; litTone: string }) {
  const m = /^(\s*)("[^"]+")(:\s)(.*?)(,?)$/.exec(text);
  if (!m) return <span style={{ color: PUNCT }}>{text}</span>;
  const [, indent, key, colon, value, comma] = m;
  const isNum = /^\d+$/.test(value);
  const valueColour = lit > 0.5 ? C.textStrong : isNum ? C.textStrong : C.text;
  const parts: ReactNode[] = [];
  // Arrays: brackets as punctuation, the string inside as a value.
  const arr = /^\[(.*)\]$/.exec(value);
  if (arr) {
    parts.push(
      <span key="o" style={{ color: PUNCT }}>
        [
      </span>,
      <span key="v" style={{ color: valueColour }}>
        {arr[1]}
      </span>,
      <span key="c" style={{ color: PUNCT }}>
        ]
      </span>,
    );
  } else {
    parts.push(
      <span key="v" style={{ color: valueColour, fontWeight: isNum ? 700 : undefined }}>
        {value}
      </span>,
    );
  }
  return (
    <>
      <span>{indent}</span>
      <span style={{ color: lit > 0.05 ? litTone : KEY, fontWeight: lit > 0.05 ? 700 : 500 }}>{key}</span>
      <span style={{ color: PUNCT }}>{colon}</span>
      {parts}
      <span style={{ color: PUNCT }}>{comma}</span>
    </>
  );
}

export function StixJson({
  at,
  focus = [],
  width,
  mini = false,
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  /** Frame the card opens (lines follow, staggered). Undefined: already on screen. */
  at?: number;
  /** Focus windows (any order); while one is active its line is lit and enlarged, the rest dim. */
  focus?: StixFocus[];
  /** Width in px (default STIX_BASE.w, or STIX_MINI_W when `mini`). */
  width?: number;
  /** Letter-size: stronger highlight and dimming so a lit line still reads as a bar at small scale. */
  mini?: boolean;
  /** 0–1: steps the whole card back. */
  dim?: number;
  /** 0–1: sky halo around the card. */
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const w = width ?? (mini ? STIX_MINI_W : STIX_BASE.w);
  const s = w / STIX_BASE.w;

  const show = at === undefined ? 1 : progress(frame, at, 14);
  if (show <= 0) return null;
  const lineIn = (i: number) => (at === undefined ? 1 : progress(frame, at + 6 + i * 2, 10));

  // Focus weight per line (max over its windows) and the strongest focus anywhere.
  const lineFocus = STIX_LINES.map(() => ({ w: 0, tone: 'sky' as Tone }));
  for (const f of focus) {
    const i = STIX_LINES.findIndex((l) => l.key === f.key);
    if (i < 0) continue;
    const wt = windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 4 });
    if (wt > lineFocus[i].w) lineFocus[i] = { w: wt, tone: f.tone ?? 'sky' };
  }
  const anyFocus = Math.max(0, ...lineFocus.map((l) => l.w));
  const dimK = mini ? 0.78 : 0.68;
  const g = clamp01(glow);
  const cardDim = clamp01(dim);
  const beat = 0.85 + 0.15 * pulse(frame, fps, 0.6);

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: BASE_H * s,
        opacity: show * (1 - 0.6 * cardDim),
        filter: cardDim > 0.001 ? `saturate(${1 - 0.5 * cardDim})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: STIX_BASE.w,
          height: BASE_H,
          transform: `scale(${s}) translateY(${(1 - show) * 16}px)`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `${mini ? 4 : 2}px solid ${g > 0 ? alpha(C.sky, 0.4 + 0.5 * g) : alpha(C.sky, 0.32)}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 28px 64px ${alpha('#000000', 0.42)}${g > 0 ? `, 0 0 ${26 + 30 * g}px ${alpha(C.sky, 0.3 * g)}` : ''}`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: STIX_BASE.w,
            height: STIX_BASE.header,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: `0 ${STIX_BASE.padX}px`,
            background: alpha(C.ink800, 0.95),
            borderBottom: `2px solid ${C.ink700}`,
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: anyFocus > 0 ? 1 - 0.35 * anyFocus : 1,
          }}
        >
          <Icon name="file" size={32} color={C.sky} />
          {STIX_HEADER}
        </div>

        {/* Lines */}
        {STIX_LINES.map((line, i) => {
          const lf = lineFocus[i];
          const t = toneOf(lf.tone);
          const lit = lf.w;
          const others = anyFocus * (1 - lit);
          const textW = line.text.length * ADV * STIX_BASE.font;
          // Grow the lit line only as far as the card allows.
          const room = STIX_BASE.w - STIX_BASE.padX - 36;
          const maxScale = Math.max(1, Math.min(1.14, room / Math.max(1, textW)));
          const k = 1 + (maxScale - 1) * lit;
          const y = STIX_BASE.header + STIX_BASE.padTop + i * STIX_BASE.line;
          const p = lineIn(i);
          return (
            <div key={i}>
              {lit > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: STIX_BASE.padX - 14,
                    top: y - 1,
                    width: STIX_BASE.w - 2 * (STIX_BASE.padX - 14),
                    height: STIX_BASE.line + 2,
                    boxSizing: 'border-box',
                    borderRadius: 8,
                    background: alpha(t.fg, (mini ? 0.32 : 0.15) * lit),
                    border: `${mini ? 4 : 2}px solid ${alpha(t.fg, 0.8 * lit)}`,
                    boxShadow: `0 0 ${Math.round((mini ? 34 : 22) * lit * beat)}px ${alpha(t.fg, (mini ? 0.55 : 0.32) * lit)}`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: STIX_BASE.padX,
                  top: y,
                  height: STIX_BASE.line,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: FONT.mono,
                  fontSize: STIX_BASE.font,
                  fontWeight: 500,
                  whiteSpace: 'pre',
                  color: C.text,
                  transform: `translateX(${(1 - p) * 12}px) scale(${k})`,
                  transformOrigin: '0 50%',
                  opacity: p * (1 - dimK * others),
                }}
              >
                <Tokens text={line.text} lit={lit} litTone={t.soft} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Ease helper for callers that hang a lens on a line: 0–1 weight of the window. */
export function stixFocusWeight(frame: number, f: StixFocus): number {
  return windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 4 });
}
