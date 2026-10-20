import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

export const STAMP_H = 60;
export const CHIP_H = 58;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/**
 * The case stamp: «Autoridad Portuaria de Halden · Sistemas · propuesta · sin fecha» (s01).
 * Never a date; the «datos ficticios» tag is the engine's own.
 */
export function CaseStamp({ what, kind }: { what: string; kind: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: STAMP_H,
        padding: '0 28px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={32} color={C.cyan} />
      <span style={{ fontWeight: 800, color: C.textStrong }}>{what}</span>
      <Dot />
      <span style={{ fontWeight: 700, color: C.cyanSoft }}>{kind}</span>
    </div>
  );
}

/** The objective plate «SY0-701 · 3.1» (violet = exam), only in s01. */
export function PlaqueChip({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 50,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.7)}`,
        background: alpha(C.violet, 0.12),
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 800,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={30} color={C.violet} />
      <span>{text}</span>
    </div>
  );
}

/** A rounded pill with an optional icon; `on` 0–1 brightens border and glow (the voice is on it). */
export function Pill({
  text,
  tone,
  icon,
  on = 1,
  size = 34,
  height = CHIP_H,
  weight = 750,
  color,
  style,
}: {
  text: ReactNode;
  tone: string;
  icon?: IconName;
  on?: number;
  size?: number;
  height?: number;
  weight?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height,
        padding: icon ? '0 28px 0 20px' : '0 28px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.4 + 0.5 * o)}`,
        background: alpha(tone, 0.06 + 0.12 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(22 * o)}px ${alpha(tone, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        color: color ?? C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.94)} color={tone} /> : null}
      <span>{text}</span>
    </div>
  );
}

/** The quiet case tag of the port's scenes (s02, s04), top-left. */
export function CaseTag({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.45)}`,
        background: alpha(C.cyan, 0.07),
        fontFamily: FONT.sans,
        fontSize: 28,
        fontWeight: 700,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={26} color={C.cyan} />
      <span>{text}</span>
    </div>
  );
}

/** An exam term named on its word (violet = exam), e.g. «AIR GAP». `on` 0–1 as in Pill. */
export function TermPill({ text, on = 1, size = 40, style }: { text: string; on?: number; size?: number; style?: CSSProperties }) {
  return <Pill text={text} tone={C.violet} icon="mortarboard" on={on} size={size} height={Math.round(size * 1.6)} weight={850} style={style} />;
}

/** The small violet chip of an exam name («REGISTRY TRUST», «container escape»). */
export function ExamChip({ text, on = 1, size = 30 }: { text: string; on?: number; size?: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: Math.round(size * 1.5),
        padding: `0 ${Math.round(size * 0.6)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.45 + 0.45 * o)}`,
        background: alpha(C.violetDeep, 0.35 + 0.35 * o),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}

/** A rose strike line across its parent, drawn left to right with `strike` 0–1. */
export function StrikeLine({ strike, tilt = -3 }: { strike: number; tilt?: number }) {
  const s = clamp01(strike);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: -6,
        top: '50%',
        height: 5,
        width: `calc(${s * 100}% + ${12 * s}px)`,
        borderRadius: 3,
        background: C.rose,
        boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
        transform: `translateY(-50%) rotate(${tilt}deg)`,
        transformOrigin: '0 50%',
      }}
    />
  );
}
