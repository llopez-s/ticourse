import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';

export const PROPOSAL_W = 600;
export const PROPOSAL_H = 100;

/**
 * One proposal card (s02): icon, text (up to two lines), the emerald tick of «las cuatro funcionan» (`tick`), the
 * emerald highlight when it is the one that attacks the cause (`win`), a dim when another one wins (`dim`) and a rose
 * strike when its reason is shown (`strike`).
 */
export function Proposal({
  text,
  icon,
  show,
  tick,
  win = 0,
  dim = 0,
  strike = 0,
}: {
  text: string;
  icon: IconName;
  show: number;
  tick: number;
  win?: number;
  dim?: number;
  strike?: number;
}) {
  const w = clamp01(win);
  const d = clamp01(dim);
  const s = clamp01(strike);
  const tone = w > 0.5 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        width: PROPOSAL_W,
        height: PROPOSAL_H,
        boxSizing: 'border-box',
        padding: '0 86px 0 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        borderRadius: RADIUS.lg,
        border: `${w > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.4 + 0.5 * Math.max(w, 0.3))}`,
        background: alpha(w > 0.5 ? C.emeraldDeep : C.ink850, 0.75),
        boxShadow: w > 0.02 ? `0 0 ${Math.round(28 * w)}px ${alpha(C.emerald, 0.35 * w)}` : undefined,
        opacity: clamp01(show) * (1 - 0.6 * d),
        transform: `scale(${1 + 0.03 * w})`,
        transformOrigin: '0 50%',
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={40} color={tone} />
      <div style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.12, color: C.textStrong }}>{text}</div>
      {tick > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: (PROPOSAL_H - 50) / 2,
            width: 50,
            height: 50,
            borderRadius: 25,
            border: `3px solid ${C.emerald}`,
            background: alpha(C.emerald, 0.16),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${0.4 + 0.6 * Math.min(1, tick)})`,
            opacity: Math.min(1, tick * 1.5),
          }}
        >
          <Icon name="check" size={32} color={C.emerald} strokeWidth={3} />
        </div>
      ) : null}
      {s > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            height: 6,
            width: (PROPOSAL_W - 32) * s,
            borderRadius: 3,
            background: C.rose,
            boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
            transform: 'translateY(-50%) rotate(-4deg)',
            transformOrigin: '0 50%',
          }}
        />
      ) : null}
    </div>
  );
}
