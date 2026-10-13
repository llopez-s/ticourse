import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * V21's recurring drawings, each drawn ONE way in every scene that shows it:
 * the dock floodlight (the signal that spills), the combination padlock (the handshake you can or
 * cannot take home), the ID card («el carné»: one identity each) and the three devices of the story
 * (a crane tablet, an access point, the test laptop).
 *
 * Everything draws inside the caller's <svg>, in the caller's units; nothing reads the timeline and
 * nothing positions itself. Each glyph is centred on (x, y) unless its doc says otherwise, and `h`
 * is its drawn height. No glyph carries text: labels belong to the scene.
 */

/** Neutral structure ink (nobody's colour). */
export const STEEL = { fill: '#1e293b', line: '#64748b', light: '#94a3b8', dark: '#0f172a' } as const;

/** The floodlight's light: the only warm white in the video (amber stays for warnings). */
export const LAMP = '#fde68a';

type Base = {
  x: number;
  y: number;
  h: number;
  tone?: string;
  opacity?: number;
  /** 0–1 soft halo in the glyph's tone. */
  glow?: number;
  children?: ReactNode;
};

function halo(tone: string, glow: number) {
  return glow > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(6 + 18 * glow)}px ${alpha(tone, 0.7 * glow)})` } : undefined;
}

/**
 * A dock floodlight. ANCHORED AT THE HEAD'S PIVOT (x, y); `h` scales the head (design head ≈ 44 tall).
 * - `angle`: where the lamp points, in degrees, 0 = right, 90 = straight down, 180 = left.
 * - `beam` 0–1: how much light shows; `reach`: length of the cone in caller units; `spread`: half-angle in degrees.
 * - `pole`: length of the mast below the pivot in caller units (0 = no mast).
 */
export function FloodlightGlyph({
  x,
  y,
  h,
  tone = STEEL.light,
  opacity = 1,
  glow = 0,
  angle = 35,
  beam = 1,
  reach = 420,
  spread = 16,
  pole = 0,
  beamTone = LAMP,
}: Base & { angle?: number; beam?: number; reach?: number; spread?: number; pole?: number; beamTone?: string }) {
  const s = h / 44;
  const b = Math.max(0, Math.min(1, beam));
  const len = reach / s;
  const half = Math.tan((spread * Math.PI) / 180) * len;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} style={halo(beamTone, glow)}>
      {pole > 0 && (
        <g>
          <line x1={0} y1={0} x2={0} y2={pole} stroke={STEEL.line} strokeWidth={Math.max(4, 7 * s)} strokeLinecap="round" />
          <line x1={-14 * s} y1={pole} x2={14 * s} y2={pole} stroke={STEEL.line} strokeWidth={Math.max(4, 7 * s)} strokeLinecap="round" />
        </g>
      )}
      <g transform={`rotate(${angle}) scale(${s})`}>
        {b > 0.01 && (
          <g>
            {/* the cone: its full reach, then two shorter ones inside it so the light is stronger near the lamp */}
            <polygon points={`26,-18 ${26 + len},${-18 - half} ${26 + len},${18 + half} 26,18`} fill={alpha(beamTone, 0.15 * b)} />
            <polygon points={`26,-15 ${26 + len * 0.72},${-15 - half * 0.6} ${26 + len * 0.72},${15 + half * 0.6} 26,15`} fill={alpha(beamTone, 0.13 * b)} />
            <polygon points={`26,-12 ${26 + len * 0.4},${-12 - half * 0.3} ${26 + len * 0.4},${12 + half * 0.3} 26,12`} fill={alpha(beamTone, 0.14 * b)} />
            <line x1={26} y1={-18} x2={26 + len} y2={-18 - half} stroke={alpha(beamTone, 0.4 * b)} strokeWidth={2 / s} strokeLinecap="round" />
            <line x1={26} y1={18} x2={26 + len} y2={18 + half} stroke={alpha(beamTone, 0.4 * b)} strokeWidth={2 / s} strokeLinecap="round" />
          </g>
        )}
        {/* yoke and pivot, housing with cooling fins, hood, lens */}
        <path d="M 0 0 L 6 -27 M 0 0 L 6 27" fill="none" stroke={STEEL.line} strokeWidth={4} strokeLinecap="round" />
        <path d="M -14 -20 H 18 L 28 -26 V 26 L 18 20 H -14 Z" fill={STEEL.fill} stroke={tone} strokeWidth={3.5} strokeLinejoin="round" />
        {[-6, 2, 10].map((fx) => (
          <line key={fx} x1={fx} y1={-20} x2={fx} y2={20} stroke={alpha(tone, 0.45)} strokeWidth={2} />
        ))}
        <path d="M 28 -26 L 36 -29 M 28 26 L 36 29" fill="none" stroke={tone} strokeWidth={3.5} strokeLinecap="round" />
        <rect x={24} y={-23} width={6} height={46} rx={2} fill={b > 0.01 ? alpha(beamTone, 0.35 + 0.65 * b) : STEEL.line} />
        <circle cx={0} cy={0} r={7} fill={STEEL.dark} stroke={tone} strokeWidth={3} />
      </g>
    </g>
  );
}

/**
 * A combination padlock (design 100 × 140, centred on the body).
 * - `open` 0–1 lifts the shackle (an opened lock).
 * - `bolted` 0–1 fades in the plate that screws it to the dock locker («atornillado a la taquilla»):
 *   the WPA3/SAE lock. Without it the lock is loose: the WPA2 lock you can carry home.
 * The dials show ticks, never digits: no code is readable.
 */
export function PadlockGlyph({
  x,
  y,
  h,
  tone = C.cyan,
  opacity = 1,
  glow = 0,
  open = 0,
  bolted = 0,
  children,
}: Base & { open?: number; bolted?: number }) {
  const s = h / 140;
  const o = Math.max(0, Math.min(1, open));
  const bo = Math.max(0, Math.min(1, bolted));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={halo(tone, glow)}>
      {bo > 0.01 && (
        <g opacity={bo}>
          <rect x={-66} y={-22} width={132} height={104} rx={10} fill={STEEL.fill} stroke={STEEL.line} strokeWidth={4} />
          {[
            [-54, -10],
            [54, -10],
            [-54, 70],
            [54, 70],
          ].map(([cx, cy]) => (
            <g key={`${cx},${cy}`}>
              <circle cx={cx} cy={cy} r={7} fill={STEEL.light} />
              <line x1={cx - 4} y1={cy - 3} x2={cx + 4} y2={cy + 3} stroke={STEEL.dark} strokeWidth={2.5} />
            </g>
          ))}
        </g>
      )}
      {/* shackle */}
      <g transform={`translate(0 ${-16 * o})`}>
        <path
          d={o > 0.5 ? 'M -24 -8 V -40 a 24 24 0 0 1 48 0 V -30' : 'M -24 -8 V -40 a 24 24 0 0 1 48 0 V -8'}
          fill="none"
          stroke={STEEL.light}
          strokeWidth={12}
          strokeLinecap="round"
        />
      </g>
      {/* body with four dials */}
      <rect x={-42} y={-12} width={84} height={76} rx={12} fill={C.ink800} stroke={tone} strokeWidth={4.5} />
      {[-27, -9, 9, 27].map((cx) => (
        <g key={cx}>
          <rect x={cx - 7} y={8} width={14} height={36} rx={4} fill={STEEL.dark} stroke={alpha(tone, 0.6)} strokeWidth={2} />
          <line x1={cx - 4} y1={17} x2={cx + 4} y2={17} stroke={alpha(tone, 0.45)} strokeWidth={2} />
          <line x1={cx - 5} y1={26} x2={cx + 5} y2={26} stroke={tone} strokeWidth={2.5} />
          <line x1={cx - 4} y1={35} x2={cx + 4} y2={35} stroke={alpha(tone, 0.45)} strokeWidth={2} />
        </g>
      ))}
      {children}
    </g>
  );
}

/**
 * «El carné»: one ID card per tablet (design 160 × 100, centred). The small seal is its certificate.
 * - `revoked` 0–1: a rose strike across the card, which also dims («se anula el carné»).
 * - `seal` 0–1: how much of the certificate seal shows.
 */
export function CarnetGlyph({
  x,
  y,
  h,
  tone = C.emerald,
  opacity = 1,
  glow = 0,
  revoked = 0,
  seal = 1,
  children,
}: Base & { revoked?: number; seal?: number }) {
  const s = h / 100;
  const r = Math.max(0, Math.min(1, revoked));
  const ink = r > 0.5 ? C.rose : tone;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={halo(ink, glow)}>
      <g opacity={1 - 0.45 * r}>
        <rect x={-80} y={-50} width={160} height={100} rx={12} fill={C.ink800} stroke={ink} strokeWidth={4.5} />
        <rect x={-14} y={-50} width={28} height={9} rx={4} fill={C.ink950} stroke={alpha(ink, 0.7)} strokeWidth={2} />
        {/* photo */}
        <rect x={-66} y={-28} width={48} height={58} rx={6} fill={STEEL.dark} stroke={alpha(ink, 0.5)} strokeWidth={2} />
        <circle cx={-42} cy={-8} r={10} fill={STEEL.light} />
        <path d="M -60 28 a 18 16 0 0 1 36 0 Z" fill={STEEL.light} />
        {/* lines */}
        <line x1={-6} y1={-22} x2={62} y2={-22} stroke={alpha(ink, 0.9)} strokeWidth={6} strokeLinecap="round" />
        <line x1={-6} y1={-4} x2={44} y2={-4} stroke={STEEL.line} strokeWidth={5} strokeLinecap="round" />
        {/* certificate seal */}
        {seal > 0.01 && (
          <g opacity={seal}>
            <circle cx={46} cy={24} r={15} fill={alpha(ink, 0.18)} stroke={ink} strokeWidth={3} />
            <path d="M 39 24 l 5 6 l 10 -12" fill="none" stroke={ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
      {r > 0.01 && <line x1={-88} y1={44} x2={-88 + 176 * r} y2={44 - 88 * r} stroke={C.rose} strokeWidth={8} strokeLinecap="round" />}
      {children}
    </g>
  );
}

/** A rugged crane tablet, portrait (design 110 × 150, centred). `screen` 0–1 lights its screen in `tone`. */
export function TabletGlyph({ x, y, h, tone = C.cyan, opacity = 1, glow = 0, screen = 0.5, children }: Base & { screen?: number }) {
  const s = h / 150;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={halo(tone, glow)}>
      <rect x={-55} y={-75} width={110} height={150} rx={16} fill={STEEL.fill} stroke={STEEL.light} strokeWidth={5} />
      {[
        [-55, -75],
        [41, -75],
        [-55, 61],
        [41, 61],
      ].map(([bx, by]) => (
        <rect key={`${bx},${by}`} x={bx} y={by} width={14} height={14} rx={5} fill={STEEL.line} />
      ))}
      <rect x={-41} y={-58} width={82} height={108} rx={5} fill={alpha(tone, 0.08 + 0.2 * screen)} stroke={alpha(tone, 0.5 + 0.5 * screen)} strokeWidth={3} />
      <circle cx={0} cy={62} r={4.5} fill={STEEL.light} />
      {children}
    </g>
  );
}

/**
 * A wall access point (design ≈ 120 wide × 96 tall with its antennas; (x, y) is the centre of the box).
 * `waves` 0–1 draws three arcs of signal above it; `led` colours its status light.
 */
export function AccessPointGlyph({
  x,
  y,
  h,
  tone = C.sky,
  opacity = 1,
  glow = 0,
  waves = 0,
  led,
  children,
}: Base & { waves?: number; led?: string }) {
  const s = h / 96;
  const w = Math.max(0, Math.min(1, waves));
  const arc = (r: number) => {
    const a = (52 * Math.PI) / 180;
    const dx = Math.sin(a) * r;
    const dy = Math.cos(a) * r;
    return `M ${-dx} ${-30 - dy} A ${r} ${r} 0 0 1 ${dx} ${-30 - dy}`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={halo(tone, glow)}>
      <line x1={-36} y1={-14} x2={-46} y2={-58} stroke={STEEL.light} strokeWidth={6} strokeLinecap="round" />
      <line x1={36} y1={-14} x2={46} y2={-58} stroke={STEEL.light} strokeWidth={6} strokeLinecap="round" />
      <rect x={-60} y={-18} width={120} height={36} rx={12} fill={STEEL.fill} stroke={tone} strokeWidth={4.5} />
      <circle cx={-38} cy={0} r={5} fill={led ?? tone} />
      <line x1={-18} y1={0} x2={40} y2={0} stroke={alpha(tone, 0.5)} strokeWidth={4} strokeLinecap="round" />
      {w > 0.01 &&
        [26, 44, 62].map((r, i) => (
          <path key={r} d={arc(r)} fill="none" stroke={alpha(tone, Math.max(0, Math.min(1, w * 3 - i)) * (0.9 - 0.2 * i))} strokeWidth={5} strokeLinecap="round" />
        ))}
      {children}
    </g>
  );
}

/** The test laptop (design 150 × 100, centred). `screen` 0–1 lights its screen in `tone`. */
export function LaptopGlyph({ x, y, h, tone = C.cyan, opacity = 1, glow = 0, screen = 0.5, children }: Base & { screen?: number }) {
  const s = h / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={halo(tone, glow)}>
      <rect x={-56} y={-48} width={112} height={74} rx={7} fill={STEEL.fill} stroke={STEEL.light} strokeWidth={5} />
      <rect x={-46} y={-39} width={92} height={56} rx={3} fill={alpha(tone, 0.08 + 0.2 * screen)} stroke={alpha(tone, 0.5 + 0.5 * screen)} strokeWidth={2.5} />
      <path d="M -74 30 H 74 L 66 44 H -66 Z" fill={STEEL.line} stroke={STEEL.light} strokeWidth={4} strokeLinejoin="round" />
      {children}
    </g>
  );
}
