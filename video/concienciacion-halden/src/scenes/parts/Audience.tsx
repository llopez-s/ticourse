import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import type { AudienceDef } from '../../data/audiences';

export const AUDIENCE_H = 250;

/**
 * One audience of the training programme: its icon and name, the risk it runs (amber) and the training it gets
 * (emerald). `on` 0–1 lights it (border, glow, text); unlit it waits at about a third of its light.
 */
export function AudienceCard({ a, width, on = 1 }: { a: AudienceDef; width: number; on?: number }) {
  const o = Math.max(0, Math.min(1, on));
  const tone = C.cyan;
  return (
    <div
      style={{
        width,
        height: AUDIENCE_H,
        boxSizing: 'border-box',
        padding: '14px 20px 12px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${alpha(tone, 0.05 + 0.07 * o)} 0%, ${C.ink900} 70%)`,
        border: `3px solid ${alpha(tone, 0.28 + 0.55 * o)}`,
        boxShadow: o > 0.02 ? `0 0 ${Math.round(26 * o)}px ${alpha(tone, 0.2 * o)}` : undefined,
        fontFamily: FONT.sans,
        opacity: 0.45 + 0.55 * o,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66 }}>
        <Icon name={a.icon} size={40} color={tone} />
        <div style={{ fontSize: 31, fontWeight: 850, lineHeight: 1.1, color: C.textStrong }}>{a.name}</div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {a.risk.map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 27, fontWeight: 700, lineHeight: 1.18, color: C.amber }}>
            <Icon name="alert" size={26} color={C.amber} style={{ marginTop: 3 }} />
            <span>{t}</span>
          </div>
        ))}
        {a.train.map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 27, fontWeight: 700, lineHeight: 1.18, color: C.text }}>
            <Icon name="check" size={26} color={C.emerald} style={{ marginTop: 3 }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
