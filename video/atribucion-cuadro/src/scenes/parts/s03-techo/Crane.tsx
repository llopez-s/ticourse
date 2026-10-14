import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { S03_COUNTRY, S03_CRANE, S03_DARK, S03_NAMES } from '../../../data/s03-techo';
import { LEVELS } from '../../../data/levels';
import { Confidence } from '../Lanes';

/** PAPER CRANE's card (rose: the only rose of the scene besides the engine's message). */
export function CraneCard({ width, show = 1 }: { width: number; show?: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '18px 24px 20px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 70%), ${C.ink900}`,
        boxShadow: `0 0 30px ${alpha(C.rose, 0.2)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * 22}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="flag" size={36} color={C.rose} strokeWidth={2.2} />
        <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{S03_CRANE.name}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 32, fontWeight: 750, lineHeight: 1.2, color: C.text }}>{S03_CRANE.role}</div>
      <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.2, color: C.textStrong }}>{S03_CRANE.does}</div>
    </div>
  );
}

/**
 * The word «país», lifted from the message (a rose outline, a dotted tie going up to the card), and what
 * it is: «el tercer nivel». `tie` is the height in px of the dotted line above the chip; `tieShow` fades it
 * (it only makes sense while the message is up).
 */
export function CountryTag({ show = 1, said = 0, tie = 60, tieShow = 1 }: { show?: number; said?: number; tie?: number; tieShow?: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: show }}>
      <div style={{ position: 'relative' }}>
        <svg width={8} height={tie} style={{ position: 'absolute', left: '50%', bottom: '100%', marginLeft: -4, opacity: tieShow }}>
          <path d={`M 4 ${tie} V 2`} stroke={alpha(C.rose, 0.9)} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 10" />
        </svg>
        <div style={{ padding: '4px 22px 7px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.rose, 0.85)}`, background: alpha(C.roseDeep, 0.85), fontSize: 40, fontWeight: 850, lineHeight: 1.12, color: C.textStrong }}>
          {S03_COUNTRY.word}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.45 + 0.55 * said }}>
        <svg width={44} height={16}>
          <path d="M 2 8 H 42" stroke={alpha('#f8fafc', 0.9)} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 10" />
        </svg>
        <span style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.1, color: '#7dd3fc', textShadow: said > 0.02 ? `0 0 ${Math.round(18 * said)}px ${alpha(C.sky, 0.6 * said)}` : undefined }}>{S03_COUNTRY.is}</span>
      </div>
    </div>
  );
}

/**
 * A lane's text in this scene: the level's name (the first over two lines), then either its confidence
 * (as s02 left it) or, on the third lane once it is in the dark, «no deja rastro en tu red».
 */
export function LaneText({ i, tone, size = 32, conf = 1, dark = 0, lit = 0 }: { i: 0 | 1 | 2; tone: string; size?: number; conf?: number; dark?: number; lit?: number }) {
  const ink = i === 2 ? '#c4b5fd' : tone;
  return (
    <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.12, letterSpacing: 0.5, color: ink, textShadow: lit > 0.02 ? `0 0 ${Math.round(18 * lit)}px ${alpha(ink, 0.6 * lit)}` : undefined }}>
        {S03_NAMES[i].map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 2 }}>
        <Confidence level={LEVELS[i]} size={Math.round(size * 0.8)} show={conf * (1 - dark)} />
        {i === 2 && dark > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, fontSize: size - 2, fontWeight: 750, lineHeight: 1.2, color: C.text, opacity: dark }}>{S03_DARK}</div> : null}
      </div>
    </div>
  );
}
