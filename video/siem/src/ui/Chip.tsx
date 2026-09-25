import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

/** Rounded pill label. `solid` fills it with the accent (for the active state). */
export function Chip({
  children,
  accent = 'cyan',
  icon,
  solid = false,
  size = TYPE.small,
  style,
}: {
  children: ReactNode;
  accent?: Accent;
  icon?: IconName;
  solid?: boolean;
  size?: number;
  style?: CSSProperties;
}) {
  const a = ACCENT[accent];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.62)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(a.fg, solid ? 0.9 : 0.55)}`,
        background: solid ? a.fg : alpha(a.fg, 0.1),
        color: solid ? C.ink950 : a.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={solid ? C.ink950 : a.fg} /> : null}
      {children}
    </span>
  );
}

export type Severity = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRÍTICA';

const SEVERITY_ACCENT: Record<Severity, Accent> = {
  BAJA: 'emerald',
  MEDIA: 'amber',
  ALTA: 'rose',
  CRÍTICA: 'rose',
};

/** Severity label used on alerts and events. */
export function SeverityBadge({ level, size = TYPE.small, style }: { level: Severity; size?: number; style?: CSSProperties }) {
  return (
    <Chip accent={SEVERITY_ACCENT[level]} solid={level === 'CRÍTICA' || level === 'ALTA'} size={size} style={style}>
      {level}
    </Chip>
  );
}

/**
 * Small inline violet "EXAMEN" tag for marking an exam fact inside a scene.
 * (The big top-right exam card is the overlay/ExamCueLayer, driven by the timeline.)
 */
export function ExamBadge({ objective, size = TYPE.micro, style }: { objective?: string; size?: number; style?: CSSProperties }) {
  return (
    <Chip accent="violet" icon="mortarboard" size={size} style={style}>
      {objective ? `EXAMEN · ${objective}` : 'EXAMEN'}
    </Chip>
  );
}
