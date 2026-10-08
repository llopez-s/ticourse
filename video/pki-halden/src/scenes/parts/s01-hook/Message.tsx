import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { MESSAGE } from '../../../data/s01-hook';
import { ShipBadge } from './Ship';

/**
 * The shipping company's message, Tuesday 10-11 at 08:15: the ship badge
 * (emerald, «una naviera»; no name, no address) and the card — date and time,
 * the sentence, and the error its program prints, `unable to get local issuer
 * certificate`, in mono and amber (error 20's colour). Not positioned.
 */

export const MESSAGE_CARD = { badge: 150, gap: 34, width: 1250 } as const;

export function MessageCard({ badgeGlow = 0, errorLit = 0 }: { badgeGlow?: number; errorLit?: number }) {
  const e = clamp01(errorLit);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: MESSAGE_CARD.gap, fontFamily: FONT.sans }}>
      <ShipBadge size={MESSAGE_CARD.badge} label={MESSAGE.who} labelSize={32} glow={badgeGlow} />
      <div
        style={{
          position: 'relative',
          width: MESSAGE_CARD.width,
          boxSizing: 'border-box',
          padding: '24px 36px 30px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.emerald, 0.6)}`,
          background: `linear-gradient(180deg, ${alpha(C.emerald, 0.09)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
          boxShadow: `0 0 30px ${alpha(C.emerald, 0.14)}, 0 26px 60px ${alpha('#000000', 0.45)}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <Icon name="mail" size={34} color={C.emerald} />
          <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 750, color: '#6ee7b7' }}>{MESSAGE.stamp}</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
          {MESSAGE.body.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '8px 22px 8px 16px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.amber, 0.45 + 0.5 * e)}`,
            background: alpha(C.amber, 0.06 + 0.1 * e),
            boxShadow: e > 0.02 ? `0 0 ${Math.round(26 * e)}px ${alpha(C.amber, 0.28 * e)}` : undefined,
            whiteSpace: 'pre',
          }}
        >
          <Icon name="alert" size={32} color={C.amber} />
          <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: '#fcd34d' }}>{MESSAGE.error}</span>
        </div>
      </div>
    </div>
  );
}
