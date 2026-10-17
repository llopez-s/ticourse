import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

export const STAMP_H = 60;
export const CHIP_H = 58;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/**
 * A case stamp: «Autoridad Portuaria de Halden · caso de ejemplo» (s01) or «caso de ejemplo · sin fecha» (s06).
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

/** The objective plate «SY0-701 · 4.1» (violet = exam), only in s01. */
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

/** The small grey tag of an everyday image: «imagen · no es del puerto». */
export function ImageTag({ text = 'imagen · no es del puerto' }: { text?: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        height: 44,
        padding: '0 20px 0 14px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.6)}`,
        background: alpha(C.ink800, 0.8),
        fontFamily: FONT.sans,
        fontSize: 28,
        fontWeight: 650,
        color: C.muted,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="eye" size={26} color={C.muted} />
      <span>{text}</span>
    </div>
  );
}

/**
 * «pregunta tipo examen · ejemplo»: drawn by each question scene's still background (the engine's panel only paints
 * «EXAMEN · SY0-701 · 4.1»), bottom-right of the stage, small.
 */
export function QuestionExampleTag() {
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
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: alpha(C.violetDeep, 0.75),
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 750,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={28} color={C.violet} />
      <span>pregunta tipo examen · ejemplo</span>
    </div>
  );
}
