import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

export const MAP_W = 800;
export const MAP_H = 380;

/** Street names of the home neighbourhood: course topics you have walked, placed on their streets. */
const STREETS = [
  { t: 'ICD 203', x: 120, y: 90 },
  { t: 'ACH', x: 520, y: 90 },
  { t: 'Kill chain', x: 90, y: 190 },
  { t: 'Diamond', x: 500, y: 190 },
  { t: 'TLP', x: 330, y: 290 },
  { t: 'Pyramid', x: 600, y: 290 },
] as const;

const panel = (accent: string): CSSProperties => ({
  position: 'relative',
  width: MAP_W,
  height: MAP_H,
  borderRadius: 24,
  overflow: 'hidden',
  background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
  border: `2px solid ${alpha(accent, 0.5)}`,
  boxShadow: `0 24px 50px ${alpha('#000000', 0.4)}`,
});

/**
 * A city map. `kind='foreign'`: a city you do not know — slanted grey streets, no names, question
 * marks — and `cross` (0–1) strikes it out with two rose lines. `kind='home'`: your own
 * neighbourhood — a clean grid of streets with the names of course topics, lit windows, and a
 * «tú» pin; `lit` (0–1) lights the streets and `pins` (0–1) drops the little check marks on them.
 */
export function MapArt({ kind, cross = 0, lit = 0, pins = 0, style }: { kind: 'foreign' | 'home'; cross?: number; lit?: number; pins?: number; style?: CSSProperties }) {
  if (kind === 'foreign') {
    return (
      <div style={{ ...panel(C.muted), ...style }}>
        <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <g stroke={C.ink600} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.9}>
            <path d="M-20 70 L260 140 L520 90 L840 170" />
            <path d="M-20 250 L200 210 L430 300 L840 240" />
            <path d="M120 -20 L180 150 L140 400" />
            <path d="M360 -20 L330 130 L440 300 L400 400" />
            <path d="M600 -20 L560 110 L650 250 L700 400" />
            <path d="M-20 340 L280 380" />
            <path d="M260 140 Q320 210 430 300" />
            <path d="M520 90 Q580 170 650 250" />
          </g>
          {[
            [60, 130],
            [240, 60],
            [470, 160],
            [700, 100],
            [250, 290],
            [560, 310],
            [730, 300],
          ].map(([x, y]) => (
            <text key={`${x}${y}`} x={x} y={y} fontFamily={FONT.sans} fontSize={44} fontWeight={800} fill={alpha(C.muted, 0.55)} textAnchor="middle">
              ?
            </text>
          ))}
        </svg>
        {cross > 0.01 ? (
          <svg width={MAP_W} height={MAP_H} style={{ position: 'absolute', inset: 0 }} aria-hidden>
            <path d={`M70 50 L${70 + 660 * cross} ${50 + 280 * cross}`} stroke={C.rose} strokeWidth={14} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.7)})` }} />
            <path d={`M${MAP_W - 70} 50 L${MAP_W - 70 - 660 * cross} ${50 + 280 * cross}`} stroke={C.rose} strokeWidth={14} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.7)})` }} />
          </svg>
        ) : null}
      </div>
    );
  }
  const streetColor = lit > 0.05 ? alpha(C.cyan, 0.35 + 0.4 * lit) : C.ink600;
  const hs = [90, 190, 290];
  const vs = [160, 400, 640];
  return (
    <div style={{ ...panel(C.cyan), ...style }}>
      <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        {/* blocks */}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            const x0 = c === 0 ? 10 : vs[c - 1] + 22;
            const x1 = c === 3 ? MAP_W - 10 : vs[c] - 22;
            const y0 = r === 0 ? 10 : hs[r - 1] + 22;
            const y1 = r === 3 ? MAP_H - 10 : hs[r] - 22;
            if (x1 - x0 < 40 || y1 - y0 < 30) return null;
            return <rect key={`${r}${c}`} x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={10} fill={alpha(C.cyan, 0.07)} stroke={alpha(C.cyan, 0.18)} strokeWidth={2} />;
          }),
        )}
        {/* streets */}
        <g stroke={streetColor} strokeWidth={18} strokeLinecap="round">
          {hs.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={MAP_W} y2={y} />
          ))}
          {vs.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={MAP_H} />
          ))}
        </g>
        {/* lit windows */}
        {[
          [60, 40],
          [260, 40],
          [520, 40],
          [720, 40],
          [60, 140],
          [260, 240],
          [520, 140],
          [720, 330],
          [260, 330],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width={14} height={14} rx={3} fill={alpha(C.amber, 0.7)} />
        ))}
      </svg>
      {STREETS.map((s) => (
        <span
          key={s.t}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y - 21,
            padding: '2px 14px 4px',
            borderRadius: 999,
            background: alpha(C.ink950, 0.9),
            border: `2px solid ${alpha(C.cyan, 0.8)}`,
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 750,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
          }}
        >
          {s.t}
        </span>
      ))}
      {/* you are here */}
      <div style={{ position: 'absolute', left: 250, top: 120, width: 62, height: 62, borderRadius: 31, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.2), border: `3px solid ${C.emerald}`, boxShadow: `0 0 24px ${alpha(C.emerald, 0.5)}` }}>
        <Icon name="user" size={34} color={C.emerald} strokeWidth={2.4} />
      </div>
      {pins > 0.02
        ? [
            [330, 70],
            [610, 70],
            [560, 170],
            [160, 170],
            [470, 270],
          ].map(([x, y], i) => {
            const p = Math.max(0, Math.min(1, pins * 5 - i));
            return (
              <div key={`${x}${y}`} style={{ position: 'absolute', left: x, top: y - 44, opacity: p, transform: `translateY(${(1 - p) * -14}px)` }}>
                <Icon name="check" size={40} color={C.emerald} strokeWidth={3.6} />
              </div>
            );
          })
        : null}
    </div>
  );
}
