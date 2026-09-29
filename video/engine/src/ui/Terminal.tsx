import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { EASE, enter, progress } from '../theme/motion';
import { Chip } from './Chip';
import { FOCUS_TEXT, dimStyle, focusWeight, type FocusInput } from './Focus';
import { Icon, type IconName } from './Icon';
import { MonoLine, monoLength, type MonoToken } from './MonoLine';
import { Panel } from './Panel';
import { Redacted } from './Redacted';
import { tone as toneOf, type Tone } from './tone';

/** A small chip at the end of a line (e.g. «phishing», «Lab 3A»). */
export interface TerminalTag {
  text: string;
  accent?: Accent;
  icon?: IconName;
  solid?: boolean;
  /** Frame the tag appears (defaults to the line's `at`). */
  at?: number;
}

/** One console line. All frames are relative to the enclosing Sequence. */
export interface TerminalLine {
  /**
   * 'cmd' typed after the prompt · 'out' plain output (muted) · 'result' a
   * highlighted answer row (big mono value in a tinted box) · 'redacted' a
   * hidden value (icon + redaction bar) · 'gap' vertical space.
   */
  kind?: 'cmd' | 'out' | 'result' | 'redacted' | 'gap';
  /** Frame the line appears — for 'cmd', the frame typing starts. */
  at: number;
  text?: string | MonoToken[];
  /** cmd: the bare prompt + caret shows from this frame until typing starts. */
  promptAt?: number;
  /** cmd: typing speed in characters per second (default 42). */
  cps?: number;
  /** result / redacted: leading icon. */
  icon?: IconName;
  /** result / redacted: colour (default cyan / muted). */
  tone?: Tone;
  /** result: a sans explanation line under the value. */
  note?: ReactNode;
  tag?: TerminalTag;
  /** result: 0–1 halo (defaults to the line's focus weight). */
  glow?: number;
  /** redacted: bar width (default 220). */
  width?: number;
  /** out: blur in px (texture scrolling past). */
  blur?: number;
  /** out: colour of a plain-string line (default muted). */
  color?: string;
  /** Enlarges this line and dims the others (0–1, boolean or [from, to) frames). */
  focus?: FocusInput;
  /** gap: height in px. */
  height?: number;
}

const HEADER_H = 64;
const PAD_X = 26;
const PAD_Y = 18;

/**
 * Console panel (generalised from V4's two passive-DNS consoles, S03Pdns and
 * s05-cert/PdnsConsole): a Panel title bar (icon + title + optional chip) and
 * lines that type / print at given frames. Lines are laid out with explicit
 * heights, so a focused line (scaled from its left edge) pushes the rest down
 * instead of overlapping them; the others dim. With a fixed `height`, the body
 * scrolls smoothly once the printed lines overflow it.
 */
export function Terminal({
  title,
  icon = 'terminal',
  accent = 'cyan',
  chip,
  right,
  lines,
  width = 1000,
  height,
  size = 36,
  outSize = 30,
  resultSize = FOCUS_TEXT.key,
  noteSize = FOCUS_TEXT.sub,
  tagSize = 30,
  prompt = '$ ',
  promptColor = C.emerald,
  focusScale = 1.12,
  glow = 0,
  at,
  frame: frameProp,
  fps: fpsProp,
  style,
}: {
  title: string;
  icon?: IconName;
  accent?: Accent;
  /** Chip at the right of the title bar. */
  chip?: { text: string; accent?: Accent; icon?: IconName };
  /** Anything else for the title bar's right slot (overrides `chip`). */
  right?: ReactNode;
  lines: TerminalLine[];
  width?: number;
  /** Fixed panel height (enables scrolling); omitted, the panel fits all lines. */
  height?: number;
  /** Font size of commands. */
  size?: number;
  /** Font size of 'out' lines. */
  outSize?: number;
  /** Font size of the value in 'result' rows (the thing the voice reads). */
  resultSize?: number;
  noteSize?: number;
  tagSize?: number;
  prompt?: string;
  promptColor?: string;
  /** Scale of a line at full focus. */
  focusScale?: number;
  /** 0–1 accent halo around the whole panel. */
  glow?: number;
  /** Frame the panel slides in (omitted: always visible). */
  at?: number;
  frame?: number;
  fps?: number;
  style?: CSSProperties;
}) {
  const currentFrame = useCurrentFrame();
  const { fps: configFps } = useVideoConfig();
  const frame = frameProp ?? currentFrame;
  const fps = fpsProp ?? configFps;

  const baseHeight = (l: TerminalLine): number => {
    switch (l.kind ?? 'out') {
      case 'cmd':
        return Math.round(size * 1.45);
      case 'out':
        return Math.round(outSize * 1.45);
      case 'result':
        return 12 + 4 + 20 + Math.round(resultSize * 1.3) + (l.note ? 6 + Math.round(noteSize * 1.3) : 0);
      case 'redacted':
        return Math.max(56, Math.round(tagSize * 1.9));
      case 'gap':
        return l.height ?? Math.round(size * 0.5);
    }
  };
  const startOf = (l: TerminalLine) => (l.kind === 'cmd' && l.promptAt !== undefined ? Math.min(l.promptAt, l.at) : l.at);

  const weights = lines.map((l) => focusWeight(l.focus, frame));
  const dimOf = (i: number) => weights.reduce((m, w, j) => (j === i ? m : Math.max(m, w)), 0) * (1 - weights[i]);
  const scaleOf = (i: number) => 1 + (focusScale - 1) * weights[i];

  // Layout: visible lines stacked with their (focus-scaled) heights.
  const bodyH = height !== undefined ? height - HEADER_H - 2 * PAD_Y - 4 : undefined;
  let y = 0;
  let smooth = 0;
  const placed: { i: number; top: number; h: number }[] = [];
  lines.forEach((l, i) => {
    const start = startOf(l);
    if (frame < start) return;
    const h = baseHeight(l) * scaleOf(i);
    placed.push({ i, top: y, h });
    y += h;
    smooth += h * progress(frame, start, 12, EASE.inOut);
  });
  const scroll = bodyH !== undefined ? Math.max(0, smooth - bodyH) : 0;
  // Once it scrolls, the top edge fades out instead of cutting a line in half.
  const fade = Math.min(scroll, Math.round(size * 1.2));
  const mask = fade > 0.5 ? `linear-gradient(to bottom, transparent 0, #000 ${fade.toFixed(1)}px)` : undefined;
  const fitH =
    lines.reduce((s, l) => s + baseHeight(l), 0) + Math.max(0, ...lines.map((l) => (l.focus !== undefined ? baseHeight(l) * (focusScale - 1) : 0)));
  const lastPlaced = placed.length ? placed[placed.length - 1].i : -1;

  const entrance = at !== undefined ? enter(frame, at, { distance: 22, duration: 14 }) : undefined;
  if (at !== undefined && frame < at - 1) return null;

  const renderLine = (l: TerminalLine, i: number): ReactNode => {
    const kind = l.kind ?? 'out';
    const appear = enter(frame, l.at, { distance: 8, duration: 8 });
    const tag = l.tag && frame >= (l.tag.at ?? l.at) ? <TagChip tag={l.tag} size={tagSize} frame={frame} fallbackAt={l.at} /> : null;
    if (kind === 'cmd') {
      const tokens: MonoToken[] = [{ t: prompt, c: promptColor, bold: true }, ...toTokens(l.text, C.text)];
      const len = monoLength(tokens);
      const typed = frame < l.at ? prompt.length : Math.min(len, prompt.length + Math.floor(((frame - l.at) / fps) * (l.cps ?? 42)));
      const caret = typed < len || (i === lastPlaced && frame >= l.at);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: '100%' }}>
          <MonoLine tokens={tokens} size={size} visibleChars={typed} caret={caret} />
          {tag}
        </div>
      );
    }
    if (kind === 'out') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            height: '100%',
            ...appear,
            filter: l.blur ? `blur(${l.blur.toFixed(2)}px)` : undefined,
          }}
        >
          <MonoLine tokens={toTokens(l.text, l.color ?? C.muted)} size={outSize} />
          {tag}
        </div>
      );
    }
    if (kind === 'result') {
      const t = toneOf(l.tone ?? 'cyan');
      const g = l.glow ?? Math.max(0.35, weights[i]);
      return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', ...appear }}>
          <div
            style={{
              display: 'inline-block',
              boxSizing: 'border-box',
              padding: '10px 18px',
              borderRadius: RADIUS.md,
              background: alpha(t.fg, 0.06 + 0.1 * g),
              border: `2px solid ${alpha(t.fg, 0.35 + 0.55 * g)}`,
              boxShadow: g > 0 ? `0 0 ${Math.round(30 * g)}px ${alpha(t.fg, 0.35 * g)}` : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {l.icon ? <Icon name={l.icon} size={Math.round(resultSize * 0.8)} color={t.fg} strokeWidth={2} /> : null}
              <MonoLine tokens={toTokens(l.text, t.soft)} size={resultSize} style={{ fontWeight: 800, lineHeight: 1.3 }} />
              {tag}
            </div>
            {l.note ? (
              <div
                style={{
                  marginTop: 6,
                  marginLeft: l.icon ? Math.round(resultSize * 0.8) + 16 : 0,
                  fontFamily: FONT.sans,
                  fontSize: noteSize,
                  fontWeight: 650,
                  lineHeight: 1.3,
                  color: C.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {l.note}
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    if (kind === 'redacted') {
      const t = toneOf(l.tone ?? 'muted');
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: '100%', ...appear }}>
          <Icon name={l.icon ?? 'lock'} size={Math.round(tagSize * 1.05)} color={t.fg} />
          <Redacted width={l.width ?? 220} height={Math.round(tagSize * 0.95)} tone={l.tone ?? 'muted'} glow={l.glow ?? 0} />
          {tag}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width, ...entrance, ...style }}>
      <Panel
        title={title}
        icon={icon}
        accent={accent}
        glow={glow}
        right={right ?? (chip ? <Chip accent={chip.accent ?? 'muted'} icon={chip.icon} size={TYPE.small}>{chip.text}</Chip> : undefined)}
        style={{ height: height ?? HEADER_H + 2 * PAD_Y + 4 + fitH }}
        bodyStyle={{ padding: `${PAD_Y}px ${PAD_X}px`, overflow: 'hidden', maskImage: mask, WebkitMaskImage: mask }}
      >
        <div style={{ position: 'relative', transform: scroll > 0 ? `translateY(${-scroll}px)` : undefined }}>
          {placed.map(({ i, top, h }) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                top,
                height: h / scaleOf(i),
                width: `${100 / scaleOf(i)}%`,
                transform: scaleOf(i) !== 1 ? `scale(${scaleOf(i)})` : undefined,
                transformOrigin: '0 0',
                ...dimStyle(dimOf(i)),
              }}
            >
              {renderLine(lines[i], i)}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function toTokens(text: string | MonoToken[] | undefined, color: string): MonoToken[] {
  if (text === undefined) return [];
  return typeof text === 'string' ? [{ t: text, c: color }] : text;
}

function TagChip({ tag, size, frame, fallbackAt }: { tag: TerminalTag; size: number; frame: number; fallbackAt: number }) {
  const p = progress(frame, tag.at ?? fallbackAt, 10);
  return (
    <span style={{ display: 'inline-flex', opacity: p, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: 'left center' }}>
      <Chip accent={tag.accent ?? 'cyan'} icon={tag.icon} solid={tag.solid} size={size}>
        {tag.text}
      </Chip>
    </span>
  );
}
