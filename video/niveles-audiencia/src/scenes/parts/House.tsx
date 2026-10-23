import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The house of the Sliding Scale (s04, s05): a building in cross-section that is built one piece
 * per stop. Foundation and walls = Architecture, the armoured door = Passive Defense, the watchman
 * on his round = Active Defense, the roof = Intelligence, and, outside the house, dark and padlocked,
 * Offense. Natural size 600×520 (viewBox 0 0 600 520).
 */
export const HOUSE = { w: 600, h: 520 } as const;

export type PieceId = 'arch' | 'passive' | 'active' | 'intel' | 'offense';

export interface HouseProps {
  frame: number;
  /** Frame each piece starts to be built. Use a very negative number for «already there». */
  at: Record<PieceId, number>;
  /** 0–1 per piece: lit while the voice is on it. */
  glow?: Partial<Record<PieceId, number>>;
  /** 0–1: the armoured door in emerald (the answer). */
  answer?: number;
  /** 0–1: the whole house steps back. */
  dim?: number;
  /** 0–1: walls, foundation, door and watchman sink and fade; the roof stays up. */
  bodyOut?: number;
  /** Extra px the roof is lifted (s05: it hangs in the air). */
  roofLift?: number;
  /** Hide the Offense piece. */
  noOffense?: boolean;
}

const SKY = C.sky;
const GROUND_Y = 500;

export function SlidingHouse({ frame, at, glow = {}, answer = 0, dim = 0, bodyOut = 0, roofLift = 0, noOffense = false }: HouseProps) {
  const g = (id: PieceId) => clamp01(glow[id] ?? 0);
  const slab = progress(frame, at.arch, 22, EASE.out);
  const walls = progress(frame, at.arch + 16, 30, EASE.out);
  const door = progress(frame, at.passive, 22, EASE.out);
  const guard = progress(frame, at.active, 18);
  const roof = progress(frame, at.intel, 24, EASE.out);
  const off = noOffense ? 0 : progress(frame, at.offense, 20);

  const bodyOpacity = 1 - bodyOut;
  const sink = bodyOut * 50;
  const archGlow = g('arch');
  const wallStroke = alpha(SKY, 0.55 + 0.45 * archGlow);

  // The watchman walks the ground in front of the house, back and forth.
  const f = Math.max(0, frame - at.active);
  const tri = (t: number) => Math.abs(((t / 140) % 2) - 1); // 0..1..0
  const gx = 96 + 330 * tri(f + 40);
  const dir = Math.floor(((f + 40) / 140) % 2) === 0 ? -1 : 1; // moving left when 1 - ... flips at the ends
  const step = Math.sin(f / 4);

  return (
    <div style={{ position: 'relative', width: HOUSE.w, height: HOUSE.h, opacity: 1 - 0.6 * clamp01(dim), filter: dim > 0.01 ? `saturate(${1 - 0.5 * clamp01(dim)})` : undefined }}>
      <svg width={HOUSE.w} height={HOUSE.h} viewBox={`0 0 ${HOUSE.w} ${HOUSE.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <defs>
          <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 V14" stroke={alpha(SKY, 0.5)} strokeWidth="3" />
          </pattern>
        </defs>

        {/* ground */}
        <path d={`M10 ${GROUND_Y} H590`} stroke={alpha(C.ink500, 0.9)} strokeWidth={3} strokeDasharray={slab > 0.01 ? undefined : '8 8'} strokeLinecap="round" />

        <g opacity={bodyOpacity} transform={`translate(0 ${sink})`}>
          {/* skeleton of the house before it exists */}
          {walls < 1 ? <rect x={90} y={250} width={340} height={230} rx={6} fill="none" stroke={alpha(C.ink600, 0.9)} strokeWidth={2.5} strokeDasharray="8 8" opacity={1 - walls} /> : null}

          {/* foundation */}
          <rect x={70} y={476} width={380 * slab} height={24} fill="url(#hatch)" stroke={wallStroke} strokeWidth={3} opacity={slab > 0 ? 1 : 0} />

          {/* walls rise from the foundation */}
          <g style={{ clipPath: `inset(${(1 - walls) * 100}% 0 0 0)` }}>
            <rect x={90} y={250} width={340} height={226} rx={4} fill={alpha(SKY, 0.06 + 0.06 * archGlow)} stroke={wallStroke} strokeWidth={5} />
            <path d="M90 372 H430" stroke={alpha(SKY, 0.3)} strokeWidth={2.5} />
            <rect x={120} y={284} width={64} height={60} rx={5} fill={alpha(C.amber, 0.1)} stroke={alpha(SKY, 0.5)} strokeWidth={3} />
            <rect x={336} y={284} width={64} height={60} rx={5} fill={alpha(C.amber, 0.1)} stroke={alpha(SKY, 0.5)} strokeWidth={3} />
          </g>

          {/* the armoured door */}
          <g opacity={door} transform={`translate(0 ${(1 - door) * -26})`}>
            <rect x={226} y={346} width={68} height={130} rx={8} fill={alpha(answer > 0.01 ? C.emerald : SKY, 0.16 + 0.2 * Math.max(g('passive'), answer))} stroke={answer > 0.01 ? C.emerald : SKY} strokeWidth={5 + 2 * Math.max(g('passive'), answer)} />
            {[366, 400, 434, 462].map((y) => (
              <circle key={y} cx={238} cy={y} r={3.5} fill={alpha(answer > 0.01 ? C.emerald : SKY, 0.9)} />
            ))}
            {[366, 400, 434, 462].map((y) => (
              <circle key={`r${y}`} cx={282} cy={y} r={3.5} fill={alpha(answer > 0.01 ? C.emerald : SKY, 0.9)} />
            ))}
            <circle cx={282} cy={414} r={5} fill={C.textStrong} />
          </g>

          {/* the watchman and his lantern */}
          {guard > 0 ? (
            <g opacity={guard}>
              <path d={`M96 ${GROUND_Y + 14} H426`} stroke={alpha(C.amber, 0.5)} strokeWidth={3} strokeDasharray="4 9" strokeLinecap="round" />
              <g transform={`translate(${gx} ${GROUND_Y - 6}) scale(${dir === 1 ? 1 : -1} 1)`}>
                <path d="M16 -50 L74 -26 L74 -2 Z" fill={alpha(C.amber, 0.12 + 0.14 * g('active'))} />
                <circle cx={0} cy={-76} r={11} fill={C.amber} />
                <path d="M0 -64 V-30" stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
                <path d={`M0 -30 L${-8 + step * 8} 0 M0 -30 L${8 - step * 8} 0`} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
                <path d="M0 -56 L18 -44" stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
                <circle cx={22} cy={-42} r={6} fill={C.textStrong} />
              </g>
            </g>
          ) : null}
        </g>

        {/* the roof: Intelligence */}
        <g opacity={roof} transform={`translate(0 ${(1 - roof) * -46 - roofLift})`}>
          <path d="M66 254 L260 108 L454 254 Z" fill={alpha(C.cyan, 0.14 + 0.16 * g('intel'))} stroke={C.cyan} strokeWidth={5 + 2 * g('intel')} strokeLinejoin="round" />
          <path d="M120 254 L260 150 L400 254" fill="none" stroke={alpha(C.cyan, 0.4)} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={260} cy={206} r={22} fill={C.ink900} stroke={C.cyan} strokeWidth={4} />
        </g>

        {/* Offense, outside the house: dark and padlocked */}
        {off > 0 ? (
          <g opacity={off}>
            <circle cx={522} cy={392} r={54} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="10 8" />
          </g>
        ) : null}
      </svg>

      {/* icons (HTML so they use the engine's Icon) */}
      <div style={{ position: 'absolute', left: 260 - 14, top: 206 - 14 - (1 - roof) * 46 - roofLift, opacity: roof }}>
        <Icon name="eye" size={28} color={C.cyan} strokeWidth={2.4} />
      </div>
      <div style={{ position: 'absolute', left: 260 - 20, top: 380 + sink, opacity: door * bodyOpacity }}>
        <Icon name="shield" size={40} color={answer > 0.01 ? C.emerald : SKY} strokeWidth={2.4} />
      </div>
      {off > 0 ? (
        <div style={{ position: 'absolute', left: 522 - 24, top: 392 - 24, opacity: off * 0.55 }}>
          <Icon name="target" size={48} color={C.muted} strokeWidth={2} />
        </div>
      ) : null}
      {off > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 522 + 14,
            top: 392 + 14,
            width: 44,
            height: 44,
            borderRadius: 22,
            display: 'grid',
            placeItems: 'center',
            background: C.ink800,
            border: `3px solid ${alpha(C.muted, 0.85)}`,
            opacity: off,
          }}
        >
          <Icon name="lock" size={26} color={C.text} strokeWidth={2.4} />
        </div>
      ) : null}
    </div>
  );
}
