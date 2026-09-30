import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { KEY_COLOR } from '../s05-cert/bits';

export const LENS_R = 170;

/**
 * The magnifier over one free-CA notice: the issuer is struck out, the exact
 * fingerprint is what pivots.
 */
export function Lens({ cx, cy, p, fingerprint }: { cx: number; cy: number; p: number; fingerprint: string }) {
  if (p <= 0) return null;
  const hx = cx + LENS_R * 0.72;
  const hy = cy + LENS_R * 0.72;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity: p, pointerEvents: 'none' }}>
      {/* Handle. */}
      <div
        style={{
          position: 'absolute',
          left: hx - 6,
          top: hy - 14,
          width: 120,
          height: 28,
          borderRadius: 14,
          background: `linear-gradient(180deg, ${C.ink600} 0%, ${C.ink800} 100%)`,
          border: `3px solid ${alpha(KEY_COLOR, 0.7)}`,
          transform: 'rotate(45deg)',
          transformOrigin: '6px 14px',
          boxShadow: `0 10px 24px ${alpha('#000000', 0.5)}`,
        }}
      />
      {/* Glass. */}
      <div
        style={{
          position: 'absolute',
          left: cx - LENS_R,
          top: cy - LENS_R,
          width: LENS_R * 2,
          height: LENS_R * 2,
          boxSizing: 'border-box',
          borderRadius: '50%',
          border: `7px solid ${KEY_COLOR}`,
          background: `radial-gradient(circle at 38% 32%, ${alpha('#ffffff', 0.09)} 0%, transparent 50%), radial-gradient(circle, ${C.ink800} 0%, ${C.ink850} 100%)`,
          boxShadow: `0 0 40px ${alpha(KEY_COLOR, 0.45)}, 0 24px 50px ${alpha('#000000', 0.55)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          transform: `scale(${0.7 + 0.3 * p})`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ fontSize: TYPE.small, fontWeight: 700, color: C.faint, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>CA gratuita</div>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(KEY_COLOR, 0.8)}`,
            background: alpha(KEY_COLOR, 0.14),
            fontFamily: FONT.mono,
            fontSize: TYPE.label,
            fontWeight: 800,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
          }}
        >
          SHA1 {fingerprint}
        </div>
      </div>
    </div>
  );
}
