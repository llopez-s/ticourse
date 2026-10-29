import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

/** A magnifying glass (lupa): the "rigor" mark. Emerald: the evidence is being examined. 120 x 120 box. */
export function Magnifier({ size = 120, glow = 0 }: { size?: number; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: 'block', overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(C.emerald, 0.7 * glow)})` : undefined }} aria-hidden>
      <circle cx={48} cy={48} r={34} fill={alpha(C.emerald, 0.18)} stroke={C.emerald} strokeWidth={9} />
      <path d="M 36 34 Q 42 26 52 25" fill="none" stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <path d="M 74 74 L 106 106" stroke={C.emerald} strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
}

/** The name of a fallacy (English: it is the exam's term), a pill in the marker's colour. */
export function NameTag({ text, size = 44, show = 1, style }: { text: string; size?: number; show?: number; style?: CSSProperties }) {
  if (show <= 0.001) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: size * 1.5,
        padding: `0 ${size * 0.6}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(C.rose, 0.85)}`,
        background: alpha(C.roseDeep, 0.92),
        boxShadow: `0 0 ${Math.round(28 * show)}px ${alpha(C.rose, 0.3 * show)}`,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: 2,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
}

/**
 * The thermometer of «confianza en la atribución»: a tube that fills with `level` (0-1). Amber while it climbs, rose at the
 * top (too much confidence for what is behind it). A normal-flow box `width` x `height`.
 */
export function Thermometer({ height = 300, level = 0, glow = 0, label }: { height?: number; level?: number; glow?: number; label?: string }) {
  const tube = 54;
  const bulb = 92;
  const h = height;
  const fill = Math.max(0, Math.min(1, level));
  const tone = fill > 0.75 ? C.rose : C.amber;
  return (
    <div style={{ position: 'relative', width: bulb, height: h, fontFamily: FONT.sans }}>
      <svg width={bulb} height={h} viewBox={`0 0 ${bulb} ${h}`} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        <rect x={(bulb - tube) / 2} y={0} width={tube} height={h - bulb / 2 - 4} rx={tube / 2} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.muted, 0.7)} strokeWidth={4} />
        <circle cx={bulb / 2} cy={h - bulb / 2} r={bulb / 2 - 4} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.muted, 0.7)} strokeWidth={4} />
        {/* mercury */}
        <circle cx={bulb / 2} cy={h - bulb / 2} r={bulb / 2 - 14} fill={tone} />
        <rect x={(bulb - 28) / 2} y={14 + (1 - fill) * (h - bulb - 30)} width={28} height={(h - bulb / 2) - (14 + (1 - fill) * (h - bulb - 30)) - 6} rx={14} fill={tone} />
        {[0.25, 0.5, 0.75].map((t) => (
          <path key={t} d={`M ${bulb / 2 + tube / 2 + 4} ${14 + (1 - t) * (h - bulb - 30)} h 12`} stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeLinecap="round" />
        ))}
      </svg>
      {glow > 0.01 ? <div style={{ position: 'absolute', inset: -10, borderRadius: 40, boxShadow: `0 0 ${Math.round(34 * glow)}px ${alpha(tone, 0.4 * glow)}`, pointerEvents: 'none' }} /> : null}
      {label ? <div style={{ position: 'absolute', left: bulb + 20, top: 0, fontSize: 32, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{label}</div> : null}
    </div>
  );
}
