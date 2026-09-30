import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../theme/tokens';
import { EASE, progress, pulse } from '../theme/motion';
import { FOCUS_TEXT, dimStyle, focusWeights } from './Focus';
import { Icon, type IconName } from './Icon';
import { tone as toneOf, type Tone } from './tone';

/** One stage of the timeline. Frames are relative to the Sequence. */
export interface TimelineStage {
  title: string;
  sub?: string;
  icon: IconName;
  /** Colour once lit (default cyan); the rail segment leading to it takes it too. */
  tone?: Tone;
  /** Frame the stage lights (and becomes the one in focus). */
  at: number;
  /** An optional / tail stage: dashed ring and dashed rail segment. */
  dashed?: boolean;
  /** A vignette drawn above the node (it appears when the stage lights). */
  above?: ReactNode;
}

/**
 * Horizontal stage timeline (V4 S08Lifecycle's lifecycle rail): nodes on a
 * rail with a title and a sublabel under each. The rail draws in from
 * `drawAt`; each stage lights at its `at` and the rail fills up to it in the
 * stage's colour. The newest lit stage is in focus (node pulses, title grows);
 * earlier ones step back a little, later ones wait greyed out. `focusEnd`
 * releases the focus (all lit stages at full strength).
 */
export function StageTimeline({
  stages,
  width = 1728,
  nodeSize = 76,
  titleSize = FOCUS_TEXT.min,
  subSize = FOCUS_TEXT.sub,
  focusScale = 1.15,
  aboveHeight = 190,
  drawAt = 0,
  focusEnd,
  frame: frameProp,
  fps: fpsProp,
  style,
}: {
  stages: TimelineStage[];
  width?: number;
  nodeSize?: number;
  /** Title size before focus (shrunk if the focused title would not fit its slot). */
  titleSize?: number;
  subSize?: number;
  focusScale?: number;
  /** Room reserved above the rail when any stage has a vignette. */
  aboveHeight?: number;
  /** Frame the rail starts drawing in. */
  drawAt?: number;
  /** Frame from which no stage is in focus. */
  focusEnd?: number;
  frame?: number;
  fps?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps: configFps } = useVideoConfig();
  const frame = frameProp ?? current;
  const fps = fpsProp ?? configFps;
  const n = stages.length;
  const slot = width / n;
  const nodeX = (i: number) => slot / 2 + slot * i;
  const R = nodeSize / 2;
  const hasAbove = stages.some((s) => s.above);
  const railY = (hasAbove ? aboveHeight + 20 : 0) + R * focusScale + 4;
  const labelTop = railY + R * focusScale + 14;
  // Title and sublabel shrink so that, grown by focusScale, they still fit their slot.
  const longest = Math.max(...stages.map((s) => s.title.length));
  const longestSub = Math.max(0, ...stages.map((s) => s.sub?.length ?? 0));
  const fitTitle = Math.min(titleSize, Math.floor((slot - 20) / (0.6 * longest * focusScale)));
  const fitSub = longestSub ? Math.min(subSize, Math.floor((slot - 20) / (0.56 * longestSub * focusScale))) : subSize;
  const height = labelTop + (fitTitle * 1.1 + 8 + fitSub * 1.3) * focusScale;

  const draw = progress(frame, drawAt, 26, EASE.inOut);
  const lit = stages.map((s) => progress(frame, s.at - 2, 14));
  const { weights, dims } = focusWeights(
    frame,
    stages.map((s) => s.at),
    { end: focusEnd },
  );

  // Rail: segment i joins node i-1 to node i (styled after stage i).
  const segments: ReactNode[] = [];
  for (let i = 1; i < n; i++) {
    const s = stages[i];
    const x0 = nodeX(i - 1);
    const x1 = nodeX(i);
    const shown = Math.max(0, Math.min(1, draw * (n - 1) - (i - 1)));
    const col = toneOf(s.tone ?? 'cyan').fg;
    const dash = s.dashed ? '6 16' : undefined;
    segments.push(
      <g key={i}>
        {shown > 0 ? (
          <line x1={x0} y1={railY} x2={x0 + (x1 - x0) * shown} y2={railY} stroke={C.ink600} strokeWidth={s.dashed ? 6 : 8} strokeDasharray={dash} strokeLinecap="round" />
        ) : null}
        {lit[i] > 0 ? (
          <line
            x1={x0}
            y1={railY}
            x2={x0 + (x1 - x0) * lit[i]}
            y2={railY}
            stroke={s.dashed ? C.muted : col}
            strokeWidth={s.dashed ? 6 : 8}
            strokeDasharray={dash}
            strokeLinecap="round"
            style={s.dashed ? undefined : { filter: `drop-shadow(0 0 8px ${alpha(col, 0.55)})` }}
          />
        ) : null}
      </g>,
    );
  }

  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, ...style }}>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {segments}
      </svg>
      {stages.map((s, i) => {
        const t = toneOf(s.tone ?? 'cyan');
        const x = nodeX(i);
        const appear = progress(frame, drawAt + 4 + i * 3, 14);
        const f = weights[i];
        const d = dims[i] * lit[i];
        const beat = lit[i] * (f > 0.01 ? 0.35 + 0.65 * f * (0.65 + 0.35 * pulse(frame, fps, 0.6)) : 0.3);
        const size = s.dashed ? nodeSize * 0.85 : nodeSize;
        const k = 1 + (focusScale - 1) * f;
        const on = lit[i] > 0.01;
        return (
          <div key={s.title + i} style={{ position: 'absolute', inset: 0, ...dimStyle(0.8 * d) }}>
            {s.above ? (
              <div
                style={{
                  position: 'absolute',
                  left: x - slot / 2 + 8,
                  width: slot - 16,
                  top: 0,
                  height: aboveHeight,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  opacity: lit[i],
                  transform: `translateY(${(1 - lit[i]) * 12}px)`,
                }}
              >
                {s.above}
              </div>
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: x - size / 2,
                top: railY - size / 2,
                width: size,
                height: size,
                boxSizing: 'border-box',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: on ? `linear-gradient(${alpha(t.fg, 0.18 * lit[i])}, ${alpha(t.fg, 0.18 * lit[i])}), ${C.ink850}` : C.ink850,
                border: `3px ${s.dashed ? 'dashed' : 'solid'} ${on ? alpha(t.fg, 0.5 + 0.5 * lit[i]) : C.ink600}`,
                boxShadow: beat > 0.01 ? `0 0 ${Math.round(34 * beat)}px ${alpha(t.fg, 0.55 * beat)}` : undefined,
                opacity: appear,
                transform: `scale(${(0.85 + 0.15 * appear) * k})`,
              }}
            >
              <Icon name={s.icon} size={Math.round(size * 0.48)} color={on ? t.fg : C.faint} strokeWidth={2} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: x - slot / 2,
                width: slot,
                top: labelTop,
                textAlign: 'center',
                opacity: appear * (0.42 + 0.58 * lit[i]),
                transform: k !== 1 ? `scale(${k})` : undefined,
                transformOrigin: 'center top',
              }}
            >
              <div
                style={{
                  fontSize: fitTitle,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: lit[i] > 0.5 ? C.textStrong : C.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.title}
              </div>
              {s.sub ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: fitSub,
                    fontWeight: 600,
                    color: s.dashed ? C.muted : t.soft,
                    whiteSpace: 'nowrap',
                    opacity: lit[i],
                  }}
                >
                  {s.sub}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
