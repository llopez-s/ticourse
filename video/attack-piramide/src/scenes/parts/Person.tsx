import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui/Focus';
import { STEEL } from './Pyramid';

/**
 * Concept 2's image: «reconocer a alguien por la ropa, por el acento o por cómo
 * anda». A flat walking figure with three things you can recognise:
 *   la ropa   — the coat (amber; `swapClothes` turns it another colour)
 *   el acento — a speech bubble with sound waves (steel; `acentoDisguised`
 *               draws it half faded and dashed)
 *   cómo anda — footprints trailing behind the feet (emerald)
 *
 * With `labels` (default), a legend column sits right of the figure: one row
 * per trait, its mini icon and its name, placed at `levels` (fractions of
 * `height`) so the rows line up with the Pyramid's top / middle / base when
 * both share a height and a top: «cómo anda» top, «el acento» middle,
 * «la ropa» bottom. The figure and its row are tied by colour, not by lines.
 * Without labels the figure fills the box (small art, e.g. a recap card).
 *
 * `focus` (0–1 each) lights a trait on the figure and in the legend; the other
 * traits step back while any is in focus. `show` (0–1) fades/rises it in.
 */

export type PersonTrait = 'ropa' | 'acento' | 'andar';

const COAT = C.amber;
const COAT_SWAPPED = '#fb923c';
const SKIN = '#cbd5e1';
const TROUSERS = '#475569';

/** Row centres (fractions of height) that match a six-rung Pyramid: TTPs, the middle, Hash values. */
export const PERSON_LEVELS: Record<PersonTrait, number> = { andar: 1 / 12, acento: 0.5, ropa: 11 / 12 };

const LABEL: Record<PersonTrait, string> = { andar: 'cómo anda', acento: 'el acento', ropa: 'la ropa' };

function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((o) => parseInt(a.slice(o, o + 2), 16));
  const pb = [1, 3, 5].map((o) => parseInt(b.slice(o, o + 2), 16));
  return `#${pa.map((v, j) => Math.round(v + (pb[j] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

export function Person({
  width,
  height: heightProp,
  frame: frameProp,
  show = 1,
  labels = true,
  levels = PERSON_LEVELS,
  focus,
  swapClothes = 0,
  acentoDisguised = 0,
  labelSize = 40,
}: {
  width: number;
  /** Default: a figure-only box is 2.3× as tall as wide; with labels, 2× the width. */
  height?: number;
  frame?: number;
  show?: number;
  labels?: boolean;
  levels?: Record<PersonTrait, number>;
  focus?: { ropa?: number; acento?: number; andar?: number };
  swapClothes?: number;
  acentoDisguised?: number;
  /** Largest legend text (shrunk to fit the column). */
  labelSize?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const height = heightProp ?? Math.round(width * (labels ? 2 : 2.3));
  const f = { ropa: clamp01(focus?.ropa ?? 0), acento: clamp01(focus?.acento ?? 0), andar: clamp01(focus?.andar ?? 0) };
  const any = Math.max(f.ropa, f.acento, f.andar);
  const dimOf = (t: PersonTrait) => any * (1 - f[t]);
  const coat = mixHex(COAT, COAT_SWAPPED, swapClothes);
  const breath = 0.8 + 0.2 * Math.sin((frame / 30) * Math.PI * 0.8);
  const disguised = clamp01(acentoDisguised);

  // Figure column.
  const figW = labels ? Math.min(150, width * 0.36) : width;
  const legendX = figW + Math.max(10, width * 0.045);
  const legendW = width - legendX;

  // The figure keeps its 100×240 aspect inside the column, feet on the bottom.
  const vbW = 100;
  const vbH = 240;
  const scale = Math.min(figW / vbW, (labels ? height * 0.92 : height) / vbH);
  const svgW = vbW * scale;
  const svgH = vbH * scale;

  const traitOpacity = (t: PersonTrait, base = 1) => base * (1 - 0.55 * dimOf(t));
  const glow = (t: PersonTrait, color: string) =>
    f[t] > 0.02 ? `drop-shadow(0 0 ${(4 + 6 * f[t]) * breath}px ${alpha(color, 0.85 * f[t])})` : undefined;

  const prints = [
    { x: 8, y: 233, r: -8 },
    { x: 24, y: 226, r: 6 },
    { x: 40, y: 234, r: -8 },
  ];

  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, opacity: clamp01(show), transform: `translateY(${(1 - clamp01(show)) * 18}px)` }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${vbW} ${vbH}`}
        style={{ position: 'absolute', left: (figW - svgW) / 2, top: height - svgH, overflow: 'visible' }}
      >
        {/* cómo anda: footprints behind the feet */}
        <g opacity={traitOpacity('andar', 0.55 + 0.45 * Math.max(f.andar, any === 0 ? 0.4 : 0))} style={{ filter: glow('andar', C.emerald) }}>
          {prints.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
              <ellipse cx={0} cy={0} rx={7.5} ry={3.8} fill={C.emerald} />
              <circle cx={9.2} cy={-1.6} r={1.7} fill={C.emerald} />
            </g>
          ))}
        </g>

        {/* legs and shoes (walking pose) */}
        <g strokeLinecap="round" opacity={1 - 0.35 * any}>
          <line x1={53} y1={146} x2={40} y2={208} stroke={TROUSERS} strokeWidth={11} />
          <line x1={64} y1={146} x2={78} y2={206} stroke={TROUSERS} strokeWidth={11} />
          <ellipse cx={43} cy={213} rx={9} ry={4.5} fill="#1e293b" stroke="#64748b" strokeWidth={1.2} />
          <ellipse cx={83} cy={210} rx={9} ry={4.5} fill="#1e293b" stroke="#64748b" strokeWidth={1.2} />
        </g>

        {/* la ropa: the coat with its sleeves */}
        <g opacity={traitOpacity('ropa')} style={{ filter: glow('ropa', coat) }}>
          <line x1={47} y1={88} x2={35} y2={128} stroke={mixHex(coat, '#000000', 0.18)} strokeWidth={9} strokeLinecap="round" />
          <path d="M44 80 Q58 72 72 80 L80 150 Q58 157 36 150 Z" fill={coat} stroke={mixHex(coat, '#000000', 0.35)} strokeWidth={1.5} />
          <path d="M53 78 L58 96 L63 78" fill="none" stroke={mixHex(coat, '#000000', 0.4)} strokeWidth={2} strokeLinejoin="round" />
          <line x1={58} y1={98} x2={58} y2={148} stroke={mixHex(coat, '#000000', 0.3)} strokeWidth={1.5} />
          <line x1={70} y1={88} x2={83} y2={124} stroke={mixHex(coat, '#000000', 0.12)} strokeWidth={9} strokeLinecap="round" />
          <circle cx={35} cy={132} r={4.2} fill={SKIN} />
          <circle cx={84} cy={128} r={4.2} fill={SKIN} />
        </g>

        {/* head */}
        <g opacity={1 - 0.35 * any}>
          <circle cx={59} cy={62} r={13} fill={SKIN} />
          <path d="M46 58 Q50 44 62 47 Q72 49 72 60 Q66 52 56 55 Z" fill="#334155" />
        </g>

        {/* el acento: a speech bubble with sound waves */}
        <g
          opacity={traitOpacity('acento', 1 - 0.5 * disguised)}
          style={{ filter: glow('acento', STEEL) }}
        >
          <path
            d="M34 6 H94 Q98 6 98 10 V34 Q98 38 94 38 H74 L66 47 L66 38 H34 Q30 38 30 34 V10 Q30 6 34 6 Z"
            fill={alpha(STEEL, 0.16 + 0.14 * f.acento)}
            stroke={STEEL}
            strokeWidth={2}
            strokeDasharray={disguised > 0.05 ? `${6 - 2 * disguised} ${2 + 4 * disguised}` : undefined}
            strokeLinejoin="round"
          />
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M${46 + k * 11} ${16 - k * 1.5} Q${52 + k * 11} 22 ${46 + k * 11} ${28 + k * 1.5}`}
              fill="none"
              stroke={STEEL}
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={1 - disguised * (0.3 + 0.25 * k)}
            />
          ))}
        </g>
      </svg>

      {labels
        ? (['andar', 'acento', 'ropa'] as PersonTrait[]).map((t) => {
            const color = t === 'andar' ? C.emerald : t === 'acento' ? STEEL : coat;
            const y = levels[t] * height;
            const icon = 42;
            const textRoom = legendW - icon - 14;
            const size = Math.min(labelSize, Math.floor(textRoom / (0.56 * LABEL[t].length)));
            return (
              <div
                key={t}
                style={{
                  position: 'absolute',
                  left: legendX,
                  top: y,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  whiteSpace: 'nowrap',
                  opacity: traitOpacity(t),
                }}
              >
                <TraitIcon trait={t} color={color} size={icon} lit={f[t]} disguised={t === 'acento' ? disguised : 0} />
                <span style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.3, color: f[t] > 0.3 ? color : mixHex(color, '#f8fafc', 0.35) }}>{LABEL[t]}</span>
              </div>
            );
          })
        : null}
    </div>
  );
}

/** Small icon for a legend row. */
function TraitIcon({ trait, color, size, lit, disguised }: { trait: PersonTrait; color: string; size: number; lit: number; disguised: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: alpha(color, 0.1 + 0.18 * lit),
        border: `2px solid ${alpha(color, 0.45 + 0.5 * lit)}`,
        boxShadow: lit > 0.02 ? `0 0 ${18 * lit}px ${alpha(color, 0.5 * lit)}` : undefined,
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 32 32">
        {trait === 'andar' ? (
          <g fill={color}>
            <ellipse cx={10} cy={22} rx={4.5} ry={7} transform="rotate(-10 10 22)" />
            <ellipse cx={22} cy={11} rx={4.5} ry={7} transform="rotate(10 22 11)" />
          </g>
        ) : trait === 'acento' ? (
          <g opacity={1 - 0.45 * disguised}>
            <path
              d="M4 5 H28 V21 H15 L9 27 V21 H4 Z"
              fill="none"
              stroke={color}
              strokeWidth={2.4}
              strokeLinejoin="round"
              strokeDasharray={disguised > 0.05 ? '4 3' : undefined}
            />
            <path d="M12 10 Q15 13 12 16 M17 9 Q21 13 17 17" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
          </g>
        ) : (
          <path d="M10 6 Q16 3 22 6 L27 13 L23 15 L23 28 H9 L9 15 L5 13 Z" fill={color} stroke={mixHex(color, '#000000', 0.35)} strokeWidth={1.2} strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
