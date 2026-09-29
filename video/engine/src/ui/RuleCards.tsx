import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../theme/tokens';
import { progress, pulse, springIn } from '../theme/motion';
import { DIM, FOCUS_TEXT, dimStyle, focusWeights } from './Focus';
import { Icon, type IconName } from './Icon';
import { tone as toneOf, type Tone } from './tone';

/** One rule. Frames are relative to the Sequence. */
export interface RuleCardDef {
  /** One line, or two hard-broken lines (the title is big: it rarely fits one). */
  title: string | readonly [string, string];
  /** One or two lines under the title (ReactNode, so words can be coloured). */
  sub?: ReactNode | readonly [ReactNode, ReactNode];
  /** Drawn in a glowing circle when there is no `art`. */
  icon?: IconName;
  /** A custom illustration for the art slot (e.g. a small Building + House). */
  art?: ReactNode;
  /** Card colour (default cyan). */
  tone?: Tone;
  /** Frame the card lights — the voice says the rule. */
  at: number;
}

/**
 * N big rule cards side by side (V4 s11-recap/Rules): numbered dashed slots
 * wait, each card springs in at its `at` and is the one in focus (glowing,
 * pulsing number) until the next lights; earlier cards step back. `dimFrom`
 * steps all of them back (e.g. when a final call to action takes over).
 */
export function RuleCards({
  rules,
  width = 1728,
  height = 440,
  gap = 48,
  slotAt = 0,
  dimFrom,
  titleSize = FOCUS_TEXT.big - 2,
  subSize = 34,
  artHeight = 150,
  frame: frameProp,
  fps: fpsProp,
  style,
}: {
  rules: RuleCardDef[];
  width?: number;
  height?: number;
  gap?: number;
  /** Frame the numbered placeholder slots start to appear (staggered). */
  slotAt?: number;
  /** Frame from which every card steps back. */
  dimFrom?: number;
  /** Title size (shrunk to fit the card's width). */
  titleSize?: number;
  subSize?: number;
  artHeight?: number;
  frame?: number;
  fps?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps: configFps } = useVideoConfig();
  const frame = frameProp ?? current;
  const fps = fpsProp ?? configFps;
  const n = rules.length;
  const w = (width - gap * (n - 1)) / n;
  const allDim = dimFrom === undefined ? 0 : progress(frame, dimFrom - 4, 14);
  const { weights, dims } = focusWeights(
    frame,
    rules.map((r) => r.at),
    { end: dimFrom },
  );
  const lines = (v: string | readonly [string, string]) => (typeof v === 'string' ? [v] : [...v]);
  const longest = Math.max(...rules.map((r) => Math.max(...lines(r.title).map((l) => l.length))));
  const fitTitle = Math.min(titleSize, Math.floor((w - 56) / (0.57 * longest)));

  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, ...style }}>
      {rules.map((r, i) => {
        const t = toneOf(r.tone ?? 'cyan');
        const left = i * (w + gap);
        const slot = progress(frame, slotAt + i * 4, 12);
        const p = springIn(frame, fps, r.at - 4, { damping: 16 });
        const lit = Math.min(1, p * 1.3);
        const d = Math.max(dims[i] * lit, allDim);
        const hot = weights[i];
        const glow = hot * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const sub = r.sub === undefined ? [] : Array.isArray(r.sub) ? (r.sub as ReactNode[]) : [r.sub as ReactNode];
        return (
          <div key={i}>
            {/* The waiting slot. */}
            {lit < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  width: w,
                  height,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px dashed ${C.ink600}`,
                  display: 'grid',
                  placeItems: 'center',
                  opacity: slot * (1 - lit),
                  transform: `translateY(${(1 - slot) * 16}px)`,
                }}
              >
                <span style={{ fontSize: 120, fontWeight: 850, color: C.ink700 }}>{i + 1}</span>
              </div>
            ) : null}
            {lit > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  width: w,
                  height,
                  boxSizing: 'border-box',
                  padding: '22px 28px 26px',
                  borderRadius: RADIUS.lg,
                  border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(t.fg, 0.35 + 0.55 * glow)}`,
                  background: `linear-gradient(180deg, ${alpha(t.fg, 0.05 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
                  boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(t.fg, 0.28 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  ...dimStyle(d, lit),
                  transform: `translateY(${(1 - p) * 22}px) scale(${(0.96 + 0.04 * Math.min(1, p)) * (1 - (1 - DIM.scale) * d)})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    display: 'grid',
                    placeItems: 'center',
                    background: glow > 0.3 ? t.fg : alpha(t.fg, 0.18),
                    border: `2px solid ${alpha(t.fg, 0.7)}`,
                    fontSize: 34,
                    fontWeight: 850,
                    color: glow > 0.3 ? C.ink950 : t.soft,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ height: artHeight, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.art ?? (r.icon ? <IconDisc icon={r.icon} color={t.fg} size={Math.min(136, artHeight - 8)} /> : null)}
                </div>
                <div style={{ marginTop: 14, fontSize: fitTitle, fontWeight: 850, lineHeight: 1.08, letterSpacing: -1, color: C.textStrong, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {lines(r.title).map((l, k) => (
                    <div key={k}>{l}</div>
                  ))}
                </div>
                {sub.length ? (
                  <div style={{ marginTop: 12, fontSize: subSize, fontWeight: 700, lineHeight: 1.22, color: C.text, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {sub.map((s, k) => (
                      <div key={k}>{s}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function IconDisc({ icon, color, size }: { icon: IconName; color: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        background: alpha(color, 0.12),
        border: `3px solid ${alpha(color, 0.7)}`,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.59)} color={color} strokeWidth={2.2} />
    </div>
  );
}
