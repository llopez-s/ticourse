import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/** Height of the window's title / address bar. */
export const WIN_BAR = 60;

/**
 * A browser window: three dots and an address pill on a bar, then a body the caller fills (body-local coordinates,
 * `width` × `height − WIN_BAR`). The test copy has no domain, so the pill carries a path or a page name only.
 * `glow` (0–1) lights the border, `dim` (0–1) steps the whole window back.
 */
export function WebWindow({
  width,
  height,
  url,
  title,
  urlSize = 30,
  accent = 'cyan',
  glow = 0,
  dim = 0,
  children,
  style,
  bodyStyle,
}: {
  width: number;
  height: number;
  /** Address text (mono). */
  url?: ReactNode;
  /** Page name (sans) when there is no address. */
  title?: string;
  urlSize?: number;
  accent?: Accent;
  glow?: number;
  dim?: number;
  children?: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        background: C.ink900,
        border: `2px solid ${glow > 0 ? alpha(a.fg, 0.35 + 0.55 * glow) : C.ink700}`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}${glow > 0 ? `, 0 0 ${Math.round(20 + 36 * glow)}px ${alpha(a.fg, 0.35 * glow)}` : ''}`,
        opacity: 1 - 0.6 * dim,
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: WIN_BAR,
          padding: '0 18px',
          boxSizing: 'border-box',
          background: alpha(C.ink800, 0.95),
          borderBottom: `2px solid ${C.ink700}`,
        }}
      >
        {[C.ink500, C.ink600, C.ink700].map((c, i) => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c, flexShrink: 0 }} />
        ))}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: 40,
            boxSizing: 'border-box',
            marginLeft: 8,
            padding: '0 16px',
            borderRadius: 20,
            background: C.ink950,
            border: `2px solid ${C.ink700}`,
            display: 'flex',
            alignItems: 'center',
            fontFamily: url !== undefined ? FONT.mono : FONT.sans,
            fontSize: urlSize,
            fontWeight: url !== undefined ? 500 : 650,
            color: C.text,
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          {url ?? title}
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: height - WIN_BAR, ...bodyStyle }}>{children}</div>
    </div>
  );
}
