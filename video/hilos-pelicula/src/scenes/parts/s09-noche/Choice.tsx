import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * The two answers to «¿Esperas o buscas ya?»: the bad one gets a drawn strike and its cost underneath (amber:
 * a warning); the good one is MARKED with a cyan ring that closes around it — never a tick (there is no result in
 * this video, and the marks of s09 must not read as one).
 *
 * - `show`   0–1 both rows appear.
 * - `strike` 0–1 the strike line draws across the first row; `cost` 0–1 its note appears.
 * - `mark`   0–1 the ring closes around the second row (and it fills cyan).
 */
export function Choice({
  wait,
  cost,
  hunt,
  show,
  strike,
  costIn,
  mark,
  width,
}: {
  /** The waiting option, in two hard lines. */
  wait: readonly [string, string];
  cost: string;
  hunt: string;
  show: number;
  strike: number;
  costIn: number;
  mark: number;
  width: number;
}) {
  const s = clamp01(show);
  if (s <= 0) return null;
  const st = clamp01(strike);
  const m = clamp01(mark);
  const ROW_H = 132;
  const HUNT_H = 96;
  const HUNT_W = 340;
  return (
    <div style={{ position: 'relative', width, fontFamily: FONT.sans, opacity: s, transform: `translateY(${(1 - s) * 18}px)` }}>
      {/* Option 1: wait — struck. */}
      <div
        style={{
          position: 'relative',
          width,
          height: ROW_H,
          boxSizing: 'border-box',
          padding: '16px 28px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: alpha(C.ink850, 0.9),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: 1 - 0.35 * st,
        }}
      >
        {wait.map((l, k) => (
          <div key={k} style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: st > 0.5 ? C.muted : C.text, whiteSpace: 'nowrap' }}>
            {l}
          </div>
        ))}
        <svg width={width} height={ROW_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {[0, 1].map((k) => {
            const p = clamp01(st * 2 - k * 0.6);
            if (p <= 0) return null;
            const y = 16 + 23 + k * 46;
            const x0 = 22;
            const x1 = width - 40 - k * 220;
            return <line key={k} x1={x0} y1={y + 2} x2={x0 + (x1 - x0) * p} y2={y - 2} stroke={C.amber} strokeWidth={5} strokeLinecap="round" />;
          })}
        </svg>
      </div>
      <div
        style={{
          marginTop: 12,
          marginLeft: 28,
          fontSize: 34,
          fontWeight: 700,
          color: '#fcd34d',
          whiteSpace: 'nowrap',
          opacity: clamp01(costIn),
          transform: `translateY(${(1 - clamp01(costIn)) * 10}px)`,
        }}
      >
        {cost}
      </div>
      {/* Option 2: hunt — marked with a ring. */}
      <div style={{ position: 'relative', marginTop: 34, height: HUNT_H }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HUNT_W,
            height: HUNT_H,
            boxSizing: 'border-box',
            justifyContent: 'center',
            borderRadius: RADIUS.pill,
            border: `3px solid ${alpha(C.cyan, 0.4 + 0.6 * m)}`,
            background: m > 0.5 ? alpha(C.cyan, 0.22 * m) : alpha(C.ink850, 0.9),
            boxShadow: m > 0.02 ? `0 0 ${Math.round(36 * m)}px ${alpha(C.cyan, 0.35 * m)}` : undefined,
            display: 'flex',
            alignItems: 'center',
            fontSize: 52,
            fontWeight: 850,
            color: m > 0.5 ? C.textStrong : C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {hunt}
        </div>
        <MarkRing m={m} w={HUNT_W} h={HUNT_H} />
      </div>
    </div>
  );
}

/** A hand-drawn ring that closes around the marked answer (stroke drawn with pathLength). */
function MarkRing({ m, w, h }: { m: number; w: number; h: number }) {
  if (m <= 0) return null;
  const pad = 14;
  const rx = w / 2 + pad;
  const ry = h / 2 + pad;
  const cx = w / 2;
  const cy = h / 2;
  // A slightly open ellipse that overshoots, like a marker circle.
  const d = `M ${cx - rx * 0.2} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx - rx * 0.62} ${cy - ry * 0.78}`;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${m} 1`} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.6)})` }} />
    </svg>
  );
}
