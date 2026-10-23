import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { STAMP_TEXT, type StampKind } from '../../data/canon';

/**
 * The request's small marks, shared by the sheet (Request.tsx), s02's big form and the slot lines: a check box that
 * takes a tick (never a padlock) and the request's stamp in its four states.
 */

/** Stamp colour per state: amber «sin firmar», emerald «firmado» and «cerrado», sky «comprobado». */
export const STAMP_TONE: Record<StampKind, string> = {
  unsigned: C.amber,
  cab: C.emerald,
  verified: C.sky,
  closed: C.emerald,
};

/** A square box; `tick` 0–1 draws the emerald tick and fills it. `glow` 0–1 lights its border. */
export function CheckBox({ size = 40, tick = 0, glow = 0, tone = C.emerald }: { size?: number; tick?: number; glow?: number; tone?: string }) {
  const t = clamp01(tick);
  const g = clamp01(glow);
  const path = `M ${size * 0.22} ${size * 0.53} L ${size * 0.42} ${size * 0.72} L ${size * 0.8} ${size * 0.3}`;
  const len = size * 0.85;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0, overflow: 'visible' }}>
      <rect
        x={2}
        y={2}
        width={size - 4}
        height={size - 4}
        rx={size * 0.18}
        fill={alpha(tone, 0.04 + 0.16 * t)}
        stroke={t > 0.01 ? alpha(tone, 0.5 + 0.5 * t) : alpha(C.text, 0.45 + 0.4 * g)}
        strokeWidth={Math.max(2, size * 0.07)}
        style={g > 0.02 ? { filter: `drop-shadow(0 0 ${8 * g}px ${alpha(C.cyan, 0.7 * g)})` } : undefined}
      />
      {t > 0.01 ? (
        <path
          d={path}
          fill="none"
          stroke={tone}
          strokeWidth={Math.max(3, size * 0.12)}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - t)}
        />
      ) : null}
    </svg>
  );
}

/**
 * The request's stamp. `drop` 0–1 lands it (big and faint to its size). `mini` draws the frame with two bars instead
 * of the words (question backgrounds carry no readable text). Lower-case on purpose: the ficha quotes it that way.
 */
export function ReqStamp({
  kind,
  drop = 1,
  size = 34,
  rotate = -7,
  mini = false,
  style,
}: {
  kind: StampKind;
  drop?: number;
  size?: number;
  rotate?: number;
  mini?: boolean;
  style?: CSSProperties;
}) {
  const p = clamp01(drop);
  if (p <= 0.001) return null;
  const tone = STAMP_TONE[kind];
  const dashed = kind === 'unsigned';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px`,
        border: `${Math.max(3, Math.round(size * 0.13))}px ${dashed ? 'dashed' : 'solid'} ${tone}`,
        borderRadius: RADIUS.md,
        background: alpha(C.ink950, 0.82),
        color: tone,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 1.3),
        transform: `rotate(${rotate}deg) scale(${1.5 - 0.5 * p})`,
        boxShadow: `0 0 ${Math.round(24 * p)}px ${alpha(tone, 0.28)}`,
        ...style,
      }}
    >
      {kind !== 'unsigned' ? <Icon name="check" size={Math.round(size * 0.95)} color={tone} strokeWidth={2.4} /> : null}
      {mini ? (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: size * 0.18 }}>
          <span style={{ display: 'block', width: size * 3.2, height: size * 0.26, borderRadius: 4, background: alpha(tone, 0.8) }} />
          <span style={{ display: 'block', width: size * 2, height: size * 0.26, borderRadius: 4, background: alpha(tone, 0.5) }} />
        </span>
      ) : (
        <span>{STAMP_TEXT[kind]}</span>
      )}
    </div>
  );
}
