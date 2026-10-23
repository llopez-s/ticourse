import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * The case folder (a manila folder with its tab): the same drawing for MOONLIGHT MAZE,
 * Sony, the DNC box and APT10. `title` is printed on the cover, `children` go under it.
 */
export function Folder({
  w,
  h,
  title,
  titleSize = 56,
  tabLabel = 'CASO',
  tone = 'sky',
  children,
  glow = 0,
}: {
  w: number;
  h: number;
  title: string;
  titleSize?: number;
  tabLabel?: string;
  tone?: Tone;
  children?: ReactNode;
  glow?: number;
}) {
  const t = toneOf(tone);
  const tabW = Math.min(300, Math.round(w * 0.42));
  const TAB = 52;
  return (
    <div style={{ position: 'relative', width: w, height: h, fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: tabW,
          height: TAB + 14,
          borderRadius: '18px 18px 0 0',
          background: alpha(t.fg, 0.28),
          border: `3px solid ${alpha(t.fg, 0.7)}`,
          borderBottom: 'none',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 20px',
          color: t.soft,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        <Icon name="archive" size={28} color={t.fg} strokeWidth={2} />
        {tabLabel}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: TAB,
          width: w,
          height: h - TAB,
          boxSizing: 'border-box',
          borderRadius: '0 22px 22px 22px',
          border: `3px solid ${alpha(t.fg, 0.7 + 0.3 * glow)}`,
          background: `linear-gradient(180deg, ${alpha(t.fg, 0.16)} 0%, ${C.ink900} 70%)`,
          boxShadow: glow > 0 ? `0 0 ${Math.round(38 * glow)}px ${alpha(t.fg, 0.4 * glow)}` : `0 24px 50px ${alpha('#000000', 0.35)}`,
          padding: '22px 30px',
        }}
      >
        <div style={{ fontSize: titleSize, fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, color: C.textStrong }}>{title}</div>
        {children}
      </div>
    </div>
  );
}
