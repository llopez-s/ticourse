import { ACCENT, C, FONT, RADIUS, alpha, type Accent } from '../../../theme/tokens';

/** Rough rendered width of an event chip (layout only: bands, links, labels). */
export function chipWidth(code: string, label: string | undefined, size: number): number {
  const mono = code.length * size * 0.6;
  const sans = label ? label.length * size * 0.54 + size * 0.45 : 0;
  return mono + sans + size * 1.0 + 4;
}

export function chipHeight(size: number): number {
  return size * 1.15 + 2 * Math.round(size * 0.3) + 4;
}

/**
 * One log event on the correlation timeline: event ID in mono plus an
 * optional plain-language label. Centred on (x, y); `glow` 0–1 lights it.
 */
export function EventChip({
  x,
  y,
  code,
  label,
  accent,
  size,
  glow = 0,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  code: string;
  label?: string;
  accent: Accent;
  size: number;
  glow?: number;
  opacity?: number;
  scale?: number;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        gap: Math.round(size * 0.4),
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.pill,
        // Opaque base so lines passing behind the chip do not show through.
        background: `linear-gradient(${alpha(a.fg, 0.14 + 0.1 * glow)}, ${alpha(a.fg, 0.14 + 0.1 * glow)}), ${C.ink900}`,
        border: `2px solid ${alpha(a.fg, 0.55 + 0.4 * glow)}`,
        boxShadow: glow > 0 ? `0 0 ${26 * glow}px ${alpha(a.fg, 0.35 * glow)}` : 'none',
        whiteSpace: 'nowrap',
        opacity,
        lineHeight: 1.15,
      }}
    >
      <span style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 750, color: a.soft }}>{code}</span>
      {label ? <span style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 650, color: C.textStrong }}>{label}</span> : null}
    </div>
  );
}
