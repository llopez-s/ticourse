import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

export const STAMP_H = 60;
export const CHIP_H = 58;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/**
 * The case stamp: «Autoridad Portuaria de Halden · caso de ejemplo» (s01) or a «supuesto · imagina · sin fecha» stamp
 * (s03, s05, s08). Never a date; the «datos ficticios» tag is the engine's own. `tone` cyan for the port's examples,
 * amber for a «supuesto».
 */
export function CaseStamp({ what, kind, tone = C.cyan, icon = 'flag', size = 32 }: { what: string; kind?: string; tone?: string; icon?: IconName; size?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: Math.round(size * 1.85),
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.7)}`,
        background: alpha(tone, 0.1),
        fontFamily: FONT.sans,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={size} color={tone} />
      <span style={{ fontWeight: 800, color: C.textStrong }}>{what}</span>
      {kind ? (
        <>
          <Dot />
          <span style={{ fontWeight: 700, color: tone === C.cyan ? C.cyanSoft : C.text }}>{kind}</span>
        </>
      ) : null}
    </div>
  );
}

/** The objective plate «SY0-701 · 2.2» (violet = exam), only in s01. */
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

/**
 * An exam name as it lands: the English term in violet capitals on a violet card, with an optional Spanish gloss
 * under it (« … »). `size` is the term's font size; the gloss is ~0.62 of it, never under 32 px.
 */
export function TermName({ term, gloss, size = 56, tone = C.violet, style }: { term: string; gloss?: string; size?: number; tone?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        padding: `${Math.round(size * 0.26)}px ${Math.round(size * 0.55)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.16)} 0%, ${alpha(C.ink900, 0.92)} 100%)`,
        boxShadow: `0 0 34px ${alpha(tone, 0.22)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontSize: size, fontWeight: 900, letterSpacing: 1, lineHeight: 1.05, color: tone === C.violet ? '#c4b5fd' : tone }}>{term}</span>
      {gloss ? <span style={{ fontSize: Math.max(32, Math.round(size * 0.62)), fontWeight: 700, color: C.text, lineHeight: 1.15 }}>{gloss}</span> : null}
    </div>
  );
}

/** A plain caption line in a soft box (the scene's own sentence on screen). */
export function Caption({ text, tone = C.cyan, size = 38, icon, style }: { text: ReactNode; tone?: string; size?: number; icon?: IconName; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: `${Math.round(size * 0.36)}px ${Math.round(size * 0.8)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.6)}`,
        background: alpha(tone, 0.08),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={tone} /> : null}
      <span>{text}</span>
    </div>
  );
}

/** Digit blocks: a phone or account number drawn as small rounded bars, never real digits. */
export function DigitBlocks({ n = 9, tone = C.text, w = 14, h = 22, gap = 6, groups = 3 }: { n?: number; tone?: string; w?: number; h?: number; gap?: number; groups?: number }) {
  const per = Math.ceil(n / groups);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: gap * 2.2 }}>
      {Array.from({ length: groups }, (_, g) => (
        <span key={g} style={{ display: 'inline-flex', gap }}>
          {Array.from({ length: Math.min(per, n - g * per) }, (_, i) => (
            <span key={i} style={{ display: 'inline-block', width: w, height: h, borderRadius: 4, background: alpha(tone, 0.75) }} />
          ))}
        </span>
      ))}
    </span>
  );
}
