import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { RULE_LABEL } from '../../data/rules';

/**
 * RuleCode — a code panel that shows a detection rule with line-level control. Used for the YARA rule
 * (s03, `YARA_RULE`) and the Sigma rule (s04, `SIGMA_RULE`), both in `src/data/rules.ts` (with
 * `YARA_LINE` / `SIGMA_LINE` line indexes). Presentational only: it never reads the timeline; every
 * frame prop (`at`, `typeAt`, tag/highlight `at`) is relative to the scene's Sequence, like the engine's
 * ui pieces, and `frame` defaults to `useCurrentFrame()`. Wrap it in an absolutely positioned div.
 *
 * Props (all optional except `lines`):
 *   lines        the rule, one string per line (exact text; leading spaces are the indentation)
 *   frame        current frame (default useCurrentFrame())
 *   title        left side of the header strip, e.g. 'YARA' / 'Sigma' (sans, in `tone`)
 *   label        right side of the strip; default RULE_LABEL «extracto de la lección · ficticia»; '' hides it
 *   tone         panel accent (default cyan: the analyst's rule)
 *   fontSize     code size in px, ≥ 26 (default 26). Mono advance is 0.6 em, so width is predictable.
 *   lineHeight   line pitch as a multiple of fontSize (default 1.2)
 *   blankScale   height of an empty line relative to a normal one (default 0.5)
 *   indentScale  drawn width of each leading space relative to a character (default 0.5: the text stays
 *                exact, only the indentation is narrower)
 *   width        panel width in px (default: the natural width from `ruleCodeGeometry`)
 *   at           frame the panel fades/slides in (default: visible from the start)
 *   typeAt       lines type in: a start frame (line i starts at typeAt + i × typeStep) or one start
 *                frame per line; omit for all lines visible
 *   typeStep     frames per line when `typeAt` is a number (default 4)
 *   focus        line indexes kept lit; the rest dim by `focusAmount`. null/undefined = all lit
 *   focusAmount  0–1 strength of that dimming (default 1); animate it to ease focus in and out
 *   highlights   [{ line, token?, nth?, tone?, at?, amount? }]: a box behind `token` (the nth match in
 *                that line, default 0) or, without `token`, behind the whole line's text
 *   tags         [{ line, text, sub?, tone?, at?, amount?, size? }]: a pill (≥ 32 px, default 32) to the
 *                right of the line, with a thin leader from the line's end. All tags share one column
 *                (`tagX`) and are spread vertically so consecutive tagged lines never overlap; pass every
 *                tag from the start with its own `at` so the layout never jumps. Tags may extend past the
 *                panel's right edge (measure with `ruleCodeGeometry(...).tagX`).
 *   tagX         x of the tag column from the panel's left edge (default: after the longest tagged line)
 *   viewHeight   clip the code area to this many px (a window onto a long rule) …
 *   scrollTo     … starting at this (fractional) line index
 *   style        extra style on the outer box (do not pass `transform` if `at` is set)
 *
 * Geometry: `ruleCodeGeometry(lines, opts)` returns the panel's natural size and the y centre / x end
 * of every line in panel coordinates, so scenes can point arrows at a line or lay out next to it.
 * Worst cases at the defaults (26 px, with a title): YARA_RULE = 1180 × 609, SIGMA_RULE = 1055 × 641 (both fit
 * the 660 px stage; for room beside it, pass `viewHeight` + `scrollTo` or shorten the title strip with label='').
 */

export type RuleHighlight = {
  line: number;
  /** Text to box inside the line; omit to box the whole line. */
  token?: string;
  /** Which match of `token` in the line (0-based). */
  nth?: number;
  tone?: string;
  /** Fade-in frame; or drive it with `amount`. */
  at?: number;
  amount?: number;
};

export type RuleTag = {
  line: number;
  text: string;
  /** A smaller second line under the pill. */
  sub?: string;
  tone?: string;
  at?: number;
  amount?: number;
  /** Pill text size, ≥ 32 (default 32). */
  size?: number;
};

export type RuleCodeOptions = {
  fontSize?: number;
  lineHeight?: number;
  blankScale?: number;
  indentScale?: number;
  title?: string;
  label?: string;
};

export type RuleCodeProps = RuleCodeOptions & {
  lines: readonly string[];
  frame?: number;
  tone?: string;
  width?: number;
  at?: number;
  typeAt?: number | readonly number[];
  typeStep?: number;
  focus?: readonly number[] | null;
  focusAmount?: number;
  highlights?: readonly RuleHighlight[];
  tags?: readonly RuleTag[];
  tagX?: number;
  viewHeight?: number;
  scrollTo?: number;
  style?: CSSProperties;
};

const ADVANCE = 0.6; // JetBrains Mono: 600/1000 em
const PAD = { x: 26, top: 12, bottom: 16, right: 30 } as const;
const STRIP_PAD_Y = 10;
const STRIP_SIZE = 26;
const TAG_GAP = 44;
const TAG_MIN_SPACE = 8;

function indentOf(line: string): number {
  const m = /^ */.exec(line);
  return m ? m[0].length : 0;
}

/** Natural geometry of a rule panel (px, panel coordinates). */
export function ruleCodeGeometry(lines: readonly string[], opts: RuleCodeOptions = {}) {
  const fontSize = Math.max(26, opts.fontSize ?? 26);
  const lh = opts.lineHeight ?? 1.2;
  const blankScale = opts.blankScale ?? 0.5;
  const indentScale = opts.indentScale ?? 0.5;
  const cw = fontSize * ADVANCE;
  const pitch = fontSize * lh;
  const hasStrip = Boolean(opts.title) || (opts.label ?? RULE_LABEL) !== '';
  const stripH = hasStrip ? Math.round(STRIP_SIZE * 1.2 + 2 * STRIP_PAD_Y) : 0;
  const codeTop = stripH + PAD.top;
  const tops: number[] = [];
  const heights: number[] = [];
  let y = 0;
  for (const l of lines) {
    const h = l.trim() === '' ? pitch * blankScale : pitch;
    tops.push(y);
    heights.push(h);
    y += h;
  }
  const codeHeight = y;
  /** x (from the code origin) of character `i` of line `n`. */
  const charX = (n: number, i: number) => {
    const k = indentOf(lines[n] ?? '');
    return i <= k ? i * cw * indentScale : k * cw * indentScale + (i - k) * cw;
  };
  const ends = lines.map((l, n) => charX(n, l.length));
  const textWidth = Math.max(0, ...ends);
  return {
    fontSize,
    cw,
    pitch,
    stripH,
    codeTop,
    codeHeight,
    tops,
    heights,
    charX,
    /** Natural panel size. */
    width: Math.ceil(PAD.x + textWidth + PAD.right),
    height: Math.ceil(codeTop + codeHeight + PAD.bottom),
    /** Panel-coordinate y centre of line n (before any scroll). */
    lineY: (n: number) => codeTop + (tops[n] ?? 0) + (heights[n] ?? pitch) / 2,
    /** Panel-coordinate x of the end of line n's text. */
    lineEnd: (n: number) => PAD.x + (ends[n] ?? 0),
    /** Default x of the tag column for these tagged lines. */
    tagX: (tagged: readonly number[]) => PAD.x + Math.max(0, ...tagged.map((n) => ends[n] ?? 0)) + TAG_GAP,
  };
}

// ---------------------------------------------------------------------------
// Light syntax colouring (not semantic: the scenes carry meaning with highlights and tags)

const KEY = C.cyanSoft;
const VAR = '#7dd3fc';
const STR = C.textStrong;
const PUNCT = C.muted;
const WORD = '#cbd5e1';
const KEYWORDS = new Set(['rule', 'and', 'or', 'not', 'of', 'ascii', 'wide', 'filesize', 'uint16']);

type Tok = { text: string; color: string; weight?: number };

function tokenize(line: string): Tok[] {
  const toks: Tok[] = [];
  const body = line.slice(indentOf(line));
  // A leading key: `name:` (YAML / YARA section) or `name =` (YARA meta / strings)
  const key = /^(- )?([A-Za-z_$][\w|.$]*)(\s*)([:=])/.exec(body);
  let rest = body;
  if (key) {
    if (key[1]) toks.push({ text: key[1], color: PUNCT });
    toks.push({ text: key[2], color: key[2].startsWith('$') ? VAR : KEY, weight: 650 });
    toks.push({ text: key[3] + key[4], color: PUNCT });
    rest = body.slice(key[0].length);
  }
  const re = /("(?:[^"\\]|\\.)*"|'[^']*')|(\$\w+)|([A-Za-z_][\w.]*)|(\s+)|([^\sA-Za-z_$"']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    if (m[1]) toks.push({ text: m[1], color: STR });
    else if (m[2]) toks.push({ text: m[2], color: VAR, weight: 600 });
    else if (m[3]) toks.push({ text: m[3], color: KEYWORDS.has(m[3]) ? '#93c5fd' : WORD });
    else if (m[4]) toks.push({ text: m[4], color: WORD });
    else toks.push({ text: m[5], color: PUNCT });
  }
  return toks;
}

/** Tokens cut to the first `n` characters of the (de-indented) body. */
function sliceToks(toks: Tok[], n: number): Tok[] {
  const out: Tok[] = [];
  let left = n;
  for (const t of toks) {
    if (left <= 0) break;
    if (t.text.length <= left) out.push(t);
    else out.push({ ...t, text: t.text.slice(0, left) });
    left -= t.text.length;
  }
  return out;
}

const amountOf = (frame: number, at: number | undefined, amount: number | undefined, dur = 14) =>
  clamp01(amount ?? 1) * (at === undefined ? 1 : progress(frame, at, dur));

/** Spreads pill boxes (desired centres) so they keep `space` between them, staying near their lines. */
function spread(desired: number[], heights: number[], space: number): number[] {
  const n = desired.length;
  const c = [...desired];
  // Pass down, then shift each overlapping group up to centre it on its desired centres.
  for (let iter = 0; iter < 4; iter++) {
    for (let i = 1; i < n; i++) {
      const min = c[i - 1] + heights[i - 1] / 2 + space + heights[i] / 2;
      if (c[i] < min) c[i] = min;
    }
    let i = 0;
    while (i < n) {
      let j = i;
      while (j + 1 < n && c[j + 1] - c[j] <= heights[j] / 2 + space + heights[j + 1] / 2 + 0.5) j++;
      if (j > i) {
        const want = desired.slice(i, j + 1).reduce((a, b) => a + b, 0) / (j - i + 1);
        const have = c.slice(i, j + 1).reduce((a, b) => a + b, 0) / (j - i + 1);
        const prevEnd = i > 0 ? c[i - 1] + heights[i - 1] / 2 + space + heights[i] / 2 : -Infinity;
        const shift = Math.max(want - have, prevEnd - c[i]);
        for (let k = i; k <= j; k++) c[k] += shift;
      }
      i = j + 1;
    }
  }
  return c;
}

export function RuleCode(props: RuleCodeProps) {
  const current = useCurrentFrame();
  const frame = props.frame ?? current;
  const { lines, tone = C.cyan, typeStep = 4, focusAmount = 1, highlights = [], tags = [], style } = props;
  const label = props.label ?? RULE_LABEL;
  const g = ruleCodeGeometry(lines, props);
  const width = props.width ?? g.width;

  // Panel entrance
  const enterP = props.at === undefined ? 1 : progress(frame, props.at, 18);

  // Typing: visible characters per line
  const typeStart = (i: number): number | null => {
    if (props.typeAt === undefined) return null;
    if (typeof props.typeAt === 'number') return props.typeAt + i * typeStep;
    return props.typeAt[i] ?? props.typeAt[props.typeAt.length - 1] ?? 0;
  };
  const visibleChars = (i: number): number => {
    const body = lines[i].length - indentOf(lines[i]);
    const s = typeStart(i);
    if (s === null) return body;
    const dur = typeof props.typeAt === 'number' ? Math.max(1, typeStep) : Math.max(4, Math.min(16, Math.round(body / 4)));
    return Math.round(body * progress(frame, s, dur, EASE.linear));
  };
  const lineShown = (i: number) => {
    const s = typeStart(i);
    return s === null || frame >= s;
  };
  let typingLine = -1;
  if (props.typeAt !== undefined) {
    for (let i = 0; i < lines.length; i++) {
      const body = lines[i].length - indentOf(lines[i]);
      if (lineShown(i) && visibleChars(i) < body) typingLine = i;
    }
  }

  const focusSet = props.focus ? new Set(props.focus) : null;
  const lineOpacity = (i: number) => (focusSet && !focusSet.has(i) ? 1 - 0.68 * clamp01(focusAmount) : 1);

  // Scroll window
  const scrollY = (() => {
    if (props.scrollTo === undefined) return 0;
    const s = Math.max(0, Math.min(lines.length - 1, props.scrollTo));
    const a = Math.floor(s);
    const b = Math.min(lines.length - 1, a + 1);
    return g.tops[a] + (g.tops[b] - g.tops[a]) * (s - a);
  })();
  const codeViewH = props.viewHeight ?? g.codeHeight;
  const panelH = g.codeTop + codeViewH + PAD.bottom;

  // Tags: one column, spread vertically
  const tagSize = (t: RuleTag) => Math.max(32, t.size ?? 32);
  const pillHeight = (t: RuleTag) => Math.round(tagSize(t) * 1.18 + 16);
  const tagBoxH = (t: RuleTag) => pillHeight(t) + (t.sub ? Math.round(26 * 1.25 + 4) : 0);
  const order = tags.map((_, i) => i).sort((a, b) => tags[a].line - tags[b].line);
  const hs = order.map((i) => tagBoxH(tags[i]));
  // Each pill wants its centre on its line; a sub line hangs below the pill, so the box centre sits lower
  const below = order.map((i, k) => (hs[k] - pillHeight(tags[i])) / 2);
  const boxCentres = spread(
    order.map((i, k) => g.lineY(tags[i].line) - scrollY + below[k]),
    hs,
    TAG_MIN_SPACE,
  );
  const pillCentres = boxCentres.map((c, k) => c - below[k]);
  const tagX = props.tagX ?? g.tagX(tags.map((t) => t.line));

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: panelH,
        opacity: enterP,
        transform: props.at === undefined ? undefined : `translateY(${(1 - enterP) * 24}px)`,
        ...style,
      }}
    >
      {/* panel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(tone, 0.42)}`,
          background: `linear-gradient(180deg, ${alpha(C.ink850, 0.97)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
          boxShadow: `0 18px 50px ${alpha('#000000', 0.45)}, 0 0 36px ${alpha(tone, 0.08)}`,
          overflow: 'hidden',
        }}
      >
        {g.stripH > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: g.stripH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              padding: `0 ${PAD.x}px`,
              background: alpha(tone, 0.1),
              borderBottom: `1.5px solid ${alpha(tone, 0.28)}`,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: STRIP_SIZE + 2, fontWeight: 800, color: tone, letterSpacing: 0.5 }}>{props.title ?? ''}</span>
            {label ? <span style={{ fontSize: STRIP_SIZE, fontWeight: 600, color: C.muted, fontStyle: 'italic' }}>{label}</span> : null}
          </div>
        ) : null}

        {/* code window */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: g.codeTop, height: codeViewH, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: PAD.x, top: -scrollY, right: 0 }}>
            {/* highlights, behind the text */}
            {highlights.map((h, k) => {
              const a = amountOf(frame, h.at, h.amount);
              if (a <= 0.001 || !lines[h.line] || !lineShown(h.line)) return null;
              const line = lines[h.line];
              let x0: number;
              let x1: number;
              if (h.token) {
                let idx = -1;
                let from = 0;
                for (let n = 0; n <= (h.nth ?? 0); n++) {
                  idx = line.indexOf(h.token, from);
                  if (idx < 0) break;
                  from = idx + 1;
                }
                if (idx < 0) return null;
                x0 = g.charX(h.line, idx);
                x1 = g.charX(h.line, idx + h.token.length);
              } else {
                x0 = g.charX(h.line, indentOf(line));
                x1 = g.charX(h.line, line.length);
              }
              const c = h.tone ?? C.cyan;
              const padX = 6;
              return (
                <div
                  key={`h${k}`}
                  style={{
                    position: 'absolute',
                    left: x0 - padX,
                    top: g.tops[h.line] + 2,
                    width: (x1 - x0 + 2 * padX) * (0.4 + 0.6 * a),
                    height: g.heights[h.line] - 4,
                    borderRadius: 8,
                    background: alpha(c, 0.2 * a),
                    border: `2px solid ${alpha(c, 0.85 * a)}`,
                    boxShadow: `0 0 ${Math.round(18 * a)}px ${alpha(c, 0.35 * a)}`,
                  }}
                />
              );
            })}

            {lines.map((line, i) => {
              if (!lineShown(i) || line.trim() === '') return null;
              const k = indentOf(line);
              const toks = sliceToks(tokenize(line), visibleChars(i));
              const lit = focusSet ? focusSet.has(i) && focusAmount > 0.01 : false;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: k * g.cw * (props.indentScale ?? 0.5),
                    top: g.tops[i],
                    height: g.heights[i],
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'pre',
                    fontFamily: FONT.mono,
                    fontSize: g.fontSize,
                    lineHeight: 1,
                    opacity: lineOpacity(i),
                    filter: lit ? `brightness(${1 + 0.15 * focusAmount})` : undefined,
                  }}
                >
                  {toks.map((t, j) => (
                    <span key={j} style={{ color: t.color, fontWeight: t.weight ?? 500 }}>
                      {t.text}
                    </span>
                  ))}
                  {i === typingLine ? <Caret size={g.fontSize} color={tone} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* tags: leaders + pills, outside the panel's clip so they can overhang its right edge */}
      {order.map((ti, k) => {
        const t = tags[ti];
        const a = amountOf(frame, t.at, t.amount);
        if (a <= 0.001 || !lineShown(t.line)) return null;
        const c = t.tone ?? C.cyan;
        const size = tagSize(t);
        const pillH = pillHeight(t);
        const cy = pillCentres[k];
        const ly = g.lineY(t.line) - scrollY;
        const lx = g.lineEnd(t.line) + 10;
        const top = cy - pillH / 2;
        if (ly < g.codeTop - 4 || ly > g.codeTop + codeViewH + 4) return null;
        return (
          <TagBox key={`t${ti}`} x={tagX} top={top} lineX={lx} lineY={ly} pillY={cy} a={a} color={c} size={size} text={t.text} sub={t.sub} />
        );
      })}
    </div>
  );
}

function TagBox({
  x,
  top,
  lineX,
  lineY,
  pillY,
  a,
  color,
  size,
  text,
  sub,
}: {
  x: number;
  top: number;
  lineX: number;
  lineY: number;
  pillY: number;
  a: number;
  color: string;
  size: number;
  text: string;
  sub?: string;
}) {
  const startX = Math.min(lineX, x - 14);
  const w = Math.max(1, x - startX);
  const minY = Math.min(lineY, pillY) - 4;
  const h = Math.abs(lineY - pillY) + 8;
  return (
    <>
      <svg style={{ position: 'absolute', left: startX, top: minY, overflow: 'visible', opacity: a }} width={w} height={h}>
        <path
          d={`M 0 ${lineY - minY} L ${w * 0.45} ${lineY - minY} L ${w - 4} ${pillY - minY}`}
          fill="none"
          stroke={alpha(color, 0.7)}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <circle cx={0} cy={lineY - minY} r={4} fill={color} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: x,
          top,
          opacity: a,
          transform: `translateX(${(1 - a) * 16}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `6px ${Math.round(size * 0.5)}px`,
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(color, 0.75)}`,
            background: `linear-gradient(${alpha(color, 0.16)}, ${alpha(color, 0.16)}), ${C.ink900}`,
            color,
            fontFamily: FONT.sans,
            fontSize: size,
            fontWeight: 750,
            lineHeight: 1.18,
            boxShadow: `0 0 18px ${alpha(color, 0.18)}`,
          }}
        >
          {text}
        </span>
        {sub ? (
          <span style={{ marginLeft: Math.round(size * 0.5) - 8, padding: '1px 8px', borderRadius: 6, background: alpha(C.ink900, 0.88), fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>
            {sub}
          </span>
        ) : null}
      </div>
    </>
  );
}

function Caret({ size, color }: { size: number; color: string }): ReactNode {
  return <span style={{ display: 'inline-block', width: size * 0.55, height: size * 1.05, marginLeft: 2, background: alpha(color, 0.85), borderRadius: 2 }} />;
}
