import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01 } from '../../../../engine/src/ui';

/**
 * The DNI = the server's certificate (copied from V12's `Hotel.tsx`, `DniCard` and its helpers only; this video has
 * no hotel). Photo silhouette + bars, NEVER a number. `stolen` tints it amber (not used in F2).
 * In F2 the voice always says «DNI», never «carné». Nothing here reads the timeline and nothing is positioned.
 */

export const HOTEL_TONE = { reception: C.emerald, guest: C.cyan, police: C.sky } as const;
/** Soft text colours that go with the three tones. */
export const HOTEL_TEXT = { reception: '#6ee7b7', guest: C.cyanSoft, police: '#7dd3fc' } as const;

const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

function dimmed(d: number, extra?: string): Pick<CSSProperties, 'opacity' | 'filter'> {
  const k = clamp01(d);
  return { opacity: 1 - 0.6 * k, filter: joinFilters(extra ?? '', k > 0.01 ? `saturate(${1 - 0.6 * k})` : '') };
}

// ---------------------------------------------------------------------------

// DNI (the certificate)

/** ID-1 card proportions: width × 0.63. */
export function dniSize(width: number) {
  return { w: width, h: Math.round(width * 0.63) };
}

export function DniCard({
  width,
  glow = 0,
  dim = 0,
  stolen = 0,
  style,
}: {
  width: number;
  glow?: number;
  dim?: number;
  /** 0–1: the card turns amber (reported stolen). */
  stolen?: number;
  style?: CSSProperties;
}) {
  const { h } = dniSize(width);
  const st = clamp01(stolen);
  const col = st > 0.5 ? C.amber : HOTEL_TONE.guest;
  const g = clamp01(glow);
  const u = width / 100;
  const bar = Math.max(8, Math.round(6 * u));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.round(7 * u),
        border: `${Math.max(2, Math.round(1.6 * u))}px solid ${alpha(col, 0.85)}`,
        background: `linear-gradient(160deg, ${alpha(col, 0.2)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
        boxShadow: `0 0 ${Math.round(8 + 26 * g)}px ${alpha(col, 0.12 + 0.35 * g)}, 0 ${Math.round(6 * u)}px ${Math.round(14 * u)}px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        ...dimmed(dim),
        ...style,
      }}
    >
      {/* Header band */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: Math.round(13 * u),
          background: alpha(col, 0.22),
          display: 'flex',
          alignItems: 'center',
          paddingLeft: Math.round(6 * u),
          fontFamily: FONT.sans,
          fontSize: Math.round(8.5 * u),
          fontWeight: 850,
          letterSpacing: Math.round(0.8 * u),
          color: st > 0.5 ? '#fcd34d' : HOTEL_TEXT.guest,
        }}
      >
        DNI
      </div>
      {/* Photo silhouette */}
      <svg
        width={Math.round(26 * u)}
        height={Math.round(32 * u)}
        viewBox="0 0 26 32"
        style={{ position: 'absolute', left: Math.round(6 * u), top: Math.round(18 * u), display: 'block' }}
      >
        <rect x={0.8} y={0.8} width={24.4} height={30.4} rx={2.5} fill={alpha(col, 0.12)} stroke={alpha(col, 0.7)} strokeWidth={1.2} />
        <circle cx={13} cy={12} r={5.4} fill={alpha(col, 0.55)} />
        <path d="M 3.5 31 Q 4 20.5 13 20.5 Q 22 20.5 22.5 31 Z" fill={alpha(col, 0.55)} />
      </svg>
      {/* Data: bars only */}
      <div style={{ position: 'absolute', left: Math.round(38 * u), top: Math.round(20 * u), display: 'flex', flexDirection: 'column', gap: Math.round(5 * u) }}>
        <Redacted width={Math.round(48 * u)} height={bar} tone={col} strength={0.55} />
        <Redacted width={Math.round(38 * u)} height={bar} tone={col} strength={0.45} />
        <Redacted width={Math.round(44 * u)} height={bar} tone={col} strength={0.45} />
      </div>
      {/* Machine-readable strip: one long bar */}
      <div style={{ position: 'absolute', left: Math.round(6 * u), bottom: Math.round(5 * u) }}>
        <Redacted width={Math.round(86 * u)} height={Math.max(6, Math.round(4.5 * u))} tone="muted" strength={0.5} />
      </div>
      {/* Stolen: amber corner mark */}
      {st > 0.01 ? (
        <div style={{ position: 'absolute', right: Math.round(4 * u), top: Math.round(2 * u), opacity: st }}>
          <Icon name="alert" size={Math.round(10 * u)} color={C.amber} strokeWidth={2.4} />
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
