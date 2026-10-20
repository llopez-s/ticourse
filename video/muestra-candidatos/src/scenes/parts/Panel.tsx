import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

export const PANEL_HEAD = 78;

/**
 * A column panel: header (icon, title, sub) and a free body. Children use panel-local coordinates (the body
 * starts at y = PANEL_HEAD, but they position absolutely). `dim` (0–1) steps the whole panel back once the
 * voice has moved on to the next one.
 */
export function ColPanel({
  frame,
  at,
  x,
  y = 0,
  w,
  h,
  tone,
  icon,
  title,
  sub,
  dim = 0,
  titleSize = 36,
  children,
}: {
  frame: number;
  at: number;
  x: number;
  y?: number;
  w: number;
  h: number;
  tone: Tone;
  icon: IconName;
  title: string;
  sub: string;
  dim?: number;
  titleSize?: number;
  children?: ReactNode;
}) {
  const p = progress(frame, at, 18);
  if (p <= 0.001) return null;
  const t = toneOf(tone);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(t.fg, 0.5)}`,
        background: C.ink900,
        opacity: p * (1 - 0.55 * dim),
        transform: `translateY(${(1 - p) * 18}px)`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ boxSizing: 'border-box', height: PANEL_HEAD, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', background: alpha(t.fg, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name={icon} size={40} color={t.fg} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: titleSize, fontWeight: 800, color: C.textStrong, lineHeight: 1.05, whiteSpace: 'nowrap' }}>{title}</div>
          <div style={{ marginTop: 2, fontSize: 26, fontWeight: 600, color: t.soft, whiteSpace: 'nowrap' }}>{sub}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: PANEL_HEAD, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
}
