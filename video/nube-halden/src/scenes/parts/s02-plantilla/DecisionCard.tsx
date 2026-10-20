import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { DECISION } from '../../../data/s02-plantilla';
import { StrikeLine } from '../Labels';

export const CARD = { x: 640, y: 76, w: 1088, h: 400 } as const;
/** The vault box inside the card (card-local), so the scene can point the template's key line at it. */
export const VAULT = { x: 44, y: 222, w: 520, h: 100 } as const;

/**
 * s02's decision card: «la plantilla dice dónde está la clave, no la clave»; under it, the vault «gestor de secretos»
 * (emerald, a key in a box) and, struck through in rose on its own beat, «secrets in the repo». Screen-only labels.
 */
export function DecisionCard({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 8) return null;
  const card = enter(frame, at - 6, { distance: 20 });
  const vault = enter(frame, at + 14, { distance: 14 });
  const struck = enter(frame, at + 22, { distance: 14 });
  const strike = progress(frame, at + 34, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        padding: '30px 44px',
        borderRadius: RADIUS.lg,
        background: alpha(C.ink900, 0.96),
        border: `3px solid ${alpha(C.emerald, 0.7)}`,
        boxShadow: `0 0 36px ${alpha(C.emerald, 0.16)}`,
        fontFamily: FONT.sans,
        ...card,
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 850, lineHeight: 1.15, color: C.textStrong, letterSpacing: -0.5 }}>
        {DECISION.text.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: VAULT.x,
          top: VAULT.y,
          width: VAULT.w,
          height: VAULT.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.emerald, 0.85)}`,
          background: alpha(C.emerald, 0.1),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 26px',
          ...vault,
        }}
      >
        <div style={{ width: 62, height: 62, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.16), border: `2px solid ${alpha(C.emerald, 0.8)}` }}>
          <Icon name="key" size={36} color={C.emerald} />
        </div>
        <span style={{ fontSize: 40, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap' }}>{DECISION.vault}</span>
      </div>
      <div style={{ position: 'absolute', left: VAULT.x + VAULT.w + 60, top: VAULT.y + 24, ...struck }}>
        <div style={{ position: 'relative', fontSize: 38, fontWeight: 800, color: alpha(C.roseSoft, 1 - 0.35 * strike), whiteSpace: 'nowrap' }}>
          {DECISION.struck}
          <StrikeLine strike={strike} />
        </div>
      </div>
    </div>
  );
}
