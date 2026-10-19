import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { FAMILIES, type Family } from './data';

export * from '../../../../engine/src/practica/bits';

/** A family name as a coloured label (the colour is only identity, never a verdict). */
export function FamTag({ f, size = 32 }: { f: Family; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.3), padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.5)}px`, borderRadius: RADIUS.pill, border: `2px solid ${alpha(f.color, 0.75)}`, background: alpha(f.color, 0.12), fontFamily: FONT.sans, fontSize: size, fontWeight: 800, color: f.color, whiteSpace: 'nowrap' }}>
      <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, background: f.color }} />
      {f.name}
    </span>
  );
}

export { FAMILIES };

/** «≠» drawn as a shape: the engine's Latin-only fonts have no such glyph. */
export function NotEqual({ size = 48, color = C.muted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
      <path d="M5 9h14M5 15h14M16 4 8 20" />
    </svg>
  );
}
