import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { STEEL } from '../Glyphs';

/**
 * Small SVG pieces of s05's two pictures. Everything draws inside the caller's <svg>, in its units.
 */

/** A plain server box with a word on it (sky: infrastructure). Centred on (x, y). */
export function ServerGlyph({ x, y, w, h, label, opacity = 1, glow = 0 }: { x: number; y: number; w: number; h: number; label: string; opacity?: number; glow?: number }) {
  const g = clamp01(glow);
  const left = x - w / 2;
  const top = y - h / 2;
  return (
    <g opacity={opacity} style={g > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(6 + 16 * g)}px ${alpha(C.sky, 0.7 * g)})` } : undefined}>
      <rect x={left} y={top} width={w} height={h} rx={12} fill={STEEL.fill} stroke={C.sky} strokeWidth={4.5} />
      {[0, 1].map((i) => (
        <g key={i}>
          <line x1={left + 16} y1={top + 22 + i * 20} x2={x + w / 2 - 44} y2={top + 22 + i * 20} stroke={alpha(C.sky, 0.5)} strokeWidth={5} strokeLinecap="round" />
          <circle cx={x + w / 2 - 22} cy={top + 22 + i * 20} r={5} fill={i === 0 ? C.emerald : C.sky} />
        </g>
      ))}
      <text x={x} y={top + h - 16} textAnchor="middle" fontFamily={FONT.sans} fontSize={30} fontWeight={880} letterSpacing={1} fill="#bae6fd">
        {label}
      </text>
    </g>
  );
}

/**
 * A certificate, as a seal with its two ribbons (the same tick as the carné's seal).
 * `ring` 0–1: a dashed ring around it in `ringTone` (somebody has to check it).
 */
export function CertSeal({ x, y, r = 20, tone = C.emerald, show = 1, ring = 0, ringTone = C.amber, glow = 0 }: { x: number; y: number; r?: number; tone?: string; show?: number; ring?: number; ringTone?: string; glow?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const k = r / 20;
  const rg = clamp01(ring);
  const g = clamp01(glow);
  return (
    <g transform={`translate(${x} ${y}) scale(${k * (0.6 + 0.4 * s)})`} opacity={s} style={g > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(12 * g)}px ${alpha(tone, 0.85 * g)})` } : undefined}>
      <path d="M -10 14 L -15 36 L -5 29 L 0 34 Z" fill={alpha(tone, 0.75)} />
      <path d="M 10 14 L 15 36 L 5 29 L 0 34 Z" fill={alpha(tone, 0.75)} />
      <circle r={20} fill={C.ink900} stroke={tone} strokeWidth={4} />
      <circle r={20} fill={alpha(tone, 0.2)} />
      <path d="M -9 0 L -3 8 L 10 -8" fill="none" stroke={tone} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      {rg > 0.01 ? <circle r={31} fill="none" stroke={alpha(ringTone, 0.95 * rg)} strokeWidth={4} strokeDasharray="9 8" /> : null}
    </g>
  );
}

/**
 * «Usuario y contraseña» as a small capsule: a person and four blank dots. Nothing is readable.
 * Centred on (x, y).
 */
export function Creds({ x, y, tone = C.amber, opacity = 1, scale = 1 }: { x: number; y: number; tone?: string; opacity?: number; scale?: number }) {
  if (opacity <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-44} y={-15} width={88} height={30} rx={15} fill={C.ink900} stroke={tone} strokeWidth={3.5} />
      <circle cx={-28} cy={-4} r={5} fill={tone} />
      <path d="M -37 9 a 9 8 0 0 1 18 0 Z" fill={tone} />
      {[-8, 5, 18, 31].map((dx) => (
        <circle key={dx} cx={dx} cy={0} r={4} fill={tone} />
      ))}
    </g>
  );
}

/** A magnifier: «the tablet has to look at the server's certificate». Centred on its lens. */
export function Magnifier({ x, y, tone = C.amber, show = 1 }: { x: number; y: number; tone?: string; show?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * s})`} opacity={s}>
      <circle r={15} fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={5} />
      <line x1={11} y1={11} x2={25} y2={25} stroke={tone} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
}

/** A straight arrow from (x1, y) to (x2, y), drawn up to `draw` (0–1), with its head at the tip. */
export function CheckArrow({ x1, x2, y, tone = C.emerald, draw = 1, dashed = false }: { x1: number; x2: number; y: number; tone?: string; draw?: number; dashed?: boolean }) {
  const d = clamp01(draw);
  if (d <= 0.001) return null;
  const dir = x2 > x1 ? 1 : -1;
  const tip = x1 + (x2 - x1) * d;
  return (
    <g>
      <line x1={x1} y1={y} x2={tip - dir * 8} y2={y} stroke={tone} strokeWidth={5} strokeLinecap="round" strokeDasharray={dashed ? '10 10' : undefined} />
      <path d={`M ${tip} ${y} l ${-dir * 18} -11 v 22 Z`} fill={tone} />
    </g>
  );
}
