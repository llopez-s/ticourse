import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The wristwatch you look at while someone asks you the time (s04, s08 rule 2): a round face on its strap, hands
 * only, no digits. `glow` 0–1 lights it amber (the bait).
 */
export function Watch({ size, glow = 0, frame = 0 }: { size: number; glow?: number; frame?: number }) {
  const g = clamp01(glow);
  const minute = (frame * 2) % 360;
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 100 150" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={30} y={0} width={40} height={150} rx={10} fill="#3a2f2a" stroke="#5c4a40" strokeWidth={2} />
      {g > 0.02 ? <circle cx={50} cy={75} r={50} fill={alpha(C.amber, 0.22 * g)} /> : null}
      <circle cx={50} cy={75} r={38} fill={C.ink900} stroke={g > 0.02 ? C.amber : '#cbd5e1'} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={50 + Math.sin(a) * 28} y1={75 - Math.cos(a) * 28} x2={50 + Math.sin(a) * 33} y2={75 - Math.cos(a) * 33} stroke={alpha(C.text, 0.6)} strokeWidth={i % 3 === 0 ? 3.5 : 2} />;
      })}
      <line x1={50} y1={75} x2={50 + Math.sin((300 * Math.PI) / 180) * 18} y2={75 - Math.cos((300 * Math.PI) / 180) * 18} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
      <line x1={50} y1={75} x2={50 + Math.sin((minute * Math.PI) / 180) * 27} y2={75 - Math.cos((minute * Math.PI) / 180) * 27} stroke={C.text} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={50} cy={75} r={4} fill={C.text} />
    </svg>
  );
}

/** The question that is the bait: a speech bubble «¿qué hora es?» (amber outline), tail at the bottom-right. */
export function TimeBubble({ show = 1, size = 34 }: { show?: number; size?: number }) {
  const s = clamp01(show);
  return (
    <div style={{ position: 'relative', display: 'inline-block', opacity: s, transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: '90% 100%' }}>
      <div
        style={{
          padding: '14px 26px',
          borderRadius: 28,
          border: `3px solid ${C.amber}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: size,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          boxShadow: `0 0 20px ${alpha(C.amber, 0.25)}`,
        }}
      >
        ¿qué hora es?
      </div>
      <svg width={40} height={30} style={{ position: 'absolute', right: 40, bottom: -27, overflow: 'visible' }}>
        <path d="M 0 0 L 34 28 L 24 0" fill={C.ink900} stroke={C.amber} strokeWidth={3} strokeLinejoin="round" />
        <rect x={2} y={-4} width={20} height={6} fill={C.ink900} />
      </svg>
    </div>
  );
}
