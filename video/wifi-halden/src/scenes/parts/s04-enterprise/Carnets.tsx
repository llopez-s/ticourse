import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { CarnetGlyph } from '../Glyphs';
import { CARNET, LOST, TABLET, TRUNK_Y } from './layout';

/**
 * Enterprise mode over the same tablets: each one shows ITS OWN carné (emerald), a line takes them
 * to the RADIUS server (sky: infrastructure) and the server answers each one on its own.
 * Draws inside the scene's <svg> (stage-local units).
 *
 *   rise[i]     0–1: tablet i's carné comes up out of it
 *   seal        0–1: the carnés' seal (their certificate)
 *   trunk       the line from the server (x = from) along the carnés
 *   verdict[i]  0–1: the server lets tablet i in (an emerald tick where its carné meets the line)
 *   revoked     0–1: the lost tablet's carné is annulled (rose strike)
 *   reject      0–1: the server turns the lost tablet away (its tick becomes a rose cross)
 *   calm        0–1: «las demás ni se enteran»: the others' ticks glow
 */
const CARD_TOP = CARNET.y - CARNET.h / 2;
/** The lost tablet leans to the right: its carné follows it a little. */
const LOST_DX = 10;

export function Carnets({
  rise,
  seal = 1,
  trunk,
  verdict,
  revoked = 0,
  reject = 0,
  calm = 0,
  glow = 0,
}: {
  rise: readonly number[];
  seal?: number;
  trunk: { from: number; draw: number };
  verdict: readonly number[];
  revoked?: number;
  reject?: number;
  calm?: number;
  /** 0–1: every carné in force glows (the scene's last word is theirs). */
  glow?: number;
}) {
  const xs = TABLET.xs.map((x, i) => (i === LOST ? x + LOST_DX : x));
  const end = xs[xs.length - 1];
  const reach = trunk.from + (end - trunk.from) * clamp01(trunk.draw);
  const rj = clamp01(reject);
  const rv = clamp01(revoked);
  const ca = clamp01(calm);
  return (
    <g>
      {trunk.draw > 0.001 ? (
        <g>
          <line x1={trunk.from} y1={TRUNK_Y} x2={reach} y2={TRUNK_Y} stroke={alpha(C.sky, 0.7)} strokeWidth={4} strokeLinecap="round" />
          {xs.map((x, i) => {
            const on = clamp01((reach - x + 14) / 14);
            const bad = i === LOST ? rj : 0;
            return on > 0.001 ? (
              <line key={x} x1={x} y1={TRUNK_Y} x2={x} y2={mix(TRUNK_Y, CARD_TOP - 4, on)} stroke={bad > 0.5 ? alpha(C.rose, 0.9) : alpha(C.sky, 0.7)} strokeWidth={4} strokeLinecap="round" strokeDasharray={bad > 0.5 ? '5 7' : undefined} />
            ) : null;
          })}
        </g>
      ) : null}
      {xs.map((x, i) => {
        const r = clamp01(rise[i] ?? 0);
        if (r <= 0.001) return null;
        const isLost = i === LOST;
        return (
          <CarnetGlyph
            key={x}
            x={x}
            y={mix(TABLET.y - 20, CARNET.y, r)}
            h={CARNET.h * (0.7 + 0.3 * r)}
            opacity={r}
            seal={seal}
            revoked={isLost ? rv : 0}
            glow={isLost ? 0.5 * rv * (1 - rj) : Math.max(0.5 * ca, 0.6 * clamp01(glow))}
          />
        );
      })}
      {xs.map((x, i) => {
        const v = clamp01(verdict[i] ?? 0);
        if (v <= 0.001) return null;
        const bad = i === LOST ? rj : 0;
        const tone = bad > 0.5 ? C.rose : C.emerald;
        const lit = i === LOST ? bad : ca;
        return (
          <g key={x} transform={`translate(${x} ${TRUNK_Y}) scale(${0.6 + 0.4 * v + 0.12 * lit})`} opacity={v} style={lit > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(10 * lit)}px ${alpha(tone, 0.8 * lit)})` } : undefined}>
            <circle r={17} fill={C.ink900} stroke={tone} strokeWidth={4} />
            {bad > 0.5 ? (
              <path d="M -7 -7 L 7 7 M 7 -7 L -7 7" fill="none" stroke={tone} strokeWidth={4.5} strokeLinecap="round" />
            ) : (
              <path d="M -8 0 L -2 7 L 9 -7" fill="none" stroke={tone} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        );
      })}
    </g>
  );
}
