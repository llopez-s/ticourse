import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui/Icon';

export * from '../../../../engine/src/practica/bits';

/** Colour meanings of this video (the engine's own: cyan data, amber noise, rose blind spot, emerald validated). */
export const K = {
  target: C.cyan,
  noise: C.amber,
  miss: C.rose,
  ok: C.emerald,
  link: C.sky,
} as const;

/** Round result mark: a check (matches), a cross (miss) or a dash (no match). */
export function Mark({ kind, size = 44, color }: { kind: 'yes' | 'no' | 'none'; size?: number; color?: string }) {
  const col = color ?? (kind === 'yes' ? C.emerald : kind === 'no' ? C.rose : C.faint);
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, display: 'grid', placeItems: 'center', border: `2px solid ${alpha(col, kind === 'none' ? 0.5 : 0.9)}`, background: kind === 'none' ? 'transparent' : alpha(col, 0.16), fontFamily: FONT.sans }}>
      {kind === 'yes' ? <Icon name="check" size={size * 0.62} color={col} strokeWidth={3} /> : kind === 'no' ? <Icon name="x" size={size * 0.62} color={col} strokeWidth={3} /> : <div style={{ width: size * 0.34, height: 3, borderRadius: 2, background: col }} />}
    </div>
  );
}

/** Card surface used by several scenes. */
export const CARD = {
  boxSizing: 'border-box' as const,
  borderRadius: RADIUS.md,
  background: C.ink850,
  border: `2px solid ${C.ink700}`,
  fontFamily: FONT.sans,
};
