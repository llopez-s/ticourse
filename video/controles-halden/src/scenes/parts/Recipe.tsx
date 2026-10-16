import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';

/** The recipe's box in its own units: height = width × RECIPE_RATIO. */
export const RECIPE_RATIO = 0.8;

/**
 * The video's one image for «compensating control»: a mixing bowl with an egg slot above it. Textless, flat SVG,
 * no `<defs>` (so it can sit next to any other part), readable from icon size (~120 px) up to ~400 px.
 *
 * The three combinations:
 * - `egg="missing"` + `substitute` — the compensating control (s06, s08 rule 3): the egg slot is an empty dashed
 *   outline crossed out in amber; a spoon of something else (emerald) pours into the bowl and a dashed thread runs
 *   from the empty slot to the spoon («it goes in its place»); the batter takes an emerald tint (the binder does the
 *   egg's job: «ligar la masa»).
 * - `egg="present"` + `substitute` — «tienes huevo y además echas otra cosa: no sustituyes nada»: the egg sits in its
 *   slot (solid), the spoon still pours, but there is no thread from slot to spoon (nothing is replaced).
 * - `egg="present"` alone — the plain recipe.
 *   (`egg="missing"` without `substitute` = the gap nobody covered: crossed slot, plain batter.)
 *
 * Reveal (frames local to the caller's Sequence): with `at`, the bowl fades in at `at`, the slot's state (cross or
 * egg) lands at `at + 8`, the spoon swings in at `at + 16` and the thread / tint at `at + 26`. Without `at` it is
 * drawn complete (icon use). `frame` defaults to `useCurrentFrame()`. `glow` (0–1) adds a soft emerald halo.
 */
export function Recipe({
  width = 260,
  egg,
  substitute = false,
  frame: frameProp,
  at,
  glow = 0,
}: {
  width?: number;
  egg: 'missing' | 'present';
  substitute?: boolean;
  frame?: number;
  at?: number;
  glow?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const p = (offset: number, dur: number) => (at === undefined ? 1 : progress(frame, at + offset, dur, EASE.out));
  const bowlIn = p(0, 14);
  const slotIn = p(8, 12);
  const spoonIn = substitute ? p(16, 16) : 0;
  const threadIn = substitute && egg === 'missing' ? p(26, 16) : 0;
  const tint = substitute ? p(26, 18) : 0;

  // Everything is drawn in a 300×240 box and scaled to `width`.
  const W = 300;
  const H = W * RECIPE_RATIO;
  const h = Math.round(width * RECIPE_RATIO);
  const sw = 4; // base stroke in box units (≈ 3.5 px at 260 px wide)

  // Bowl geometry.
  const rimY = 128;
  const rimRx = 112;
  const rimRy = 20;
  const bowlCx = 150;
  const bowlBottom = 222;
  const bowlPath = `M ${bowlCx - rimRx} ${rimY} C ${bowlCx - rimRx + 6} ${bowlBottom - 8}, ${bowlCx + rimRx - 6} ${bowlBottom - 8}, ${bowlCx + rimRx} ${rimY} Z`;

  // Egg slot (top left) and spoon (top right).
  const eggX = 82;
  const eggY = 56;
  const eggRx = 25;
  const eggRy = 32;
  const spoonX = 222;
  const spoonY = 52;
  const swing = (1 - spoonIn) * 26; // degrees: the spoon swings down into its pouring angle

  const batter = mixHex('#c8b98f', C.emerald, 0.55 * tint);

  return (
    <svg width={width} height={h} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {glow > 0.01 ? <ellipse cx={bowlCx} cy={rimY + 20} rx={150} ry={100} fill={alpha(C.emerald, 0.1 * glow)} /> : null}

      <g opacity={bowlIn} transform={`translate(0 ${(1 - bowlIn) * 10})`}>
        {/* bowl body, batter at the rim, rim edge */}
        <path d={bowlPath} fill={C.ink700} stroke={alpha(C.text, 0.55)} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx={bowlCx} cy={rimY} rx={rimRx - 8} ry={rimRy - 6} fill={batter} opacity={0.9} />
        <ellipse cx={bowlCx} cy={rimY} rx={rimRx} ry={rimRy} fill="none" stroke={alpha(C.text, 0.7)} strokeWidth={sw} />
        {/* a light band on the bowl so it reads as round */}
        <path d={`M ${bowlCx - 78} ${rimY + 36} C ${bowlCx - 50} ${rimY + 62}, ${bowlCx + 50} ${rimY + 62}, ${bowlCx + 78} ${rimY + 36}`} fill="none" stroke={alpha(C.text, 0.18)} strokeWidth={sw * 1.6} strokeLinecap="round" />
      </g>

      {/* egg slot */}
      <g opacity={bowlIn}>
        {egg === 'present' ? (
          <g opacity={slotIn} transform={`translate(0 ${(1 - slotIn) * -8})`}>
            <ellipse cx={eggX} cy={eggY} rx={eggRx} ry={eggRy} fill="#f1ead8" stroke={alpha('#000000', 0.35)} strokeWidth={sw * 0.8} />
            <ellipse cx={eggX - 8} cy={eggY - 12} rx={6} ry={9} fill={alpha('#ffffff', 0.55)} />
          </g>
        ) : (
          <>
            <ellipse cx={eggX} cy={eggY} rx={eggRx} ry={eggRy} fill="none" stroke={alpha(C.text, 0.45)} strokeWidth={sw * 0.8} strokeDasharray="7 6" />
            {slotIn > 0.01 ? (
              <g stroke={C.amber} strokeWidth={sw * 1.4} strokeLinecap="round">
                <line x1={eggX - 30} y1={eggY - 34} x2={eggX - 30 + 60 * slotIn} y2={eggY - 34 + 68 * slotIn} />
                <line x1={eggX + 30} y1={eggY - 34} x2={eggX + 30 - 60 * slotIn} y2={eggY - 34 + 68 * slotIn} />
              </g>
            ) : null}
          </>
        )}
      </g>

      {/* the thread: the substitute goes in the egg's place (only when the egg is missing) */}
      {threadIn > 0.01 ? (
        <path
          d={`M ${eggX + eggRx + 10} ${eggY - 6} Q ${(eggX + spoonX) / 2} ${eggY - 46}, ${spoonX - 40} ${spoonY - 12}`}
          fill="none"
          stroke={alpha(C.emerald, 0.85)}
          strokeWidth={sw * 0.9}
          strokeDasharray="8 7"
          strokeLinecap="round"
          opacity={threadIn}
        />
      ) : null}

      {/* the substitute: a spoon of something else, pouring into the bowl */}
      {spoonIn > 0.01 ? (
        <g opacity={spoonIn} transform={`rotate(${swing} ${spoonX + 30} ${spoonY - 30})`}>
          {/* handle */}
          <line x1={spoonX + 10} y1={spoonY - 8} x2={spoonX + 62} y2={spoonY - 44} stroke={alpha(C.text, 0.8)} strokeWidth={sw * 1.6} strokeLinecap="round" />
          {/* bowl of the spoon with its dollop */}
          <ellipse cx={spoonX - 6} cy={spoonY + 6} rx={24} ry={15} transform={`rotate(-34 ${spoonX - 6} ${spoonY + 6})`} fill={alpha(C.text, 0.8)} />
          <ellipse cx={spoonX - 9} cy={spoonY + 4} rx={17} ry={10} transform={`rotate(-34 ${spoonX - 9} ${spoonY + 4})`} fill={C.emerald} />
          {/* the drip into the batter */}
          <path
            d={`M ${spoonX - 24} ${spoonY + 18} C ${spoonX - 30} ${spoonY + 40}, ${spoonX - 34} ${spoonY + 56}, ${spoonX - 36} ${rimY - 6}`}
            fill="none"
            stroke={C.emerald}
            strokeWidth={sw * 1.5}
            strokeLinecap="round"
            opacity={tint}
          />
        </g>
      ) : null}
    </svg>
  );
}

/** Linear mix of two #rrggbb colours (t 0–1). */
function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa
    .map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0'))
    .join('')}`;
}
