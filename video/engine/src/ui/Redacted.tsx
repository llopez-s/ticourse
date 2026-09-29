import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../theme/tokens';
import { clamp01 } from './Focus';
import { tone as toneOf, type Tone } from './tone';

/**
 * Anti-spoiler redaction, drawn with CSS (never the U+2588 glyph: the fonts
 * are latin-only subsets). Three shapes:
 *   - a striped bar of `width` (default);
 *   - a domain name (`tld` set): bar · dot · short bar, so not even the TLD reads;
 *   - a labelled block (`label` set): the registry's wording printed on the
 *     marker, e.g. «REDACTED FOR PRIVACY» (width follows the text).
 * `sweep` (0–1) wipes the marker on from the left, `strike` (0–1) draws a
 * rose line through it (blocked / burned), `glow` (0–1) adds a halo.
 */
export function Redacted({
  width = 220,
  height = 28,
  tone = 'muted',
  strength = 0.75,
  glow = 0,
  tld,
  label,
  labelSize = 32,
  sweep = 1,
  strike = 0,
  style,
}: {
  width?: number;
  height?: number;
  tone?: Tone;
  /** Opacity of the marker (0–1). */
  strength?: number;
  glow?: number;
  /** Width of the TLD bar; setting it draws the redacted-domain shape. */
  tld?: number;
  /** Text printed on the marker (the block then sizes to it). */
  label?: string;
  labelSize?: number;
  sweep?: number;
  strike?: number;
  style?: CSSProperties;
}) {
  const col = toneOf(tone).fg;
  const s = clamp01(sweep);
  const clip = s < 1 ? `inset(0 ${((1 - s) * 100).toFixed(1)}% 0 0 round 6px)` : undefined;
  const halo = glow > 0 ? `0 0 ${Math.round(22 * glow)}px ${alpha(col, 0.5 * glow)}` : undefined;
  const stripe = Math.max(8, Math.round(height * 0.9));
  const bar = (w: number): CSSProperties => ({
    display: 'inline-block',
    width: w,
    height,
    borderRadius: 5,
    flexShrink: 0,
    background: `repeating-linear-gradient(90deg, ${alpha(col, strength)} 0 ${stripe}px, ${alpha(col, strength * 0.78)} ${stripe}px ${stripe + 3}px)`,
    boxShadow: halo,
  });

  let body;
  if (label) {
    body = (
      <span
        style={{
          display: 'inline-block',
          padding: `${Math.round(labelSize * 0.14)}px ${Math.round(labelSize * 0.38)}px`,
          borderRadius: 8,
          background: alpha(C.ink600, 0.95),
          boxShadow: halo,
          fontFamily: FONT.mono,
          fontSize: labelSize,
          fontWeight: 700,
          lineHeight: 1.25,
          color: C.muted,
          whiteSpace: 'nowrap',
        }}
      >
        {/* The wording shows once the marker has mostly covered the field. */}
        <span style={{ opacity: clamp01((s - 0.6) / 0.4) }}>{label}</span>
      </span>
    );
  } else if (tld !== undefined) {
    body = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(height * 0.26) }}>
        <span style={bar(width)} />
        <span
          style={{
            width: Math.round(height * 0.27),
            height: Math.round(height * 0.27),
            borderRadius: height,
            background: alpha(col, strength),
            alignSelf: 'flex-end',
            marginBottom: 2,
            flexShrink: 0,
          }}
        />
        <span style={bar(tld)} />
      </span>
    );
  } else {
    body = <span style={bar(width)} />;
  }

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', ...style }}>
      <span style={{ display: 'inline-flex', clipPath: clip }}>{body}</span>
      {strike > 0 ? (
        <span
          style={{
            position: 'absolute',
            left: -6,
            top: '50%',
            height: 4,
            marginTop: -2,
            width: `calc(${(clamp01(strike) * 100).toFixed(1)}% + 12px)`,
            borderRadius: 2,
            background: C.rose,
            boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
          }}
        />
      ) : null}
    </span>
  );
}
