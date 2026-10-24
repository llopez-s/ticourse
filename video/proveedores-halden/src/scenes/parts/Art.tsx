import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The video's small drawings, all SVG, no text and no names: the port's building, the nameless office, the crate of
 * documents with its rope, a document page (with a signature that draws itself), the seal of an outside body. Cyan =
 * the port, sky = the others, amber = the rope (the responsibility that stays), emerald = validated.
 */

/** The port's authority building: windows lit by `lit` (0–1), a flag on the roof, an open door. */
export function PortBuilding({ width = 220, lit = 1, style }: { width?: number; lit?: number; style?: CSSProperties }) {
  const l = clamp01(lit);
  const cols = [30, 84, 138];
  const rows = [84, 128, 172, 216];
  return (
    <svg width={width} height={(width * 330) / 220} viewBox="0 0 220 330" style={{ overflow: 'visible', ...style }}>
      <line x1={110} y1={40} x2={110} y2={2} stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" />
      <path d="M 110 4 L 150 14 L 110 26 Z" fill={C.cyan} />
      <rect x={4} y={40} width={212} height={26} rx={6} fill={C.ink800} stroke={C.cyan} strokeWidth={4} />
      <rect x={14} y={66} width={192} height={254} rx={4} fill={C.ink850} stroke={C.cyan} strokeWidth={4} />
      {rows.map((y, ri) =>
        cols.map((x, ci) => (
          <rect key={`${ri}-${ci}`} x={x} y={y} width={36} height={30} rx={4} fill={alpha(C.cyan, (0.1 + 0.4 * l) * ((ri + ci) % 3 === 0 ? 0.6 : 1))} stroke={alpha(C.cyan, 0.5)} strokeWidth={2} />
        )),
      )}
      <rect x={84} y={252} width={52} height={68} rx={6} fill={C.ink950} stroke={C.cyan} strokeWidth={3} />
      <line x1={110} y1={252} x2={110} y2={320} stroke={alpha(C.cyan, 0.5)} strokeWidth={2} />
    </svg>
  );
}

/** The other company's office: no name on its blank sign (dashed), a plain door. */
export function OfficeBuilding({ width = 220, lit = 1, tone = C.sky, style }: { width?: number; lit?: number; tone?: string; style?: CSSProperties }) {
  const l = clamp01(lit);
  return (
    <svg width={width} height={(width * 230) / 220} viewBox="0 0 220 230" style={{ overflow: 'visible', ...style }}>
      <rect x={52} y={6} width={116} height={34} rx={8} fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeDasharray="9 7" />
      <rect x={10} y={48} width={200} height={178} rx={6} fill={C.ink850} stroke={tone} strokeWidth={4} />
      {[30, 84, 138].map((x) => (
        <rect key={x} x={x} y={70} width={52} height={36} rx={4} fill={alpha(tone, 0.08 + 0.3 * l)} stroke={alpha(tone, 0.5)} strokeWidth={2} />
      ))}
      <rect x={84} y={150} width={52} height={76} rx={6} fill={C.ink950} stroke={tone} strokeWidth={3} />
      <circle cx={126} cy={190} r={3.5} fill={alpha(tone, 0.8)} />
    </svg>
  );
}

/** A crate of documents: three sheets stick out of its top. */
export function Crate({ width = 130, tone = C.sky, style }: { width?: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 112) / 130} viewBox="0 0 130 112" style={{ overflow: 'visible', ...style }}>
      <g transform="rotate(-7 40 40)">
        <rect x={22} y={4} width={36} height={46} rx={3} fill={C.ink700} stroke={C.ink500} strokeWidth={2.5} />
        <path d="M 29 16 H 51 M 29 24 H 51 M 29 32 H 44" stroke={alpha(C.text, 0.4)} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <g transform="rotate(5 80 40)">
        <rect x={62} y={0} width={38} height={48} rx={3} fill={C.ink700} stroke={C.ink500} strokeWidth={2.5} />
        <path d="M 69 12 H 93 M 69 20 H 93 M 69 28 H 84" stroke={alpha(C.text, 0.4)} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <rect x={40} y={8} width={38} height={44} rx={3} fill={C.ink800} stroke={C.ink500} strokeWidth={2.5} />
      <path d="M 47 20 H 71 M 47 28 H 71 M 47 36 H 62" stroke={alpha(C.text, 0.5)} strokeWidth={2.5} strokeLinecap="round" />
      <rect x={6} y={44} width={118} height={64} rx={6} fill={C.ink800} stroke={tone} strokeWidth={4} />
      <path d="M 6 62 H 124" stroke={alpha(tone, 0.5)} strokeWidth={3} />
      <rect x={50} y={52} width={30} height={8} rx={3} fill={alpha(tone, 0.5)} />
    </svg>
  );
}

/**
 * A rope between two points: it sags by `sag` px and draws itself with `draw` (0–1). The twist (dark dashes) comes with it.
 * Coordinates are in the parent's pixels; the SVG fills its parent (position: absolute).
 */
export function Rope({ x1, y1, x2, y2, sag = 60, draw = 1, tone = C.amber, w = 800, h = 660, strokeWidth = 8 }: { x1: number; y1: number; x2: number; y2: number; sag?: number; draw?: number; tone?: string; w?: number; h?: number; strokeWidth?: number }) {
  const d = draw;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  const path = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={path} fill="none" stroke={tone} strokeWidth={strokeWidth} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} style={{ filter: `drop-shadow(0 0 8px ${alpha(tone, 0.4)})` }} />
      <path d={path} fill="none" stroke={alpha(C.ink950, 0.55)} strokeWidth={strokeWidth - 2} strokeDasharray="3 11" strokeLinecap="butt" opacity={d >= 0.98 ? 1 : 0} />
      <circle cx={x1} cy={y1} r={strokeWidth * 0.9} fill={C.ink900} stroke={tone} strokeWidth={4} opacity={d > 0.02 ? 1 : 0} />
      <circle cx={x2} cy={y2} r={strokeWidth * 0.9} fill={C.ink900} stroke={tone} strokeWidth={4} opacity={d > 0.5 ? 1 : 0} />
    </svg>
  );
}

/** Bars standing for lines of text on a page (never letters). */
function Bars({ x, y, w, rows, gap = 16, tone = C.text, a = 0.38, last = 0.6 }: { x: number; y: number; w: number; rows: number; gap?: number; tone?: string; a?: number; last?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <rect key={i} x={x} y={y + i * gap} width={i === rows - 1 ? w * last : w} height={7} rx={3.5} fill={alpha(tone, a)} />
      ))}
    </>
  );
}

/** A plain document page. `ticks` puts a check box in front of each line (a filled-in form). */
export function Page({ width = 110, rows = 5, ticks = false, tone = C.ink500, style }: { width?: number; rows?: number; ticks?: boolean; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 140) / 110} viewBox="0 0 110 140" style={{ overflow: 'visible', ...style }}>
      <path d="M 6 4 H 78 L 104 30 V 136 H 6 Z" fill={C.ink800} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 78 4 V 30 H 104" fill="none" stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      {ticks
        ? Array.from({ length: rows }, (_, i) => (
            <g key={i}>
              <rect x={18} y={38 + i * 19} width={13} height={13} rx={3} fill="none" stroke={alpha(C.cyan, 0.85)} strokeWidth={2.5} />
              <path d={`M 20.5 ${44.5 + i * 19} l 3.5 3.5 l 6 -8`} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <rect x={40} y={41 + i * 19} width={52 - (i % 2) * 14} height={7} rx={3.5} fill={alpha(C.text, 0.38)} />
            </g>
          ))
        : <Bars x={18} y={40} w={72} rows={rows} gap={17} />}
    </svg>
  );
}

/** The seal of an outside body (rosette with a check): emerald = validated by someone else. */
export function Seal({ size = 70, tone = C.emerald, style }: { size?: number; tone?: string; style?: CSSProperties }) {
  const pts: string[] = [];
  const n = 14;
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 === 0 ? 46 : 39;
    pts.push(`${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', ...style }}>
      <polygon points={pts.join(' ')} fill={alpha(tone, 0.22)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={50} cy={50} r={27} fill={C.ink900} stroke={tone} strokeWidth={4} />
      <path d="M 37 51 l 9 9 l 18 -20" fill="none" stroke={tone} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The curve of a signature, drawn from 0 to `sign` (0–1). The pen follows its tip. */
const SIGN_PATH = 'M 0 30 C 8 4 20 4 22 26 C 24 44 12 46 16 30 C 22 8 38 8 40 24 C 42 38 50 12 58 26 C 64 36 70 30 84 20';
const SIGN_SEGS: [number, number, number, number, number, number, number, number][] = [
  [0, 30, 8, 4, 20, 4, 22, 26],
  [22, 26, 24, 44, 12, 46, 16, 30],
  [16, 30, 22, 8, 38, 8, 40, 24],
  [40, 24, 42, 38, 50, 12, 58, 26],
  [58, 26, 64, 36, 70, 30, 84, 20],
];
const SIGN_LEN = [34, 26, 30, 30, 32];

/** The point of the signature curve at `s` (0–1), by approximate arc length, for the pen tip. */
function signTip(s: number): { x: number; y: number } {
  const total = SIGN_LEN.reduce((a, b) => a + b, 0);
  let at = clamp01(s) * total;
  for (let i = 0; i < SIGN_SEGS.length; i++) {
    if (at <= SIGN_LEN[i] || i === SIGN_SEGS.length - 1) {
      const t = clamp01(at / SIGN_LEN[i]);
      const [x0, y0, x1, y1, x2, y2, x3, y3] = SIGN_SEGS[i];
      const u = 1 - t;
      return {
        x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      };
    }
    at -= SIGN_LEN[i];
  }
  return { x: 84, y: 20 };
}

/** A contract page with clause bars, a signature line and a signature that draws itself with `sign` (0–1). */
export function ContractPage({ width = 150, rows = 4, sign = 0, pen = true, style }: { width?: number; rows?: number; sign?: number; pen?: boolean; style?: CSSProperties }) {
  const s = clamp01(sign);
  return (
    <svg width={width} height={(width * 190) / 150} viewBox="0 0 150 190" style={{ overflow: 'visible', ...style }}>
      <path d="M 8 4 H 108 L 142 38 V 184 H 8 Z" fill={C.ink800} stroke={C.text} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M 108 4 V 38 H 142" fill="none" stroke={C.text} strokeWidth={4.5} strokeLinejoin="round" />
      <Bars x={24} y={54} w={100} rows={rows} gap={20} tone={C.cyanSoft} a={0.45} />
      <line x1={24} y1={150} x2={126} y2={150} stroke={alpha(C.muted, 0.8)} strokeWidth={3} />
      <g transform="translate(34 118)">
        <path d={SIGN_PATH} fill="none" stroke={C.cyan} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - s} />
      </g>
      {pen && s > 0.01 && s < 0.995 ? (
        <g transform={`translate(${34 + signTip(s).x} ${118 + signTip(s).y}) rotate(32)`}>
          <rect x={-5} y={-50} width={10} height={44} rx={3} fill={C.amber} />
          <path d="M -5 -6 L 5 -6 L 0 6 Z" fill={C.text} />
        </g>
      ) : null}
    </svg>
  );
}
