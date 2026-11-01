import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * Mini options: the video's one way to draw «the four options» small, with nothing about security in them.
 *   s04  four blank cards «opción 1…4» in a row; one lights per qualifier (state 'lit'), then two tempt and one fits ('ok')
 *   s05+ a strip of letters A–D in the question band, with the discarded ones struck (strike 0–1)
 *   s07  the options of questions 1 and 2 in miniature, two struck and the reason in a chip next to them
 * A discarded option is crossed by a white stroke (drawn as SVG, never a «✕» character) and steps back to 40 %.
 * Reuse: <OptionStack items={...} layout="row" w={402} h={170} />; per-item `tone` colours the 'lit' state.
 * A single card is <OptionCard item={...} w h />.
 */
export type OptionState = 'idle' | 'lit' | 'tempt' | 'ok' | 'trap';

export interface OptionItem {
  /** Text inside the card (omit for a letter-only chip). */
  label?: string;
  /** Letter badge A–D (omit for none). */
  letter?: string;
  state?: OptionState;
  /** 0–1: how lit the card is (animates the state). */
  on?: number;
  /** 0–1: how much of the strike stroke is drawn. */
  strike?: number;
  /** Colour of the 'lit' state (violet by default; rose for «MENOS»). */
  tone?: string;
}

const STATE_TONE = { tempt: C.amber, ok: C.emerald, trap: C.amber } as const;

export function OptionCard({
  item,
  w,
  h,
  fontSize = 36,
  style,
}: {
  item: OptionItem;
  w: number;
  h: number;
  fontSize?: number;
  style?: CSSProperties;
}) {
  const state = item.state ?? 'idle';
  const on = clamp01(item.on ?? (state === 'idle' ? 0 : 1));
  const tone = state === 'lit' ? (item.tone ?? C.violet) : state === 'idle' ? C.ink600 : STATE_TONE[state];
  const strike = clamp01(item.strike ?? 0);
  const letterSize = Math.min(Math.round(h * 0.62), 56);
  const dim = 1 - 0.6 * strike;
  const showIcon = (state === 'ok' || state === 'trap') && on > 0.3;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, (state === 'idle' ? 1 : 0.35 + 0.6 * on) * dim)}`,
        background: alpha(tone, (state === 'idle' ? 0.35 : 0.08 + 0.2 * on) * dim),
        boxShadow: on > 0.02 && state !== 'idle' ? `0 0 ${Math.round(30 * on)}px ${alpha(tone, 0.4 * on * dim)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        fontFamily: FONT.sans,
        fontSize,
        fontWeight: 750,
        color: C.textStrong,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: dim }}>
      {item.letter ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: letterSize,
            height: letterSize,
            borderRadius: RADIUS.sm,
            background: state === 'idle' ? C.ink800 : alpha(tone, 0.25 + 0.5 * on),
            border: `2px solid ${alpha(tone, 0.8)}`,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: Math.round(letterSize * 0.62),
            color: C.textStrong,
          }}
        >
          {item.letter}
        </span>
      ) : null}
      {item.label ? <span style={{ color: state === 'idle' ? C.muted : C.textStrong }}>{item.label}</span> : null}
      {showIcon ? <Icon name={state === 'ok' ? 'check' : 'alert'} size={Math.round(fontSize * 1.1)} color={tone} strokeWidth={2.6} /> : null}
      </div>
      {strike > 0 ? (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: -3, top: -3, overflow: 'visible' }}>
          <line
            x1={w * 0.04}
            y1={h * 0.62}
            x2={w * 0.04 + w * 0.92 * strike}
            y2={h * 0.62 - h * 0.24 * strike}
            stroke={C.textStrong}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
}

/** A row or column of option cards. */
export function OptionStack({
  items,
  layout = 'row',
  w,
  h,
  gap = 24,
  fontSize,
}: {
  items: OptionItem[];
  layout?: 'row' | 'column';
  w: number;
  h: number;
  gap?: number;
  fontSize?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: layout === 'row' ? 'row' : 'column', gap }}>
      {items.map((it, i) => (
        <OptionCard key={i} item={it} w={w} h={h} fontSize={fontSize} />
      ))}
    </div>
  );
}
