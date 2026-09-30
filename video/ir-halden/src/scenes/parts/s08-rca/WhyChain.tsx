import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha, type Accent } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, dimStyle, mix, windowWeight, type IconName } from '../../../../../engine/src/ui';
import { emWidth } from '../Board';

/**
 * The «¿por qué?» staircase of the root cause analysis (s08 chain 1, s09
 * chain 2): one step per answer, going down step by step, each joined to the
 * next by a small drawn arrow labelled «¿por qué?». The last step is the cause
 * that can be fixed. `dir` sets where the stairs go: 'right' (s08) or 'left'
 * (s09, so the thread ends above Preparación, the first column of the board).
 *
 * Frames are Sequence-relative; the scene decides every `at`. Coordinates are
 * chain-local (the caller places the chain with an absolute div).
 */

/** A run of text in a step line; `mono` for host names. */
export type Run = string | { text: string; mono?: boolean; tone?: string };
export interface WhyStepDef {
  /** One or two lines (each a string or runs). */
  lines: readonly (string | readonly Run[])[];
  icon: IconName;
}

export interface StepTab {
  text: string;
  icon?: IconName;
  accent: Accent;
  at: number;
}

/** What one step is doing (all frames Sequence-relative). */
export interface WhyStepState {
  /** Frame the step springs in. */
  at: number;
  /** 0–1 the step is the one the voice is on (cyan glow). */
  hot?: number;
  /** 0–1 step-back. */
  dim?: number;
  /** 0–1 marked as the cause (rose outline, rose icon). */
  cause?: number;
  /** Chip drawn after the text, on the last line (e.g. «como cualquiera»). */
  inline?: { node: ReactNode; at: number };
  /** Chips on the right end of the step's top edge (or bottom edge with `tabsBelow`). */
  tabs?: readonly StepTab[];
  tabsBelow?: boolean;
  /** 0–1 underline drawn under the line `underlineLine` (default the last). */
  underline?: number;
  underlineLine?: number;
}

export interface WhyChainOpts {
  dir?: 'right' | 'left';
  /** Horizontal shift per step. */
  dx?: number;
  /** Gap between steps (the connector lives there). */
  gap?: number;
  fontSize?: number;
}

const PAD_X = 26;
const PAD_Y = 16;
const ICON_GAP = 18;

export interface StepGeo {
  x: number;
  y: number;
  /** Estimated width (the step itself is max-content; use it for placing things beside it). */
  w: number;
  h: number;
}

function runsOf(line: string | readonly Run[]): { text: string; mono?: boolean; tone?: string }[] {
  if (typeof line === 'string') return [{ text: line }];
  return line.map((r) => (typeof r === 'string' ? { text: r } : r));
}

/** Rough text width (px) of a line at `size`: Inter bold for sans runs, 0.6 em per mono character. */
function lineWidth(line: string | readonly Run[], size: number): number {
  return runsOf(line).reduce((w, r) => w + (r.mono ? r.text.length * 0.6 : emWidth(r.text) * 0.97) * size, 0);
}

/** Where each step sits (chain-local), for the same defs and options the chain gets. */
export function whyChainGeometry(steps: readonly WhyStepDef[], opts: WhyChainOpts = {}): { steps: StepGeo[]; width: number; height: number } {
  const F = opts.fontSize ?? 44;
  const dx = opts.dx ?? 56;
  const gap = opts.gap ?? 46;
  const n = steps.length;
  const lineH = F * 1.18;
  let y = 0;
  const geo = steps.map((s, i) => {
    const h = s.lines.length * lineH + 2 * PAD_Y;
    const x = (opts.dir ?? 'right') === 'right' ? i * dx : (n - 1 - i) * dx;
    const w = 2 * PAD_X + F * 1.1 + ICON_GAP + Math.max(...s.lines.map((l) => lineWidth(l, F)));
    const g = { x, y, w, h };
    y += h + gap;
    return g;
  });
  return { steps: geo, width: Math.max(...geo.map((g) => g.x + g.w)), height: y - gap };
}

export function WhyChain({
  steps,
  states,
  whyAt,
  slotAt,
  frame,
  fps,
  opts = {},
  whyLabel = '¿por qué?',
  style,
}: {
  steps: readonly WhyStepDef[];
  states: readonly WhyStepState[];
  /** Frame each connector draws (between step i and i + 1). */
  whyAt: readonly number[];
  /** Frame the dashed waiting slots appear (omit: no slots). */
  slotAt?: number;
  frame: number;
  fps: number;
  opts?: WhyChainOpts;
  whyLabel?: string;
  style?: CSSProperties;
}) {
  const F = opts.fontSize ?? 44;
  const lineH = F * 1.18;
  const geo = whyChainGeometry(steps, opts);
  return (
    <div style={{ position: 'relative', width: geo.width, height: geo.height, fontFamily: FONT.sans, ...style }}>
      {/* Waiting slots: the stairs before they are climbed down. */}
      {slotAt !== undefined
        ? geo.steps.map((g, i) => {
            const lit = Math.min(1, springIn(frame, fps, states[i].at - 4, { damping: 16 }) * 1.3);
            const slot = progress(frame, slotAt + i * 5, 14);
            if (lit >= 1 || slot <= 0) return null;
            return (
              <div
                key={`slot-${i}`}
                style={{
                  position: 'absolute',
                  left: g.x,
                  top: g.y,
                  width: g.w * 0.72,
                  height: g.h,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.md,
                  border: `2px dashed ${C.ink600}`,
                  opacity: slot * (1 - lit),
                  transform: `translateY(${(1 - slot) * 12}px)`,
                }}
              />
            );
          })
        : null}

      {/* Connectors «¿por qué?» */}
      <svg width={geo.width + 400} height={geo.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {whyAt.map((at, i) => {
          const a = geo.steps[i];
          const b = geo.steps[i + 1];
          if (!b) return null;
          const p = progress(frame, at, 14, EASE.inOut);
          if (p <= 0) return null;
          // A straight drop where the two steps overlap, so it reads as «down one step».
          const x2 = Math.max(a.x, b.x) + 44;
          const y1 = a.y + a.h + 4;
          const y2 = b.y - 6;
          const d = `M ${x2} ${y1} L ${x2} ${y2}`;
          const head = progress(p, 0.75, 0.25);
          return (
            <g key={`why-${i}`} opacity={dimOf(states, i, i + 1)}>
              <path d={d} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
              {head > 0 ? (
                <path
                  d={`M ${x2 - 11} ${y2 - 12} L ${x2} ${y2} L ${x2 + 11} ${y2 - 12}`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={head}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      {whyAt.map((at, i) => {
        const a = geo.steps[i];
        const b = geo.steps[i + 1];
        if (!b) return null;
        const p = progress(frame, at + 4, 12);
        if (p <= 0) return null;
        const x = Math.max(a.x, b.x) + 44 + 34;
        return (
          <div
            key={`why-l-${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: a.y + a.h,
              height: b.y - (a.y + a.h),
              display: 'flex',
              alignItems: 'center',
              fontSize: 32,
              fontWeight: 800,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
              opacity: p * dimOf(states, i, i + 1),
              transform: `translateX(${(1 - p) * -10}px)`,
            }}
          >
            {whyLabel}
          </div>
        );
      })}

      {/* Steps */}
      {geo.steps.map((g, i) => {
        const def = steps[i];
        const st = states[i];
        const p = springIn(frame, fps, st.at - 4, { damping: 16 });
        const lit = Math.min(1, p * 1.3);
        if (lit <= 0) return null;
        const hot = clamp01(st.hot ?? 0);
        const cause = clamp01(st.cause ?? 0);
        const dim = clamp01(st.dim ?? 0) * (1 - cause);
        const glow = Math.max(hot * (0.8 + 0.2 * pulse(frame, fps, 0.5)), cause);
        const edge = cause > 0.01 ? mixColor(C.cyan, C.rose, cause) : C.cyan;
        const border = alpha(edge, 0.3 + 0.6 * Math.max(glow, cause));
        const iconColor = cause > 0.5 ? C.roseSoft : C.cyan;
        const inline = st.inline ? progress(frame, st.inline.at, 12) : 0;
        return (
          <div
            key={`step-${i}`}
            style={{
              position: 'absolute',
              left: g.x,
              top: g.y,
              height: g.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: ICON_GAP,
              padding: `0 ${PAD_X}px`,
              borderRadius: RADIUS.md,
              border: `${glow > 0.4 ? 3 : 2}px solid ${border}`,
              background: `linear-gradient(90deg, ${alpha(edge, 0.06 + 0.1 * Math.max(glow, cause))} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
              boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(edge, 0.28 * glow)}` : `0 14px 34px ${alpha('#000000', 0.3)}`,
              whiteSpace: 'nowrap',
              ...dimStyle(dim * 0.9, lit),
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            <Icon name={def.icon} size={Math.round(F * 1.1)} color={iconColor} strokeWidth={2} />
            <div style={{ position: 'relative' }}>
              {def.lines.map((line, k) => (
                <div key={k} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, height: lineH }}>
                  <span style={{ fontSize: F, fontWeight: 750, letterSpacing: -0.3, color: C.textStrong }}>
                    {runsOf(line).map((r, j) => (
                      <span key={j} style={{ fontFamily: r.mono ? FONT.mono : undefined, fontWeight: r.mono ? 800 : undefined, color: r.tone }}>
                        {r.text}
                      </span>
                    ))}
                  </span>
                  {st.inline && k === def.lines.length - 1 && inline > 0 ? (
                    <span style={{ opacity: inline, transform: `translateX(${(1 - inline) * 10}px)` }}>{st.inline.node}</span>
                  ) : null}
                  {st.underline && (st.underlineLine ?? def.lines.length - 1) === k ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 2,
                        height: 5,
                        borderRadius: 3,
                        width: lineWidth(line, F) * clamp01(st.underline),
                        background: C.roseSoft,
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
            {st.tabs?.length ? (
              <div style={{ position: 'absolute', right: 18, ...(st.tabsBelow ? { bottom: 0, transform: 'translateY(58%)' } : { top: 0, transform: 'translateY(-58%)' }), display: 'flex', gap: 12 }}>
                {st.tabs.map((t) => {
                  const q = springIn(frame, fps, t.at - 2, { damping: 15 });
                  if (q <= 0.001) return null;
                  return (
                    <span key={t.text} style={{ opacity: Math.min(1, q * 1.4), transform: `scale(${0.85 + 0.15 * Math.min(1, q)})` }}>
                      <Chip accent={t.accent} icon={t.icon} solid size={28}>
                        {t.text}
                      </Chip>
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** A connector steps back with the dimmer of the two steps it joins. */
function dimOf(states: readonly WhyStepState[], a: number, b: number): number {
  const d = Math.min(clamp01(states[a]?.dim ?? 0), clamp01(states[b]?.dim ?? 0));
  return 1 - 0.55 * d;
}

function mixColor(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((k) => parseInt(a.slice(k, k + 2), 16));
  const pb = [1, 3, 5].map((k) => parseInt(b.slice(k, k + 2), 16));
  const v = pa.map((x, k) => Math.round(mix(x, pb[k], t)).toString(16).padStart(2, '0'));
  return `#${v.join('')}`;
}

/**
 * Focus sequence → per-step hot/dim weights: `seq` lists which step the voice
 * is on from which frame (a step may come back later). The latest entry wins,
 * with eased cross-fades; the others step back by `dimAmount`.
 */
export function chainFocus(frame: number, n: number, seq: readonly { step: number; from: number }[], { end = Number.POSITIVE_INFINITY, dimAmount = 0.6 } = {}) {
  const sorted = [...seq].sort((a, b) => a.from - b.from);
  const hot = new Array(n).fill(0);
  sorted.forEach((s, k) => {
    const next = k + 1 < sorted.length ? sorted[k + 1].from : end;
    hot[s.step] = Math.max(hot[s.step], windowWeight(frame, s.from, Math.min(next, end), { ramp: 12 }));
  });
  const dim = hot.map((_, i) => dimAmount * hot.reduce((m, w, j) => (j === i ? m : Math.max(m, w)), 0));
  return { hot, dim };
}
