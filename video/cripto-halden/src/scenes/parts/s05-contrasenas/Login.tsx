import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { S05 } from '../../../data/s05-contrasenas';

/**
 * s05: the shipping company's sign-in screen on the berth-booking portal. No readable account:
 * the user name is a blurred bar; the password types out as dots (drawn, not glyphs).
 * Box LOGIN_W × LOGIN_H; not positioned. All states 0–1.
 */

export const LOGIN_W = 520;
export const LOGIN_H = 540;
const DOTS = 10;

export function LoginCard({ show, typed, press, dim = 0 }: { show: number; typed: number; press: number; dim?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const n = Math.round(clamp01(typed) * DOTS);
  const pr = clamp01(press);
  return (
    <div
      style={{
        position: 'relative',
        width: LOGIN_W,
        height: LOGIN_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.6)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        boxShadow: `0 0 30px ${alpha(C.cyan, 0.14)}, 0 22px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        opacity: s * (1 - 0.55 * clamp01(dim)),
        transform: `translateY(${(1 - s) * 20}px)`,
      }}
    >
      {/* Address bar (the portal's public name, canon) */}
      <div style={{ height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: alpha(C.ink950, 0.7), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name="lock" size={24} color={C.emerald} strokeWidth={2.4} />
        <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{S05.login.host}</span>
      </div>
      <div style={{ padding: '22px 34px 0' }}>
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S05.login.title}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#6ee7b7', whiteSpace: 'nowrap', marginTop: 2 }}>{S05.login.zone}</div>
        {/* User: blurred, never readable */}
        <div style={{ marginTop: 22, fontSize: 26, fontWeight: 650, color: C.muted }}>{S05.login.user}</div>
        <div style={{ marginTop: 6, height: 56, borderRadius: RADIUS.sm, border: `2px solid ${C.ink600}`, background: C.ink950, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ width: 210, height: 16, borderRadius: 8, background: alpha(C.muted, 0.45), filter: 'blur(3px)' }} />
        </div>
        {/* Password: dots */}
        <div style={{ marginTop: 16, fontSize: 26, fontWeight: 650, color: C.muted }}>{S05.login.pass}</div>
        <div
          style={{
            marginTop: 6,
            height: 56,
            borderRadius: RADIUS.sm,
            border: `2px solid ${n > 0 && n < DOTS ? C.cyan : C.ink600}`,
            background: C.ink950,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 18px',
          }}
        >
          {Array.from({ length: n }, (_, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.textStrong }} />
          ))}
        </div>
      </div>
      {/* Button */}
      <div style={{ position: 'absolute', right: 34, bottom: 26 }}>
        <div
          style={{
            padding: '10px 34px',
            borderRadius: RADIUS.md,
            background: alpha(C.cyan, 0.25 + 0.45 * pr),
            border: `2px solid ${C.cyan}`,
            fontSize: 30,
            fontWeight: 800,
            color: C.textStrong,
            transform: `scale(${1 - 0.06 * Math.sin(Math.PI * pr)})`,
          }}
        >
          {S05.login.button}
        </div>
      </div>
    </div>
  );
}

/** A masked password as a chip of dots (`n` dots), for the flow and the table. */
export function PasswordDots({ n = 8, size = 14, tone = C.textStrong, mark = 0, markTone = C.amber }: { n?: number; size?: number; tone?: string; mark?: number; markTone?: string }) {
  const m = clamp01(mark);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.7),
        padding: `${Math.round(size * 0.9)}px ${Math.round(size * 1.2)}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${m > 0.01 ? alpha(markTone, 0.5 + 0.45 * m) : C.ink600}`,
        background: m > 0.01 ? alpha(markTone, 0.12 * m) : C.ink950,
        boxShadow: m > 0.01 ? `0 0 ${Math.round(18 * m)}px ${alpha(markTone, 0.35 * m)}` : undefined,
      }}
    >
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ width: size, height: size, borderRadius: size / 2, background: tone }} />
      ))}
    </div>
  );
}
