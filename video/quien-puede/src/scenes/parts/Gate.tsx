import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The gate of the whole video: a BARRIER with an arm that swings up (never an arch, never a numbered door, no reader,
 * no lamp, no lock glyph: those images belong to V49 and V50). Two posts, one striped arm, optionally a plate above.
 * The same drawing is the airport gate of s02 (sky) and the small «escribir» gate of the folder (rose closed, emerald open).
 */

export const GATE = { w: 200, h: 170 } as const;
export const gateHeight = (width: number) => (width * GATE.h) / GATE.w;

/**
 * `open` 0–1 swings the arm up; `tone` tints posts and arm (the caller picks: sky in the image, rose/emerald on the
 * folder). `shake` (px, already computed by the caller) wobbles the closed arm once when it refuses to open.
 */
export function GateBar({ width = 200, open = 0, tone = C.sky, shake = 0 }: { width?: number; open?: number; tone?: string; shake?: number }) {
  const o = clamp01(open);
  const stripes = 7;
  return (
    <svg width={width} height={gateHeight(width)} viewBox={`0 0 ${GATE.w} ${GATE.h}`} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      {/* ground */}
      <path d="M0 160 H200" stroke={alpha(tone, 0.4)} strokeWidth={4} strokeLinecap="round" />
      {/* posts */}
      <rect x={12} y={52} width={22} height={108} rx={6} fill={alpha(tone, 0.2)} stroke={tone} strokeWidth={4} />
      <rect x={166} y={52} width={22} height={108} rx={6} fill={alpha(tone, 0.2)} stroke={tone} strokeWidth={4} />
      {/* arm: pivots on the left post */}
      <g transform={`translate(34 84) rotate(${-82 * o + shake})`}>
        <rect x={0} y={-10} width={132} height={20} rx={10} fill={C.ink900} stroke={tone} strokeWidth={4} />
        {Array.from({ length: stripes }, (_, i) => (
          <path key={i} d={`M${14 + i * 17} 8 L${24 + i * 17} -8`} stroke={alpha(tone, 0.85)} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
      {/* the pivot */}
      <circle cx={34} cy={84} r={9} fill={tone} />
    </svg>
  );
}

/** A gate with a plate above it: the plate carries the «vuelo» (airport) or «Partes de avería · escribir» (the folder). */
export function LabelledGate({
  width = 240,
  open = 0,
  tone = C.sky,
  label,
  sub,
  on = 0,
  shake = 0,
  size = 32,
}: {
  width?: number;
  open?: number;
  tone?: string;
  label: string;
  sub?: string;
  /** 0–1 brightness of the plate (the voice is on it). */
  on?: number;
  shake?: number;
  size?: number;
}) {
  const g = clamp01(on);
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT.sans }}>
      <div
        style={{
          boxSizing: 'border-box',
          padding: `8px 16px`,
          minWidth: width * 0.7,
          maxWidth: width + 40,
          textAlign: 'center',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(tone, 0.45 + 0.5 * g)}`,
          background: alpha(tone, 0.08 + 0.14 * g),
          boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(tone, 0.35 * g)}` : undefined,
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.12,
          color: C.textStrong,
        }}
      >
        <div style={{ whiteSpace: 'nowrap' }}>{label}</div>
        {sub ? <div style={{ whiteSpace: 'nowrap', fontSize: Math.round(size * 0.86), fontWeight: 700, color: alpha('#ffffff', 0.78) }}>{sub}</div> : null}
      </div>
      <GateBar width={width * 0.8} open={open} tone={tone} shake={shake} />
    </div>
  );
}
