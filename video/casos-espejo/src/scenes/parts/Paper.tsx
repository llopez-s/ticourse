import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Redacted, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * A printed document: header + text lines drawn as bars. `redact` lists the line indexes that are
 * blacked out (the others are plain grey bars); `legible` is a line of real text printed over the bars.
 * Used for the APT1 report (s03/s04), the government's attribution (s06) and the indictment (s08).
 */
export function Paper({
  w,
  h,
  tone = 'sky',
  title,
  titleSize = 40,
  kicker,
  lines = 7,
  redact = [],
  sweep = 1,
  legible,
  legibleSize = 32,
  seal,
  glow = 0,
  light = false,
  children,
}: {
  w: number;
  h: number;
  tone?: Tone;
  title?: string;
  titleSize?: number;
  kicker?: string;
  lines?: number;
  redact?: readonly number[];
  /** 0–1: how far the black bars have swept across. */
  sweep?: number;
  legible?: ReactNode;
  legibleSize?: number;
  seal?: ReactNode;
  glow?: number;
  /** Pale paper with black bars (a redacted official document reads better that way). */
  light?: boolean;
  children?: ReactNode;
}) {
  const t = toneOf(tone);
  const widths = [0.92, 0.78, 0.88, 0.6, 0.84, 0.7, 0.9, 0.5, 0.8, 0.66];
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        padding: '26px 30px',
        borderRadius: 14,
        border: `2px solid ${alpha(t.fg, 0.55 + 0.4 * glow)}`,
        background: light ? '#dbe4ef' : `linear-gradient(180deg, ${alpha('#e2e8f0', 0.09)} 0%, ${alpha('#e2e8f0', 0.04)} 100%), ${C.ink900}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(34 * glow)}px ${alpha(t.fg, 0.35 * glow)}` : `0 22px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      {kicker ? <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: light ? '#334155' : t.soft, textTransform: 'uppercase' }}>{kicker}</div> : null}
      {title ? <div style={{ marginTop: kicker ? 6 : 0, fontSize: titleSize, fontWeight: 900, letterSpacing: -0.8, color: light ? C.ink950 : C.textStrong, lineHeight: 1.05 }}>{title}</div> : null}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from({ length: lines }).map((_, i) =>
          redact.includes(i) ? (
            <Redacted key={i} width={Math.round((w - 60) * widths[i % widths.length])} height={20} tone="#020617" strength={light ? 1 : 0.9} sweep={sweep} />
          ) : (
            <div key={i} style={{ height: 12, width: `${widths[i % widths.length] * 100}%`, borderRadius: 6, background: light ? '#94a3b8' : alpha('#e2e8f0', 0.26) }} />
          ),
        )}
      </div>
      {legible ? (
        <div style={{ marginTop: 20, fontSize: legibleSize, fontWeight: 750, lineHeight: 1.2, color: light ? C.ink950 : C.textStrong, padding: '10px 14px', borderRadius: 10, background: light ? alpha(t.fg, 0.22) : alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.7)}` }}>{legible}</div>
      ) : null}
      {seal ? <div style={{ position: 'absolute', right: 22, bottom: 20 }}>{seal}</div> : null}
      {children}
    </div>
  );
}
