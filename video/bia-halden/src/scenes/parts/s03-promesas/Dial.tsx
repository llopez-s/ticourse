import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';

/**
 * A control dial: a 240° track with ticks, a filled arc up to the pointer and a pointer on a hub. The value sits in the
 * opening at the bottom. No arrows, no words on the dial itself: the scene writes the sentence under it.
 *   at       0–1 how far the pointer has swept from the left stop to `target`
 *   target   final pointer angle in degrees (−120 = left stop … +120 = right stop, 0 = straight up)
 *   show     the dial arrives
 *   glow     an extra halo round the dial (the voice is on it)
 */
const R = 118;
const CX = 150;
const CY = 150;
const MIN = -120;
const MAX = 120;

const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
};

function arc(from: number, to: number, r: number): string {
  const a = pt(from, r);
  const b = pt(to, r);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export function Dial({
  size = 300,
  tone,
  target,
  at = 1,
  show = 1,
  glow = 0,
  value,
  valueShow = 1,
}: {
  size?: number;
  tone: string;
  target: number;
  at?: number;
  show?: number;
  glow?: number;
  value: string;
  valueShow?: number;
}) {
  const s = clamp01(show);
  const angle = mix(MIN, target, at);
  const tip = pt(angle, 94);
  const g = clamp01(glow);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      style={{ overflow: 'visible', opacity: s, transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: 'center' }}
    >
      {g > 0.01 ? <circle cx={CX} cy={CY} r={R + 20} fill="none" stroke={alpha(tone, 0.45 * g)} strokeWidth={6} /> : null}
      <circle cx={CX} cy={CY} r={R + 20} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.ink500, 0.9)} strokeWidth={3} />
      {Array.from({ length: 13 }).map((_, i) => {
        const d = MIN + i * 20;
        const major = i % 3 === 0;
        const a = pt(d, major ? R - 20 : R - 14);
        const b = pt(d, R - 4);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.muted} strokeWidth={major ? 5 : 3} strokeLinecap="round" />;
      })}
      <path d={arc(MIN, MAX, R + 8)} fill="none" stroke={C.ink600} strokeWidth={6} strokeLinecap="round" />
      {angle > MIN + 0.5 ? <path d={arc(MIN, angle, R + 8)} fill="none" stroke={tone} strokeWidth={8} strokeLinecap="round" /> : null}
      <line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={C.textStrong} strokeWidth={8} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={16} fill={C.ink800} stroke={tone} strokeWidth={6} />
      <text
        x={CX}
        y={CY + 96}
        textAnchor="middle"
        fontFamily={FONT.sans}
        fontSize={60}
        fontWeight={850}
        fill={tone}
        opacity={clamp01(valueShow)}
      >
        {value}
      </text>
    </svg>
  );
}
