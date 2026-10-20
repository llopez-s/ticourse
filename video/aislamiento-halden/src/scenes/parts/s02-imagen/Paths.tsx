import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { PATH_PATCH, PATH_REBUILD } from '../../../data/s02-imagen';
import { StrikeLine } from '../Labels';

export const PATH_W = 1100;

/**
 * Path 1 (`two-paths`): «entrar en cada copia y corregirlo dentro», struck through in rose with `strike`, and its
 * reason «la próxima copia sale igual» on `note`. Grey card: the road not taken.
 */
export function PatchPath({ show, strike, note }: { show: number; strike: number; note: number }) {
  return (
    <div
      style={{
        width: PATH_W,
        boxSizing: 'border-box',
        padding: '14px 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.muted, 0.45)}`,
        background: alpha(C.ink800, 0.85),
        fontFamily: FONT.sans,
        opacity: clamp01(show),
        transform: `translateY(${(1 - clamp01(show)) * 14}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name="gear" size={34} color={C.muted} />
        <span style={{ position: 'relative', fontSize: 34, fontWeight: 750, color: strike > 0.5 ? C.muted : C.textStrong, whiteSpace: 'nowrap' }}>
          {PATH_PATCH.text}
          <StrikeLine strike={strike} tilt={-1.5} />
        </span>
      </div>
      <div style={{ marginTop: 8, marginLeft: 50, fontSize: 32, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap', opacity: clamp01(note) }}>
        {PATH_PATCH.note}
      </div>
    </div>
  );
}

/**
 * Path 2 (`rebuild`): correct the image, scan it again, deploy new copies — emerald, highlighted. `line2` 0–1 brings in
 * its second line on «copias».
 */
export function RebuildPath({ show, line2, glow }: { show: number; line2: number; glow: number }) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: PATH_W,
        boxSizing: 'border-box',
        padding: '14px 28px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.emerald, 0.5 + 0.45 * g)}`,
        background: alpha(C.emerald, 0.06 + 0.08 * g),
        boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(C.emerald, 0.25 * g)}` : undefined,
        fontFamily: FONT.sans,
        opacity: clamp01(show),
        transform: `translateY(${(1 - clamp01(show)) * 14}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name="layers" size={34} color={C.emerald} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{PATH_REBUILD[0]}</span>
      </div>
      <div style={{ marginTop: 8, marginLeft: 50, fontSize: 32, fontWeight: 750, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: clamp01(line2) }}>
        {PATH_REBUILD[1]}
      </div>
    </div>
  );
}
