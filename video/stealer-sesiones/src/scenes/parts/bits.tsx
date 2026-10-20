import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

export * from '../../../../engine/src/practica/bits';

/** The colour of each party of the case (Ana's side, the trusted device, the identity service, Graph, the app). */
export const WHO = {
  ana: C.cyan,
  trusted: C.emerald,
  idp: C.emerald,
  app: C.sky,
  graph: '#fb923c',
} as const;

/** A statement that may wrap onto two lines (Pill never wraps): icon + text in a bordered box. */
export function Note({ children, icon, tone = 'muted', size = 30, w, dashed = false }: { children: ReactNode; icon?: IconName; tone?: Tone; size?: number; w?: number; dashed?: boolean }) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        display: 'flex',
        alignItems: 'center',
        gap: Math.round(size * 0.4),
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.6)}px`,
        borderRadius: RADIUS.md,
        border: `2px ${dashed ? 'dashed' : 'solid'} ${alpha(t.fg, 0.6)}`,
        background: alpha(t.fg, 0.08),
        color: t.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        lineHeight: 1.18,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.1)} color={t.fg} style={{ flexShrink: 0 }} /> : null}
      <span>{children}</span>
    </div>
  );
}
