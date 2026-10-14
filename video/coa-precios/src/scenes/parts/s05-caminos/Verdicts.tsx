import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S05 } from '../../../data/s05-caminos';
import { GEOM } from './geom';

const VIOLET_SOFT = '#c4b5fd';
const EMERALD_SOFT = '#6ee7b7';
const AMBER_SOFT = '#fcd34d';
/** The band over the C2 row that the matrix's top leaves free from `supose` on. */
const ZONE = { top: 24, bottom: GEOM.c2.y - 56 } as const;

/** One block centred in that band. */
function Slot({ show, children, style }: { show: number; children: ReactNode; style?: CSSProperties }) {
  if (show <= 0.004) return null;
  return (
    <div style={{ position: 'absolute', left: GEOM.matrix.x, width: GEOM.matrix.w, top: ZONE.top, height: ZONE.bottom - ZONE.top, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans, textAlign: 'center', whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 12}px)`, ...style }}>
      {children}
    </div>
  );
}

/** `watch`: «ves su operación, avisas menos» and, under it, «mientras lo valioso esté protegido». */
export function WatchLabel({ show, sub }: { show: number; sub: number }) {
  return (
    <Slot show={show}>
      <div style={{ fontSize: 52, lineHeight: 1.12, fontWeight: 900, letterSpacing: -0.8, color: C.textStrong }}>
        <span style={{ color: C.cyanSoft }}>{S05.watch.a}</span> {S05.watch.b}
      </div>
      <div style={{ marginTop: 10, fontSize: 37, lineHeight: 1.15, fontWeight: 750, color: EMERALD_SOFT, opacity: sub, transform: `translateY(${(1 - sub) * 8}px)` }}>{S05.watch.sub}</div>
    </Slot>
  );
}

/** `flip`: «si ya se llevan lo crítico:» (a hypothesis: dashed) and then «contener ahora, recoger después». */
export function FlipLabel({ show, act }: { show: number; act: number }) {
  return (
    <Slot show={show}>
      <div style={{ padding: '0 22px 4px', borderRadius: 14, border: `3px dashed ${alpha('#94a3b8', 0.9)}`, fontSize: 44, lineHeight: 1.22, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong }}>{S05.flip.if}</div>
      <div style={{ marginTop: 12, fontSize: 50, lineHeight: 1.12, fontWeight: 900, letterSpacing: -0.8, opacity: act, transform: `translateY(${(1 - act) * 8}px)` }}>
        <span style={{ color: EMERALD_SOFT }}>{S05.flip.now}</span> <span style={{ color: C.textStrong }}>{S05.flip.later}</span>
      </div>
    </Slot>
  );
}

/**
 * `business`: the name INTELLIGENCE GAIN/LOSS (exam term), «la decisión final es del negocio, no del
 * SOC» and «tú pones los precios sobre la mesa». Each line has its own 0–1 weight.
 */
export function BusinessBlock({ name, decision, prices, glow = 0 }: { name: number; decision: number; prices: number; glow?: number }) {
  return (
    <Slot show={Math.max(name, decision, prices)}>
      <div style={{ fontSize: 54, lineHeight: 1.1, fontWeight: 900, letterSpacing: 1.2, color: VIOLET_SOFT, textShadow: `0 0 26px ${alpha(C.violet, 0.45)}`, opacity: name, transform: `translateY(${(1 - name) * 10}px)` }}>{S05.business.name}</div>
      <div style={{ marginTop: 12, fontSize: 37, lineHeight: 1.18, fontWeight: 800, color: C.textStrong, opacity: decision, transform: `translateY(${(1 - decision) * 8}px)` }}>{S05.business.decision}</div>
      <div style={{ marginTop: 4, fontSize: 37, lineHeight: 1.18, fontWeight: 800, color: AMBER_SOFT, textShadow: glow > 0.02 ? `0 0 ${Math.round(22 * glow)}px ${alpha(C.amber, 0.5 * glow)}` : undefined, opacity: prices * (0.75 + 0.25 * glow), transform: `translateY(${(1 - prices) * 8}px)` }}>{S05.business.prices}</div>
    </Slot>
  );
}
