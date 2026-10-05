import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { CAR } from '../../data/s02-hash';

/**
 * «El coche raro en tu calle» — do not upload a targeted sample, look up its hash (s02 `car`; rule 1 of s06).
 * Owner: builder A.
 *
 *   <CarVignette width={1728} street={a} notebook={b} note={c} strike={d} />   // s02, full
 *   <CarVignette mini width={300} />                                            // s06 rule 1: car + notebook, note struck
 *
 * A quiet street at night (lamp post, low wall, a tree — no houses, no blocks of flats), ONE parked car seen from the
 * front. Its plate reads the sample's short hash (V3's spelling, upper case) — never a real-format number plate.
 * Left: a notebook (cyan) with the plate written down and «la buscas tú, en silencio». Right: the note left on the
 * windscreen, «te he visto», struck out in rose.
 *
 * Full-mode inputs (0–1, computed by the scene): `street` (street + car), `notebook` (notebook + caption), `note`
 * (the note on the windscreen + its enlarged copy), `strike` (rose strike), `lift` (the notebook's written line
 * leaves: the scene flies its own copy from `carNotebookLine()` to the search box). Mini mode is static.
 */

/** Full-mode design size; every coordinate below is in this space and scaled by width / 1728. */
const BASE = { w: 1728, h: 440 } as const;
const MINI = { w: 300, h: 176 } as const;

const NB = { x: 30, y: 26, w: 380, h: 300 } as const;
const NB_LINE = { cx: NB.x + NB.w / 2, cy: 188, size: 46 } as const;
const STREET = { x: 452, y: 0, w: 836, h: 440 } as const;
const CAR_AT = { x: 650, y: 122 } as const;
const NOTE = { x: 1352, y: 110, w: 350, h: 190 } as const;

/** Height in px of a CarVignette `width` px wide. */
export function carVignetteHeight(width: number, mini = false): number {
  return mini ? (MINI.h * width) / MINI.w : (BASE.h * width) / BASE.w;
}

/** Where the notebook's written plate sits (vignette px): the scene starts the morph to the search there. */
export function carNotebookLine(width: number): { x: number; y: number; w: number; h: number; size: number } {
  const s = width / BASE.w;
  const w = CAR.plate.length * 0.6 * NB_LINE.size;
  return { x: (NB_LINE.cx - w / 2) * s, y: (NB_LINE.cy - NB_LINE.size * 0.65) * s, w: w * s, h: NB_LINE.size * 1.3 * s, size: NB_LINE.size * s };
}

const BODY = '#334155';
const CABIN = '#3b4a60';
const RIM = alpha(C.rose, 0.5);
const PAPER = '#f3ecd9';

/** The car from the front, 440×300 design units. The note sits under the wiper. */
function CarFront({ note, strike, plateOpacity = 1 }: { note: number; strike: number; plateOpacity?: number }) {
  return (
    <g>
      {/* shadow on the road */}
      <ellipse cx={220} cy={302} rx={210} ry={12} fill={alpha('#000000', 0.45)} />
      {/* cabin + windscreen */}
      <path d="M 112 18 Q 122 8 138 8 L 302 8 Q 318 8 328 18 L 392 124 L 48 124 Z" fill={CABIN} stroke={RIM} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 130 26 L 310 26 L 366 116 L 74 116 Z" fill="#0d1a2e" stroke="#1e3350" strokeWidth={2} strokeLinejoin="round" />
      <path d="M 150 108 L 192 32" stroke={alpha('#ffffff', 0.07)} strokeWidth={12} strokeLinecap="round" />
      <path d="M 300 108 L 318 76" stroke={alpha('#ffffff', 0.05)} strokeWidth={8} strokeLinecap="round" />
      {/* mirrors */}
      <rect x={10} y={102} width={38} height={24} rx={7} fill={CABIN} stroke={RIM} strokeWidth={2} />
      <rect x={392} y={102} width={38} height={24} rx={7} fill={CABIN} stroke={RIM} strokeWidth={2} />
      {/* lower body */}
      <rect x={10} y={116} width={420} height={142} rx={34} fill={BODY} stroke={RIM} strokeWidth={2.5} />
      {/* headlights (off) */}
      <ellipse cx={82} cy={164} rx={44} ry={20} fill="#cbd5e1" opacity={0.5} />
      <ellipse cx={358} cy={164} rx={44} ry={20} fill="#cbd5e1" opacity={0.5} />
      {/* grille */}
      <rect x={150} y={146} width={140} height={40} rx={10} fill="#0f172a" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={162} y={154 + i * 10} width={116} height={4} rx={2} fill="#1e293b" />
      ))}
      {/* plate: the sample's short hash, not a real-format plate */}
      <g opacity={plateOpacity}>
        <rect x={102} y={196} width={236} height={54} rx={8} fill="#f1f5f9" stroke="#0f172a" strokeWidth={3} />
        <text
          x={220}
          y={224}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT.mono}
          style={{ fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0' }}
          fontSize={34}
          fontWeight={800}
          fill="#0f172a"
        >
          {CAR.plate}
        </text>
      </g>
      {/* bumper + wheels */}
      <rect x={20} y={252} width={400} height={22} rx={11} fill="#1e293b" />
      <rect x={34} y={262} width={70} height={38} rx={10} fill="#05080f" />
      <rect x={336} y={262} width={70} height={38} rx={10} fill="#05080f" />
      {/* the note under the wiper */}
      {note > 0.01 ? (
        <g opacity={note} transform="rotate(-8 228 86)">
          <rect x={196} y={64} width={64} height={44} rx={3} fill={PAPER} />
          <rect x={204} y={76} width={40} height={4} rx={2} fill="#64748b" />
          <rect x={204} y={88} width={30} height={4} rx={2} fill="#64748b" />
          {strike > 0.01 ? <rect x={192} y={82} width={72 * clamp01(strike)} height={6} rx={3} fill={C.rose} /> : null}
        </g>
      ) : null}
      <path d="M 168 112 L 262 72" stroke="#0b1220" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

/** The street behind the car (inside STREET), design units of the full vignette. */
function Street() {
  const { x, y, w, h } = STREET;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={28} fill={C.ink900} stroke={C.ink700} strokeWidth={2} />
      {/* bushes behind the wall */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={x + 70 + i * 140} cy={252} r={52 + (i % 2) * 14} fill="#10243a" />
      ))}
      {/* a tree on the right */}
      <rect x={x + w - 128} y={150} width={14} height={140} rx={6} fill="#0e1d30" />
      <circle cx={x + w - 121} cy={136} r={62} fill="#112a40" />
      <circle cx={x + w - 160} cy={164} r={40} fill="#112a40" />
      {/* low wall + pavement + kerb */}
      <rect x={x} y={276} width={w} height={40} fill={C.ink800} />
      <path d={`M ${x} 276 L ${x + w} 276`} stroke={C.ink600} strokeWidth={2} />
      <rect x={x} y={316} width={w} height={22} fill="#152238" />
      <path d={`M ${x} 338 L ${x + w} 338`} stroke={C.ink500} strokeWidth={3} />
      {/* road */}
      <path d={`M ${x} 338 L ${x + w} 338 L ${x + w} ${h - 28} Q ${x + w} ${h} ${x + w - 28} ${h} L ${x + 28} ${h} Q ${x} ${h} ${x} ${h - 28} Z`} fill="#080d18" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={x + 24 + i * 124} y={418} width={64} height={6} rx={3} fill={alpha('#ffffff', 0.12)} />
      ))}
      {/* lamp post + its light */}
      <path d={`M ${x + 96} 54 L ${x + 30} 338 L ${x + 200} 338 Z`} fill={alpha('#e2e8f0', 0.05)} />
      <rect x={x + 108} y={54} width={8} height={284} rx={3} fill="#1c2a40" />
      <rect x={x + 84} y={44} width={44} height={14} rx={6} fill="#1c2a40" />
      <rect x={x + 90} y={56} width={32} height={6} rx={3} fill={alpha('#f1f5f9', 0.55)} />
    </g>
  );
}

/** The notebook (cyan): rings, ruled lines and the written plate. */
function Notebook({ lift, glow }: { lift: number; glow: number }) {
  const { x, y, w, h } = NB;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={18} fill={C.ink850} stroke={alpha(C.cyan, 0.55 + 0.4 * glow)} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x + 34 + i * 44} y={y - 12} width={10} height={28} rx={5} fill={C.ink700} stroke={alpha(C.cyan, 0.6)} strokeWidth={2} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M ${x + 30} ${y + 86 + i * 50} L ${x + w - 30} ${y + 86 + i * 50}`} stroke={alpha(C.cyan, 0.16)} strokeWidth={2} />
      ))}
      <path d={`M ${x + 62} ${y + 30} L ${x + 62} ${y + h - 20}`} stroke={alpha(C.rose, 0.2)} strokeWidth={2} />
      <text
        x={NB_LINE.cx}
        y={NB_LINE.cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT.mono}
          style={{ fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0' }}
        fontSize={NB_LINE.size}
        fontWeight={800}
        fill={C.cyanSoft}
        opacity={1 - clamp01(lift)}
      >
        {CAR.plate}
      </text>
      {/* a pencil resting on the page */}
      <g transform={`rotate(-28 ${x + 290} ${y + 250})`}>
        <rect x={x + 220} y={y + 244} width={130} height={14} rx={4} fill={C.cyanDeep} />
        <path d={`M ${x + 350} ${y + 244} L ${x + 372} ${y + 251} L ${x + 350} ${y + 258} Z`} fill="#e2e8f0" />
      </g>
    </g>
  );
}

export function CarVignette({
  width = BASE.w,
  mini = false,
  show = 1,
  street = 1,
  notebook = 1,
  note = 1,
  strike = 0,
  lift = 0,
  glowNotebook = 0,
  style,
}: {
  width?: number;
  mini?: boolean;
  show?: number;
  street?: number;
  notebook?: number;
  note?: number;
  strike?: number;
  lift?: number;
  glowNotebook?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  if (mini) return <CarMini width={width} style={{ opacity: sh, ...style }} />;
  const s = width / BASE.w;
  const st = clamp01(street);
  const nb = clamp01(notebook);
  const nt = clamp01(note);
  const sk = clamp01(strike);
  return (
    <div style={{ position: 'relative', width, height: carVignetteHeight(width), opacity: sh, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: BASE.w, height: BASE.h, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        <svg width={BASE.w} height={BASE.h} viewBox={`0 0 ${BASE.w} ${BASE.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <g opacity={st} transform={`translate(0 ${(1 - st) * 16})`}>
            <Street />
            <g transform={`translate(${CAR_AT.x} ${CAR_AT.y})`}>
              <CarFront note={nt} strike={sk} />
            </g>
          </g>
          {nb > 0.01 ? (
            <g opacity={nb} transform={`translate(${(1 - nb) * -24} 0)`}>
              <Notebook lift={lift} glow={glowNotebook} />
            </g>
          ) : null}
          {nt > 0.01 ? (
            <path
              d={`M ${CAR_AT.x + 262} ${CAR_AT.y + 80} C ${CAR_AT.x + 420} ${CAR_AT.y + 40}, ${NOTE.x - 140} ${NOTE.y + 60}, ${NOTE.x - 6} ${NOTE.y + 84}`}
              fill="none"
              stroke={alpha(PAPER, 0.5 * nt)}
              strokeWidth={3}
              strokeDasharray="8 10"
            />
          ) : null}
        </svg>
        {/* «la buscas tú, en silencio» under the notebook */}
        {nb > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: NB.x - 40,
              top: NB.y + NB.h + 22,
              width: NB.w + 80,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 750,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
              opacity: nb,
            }}
          >
            {CAR.notebook}
          </div>
        ) : null}
        {/* the note, enlarged, struck in rose */}
        {nt > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: NOTE.x,
              top: NOTE.y,
              width: NOTE.w,
              height: NOTE.h,
              borderRadius: 6,
              background: PAPER,
              boxShadow: `0 18px 40px ${alpha('#000000', 0.45)}`,
              transform: `rotate(-4deg) translateY(${(1 - nt) * 14}px)`,
              opacity: nt * (1 - 0.25 * sk),
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{ position: 'relative', fontFamily: FONT.sans, fontSize: 54, fontStyle: 'italic', fontWeight: 750, color: '#334155', whiteSpace: 'nowrap' }}>
              {CAR.note}
              <div
                style={{
                  position: 'absolute',
                  left: -14,
                  top: '52%',
                  width: `calc((100% + 28px) * ${sk})`,
                  height: 8,
                  marginTop: -4,
                  borderRadius: 4,
                  background: C.rose,
                  boxShadow: `0 0 12px ${alpha(C.rose, 0.5)}`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** s06 rule 1: the street patch with the car, the notebook beside it, the note on the windscreen struck. */
function CarMini({ width, style }: { width: number; style?: CSSProperties }) {
  const h = carVignetteHeight(width, true);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${MINI.w} ${MINI.h}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      {/* street patch */}
      <rect x={70} y={4} width={230} height={168} rx={16} fill={C.ink900} stroke={C.ink700} strokeWidth={2} />
      <rect x={70} y={104} width={230} height={14} fill={C.ink800} />
      <rect x={70} y={118} width={230} height={4} fill={C.ink500} />
      <path d="M 70 122 L 300 122 L 300 156 Q 300 172 284 172 L 86 172 Q 70 172 70 156 Z" fill="#080d18" />
      <rect x={88} y={18} width={4} height={100} rx={2} fill="#1c2a40" />
      <rect x={80} y={14} width={20} height={7} rx={3} fill="#1c2a40" />
      <g transform="translate(112 54) scale(0.38)">
        <CarFront note={1} strike={1} />
      </g>
      {/* notebook */}
      <rect x={2} y={34} width={62} height={92} rx={8} fill={C.ink850} stroke={alpha(C.cyan, 0.8)} strokeWidth={2.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={10 + i * 13} y={28} width={4} height={12} rx={2} fill={C.ink700} stroke={alpha(C.cyan, 0.7)} strokeWidth={1} />
      ))}
      <rect x={12} y={62} width={42} height={8} rx={4} fill={C.cyanSoft} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M 12 ${84 + i * 14} L 54 ${84 + i * 14}`} stroke={alpha(C.cyan, 0.2)} strokeWidth={1.5} />
      ))}
    </svg>
  );
}
