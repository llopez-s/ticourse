import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { PadlockGlyph, STEEL, TabletGlyph } from '../Glyphs';
import { LOST, RAIL_Y, TABLET } from './layout';

/**
 * The crane tablets (right column) and the ONE shared key that reaches them all.
 * Draws inside the scene's <svg> (stage-local units).
 *
 *   shared[i]   0–1: the same combination padlock on tablet i's screen (amber: one key, everybody's)
 *   rail        the amber rail from the sign / the keypad to every tablet: one way in for all
 *   lost        0–1: the last tablet «se pierde» (it tilts, greys and gets a dashed outline; it
 *               still carries the key: that is the problem)
 *   change[i]   0–1: the key has to be changed on tablet i (an amber ring that turns)
 */
const TOP = TABLET.y - TABLET.h / 2;
const HALF_W = (TABLET.h * 110) / 150 / 2;

export function Fleet({
  show = 1,
  shared,
  rail,
  lost = 0,
  change,
  dim = 0,
}: {
  show?: number;
  shared: readonly number[];
  rail: { from: number; draw: number; opacity: number };
  lost?: number;
  change: readonly number[];
  /** 0–1: the shared key steps back (enterprise mode takes over). */
  dim?: number;
}) {
  const s = clamp01(show);
  const lo = clamp01(lost);
  const keyOn = 1 - clamp01(dim);
  const xs = TABLET.xs;
  const end = xs[xs.length - 1];
  const len = end - rail.from;
  const reach = rail.from + len * clamp01(rail.draw);
  const ro = clamp01(rail.opacity);
  return (
    <g opacity={s}>
      {/* the rail: one line for everybody */}
      {ro > 0.001 && rail.draw > 0.001 ? (
        <g opacity={ro}>
          <line x1={rail.from} y1={RAIL_Y} x2={reach} y2={RAIL_Y} stroke={alpha(C.amber, 0.85)} strokeWidth={5} strokeLinecap="round" />
          {xs.map((x) => {
            const on = clamp01((reach - x + 14) / 14);
            return on > 0.001 ? <line key={x} x1={x} y1={RAIL_Y} x2={x} y2={mix(RAIL_Y, TOP - 6, on)} stroke={alpha(C.amber, 0.85)} strokeWidth={5} strokeLinecap="round" /> : null;
          })}
        </g>
      ) : null}
      {xs.map((x, i) => {
        const isLost = i === LOST;
        const k = clamp01(shared[i] ?? 0) * keyOn;
        const ch = clamp01(change[i] ?? 0) * keyOn;
        const gone = isLost ? lo : 0;
        return (
          <g key={x} transform={`rotate(${9 * gone} ${x} ${TABLET.y + TABLET.h / 2})`}>
            <g opacity={1 - 0.4 * gone}>
              <TabletGlyph x={x} y={TABLET.y} h={TABLET.h} tone={gone > 0.5 ? STEEL.light : C.cyan} screen={0.35 + 0.25 * k}>
                {k > 0.01 ? (
                  <g opacity={k} transform={`scale(${0.8 + 0.2 * k})`}>
                    <PadlockGlyph x={0} y={-14} h={74} tone={C.amber} />
                  </g>
                ) : null}
              </TabletGlyph>
            </g>
            {/* lost: hypothetical, so a dashed grey outline */}
            {gone > 0.01 ? (
              <rect x={x - HALF_W - 10} y={TOP - 10} width={2 * HALF_W + 20} height={TABLET.h + 20} rx={22} fill="none" stroke={alpha(STEEL.light, 0.9 * gone)} strokeWidth={4} strokeDasharray="12 10" />
            ) : null}
            {/* the key is changed here too */}
            {ch > 0.01 ? <ChangeRing x={x} y={TABLET.y - 12} r={HALF_W + 2} t={ch} /> : null}
          </g>
        );
      })}
    </g>
  );
}

/** An amber ring with an arrow head that turns once as `t` goes from 0 to 1, then rests. */
function ChangeRing({ x, y, r, t }: { x: number; y: number; r: number; t: number }) {
  const sweep = 300 * t;
  const a0 = -90 + 220 * (1 - t);
  const pt = (deg: number) => ({ px: x + r * Math.cos((deg * Math.PI) / 180), py: y + r * Math.sin((deg * Math.PI) / 180) });
  const a = pt(a0);
  const b = pt(a0 + sweep);
  const head = a0 + sweep;
  return (
    <g opacity={Math.min(1, t * 3)}>
      <circle cx={x} cy={y} r={r} fill={alpha(C.amber, 0.08)} stroke="none" />
      <path d={`M ${a.px} ${a.py} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${b.px} ${b.py}`} fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
      <path d="M -11 -8 L 5 0 L -11 8 Z" fill={C.amber} transform={`translate(${b.px} ${b.py}) rotate(${head + 90})`} />
    </g>
  );
}
