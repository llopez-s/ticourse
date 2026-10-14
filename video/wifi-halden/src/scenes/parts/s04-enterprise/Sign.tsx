import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { REPLY, SIGN as TEXT } from '../../../data/s04-enterprise';
import { SIGN } from './layout';

/**
 * The shared key, on a sign: «HALDEN-OPS · una clave · toda la terminal · sin cambiar desde 2022»,
 * one part per line. Amber: a finding, nobody's fault. Drawn at SIGN.w × SIGN.h; the scene places
 * and scales it (`at`), from its top-left corner.
 */
const AMBER_SOFT = '#fde68a';

export function Sign({
  at,
  show = 1,
  lit = 0,
  who = 0,
  dim = 0,
}: {
  at: { x: number; y: number; scale: number };
  show?: number;
  /** 0–1: the voice is on the sign. */
  lit?: number;
  /** 0–1: «toda la terminal» is the line that matters («mira quién la sabe»). */
  who?: number;
  dim?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const l = clamp01(lit);
  const w = clamp01(who);
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        width: SIGN.w,
        height: SIGN.h,
        boxSizing: 'border-box',
        padding: '18px 34px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.amber, 0.55 + 0.4 * l)}`,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.09 + 0.07 * l)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: `0 0 ${Math.round(12 + 34 * l)}px ${alpha(C.amber, 0.1 + 0.22 * l)}, 0 14px 30px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: s * (1 - 0.5 * clamp01(dim)),
        transform: `scale(${at.scale})`,
        transformOrigin: '0 0',
      }}
    >
      {/* the two pins that hold it to the wall */}
      {[26, SIGN.w - 38].map((x) => (
        <div key={x} style={{ position: 'absolute', left: x, top: 12, width: 12, height: 12, borderRadius: 99, background: alpha(C.amber, 0.75) }} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <WifiMark />
        <span style={{ fontFamily: FONT.mono, fontSize: 58, fontWeight: 800, letterSpacing: 0.5, color: C.cyanSoft }}>{TEXT.network}</span>
      </div>
      <div style={{ fontSize: 54, fontWeight: 850, letterSpacing: -0.5, lineHeight: 1.12, color: AMBER_SOFT }}>{TEXT.one}</div>
      <div
        style={{
          alignSelf: 'flex-start',
          margin: '0 -12px',
          padding: '0 12px 2px',
          borderRadius: RADIUS.sm,
          background: alpha(C.amber, 0.2 * w),
          boxShadow: w > 0.01 ? `inset 5px 0 0 ${alpha(C.amber, 0.9 * w)}` : undefined,
          fontSize: 46,
          fontWeight: 780,
          lineHeight: 1.16,
          color: C.textStrong,
        }}
      >
        {TEXT.who}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
        <Icon name="clock" size={38} color={C.amber} strokeWidth={2.2} />
        <span style={{ fontSize: 40, fontWeight: 780, color: AMBER_SOFT }}>{TEXT.since}</span>
      </div>
    </div>
  );
}

/** The network's mark: a dot and three arcs of signal (sky: infrastructure). */
function WifiMark() {
  const arc = (r: number) => `M ${28 - r * 0.707} ${46 - r * 0.707} A ${r} ${r} 0 0 1 ${28 + r * 0.707} ${46 - r * 0.707}`;
  return (
    <svg width={56} height={54} viewBox="0 0 56 54" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={28} cy={46} r={5.5} fill={C.sky} />
      {[14, 25, 36].map((r) => (
        <path key={r} d={arc(r)} fill="none" stroke={C.sky} strokeWidth={5.5} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/**
 * The answer to the intercepted advice, in the right column over the tablets:
 * «larga aguanta las pruebas, sí» and, bigger, «mira quién la sabe».
 */
export function Reply({ x, y, first, second, out = 0 }: { x: number; y: number; first: number; second: number; out?: number }) {
  const a = clamp01(first);
  const b = clamp01(second);
  const o = 1 - clamp01(out);
  if (a * o <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: o }}>
      <div style={{ fontSize: 40, fontWeight: 720, lineHeight: 1.15, color: alpha(C.textStrong, 1 - 0.18 * b), opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>{REPLY[0]}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 56,
          fontWeight: 880,
          letterSpacing: -0.6,
          lineHeight: 1.12,
          color: AMBER_SOFT,
          textShadow: `0 0 ${Math.round(24 * b)}px ${alpha(C.amber, 0.45 * b)}`,
          opacity: b,
          transform: `translateY(${(1 - b) * 10}px)`,
        }}
      >
        {REPLY[1]}
      </div>
    </div>
  );
}
