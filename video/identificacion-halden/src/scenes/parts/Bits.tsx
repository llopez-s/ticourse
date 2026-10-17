import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/** A case stamp: «Autoridad Portuaria de Halden · caso de ejemplo» (no date; the engine draws «datos ficticios»). */
export function CaseStamp({ what, kind, size = 32 }: { what: string; kind: string; size?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: Math.round(size * 1.85),
        padding: '0 28px 0 18px',
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
      <span style={{ fontWeight: 800, color: C.textStrong }}>{what}</span>
      {kind ? (
        <>
          <Dot />
          <span style={{ fontWeight: 700, color: C.cyanSoft }}>{kind}</span>
        </>
      ) : null}
    </div>
  );
}

/** The objective plate (violet = exam). Drawn here because ExamBadge prints «EXAMEN · …». */
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

/** A rounded label with an optional icon. `on` 0–1 brightens it (the voice is on it). */
export function Pill({
  text,
  tone,
  icon,
  size = 34,
  on = 1,
  strong = true,
  style,
}: {
  text: string;
  tone: string;
  icon?: IconName;
  size?: number;
  on?: number;
  strong?: boolean;
  style?: CSSProperties;
}) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.36),
        height: Math.round(size * 1.7),
        padding: `0 ${Math.round(size * 0.78)}px 0 ${Math.round(size * (icon ? 0.55 : 0.78))}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.4 + 0.45 * o)}`,
        background: alpha(tone, 0.06 + 0.1 * o),
        boxShadow: o > 0.5 ? `0 0 ${Math.round(18 * (o - 0.5) * 2)}px ${alpha(tone, 0.25 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: strong ? 750 : 650,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.94)} color={tone} /> : null}
      <span>{text}</span>
    </div>
  );
}

/** An English exam term as the voice names it (violet = exam). */
export function TermChip({ text, size = 40, on = 1, style }: { text: string; size?: number; on?: number; style?: CSSProperties }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: Math.round(size * 1.6),
        padding: `0 ${Math.round(size * 0.7)}px 0 ${Math.round(size * 0.5)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.violet, 0.5 + 0.45 * o)}`,
        background: alpha(C.violetDeep, 0.55),
        boxShadow: `0 0 ${Math.round(24 * o)}px ${alpha(C.violet, 0.3 * o)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        color: '#ede9fe',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Icon name="mortarboard" size={Math.round(size * 0.85)} color={C.violet} />
      <span>{text}</span>
    </div>
  );
}
