import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, dimStyle, focusWeights, tone as toneOf } from '../../../../../engine/src/ui';
import { NIGHT_HEADER, type NightEvent, type NightLine } from '../../../data/s01-hook';

/**
 * s01's catch-up strip: the night of 3-9 as a horizontal timeline that fills
 * in with the voice — dusk on the left, deep night on the right. One node per
 * event on a rail, the time big above it, a card under it whose lines appear
 * on their words. The newest event is in focus; the rest step back a little.
 * Stage-local layout (1728 wide); frames come from the scene.
 */

const W = 1728;
const HEAD_TOP = 18;
const TIME_TOP = 118;
const RAIL_Y = 222;
const NODE = 64;
const CARD_TOP = 276;
const CARD_W = 400;
const CARD_H = 250;

export function NightStrip({
  events,
  frame,
  fps,
  headAt,
  drawAt,
  at,
  lineAt,
  release,
}: {
  events: readonly NightEvent[];
  frame: number;
  fps: number;
  headAt: number;
  drawAt: number;
  at: readonly number[];
  lineAt: readonly (readonly number[])[];
  /** From here nothing is in focus (all events at full strength). */
  release: number;
}) {
  const n = events.length;
  const slot = W / n;
  const cx = (i: number) => slot / 2 + i * slot;
  const draw = progress(frame, drawAt, 30, EASE.inOut);
  const lit = at.map((a) => progress(frame, a - 4, 12));
  const { weights, dims } = focusWeights(frame, at, { ramp: 12, end: release });
  return (
    <div style={{ position: 'relative', width: W, height: CARD_TOP + CARD_H, fontFamily: FONT.sans }}>
      {/* Sky: dusk (warm) on the left fading into the night */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: TIME_TOP - 20,
          width: W,
          height: CARD_TOP + CARD_H - TIME_TOP + 40,
          borderRadius: RADIUS.lg,
          background: `linear-gradient(90deg, ${alpha(C.amber, 0.09)} 0%, ${alpha(C.amber, 0.03)} 22%, ${alpha(C.ink950, 0)} 45%, ${alpha(C.violetDeep, 0.25)} 100%)`,
          opacity: draw,
        }}
      />
      {/* Heading */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: HEAD_TOP,
          width: W,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          whiteSpace: 'nowrap',
          ...enter(frame, headAt, { distance: 12 }),
        }}
      >
        <Icon name="clock" size={40} color={C.cyan} />
        <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong, letterSpacing: -0.3 }}>{NIGHT_HEADER}</span>
      </div>

      {/* Rail */}
      <svg width={W} height={CARD_TOP} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={cx(0)} y1={RAIL_Y} x2={cx(0) + (cx(n - 1) - cx(0)) * draw} y2={RAIL_Y} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
        {events.slice(1).map((ev, k) => {
          const i = k + 1;
          const p = lit[i];
          if (p <= 0) return null;
          const col = toneOf(ev.tone).fg;
          const x0 = cx(i - 1);
          return (
            <line
              key={ev.time}
              x1={x0}
              y1={RAIL_Y}
              x2={x0 + (cx(i) - x0) * p}
              y2={RAIL_Y}
              stroke={col}
              strokeWidth={8}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${alpha(col, 0.55)})` }}
            />
          );
        })}
      </svg>

      {events.map((ev, i) => {
        const t = toneOf(ev.tone);
        const x = cx(i);
        const appear = progress(frame, drawAt + 6 + i * 4, 14);
        const on = lit[i];
        const f = weights[i];
        const beat = on * (f > 0.01 ? 0.4 + 0.6 * f * (0.65 + 0.35 * pulse(frame, fps, 0.6)) : 0.3);
        return (
          <div key={ev.time} style={{ position: 'absolute', inset: 0, ...dimStyle(0.6 * dims[i] * on) }}>
            <div
              style={{
                position: 'absolute',
                left: x - slot / 2,
                width: slot,
                top: TIME_TOP,
                height: 62,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: ev.sans ? FONT.sans : FONT.mono,
                fontSize: ev.sans ? 44 : 52,
                fontWeight: 800,
                color: on > 0.5 ? t.soft : C.faint,
                whiteSpace: 'nowrap',
                opacity: appear * (0.3 + 0.7 * on),
                transform: `scale(${1 + 0.08 * f})`,
              }}
            >
              {on > 0.02 ? ev.time : '--:--'}
            </div>
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
                border: `3px solid ${on > 0.02 ? alpha(t.fg, 0.5 + 0.5 * on) : C.ink600}`,
                boxShadow: beat > 0.01 ? `0 0 ${Math.round(32 * beat)}px ${alpha(t.fg, 0.55 * beat)}` : undefined,
                opacity: appear,
                transform: `scale(${(0.85 + 0.15 * appear) * (1 + 0.12 * f)})`,
              }}
            >
              <Icon name={ev.icon} size={32} color={on > 0.02 ? t.fg : C.faint} strokeWidth={2.2} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: x - CARD_W / 2,
                top: CARD_TOP,
                width: CARD_W,
                height: CARD_H,
                boxSizing: 'border-box',
                padding: '22px 22px',
                borderRadius: RADIUS.lg,
                border: `2px ${on > 0.5 ? 'solid' : 'dashed'} ${on > 0.02 ? alpha(t.fg, 0.25 + 0.5 * on * (0.5 + 0.5 * f)) : C.ink700}`,
                background: `linear-gradient(180deg, ${alpha(t.fg, 0.08 * on)} 0%, ${alpha(C.ink900, 0.94)} 65%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                opacity: appear,
              }}
            >
              {ev.lines.map((line, j) => (
                <Line key={j} line={line} frame={frame} at={lineAt[i]?.[j] ?? at[i]} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Line({ line, frame, at }: { line: NightLine; frame: number; at: number }) {
  if (frame < at - 1) return <div style={{ height: lineH(line) }} />;
  let body: ReactNode = null;
  switch (line.kind) {
    case 'title':
      body = (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <Icon name={line.icon} size={40} color={toneOf(line.tone).fg} />
          <span style={{ fontSize: 40, fontWeight: 800, color: C.textStrong }}>{line.text}</span>
        </span>
      );
      break;
    case 'mono':
      body = (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          {line.icon ? <Icon name={line.icon} size={Math.round((line.size ?? 40) * 0.95)} color={toneOf(line.tone).fg} /> : null}
          <span style={{ fontFamily: FONT.mono, fontSize: line.size ?? 40, fontWeight: 800, color: toneOf(line.tone).soft }}>{line.text}</span>
        </span>
      );
      break;
    case 'sub':
      body = <span style={{ fontSize: 34, fontWeight: 650, color: C.text }}>{line.text}</span>;
      break;
    case 'chip':
      body = (
        <Chip accent={line.accent} icon={line.icon} size={32}>
          {line.text}
        </Chip>
      );
      break;
    case 'big':
      body = (
        <span style={{ fontSize: 80, fontWeight: 850, color: C.roseSoft, letterSpacing: -2, lineHeight: 1, textShadow: `0 0 26px ${alpha(C.rose, 0.4)}` }}>
          {line.text}
          <span style={{ fontSize: 40, fontWeight: 800, color: C.rose, marginLeft: 12, letterSpacing: 0 }}>{line.unit}</span>
        </span>
      );
      break;
  }
  return <div style={{ height: lineH(line), display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', ...enter(frame, at, { distance: 10, duration: 14 }) }}>{body}</div>;
}

function lineH(line: NightLine): number {
  switch (line.kind) {
    case 'title':
      return 52;
    case 'mono':
      return Math.round((line.size ?? 40) * 1.25);
    case 'sub':
      return 42;
    case 'chip':
      return 54;
    case 'big':
      return 88;
  }
}
