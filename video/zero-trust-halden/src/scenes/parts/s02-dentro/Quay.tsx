import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { LaptopGlyph } from '../People';

/**
 * The quay of s02, in stage units, drawn inside the scene's <svg>: a strip of floor, a few
 * stacks of cargo far behind (neutral steel, side-on, apart from each other), and «the rule»
 * as a line painted across the floor with a thin dashed plane rising from it to the rule card.
 * Nothing of a precinct: no fence, gate, booth, barrier, turnstile, door, key or padlock.
 */
export const QUAY = {
  /** Where the feet stand. */
  floor: 638,
  /** Far edge of the floor strip, and where it has faded into the background. */
  bandTop: 612,
  bandFade: 652,
  /** The painted line. */
  lineX: 676,
} as const;

const PAINT = '#e2e8f0';

/** Cargo stacks behind everybody: [x, width, rows]. They reach past the stage so the close-up never shows an end. */
const STACKS: [number, number, number][] = [
  [-960, 250, 1],
  [-650, 250, 2],
  [-340, 250, 1],
  [-30, 250, 2],
  [290, 250, 1],
  [790, 250, 2],
  [1100, 250, 1],
  [1410, 250, 2],
  [1720, 250, 1],
  [2030, 250, 2],
];
const BOX_H = 72;

export function Cargo({ opacity = 1 }: { opacity?: number }) {
  if (opacity <= 0.001) return null;
  return (
    <g opacity={opacity}>
      {STACKS.map(([x, w, rows]) =>
        Array.from({ length: rows }, (_, r) => {
          const y = QUAY.bandTop - (r + 1) * BOX_H;
          return (
            <g key={`${x}-${r}`}>
              <rect x={x} y={y} width={w} height={BOX_H - 5} rx={5} fill={alpha(C.ink800, 0.8)} stroke={alpha(C.ink500, 0.55)} strokeWidth={2} />
              <line x1={x + 10} y1={y + 12} x2={x + w - 10} y2={y + 12} stroke={alpha(C.ink500, 0.4)} strokeWidth={2} />
              {[0.25, 0.5, 0.75].map((t) => (
                <line key={t} x1={x + w * t} y1={y + 22} x2={x + w * t} y2={y + BOX_H - 15} stroke={alpha(C.ink500, 0.28)} strokeWidth={2} />
              ))}
            </g>
          );
        }),
      )}
    </g>
  );
}

/** The floor strip: it fades into the background towards the viewer. `id` must be unique in the composition. */
export function Floor({ id = 's02-quay-floor' }: { id?: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={QUAY.bandTop} x2={0} y2={QUAY.bandFade}>
          <stop offset={0} stopColor="#17233c" stopOpacity={1} />
          <stop offset={1} stopColor="#17233c" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-3000} y={QUAY.bandTop} width={8000} height={QUAY.bandFade - QUAY.bandTop} fill={`url(#${id})`} />
      <line x1={-3000} y1={QUAY.bandTop} x2={5000} y2={QUAY.bandTop} stroke={alpha(C.ink500, 0.9)} strokeWidth={2.5} />
    </g>
  );
}

/**
 * The painted line and the plane over it. `draw` 0–1 paints it; `flash` 0–1 turns it emerald
 * (somebody is crossing: «pasa»); `beamTop` is where the plane meets the rule card.
 */
export function PaintedLine({ draw, flash = 0, beamTop }: { draw: number; flash?: number; beamTop: number }) {
  const d = clamp01(draw);
  if (d <= 0.001) return null;
  const f = clamp01(flash);
  const x = QUAY.lineX;
  const far = QUAY.bandTop;
  const near = QUAY.bandFade + 2;
  // A stripe across the floor strip, leaning with the perspective.
  const lean = 0.34;
  const half = 11;
  const xAt = (y: number) => x - (y - QUAY.floor) * lean;
  const yEnd = far + (near - far) * d;
  const stripe = `M ${xAt(far) - half} ${far} L ${xAt(far) + half} ${far} L ${xAt(yEnd) + half + 3} ${yEnd} L ${xAt(yEnd) - half - 3} ${yEnd} Z`;
  const beamX = xAt(far);
  return (
    <g>
      <path d={stripe} fill={alpha(PAINT, 0.92)} />
      {f > 0.01 ? <path d={stripe} fill={C.emerald} opacity={f} style={{ filter: `drop-shadow(0 0 ${Math.round(14 * f)}px ${alpha(C.emerald, 0.8)})` }} /> : null}
      {/* The plane of the rule: from the card down to the line */}
      <line x1={beamX} y1={beamTop} x2={beamX} y2={far} stroke={alpha(PAINT, 0.55 * d)} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 11" />
      {f > 0.01 ? <line x1={beamX} y1={beamTop} x2={beamX} y2={far} stroke={C.emerald} opacity={f} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 11" /> : null}
    </g>
  );
}

/**
 * A vest that is not theirs: an amber dashed outline around the vest, in a Person's own design
 * space (pass it as the figure's children). `pulse` 0–1 adds a halo. Amber, never rose.
 */
export function BorrowedVest({ show, pulse = 0 }: { show: number; pulse?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const p = clamp01(pulse);
  return (
    <g
      opacity={s}
      transform="translate(0 -140) scale(1.24 1.18) translate(0 140)"
      style={p > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(4 + 10 * p)}px ${alpha(C.amber, 0.9 * p)})` } : undefined}
    >
      <path
        d="M-27 -176 Q-14 -183 -9 -182 L0 -150 L9 -182 Q14 -183 27 -176 L24.5 -104 Q0 -98 -24.5 -104 Z"
        fill={alpha(C.amber, 0.1)}
        stroke={C.amber}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />
    </g>
  );
}

/**
 * The laptop a figure carries, drawn a little bigger over the one `carry="laptop"` holds (pass it
 * as that Person's children), so its warning can be seen: `warn` 0–1 lights a small amber dot with
 * a ring on the screen, `pulse` 0–1 adds a halo. Nothing is written on it: no hostname, no mail,
 * no document.
 */
export function CarriedLaptop({ warn = 0, pulse = 0 }: { warn?: number; pulse?: number }) {
  const w = clamp01(warn);
  const p = clamp01(pulse);
  const cx = 62;
  const cy = -151;
  return (
    <g>
      <LaptopGlyph x={cx} y={cy} w={80} color="#e2e8f0" />
      {w > 0.01 ? (
        <g opacity={w} style={{ filter: `drop-shadow(0 0 ${Math.round(3 + 9 * p)}px ${alpha(C.amber, 0.6 + 0.4 * p)})` }}>
          <circle cx={cx} cy={cy - 6.5} r={7.5} fill={C.amber} />
          <circle cx={cx} cy={cy - 6.5} r={14} fill="none" stroke={alpha(C.amber, 0.8)} strokeWidth={2.6} />
        </g>
      ) : null}
    </g>
  );
}

/** Trust not decided: a dashed grey ring on the floor under a figure. */
export function OpenQuestion({ x, show }: { x: number; show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return <ellipse cx={x} cy={QUAY.floor + 1} rx={66 * (0.8 + 0.2 * s)} ry={13} fill="none" stroke={alpha(C.muted, 0.9)} strokeWidth={3} strokeDasharray="9 8" opacity={s} />;
}
