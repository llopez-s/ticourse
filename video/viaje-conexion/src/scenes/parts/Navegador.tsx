import type { CSSProperties } from 'react';
import { Icon } from '../../../../engine/src/ui/Icon';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Cronometro } from './Cronometro';
import { PORTAL_BUTTON, PORTAL_HOST, PORTAL_NAME, PORTAL_OK } from './data';

/**
 * The portal in a browser window (s01). The address bar reads `reservas.haldenport.example` and, on purpose,
 * draws NO padlock (TLS is the next video). Native size NAV.w x NAV.h; NAV.button is the click target in
 * window coordinates.
 */
export const NAV = {
  w: 1200,
  h: 560,
  button: { x: 80, y: 290, w: 470, h: 96 },
  result: { x: 600, y: 160 },
} as const;

export function Navegador({
  pressed = 0,
  ok = 0,
  watch,
  style,
}: {
  /** 0-1: the button is pressed (the click). */
  pressed?: number;
  /** 0-1: «Reserva confirmada» arrives. */
  ok?: number;
  /** Stopwatch count (0-1) once armed; undefined = not shown yet. */
  watch?: number;
  style?: CSSProperties;
}) {
  const b = NAV.button;
  return (
    <div style={{ position: 'relative', width: NAV.w, height: NAV.h, borderRadius: RADIUS.lg, overflow: 'hidden', border: `2px solid ${C.ink600}`, background: C.ink900, boxShadow: `0 30px 70px ${alpha('#000000', 0.55)}`, ...style }}>
      {/* title bar with the address (no padlock) */}
      <div style={{ height: 70, background: C.ink800, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px' }}>
        {[C.roseSoft, C.amber, C.emerald].map((c, i) => (
          <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: alpha(c, 0.55) }} />
        ))}
        <div style={{ marginLeft: 12, flex: 1, height: 44, borderRadius: RADIUS.pill, background: C.ink950, border: `2px solid ${C.ink600}`, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{PORTAL_HOST}</span>
        </div>
      </div>
      {/* page */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, height: 84, background: alpha(C.cyan, 0.1), borderBottom: `2px solid ${alpha(C.cyan, 0.3)}`, display: 'flex', alignItems: 'center', padding: '0 34px' }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{PORTAL_NAME}</span>
      </div>
      {/* placeholder fields (texture) */}
      <div style={{ position: 'absolute', left: 80, top: 190, width: 470, display: 'grid', gap: 22 }}>
        {[0.9, 0.7].map((w, i) => (
          <div key={i} style={{ height: 40, width: `${w * 100}%`, borderRadius: 10, background: alpha(C.ink500, 0.35), border: `2px solid ${alpha(C.ink500, 0.5)}` }} />
        ))}
      </div>
      {/* the button */}
      <div
        style={{
          position: 'absolute',
          left: b.x,
          top: b.y,
          width: b.w,
          height: b.h,
          borderRadius: RADIUS.md,
          background: alpha(C.cyan, 0.9 - 0.25 * pressed),
          boxShadow: `0 ${Math.round(10 - 8 * pressed)}px 0 ${alpha(C.cyanDeep, 1)}`,
          transform: `translateY(${Math.round(8 * pressed)}px)`,
          display: 'grid',
          placeItems: 'center',
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 850,
          color: C.ink950,
          whiteSpace: 'nowrap',
        }}
      >
        {PORTAL_BUTTON}
      </div>
      {/* the answer */}
      <div style={{ position: 'absolute', left: NAV.result.x, top: NAV.result.y, width: 560 }}>
        <div
          style={{
            opacity: ok,
            transform: `translateY(${Math.round((1 - ok) * 16)}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 26px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.emerald, 0.8)}`,
            background: alpha(C.emerald, 0.14),
          }}
        >
          <Icon name="check" size={52} color={C.emerald} strokeWidth={3} />
          <span style={{ fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{PORTAL_OK}</span>
        </div>
        {watch !== undefined ? <Cronometro p={watch} style={{ marginTop: 34 }} /> : null}
      </div>
    </div>
  );
}
