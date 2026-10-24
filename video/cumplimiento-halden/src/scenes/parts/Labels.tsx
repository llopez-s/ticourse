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
 * A case stamp: «Autoridad Portuaria de Halden · objetos perdidos · propuesta · sin fecha» (s01), or its compact form
 * in the port's beats. `parts` are joined by a faint dot; the first is white, the second cyan, the rest muted. Never a
 * date; the «datos ficticios» tag is the engine's own.
 */
export function CaseStamp({ parts, size = 30, height = STAMP_H }: { parts: readonly string[]; size?: number; height?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.46),
        height,
        padding: `0 ${Math.round(size * 0.85)}px 0 ${Math.round(size * 0.6)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={size} color={C.cyan} />
      {parts.map((p, i) => (
        <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.46) }}>
          {i > 0 ? <Dot /> : null}
          <span style={{ fontWeight: i === 0 ? 800 : 700, color: i === 0 ? C.textStrong : i === 1 ? C.cyanSoft : C.muted }}>{p}</span>
        </span>
      ))}
    </div>
  );
}

/** The objective plate «SY0-701 · 5.4» (violet = exam), only in s01. */
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

/** An exam term named on its word (violet = exam), e.g. «DUE CARE». `on` 0–1 as in Pill. */
export function TermPill({ text, on = 1, size = 40, style }: { text: string; on?: number; size?: number; style?: CSSProperties }) {
  return <Pill text={text} tone={C.violet} icon="mortarboard" on={on} size={size} height={Math.round(size * 1.6)} weight={850} style={style} />;
}

/** A plain caption line next to an image or a diagram (≥ 30 px: the voice points at it). */
export function Caption({ children, color = C.text, size = 34, weight = 700, style }: { children: ReactNode; color?: string; size?: number; weight?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: weight, color, lineHeight: 1.2, whiteSpace: 'nowrap', ...style }}>{children}</div>
  );
}

/** The small dashed pill that marks an everyday image as an image, not a fact of the port: «imagen · no es del puerto». */
export function ImageTag({ size = 26, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.6)}px`,
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.6)}`,
        background: alpha(C.ink950, 0.6),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        color: C.muted,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      <Icon name="eye" size={Math.round(size * 0.95)} color={C.faint} />
      {IMAGE_TAG}
    </div>
  );
}

/** A small tag that marks a hypothesis («supuesto · sin efectos»): dashed amber, not a fact. */
export function SoftTag({ text, size = 28, tone = C.amber, style }: { text: string; size?: number; tone?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.65)}px`,
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(tone, 0.75)}`,
        background: alpha(tone, 0.08),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: tone,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** A round disc with an icon (a tick, an alert): the state of something. */
export function Disc({ icon, tone, show = 1, size = 52 }: { icon: IconName; tone: string; show?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        background: alpha(tone, 0.14),
        border: `3px solid ${alpha(tone, 0.8)}`,
        opacity: s,
        transform: `scale(${0.7 + 0.3 * s})`,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.58)} color={tone} strokeWidth={2.4} />
    </div>
  );
}

/** The loop mark of a routine («se repite»): a circular arrow drawn with strokes. */
export function LoopIcon({ size = 40, color = C.emerald, strokeWidth = 2.2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, display: 'block' }}>
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M17.9 2.8v3.8h-3.8" />
      <path d="M6.1 21.2v-3.8h3.8" />
    </svg>
  );
}
