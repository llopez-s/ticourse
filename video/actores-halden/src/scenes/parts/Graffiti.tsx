import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The image's own units (it scales with `width`). */
export const GRAFFITI = { w: 1600, h: 300 } as const;

/** The mote: an unreadable tag, a loop and a flourish — never letters. Drawn in the image's units. */
export const TAG_PATH =
  'M 0 60 C 20 -10 60 -10 50 50 C 44 90 10 96 18 60 C 30 20 90 10 100 56 C 108 92 80 100 92 64 C 104 28 150 22 160 60 ' +
  'C 168 88 150 96 158 70 C 170 30 214 30 236 52 C 252 68 270 40 300 30';

/**
 * Concept 1 · the graffiti (always with «imagen · no es del puerto», which the scene draws): one brick wall, one spray
 * can in the middle, and two pintadas — on the left the slogan «No a…», a protest (amber, `lema` 0–1 paints it), on the
 * right an unreadable tag squiggle, a mote to show off to the mates (rose, `mote` 0–1). Same wall, same can.
 */
export function Graffiti({ width, lema = 1, mote = 1, can = 1 }: { width: number; lema?: number; mote?: number; can?: number }) {
  const h = (width * GRAFFITI.h) / GRAFFITI.w;
  const l = clamp01(lema);
  const m = clamp01(mote);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${GRAFFITI.w} ${GRAFFITI.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <pattern id="gr-bricks" width="120" height="56" patternUnits="userSpaceOnUse">
          <rect width="120" height="56" fill="#1a2238" />
          <path d="M 0 0 H 120 M 0 28 H 120 M 60 0 V 28 M 0 28 V 56 M 120 28 V 56" stroke="#2a3552" strokeWidth="4" />
        </pattern>
        <clipPath id="gr-lema">
          <rect x={60} y={0} width={620 * l} height={GRAFFITI.h} />
        </clipPath>
        <clipPath id="gr-mote">
          <rect x={980} y={0} width={560 * m} height={GRAFFITI.h} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={GRAFFITI.w} height={GRAFFITI.h} rx={18} fill="url(#gr-bricks)" />
      <rect x={0} y={GRAFFITI.h - 22} width={GRAFFITI.w} height={22} fill="#111827" />

      {/* left: the slogan, a protest */}
      <g clipPath="url(#gr-lema)">
        <text x={90} y={190} fontFamily={FONT.sans} fontWeight={900} fontStyle="italic" fontSize={150} letterSpacing={-2} fill={C.amber} style={{ filter: `drop-shadow(0 0 ${Math.round(14 * l)}px ${alpha(C.amber, 0.5)})` }}>
          No a…
        </text>
        {[150, 260, 395, 520].map((x, k) => (
          <rect key={x} x={x} y={196} width={9} height={26 + (k % 2) * 22} rx={4} fill={C.amber} opacity={0.85} />
        ))}
      </g>

      {/* right: the tag, a mote to show off */}
      <g clipPath="url(#gr-mote)">
        <path
          d={TAG_PATH}
          transform="translate(1010 70) scale(1.7 1.6)"
          fill="none"
          stroke={C.roseSoft}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 ${Math.round(14 * m)}px ${alpha(C.rose, 0.55)})` }}
        />
        <circle cx={1530} cy={110} r={10} fill={C.roseSoft} />
      </g>

      {/* the same can between them */}
      <g transform="translate(800 120)" opacity={clamp01(can)}>
        <rect x={-34} y={0} width={68} height={130} rx={14} fill="#cbd5e1" stroke="#64748b" strokeWidth={4} />
        <rect x={-34} y={40} width={68} height={40} fill={alpha(C.cyan, 0.5)} />
        <rect x={-14} y={-26} width={28} height={28} rx={6} fill="#94a3b8" />
        <rect x={-6} y={-40} width={12} height={16} rx={3} fill="#475569" />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={(k - 1) * 30} cy={-62 - (k % 2) * 12} r={5 + (k % 2) * 2} fill={alpha('#cbd5e1', 0.45)} />
        ))}
      </g>
    </svg>
  );
}
