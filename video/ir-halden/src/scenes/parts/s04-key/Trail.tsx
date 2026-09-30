import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, dimStyle, focusWeights, tone as toneOf } from '../../../../../engine/src/ui';
import type { TrailEvent, TrailLine } from '../../../data/s04-key';
import { Chevron } from '../s03-scope/Hosts';

/**
 * s04-key: the finding of this morning as a timeline of the night. A rail
 * with one node per event (21:14 · 01:52 · 02:00–04:30 · 4-9 mañana), the
 * time big above each node and a card under it whose lines appear on their
 * words. The newest lit event is in focus; earlier ones step back a little.
 * Frames come from the scene (`at` per event, `lineAt` per line).
 */

export const TRAIL_W = 1728;
const TIME_TOP = 44;
const RAIL_Y = 132;
const NODE = 58;
const CARD_TOP = 176;
const CARD_W = 404;
const CARD_H = 312;

export function NightTrail({
  events,
  frame,
  fps,
  drawAt,
  at,
  lineAt,
  headAt,
  head,
  headIcon = 'search',
  release,
}: {
  events: readonly TrailEvent[];
  frame: number;
  fps: number;
  /** Frame the rail draws in. */
  drawAt: number;
  /** Frame each event lights. */
  at: readonly number[];
  /** Frame each line of each event appears. */
  lineAt: readonly (readonly number[])[];
  headAt: number;
  head: string;
  headIcon?: 'search' | 'alert';
  /** From here nothing is in focus (the whole night at full strength). */
  release?: number;
}) {
  const n = events.length;
  const slot = TRAIL_W / n;
  const cx = (i: number) => slot / 2 + i * slot;
  const draw = progress(frame, drawAt, 26, EASE.inOut);
  const lit = at.map((a) => progress(frame, a - 4, 12));
  const { weights, dims } = focusWeights(frame, at, { ramp: 12, end: release });
  // A short rose sweep over the rail when the finding lands (the glitch of the cue).
  const sweep = progress(frame, drawAt, 30, EASE.inOut);

  return (
    <div style={{ position: 'relative', width: TRAIL_W, height: CARD_TOP + CARD_H, fontFamily: FONT.sans }}>
      {/* Heading */}
      <div style={{ position: 'absolute', left: 4, top: 0, height: 38, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...enter(frame, headAt, { distance: 10 }) }}>
        <Icon name={headIcon} size={32} color={C.roseSoft} />
        <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>{head}</span>
      </div>

      {/* Rail */}
      <svg width={TRAIL_W} height={CARD_TOP} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={cx(0)} y1={RAIL_Y} x2={cx(0) + (cx(n - 1) - cx(0)) * draw} y2={RAIL_Y} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
        {events.slice(1).map((ev, k) => {
          const i = k + 1;
          const t = toneOf(ev.tone);
          const p = lit[i];
          if (p <= 0) return null;
          const x0 = cx(i - 1);
          const x1 = cx(i);
          return (
            <line
              key={ev.time}
              x1={x0}
              y1={RAIL_Y}
              x2={x0 + (x1 - x0) * p}
              y2={RAIL_Y}
              stroke={ev.dashed ? C.muted : t.fg}
              strokeWidth={ev.dashed ? 6 : 8}
              strokeDasharray={ev.dashed ? '8 14' : undefined}
              strokeLinecap="round"
              style={ev.dashed ? undefined : { filter: `drop-shadow(0 0 8px ${alpha(t.fg, 0.55)})` }}
            />
          );
        })}
        {sweep > 0 && sweep < 1 ? (
          <rect x={cx(0) + (cx(n - 1) - cx(0)) * sweep - 60} y={RAIL_Y - 5} width={120} height={10} rx={5} fill={alpha(C.rose, 0.8 * (1 - sweep))} style={{ filter: `blur(3px)` }} />
        ) : null}
      </svg>

      {events.map((ev, i) => {
        const t = toneOf(ev.tone);
        const x = cx(i);
        const appear = progress(frame, drawAt + 6 + i * 4, 14);
        const on = lit[i];
        const f = weights[i];
        const beat = on * (f > 0.01 ? 0.4 + 0.6 * f * (0.65 + 0.35 * pulse(frame, fps, 0.6)) : 0.25);
        return (
          <div key={ev.time} style={{ position: 'absolute', inset: 0, ...dimStyle(0.45 * dims[i] * on) }}>
            {/* Time */}
            <div
              style={{
                position: 'absolute',
                left: x - slot / 2,
                width: slot,
                top: TIME_TOP,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: ev.sans ? FONT.sans : FONT.mono,
                fontSize: ev.sans ? 40 : 46,
                fontWeight: 800,
                color: on > 0.5 ? t.soft : C.faint,
                whiteSpace: 'nowrap',
                opacity: appear * (0.35 + 0.65 * on),
              }}
            >
              {on > 0.02 ? ev.time : '--:--'}
            </div>
            {/* Node */}
            <div
              style={{
                position: 'absolute',
                left: x - NODE / 2,
                top: RAIL_Y - NODE / 2,
                width: NODE,
                height: NODE,
                boxSizing: 'border-box',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: on > 0.02 ? `linear-gradient(${alpha(t.fg, 0.2 * on)}, ${alpha(t.fg, 0.2 * on)}), ${C.ink850}` : C.ink850,
                border: `3px ${ev.dashed ? 'dashed' : 'solid'} ${on > 0.02 ? alpha(t.fg, 0.5 + 0.5 * on) : C.ink600}`,
                boxShadow: beat > 0.01 ? `0 0 ${Math.round(30 * beat)}px ${alpha(t.fg, 0.55 * beat)}` : undefined,
                opacity: appear,
                transform: `scale(${(0.85 + 0.15 * appear) * (1 + 0.12 * f)})`,
              }}
            >
              <Icon name={ev.icon} size={30} color={on > 0.02 ? t.fg : C.faint} strokeWidth={2.2} />
            </div>
            {/* Card */}
            <div
              style={{
                position: 'absolute',
                left: x - CARD_W / 2,
                top: CARD_TOP,
                width: CARD_W,
                height: CARD_H,
                boxSizing: 'border-box',
                padding: '16px 22px',
                borderRadius: RADIUS.lg,
                border: `2px ${on > 0.5 ? 'solid' : 'dashed'} ${on > 0.02 ? alpha(t.fg, 0.25 + 0.45 * on * (0.5 + 0.5 * f)) : C.ink700}`,
                background: `linear-gradient(180deg, ${alpha(t.fg, 0.08 * on)} 0%, ${alpha(C.ink900, 0.94)} 60%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                opacity: appear,
              }}
            >
              {ev.lines.map((line, j) => (
                <TrailRow key={j} line={line} frame={frame} at={lineAt[i]?.[j] ?? at[i]} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrailRow({ line, frame, at }: { line: TrailLine; frame: number; at: number }) {
  if (frame < at - 1) return <div style={{ height: rowH(line) }} />;
  const e = enter(frame, at, { distance: 10, duration: 14 });
  let body: ReactNode = null;
  switch (line.kind) {
    case 'host':
      body = <span style={{ fontFamily: FONT.mono, fontSize: line.size ?? 36, fontWeight: 800, color: toneOf(line.tone).soft }}>{line.text}</span>;
      break;
    case 'mono':
      body = <span style={{ fontFamily: FONT.mono, fontSize: line.size ?? 30, fontWeight: 700, color: line.tone === 'muted' ? C.muted : toneOf(line.tone).soft }}>{line.text}</span>;
      break;
    case 'chevron':
      body = <Chevron dir="down" size={30} color={C.roseSoft} />;
      break;
    case 'title':
      body = (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <Icon name={line.icon} size={36} color={toneOf(line.tone).fg} />
          <span style={{ fontFamily: line.icon === 'key' ? FONT.mono : FONT.sans, fontSize: line.icon === 'key' ? 36 : 36, fontWeight: 800, color: toneOf(line.tone).soft }}>{line.text}</span>
        </span>
      );
      break;
    case 'chip':
      body = (
        <Chip accent={line.accent} icon={line.icon} size={30} solid={line.accent === 'rose'}>
          {line.text}
        </Chip>
      );
      break;
    case 'sub':
      body = <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>{line.text}</span>;
      break;
    case 'big':
      body = (
        <span style={{ fontSize: 68, fontWeight: 850, color: C.roseSoft, letterSpacing: -1, lineHeight: 1 }}>
          {line.text}
          <span style={{ fontSize: 36, fontWeight: 750, color: C.rose, marginLeft: 10 }}>{line.unit}</span>
        </span>
      );
      break;
  }
  return <div style={{ height: rowH(line), display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', ...e }}>{body}</div>;
}

function rowH(line: TrailLine): number {
  switch (line.kind) {
    case 'host':
      return Math.round((line.size ?? 36) * 1.2);
    case 'mono':
      return Math.round((line.size ?? 30) * 1.25);
    case 'chevron':
      return 26;
    case 'title':
      return 46;
    case 'chip':
      return 50;
    case 'sub':
      return 36;
    case 'big':
      return 72;
  }
}
