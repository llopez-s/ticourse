import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { POLICY } from '../../../data/s03-mfa';
import { MarkStamp } from '../s02-spray/Marks';

/**
 * s03: the password policy card next to `Halden2026!` — three green boxes
 * (mayúscula · cifras · símbolo) tick one by one and the stamp «cumple» hits.
 * The password is only ever shown here (and in RED MARROW's message). Not
 * positioned; `width` × POLICY_CARD_H.
 */

export const POLICY_CARD_H = 236;

export function PolicyCard({
  width,
  frame,
  show,
  checks,
  stampAt,
}: {
  width: number;
  frame: number;
  show: number;
  /** 0…3: boxes ticked so far (fractional = the tick fading in). */
  checks: number;
  /** Frame the stamp hits. */
  stampAt: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: POLICY_CARD_H,
        boxSizing: 'border-box',
        padding: '20px 30px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.45)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.97)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.42)}`,
        fontFamily: FONT.sans,
        opacity: s,
        transform: `translateY(${(1 - s) * 20}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
        <Icon name="lock" size={32} color={C.cyan} />
        {POLICY.title}
      </div>
      <div style={{ marginTop: 10, height: 80, display: 'flex', alignItems: 'center', gap: 28 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 64, fontWeight: 800, color: C.textStrong, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{POLICY.password}</span>
        <MarkStamp frame={frame} at={stampAt} size={42} icon="check">
          {POLICY.stamp}
        </MarkStamp>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 26 }}>
        {POLICY.checks.map((label, i) => {
          const p = clamp01(checks - i);
          return (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  boxSizing: 'border-box',
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  border: `3px solid ${p > 0.01 ? alpha(C.emerald, 0.5 + 0.5 * p) : C.ink600}`,
                  background: alpha(C.emerald, 0.75 * p),
                  boxShadow: p > 0.01 ? `0 0 ${Math.round(14 * p)}px ${alpha(C.emerald, 0.45 * p)}` : undefined,
                }}
              >
                {p > 0.01 ? (
                  <svg width={24} height={24} viewBox="0 0 24 24" style={{ opacity: p }}>
                    <path d="M 5 12.5 L 10 17.5 L 19 7" fill="none" stroke={C.ink950} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
              <span style={{ fontSize: 32, fontWeight: 700, color: p > 0.5 ? C.textStrong : C.muted }}>{label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
