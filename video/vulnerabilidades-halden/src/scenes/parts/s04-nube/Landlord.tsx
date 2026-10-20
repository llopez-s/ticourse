import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { LANDLORD, TENANT } from '../../../data/s04-nube';
import { Pill } from '../Labels';

/** A window (frame + cross bar), drawn like the engine's line icons. */
function WindowGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x={4} y={3.5} width={16} height={17} rx={1.5} />
      <path d="M12 3.5v17M4 12h16" />
    </svg>
  );
}

/**
 * s04's first beat, the right column next to the building: on `landlord` «casero» with «estructura · instalación ·
 * paredes» (sky, lit on their words); on `tenant` «inquilino» with its three icons — quién entra, cómo cierra, lo que
 * guarda (cyan) — each lit on its word. `at` maps each item's word to a local frame.
 */
export function LandlordTenant({ frame, left, top, landlordAt, tenantAt, wordAt }: { frame: number; left: number; top: number; landlordAt: number; tenantAt: number; wordAt: (seg: string, word: string) => number }) {
  const lIn = frame >= landlordAt - 4 ? enter(frame, landlordAt, { distance: 16 }) : null;
  const tIn = frame >= tenantAt - 4 ? enter(frame, tenantAt, { distance: 16 }) : null;
  const lDim = 1 - 0.45 * progress(frame, tenantAt, 12);
  return (
    <div style={{ position: 'absolute', left, top, fontFamily: FONT.sans }}>
      {lIn ? (
        <div style={{ ...lIn, opacity: lIn.opacity * lDim }}>
          <Pill text={LANDLORD.who} tone={C.sky} icon="user" size={40} height={64} weight={850} />
          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 36, fontWeight: 750, whiteSpace: 'nowrap' }}>
            {LANDLORD.items.map((it, i) => (
              <span key={it.text} style={{ color: '#bae6fd', opacity: 0.3 + 0.7 * progress(frame, wordAt(it.seg, it.word) - 4 + i * 2, 10) }}>
                {it.text}
                {i < LANDLORD.items.length - 1 ? <span style={{ color: C.faint, marginLeft: 16 }}>·</span> : null}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {tIn ? (
        <div style={{ position: 'absolute', left: 0, top: 200, ...tIn }}>
          <Pill text={TENANT.who} tone={C.cyan} icon="user" size={40} height={64} weight={850} />
          <div style={{ display: 'flex', gap: 22, marginTop: 20 }}>
            {TENANT.items.map((it) => {
              const on = progress(frame, wordAt(it.seg, it.word) - 4, 10);
              return (
                <div
                  key={it.text}
                  style={{
                    width: 270,
                    height: 150,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `2px solid ${alpha(C.cyan, 0.3 + 0.6 * on)}`,
                    background: alpha(C.cyan, 0.04 + 0.1 * on),
                    boxShadow: on > 0.02 ? `0 0 ${Math.round(20 * on)}px ${alpha(C.cyan, 0.25 * on)}` : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    opacity: 0.4 + 0.6 * on,
                  }}
                >
                  {it.icon === 'window' ? <WindowGlyph size={56} color={C.cyan} /> : <Icon name={it.icon} size={56} color={C.cyan} />}
                  <span style={{ fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{it.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
