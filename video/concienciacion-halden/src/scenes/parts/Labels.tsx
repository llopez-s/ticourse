import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { IMAGE_TAG } from '../../data/canon';

export const STAMP_H = 60;
export const CHIP_H = 58;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/**
 * A case stamp, e.g. «Autoridad Portuaria de Halden · programa de concienciación · propuesta · sin fecha» (s01).
 * `parts` are joined by a faint dot; the first is white, the second tinted, the rest muted. `tone` is cyan for the
 * port's proposals and sky (with a dashed border) for suppositions. Never a date; the «datos ficticios» tag is the
 * engine's own except where the storyboard writes it into the stamp (s04).
 */
export function CaseStamp({ parts, size = 30, tone = C.cyan, dashed = false }: { parts: string[]; size?: number; tone?: string; dashed?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: STAMP_H,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px ${dashed ? 'dashed' : 'solid'} ${alpha(tone, 0.7)}`,
        background: alpha(tone, 0.1),
        fontFamily: FONT.sans,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={size} color={tone} />
      {parts.map((p, i) => (
        <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          {i > 0 ? <Dot /> : null}
          <span style={{ fontWeight: i === 0 ? 800 : 700, color: i === 0 ? C.textStrong : i === 1 ? C.text : C.muted }}>{p}</span>
        </span>
      ))}
    </div>
  );
}

/** The objective plate «SY0-701 · 5.6» (violet = exam), only in s01. */
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

/** A thin rose stroke across its parent (position: relative), drawn left to right with `strike` 0–1. */
export function StrikeLine({ strike, color = C.rose }: { strike: number; color?: string }) {
  const s = clamp01(strike);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: -6,
        top: '52%',
        height: 5,
        width: `calc(${s * 100}% + ${12 * s}px)`,
        borderRadius: 3,
        background: color,
        boxShadow: `0 0 10px ${alpha(color, 0.6)}`,
        transform: 'translateY(-50%) rotate(-3deg)',
        transformOrigin: '0 50%',
      }}
    />
  );
}

/** «imagen · no es del puerto», under the school English (muted, so it never competes). */
export function ImageTag({ size = 28, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: Math.round(size * 1.5),
        padding: '0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.6)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 700,
        color: C.muted,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {IMAGE_TAG}
    </div>
  );
}
