import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Stopwatch of s01: a dial with an arc that fills as the seconds run and a big readout. `seconds` is shown as
 * «0,0 s»…«2,9 s»; at exactly `stopAt` (3) it reads «3 s» in emerald (`stopped`). Rewinding is just a falling
 * `seconds` value (`rewind` 0–1 adds a counter-clockwise arrow badge). Not positioned.
 */
export function Stopwatch({
  seconds,
  stopAt = 3,
  size = 230,
  rewind = 0,
  style,
}: {
  seconds: number;
  stopAt?: number;
  size?: number;
  rewind?: number;
  style?: CSSProperties;
}) {
  const stopped = seconds >= stopAt - 1e-6;
  const color = stopped ? C.emerald : C.cyan;
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const frac = clamp01(seconds / stopAt);
  const rw = clamp01(rewind);
  const readout = stopped ? `${stopAt} s` : `${seconds.toFixed(1).replace('.', ',')} s`;
  return (
    <div style={{ position: 'relative', width: size, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* crown */}
        <rect x={size / 2 - 16} y={-2} width={32} height={14} rx={5} fill={C.ink600} />
        <circle cx={size / 2} cy={size / 2} r={r} fill={C.ink900} stroke={C.ink700} strokeWidth={12} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${circ * frac} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: stopped ? `drop-shadow(0 0 12px ${alpha(C.emerald, 0.6)})` : undefined }}
        />
        <text
          x={size / 2}
          y={size / 2 + size * 0.1}
          textAnchor="middle"
          fontFamily={FONT.mono}
          fontWeight={800}
          fontSize={size * (stopped ? 0.27 : 0.22)}
          fill={C.textStrong}
        >
          {readout}
        </text>
      </svg>
      {rw > 0.01 ? (
        <svg width={56} height={56} viewBox="0 0 24 24" style={{ position: 'absolute', right: -14, top: size * 0.12, opacity: rw }} fill="none" stroke={C.amber} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 4 12 a 8 8 0 1 0 3 -6.2 M 4 4 v 5 h 5" />
        </svg>
      ) : null}
    </div>
  );
}
