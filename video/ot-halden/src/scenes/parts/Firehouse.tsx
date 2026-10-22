import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The fire-station image of «En marcha, a tiempo y con parche», identical in every scene that shows it (sky = the
 * image, amber = time):
 *   FireTrucks    two trucks on duty, each with its crew  = high availability (HA)
 *   TenMinuteClock a ten-minute dial                       = responsiveness
 *   PartInBox     a spare part in its box                  = patch availability / inability to patch
 * `size` is the icon's HEIGHT in px; `fireIconWidth(kind, size)` gives its width, so a scene can lay a row out.
 * Always label the image with `<ImageTag />` («imagen · no es del puerto»). No text inside the icons.
 */

export type FireIcon = 'trucks' | 'truck' | 'clock' | 'part';

/** Native viewBox of each icon (width × height), the ratio that `fireIconWidth` applies. */
export const FIRE_ICON = {
  trucks: { w: 222, h: 70 },
  truck: { w: 104, h: 70 },
  clock: { w: 70, h: 70 },
  part: { w: 90, h: 70 },
} as const;

export function fireIconWidth(kind: FireIcon, size: number): number {
  return (size * FIRE_ICON[kind].w) / FIRE_ICON[kind].h;
}

interface IconProps {
  /** Height in px. */
  size: number;
  /** Stroke colour (default: sky for the trucks and the box, amber for the clock). */
  tone?: string;
  /** 0–1 glow (the voice is on it). */
  glow?: number;
  /** 0–1 fade of the whole icon (1 = gone). */
  dim?: number;
  style?: CSSProperties;
  /** Unique suffix for the filter id when two of the same icon share a frame. */
  idSuffix?: string;
}

const FILL = alpha(C.ink800, 0.92);

function Svg({ kind, size, glow = 0, dim = 0, tone, style, idSuffix = '', children }: IconProps & { kind: FireIcon; tone: string; children: React.ReactNode }) {
  const g = clamp01(glow);
  const id = `fire-glow-${kind}${idSuffix}`;
  const { w, h } = FIRE_ICON[kind];
  return (
    <svg width={fireIconWidth(kind, size)} height={size} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible', opacity: 1 - clamp01(dim), ...style }}>
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={tone} floodOpacity={0.15 + 0.7 * g} />
        </filter>
      </defs>
      <g filter={g > 0.02 ? `url(#${id})` : undefined} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
}

/** One truck drawn at the origin of a 104×70 box (facing right); `crew` puts two helmets in the cab. */
function TruckArt({ tone, crew, x = 0 }: { tone: string; crew: boolean; x?: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {/* ladder on the roof */}
      <line x1={8} y1={13} x2={64} y2={13} stroke={tone} strokeWidth={3} />
      <line x1={8} y1={19} x2={64} y2={19} stroke={tone} strokeWidth={3} />
      {[14, 24, 34, 44, 54].map((lx) => (
        <line key={lx} x1={lx} y1={13} x2={lx} y2={19} stroke={alpha(tone, 0.7)} strokeWidth={2.5} />
      ))}
      {/* body and cab */}
      <path d="M4 24 H66 V50 H4 Z" fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} />
      <path d="M66 28 H86 L100 38 V50 H66 Z" fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} />
      <path d="M72 32 H84 L92 38 H72 Z" fill={alpha(C.ink950, 0.9)} stroke={tone} strokeWidth={2.5} />
      <line x1={12} y1={36} x2={58} y2={36} stroke={alpha(tone, 0.55)} strokeWidth={3} />
      {crew ? (
        <g>
          {[76, 85].map((hx) => (
            <g key={hx}>
              <circle cx={hx} cy={36} r={2.8} fill={C.text} stroke="none" />
              <path d={`M${hx - 4} 33.5 A4 4 0 0 1 ${hx + 4} 33.5 Z`} fill={C.rose} stroke="none" />
            </g>
          ))}
        </g>
      ) : null}
      {/* wheels */}
      <circle cx={22} cy={53} r={8} fill={FILL} stroke={tone} strokeWidth={4} />
      <circle cx={80} cy={53} r={8} fill={FILL} stroke={tone} strokeWidth={4} />
      {/* beacon */}
      <rect x={72} y={22} width={8} height={5} rx={1.5} fill={alpha(C.rose, 0.9)} stroke="none" />
    </g>
  );
}

/** A garage (la nave): roof, two posts and a floor line around a 104-wide truck. */
function GarageArt({ tone, x = 0 }: { tone: string; x?: number }) {
  return (
    <g transform={`translate(${x} 0)`} stroke={alpha(tone, 0.6)} strokeWidth={3}>
      <path d="M-4 10 L52 -2 L108 10" />
      <line x1={-4} y1={10} x2={-4} y2={64} />
      <line x1={108} y1={10} x2={108} y2={64} />
    </g>
  );
}

/** A single fire truck. `crew` draws the helmets in the cab; `garage` parks it in its shed. */
export function FireTruck({ size, tone = C.sky, glow, dim, style, idSuffix, crew = true, garage = false }: IconProps & { crew?: boolean; garage?: boolean }) {
  return (
    <Svg kind="truck" {...{ size, tone, glow, dim, style, idSuffix }}>
      {garage ? <GarageArt tone={tone} /> : null}
      <TruckArt tone={tone} crew={crew} />
      <line x1={-4} y1={64} x2={108} y2={64} stroke={alpha(tone, 0.4)} strokeWidth={3} />
    </Svg>
  );
}

/** Two trucks on duty, each with its crew. `crew` can switch a crew off; `count` 1 draws just the first truck. */
export function FireTrucks({
  size,
  tone = C.sky,
  glow,
  dim,
  style,
  idSuffix,
  count = 2,
  crew = [true, true],
}: IconProps & { count?: 1 | 2; crew?: [boolean, boolean] }) {
  return (
    <Svg kind="trucks" {...{ size, tone, glow, dim, style, idSuffix }}>
      <TruckArt tone={tone} crew={crew[0]} x={0} />
      {count === 2 ? <TruckArt tone={tone} crew={crew[1]} x={114} /> : null}
      <line x1={-2} y1={64} x2={224} y2={64} stroke={alpha(tone, 0.4)} strokeWidth={3} />
    </Svg>
  );
}

/** A ten-minute dial: a sixth of the hour shaded from twelve, the hand at ten minutes (amber = time). */
export function TenMinuteClock({ size, tone = C.amber, glow, dim, style, idSuffix }: IconProps) {
  const cx = 35;
  const cy = 35;
  const r = 29;
  const a = (Math.PI * 2 * 10) / 60;
  const px = (rad: number, ang: number) => cx + rad * Math.sin(ang);
  const py = (rad: number, ang: number) => cy - rad * Math.cos(ang);
  return (
    <Svg kind="clock" {...{ size, tone, glow, dim, style, idSuffix }}>
      <circle cx={cx} cy={cy} r={r} fill={FILL} stroke={tone} strokeWidth={4.5} />
      <path d={`M${cx} ${cy} L${cx} ${cy - 24} A24 24 0 0 1 ${px(24, a)} ${py(24, a)} Z`} fill={alpha(tone, 0.35)} stroke="none" />
      {[0, 3, 6, 9].map((h) => (
        <line key={h} x1={px(r - 2, (h * Math.PI) / 6)} y1={py(r - 2, (h * Math.PI) / 6)} x2={px(r - 8, (h * Math.PI) / 6)} y2={py(r - 8, (h * Math.PI) / 6)} stroke={tone} strokeWidth={3} />
      ))}
      <line x1={cx} y1={cy} x2={px(22, a)} y2={py(22, a)} stroke={tone} strokeWidth={4} />
      <line x1={cx} y1={cy} x2={cx} y2={cy - 20} stroke={alpha(tone, 0.7)} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={3.2} fill={tone} stroke="none" />
    </Svg>
  );
}

/** A spare part (a gear) in its crate, lid open. */
export function PartInBox({ size, tone = C.sky, glow, dim, style, idSuffix }: IconProps) {
  const teeth = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <Svg kind="part" {...{ size, tone, glow, dim, style, idSuffix }}>
      {/* the gear, rising out of the box */}
      <g transform="translate(45 26)">
        {teeth.map((deg) => (
          <rect key={deg} x={-3.2} y={-17} width={6.4} height={8} rx={1.4} fill={alpha(tone, 0.5)} stroke={tone} strokeWidth={2} transform={`rotate(${deg})`} />
        ))}
        <circle r={12} fill={FILL} stroke={tone} strokeWidth={4} />
        <circle r={4.2} fill="none" stroke={tone} strokeWidth={3} />
      </g>
      {/* crate */}
      <path d="M8 38 H82 V64 H8 Z" fill={FILL} stroke={tone} strokeWidth={4} />
      <line x1={8} y1={51} x2={82} y2={51} stroke={alpha(tone, 0.5)} strokeWidth={3} />
      <line x1={14} y1={44} x2={14} y2={58} stroke={alpha(tone, 0.5)} strokeWidth={3} />
      <line x1={76} y1={44} x2={76} y2={58} stroke={alpha(tone, 0.5)} strokeWidth={3} />
      {/* open lid, leaning back */}
      <path d="M8 38 L2 26 H20" stroke={alpha(tone, 0.75)} strokeWidth={3.5} />
    </Svg>
  );
}

/** «imagen · no es del puerto»: the label every fire-station image carries (a dashed pill, never part of the port). */
export function ImageTag({ size = 30, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: Math.round(size * 1.55),
        padding: `0 ${Math.round(size * 0.7)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.sky, 0.55)}`,
        background: alpha(C.sky, 0.06),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        color: C.sky,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      imagen · no es del puerto
    </div>
  );
}
