import type { ReactNode } from 'react';
import { Icon } from '../../../../engine/src/ui/Icon';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The two images of s07 (TCP / UDP): a phone call and an answering machine. Pictured, not literal; the scene
 * adds the «imagen · no es del puerto» tag under each. Own strokes, no brand. Native size IMG_W x IMG_H.
 */
export const IMG_W = 840;
export const IMG_H = 212;

/** Feather-style handset on a 24 grid. */
function Handset({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function Bubble({ x, y, p, children, color, tail = 'left' }: { x: number; y: number; p: number; children: ReactNode; color: string; tail?: 'left' | 'right' }) {
  if (p <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height: 64,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        padding: '0 26px',
        borderRadius: 22,
        border: `3px solid ${alpha(color, 0.85)}`,
        background: alpha(color, 0.13),
        fontFamily: FONT.sans,
        fontSize: 37,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${Math.round((1 - p) * 14)}px)`,
      }}
    >
      <span
        style={{
          position: 'absolute',
          [tail]: -14,
          top: 22,
          width: 22,
          height: 22,
          background: C.ink900,
          borderLeft: tail === 'left' ? `3px solid ${alpha(color, 0.85)}` : undefined,
          borderBottom: tail === 'left' ? `3px solid ${alpha(color, 0.85)}` : undefined,
          borderRight: tail === 'right' ? `3px solid ${alpha(color, 0.85)}` : undefined,
          borderTop: tail === 'right' ? `3px solid ${alpha(color, 0.85)}` : undefined,
          transform: 'rotate(45deg)',
        }}
      />
      {children}
    </div>
  );
}

/** The call: a handset and the three things said, one step lower each («descuelga», «¿me oyes?», «repite eso»). */
export function LlamadaImg({ bubbles = [1, 1, 1], glow = 0 }: { bubbles?: readonly [number, number, number] | readonly number[]; glow?: number }) {
  return (
    <div style={{ position: 'relative', width: IMG_W, height: IMG_H }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 40,
          width: 150,
          height: 150,
          borderRadius: 34,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.1 + 0.1 * glow),
          border: `3px solid ${alpha(C.cyan, 0.5 + 0.4 * glow)}`,
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : undefined,
        }}
      >
        <Handset size={96} color={C.cyan} />
      </div>
      <Bubble x={200} y={0} p={bubbles[0] ?? 0} color={C.cyan}>
        descuelga
      </Bubble>
      <Bubble x={360} y={72} p={bubbles[1] ?? 0} color={C.cyan}>
        ¿me oyes?
      </Bubble>
      <Bubble x={520} y={144} p={bubbles[2] ?? 0} color={C.amber}>
        repite eso
      </Bubble>
    </div>
  );
}

/** The answering machine: a message goes in (`msg` 0-1) and nobody confirms (`silent` 0-1). */
export function ContestadorImg({ msg = 1, silent = 1, glow = 0 }: { msg?: number; silent?: number; glow?: number }) {
  const bx = 640 - 360 * msg;
  return (
    <div style={{ position: 'relative', width: IMG_W, height: IMG_H }}>
      {/* the machine */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 36,
          width: 250,
          height: 156,
          boxSizing: 'border-box',
          borderRadius: 26,
          border: `3px solid ${alpha(C.amber, 0.5 + 0.4 * glow)}`,
          background: alpha(C.amber, 0.08 + 0.08 * glow),
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.amber, 0.35 * glow)}` : undefined,
        }}
      >
        {/* two tape reels */}
        {[70, 168].map((cx) => (
          <div key={cx} style={{ position: 'absolute', left: cx - 36, top: 26, width: 72, height: 72, borderRadius: 36, boxSizing: 'border-box', border: `3px solid ${alpha(C.amber, 0.8)}`, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, border: `3px solid ${alpha(C.amber, 0.8)}` }} />
          </div>
        ))}
        {/* speaker slots and the light */}
        <div style={{ position: 'absolute', left: 32, bottom: 20, width: 140, height: 14, borderTop: `3px solid ${alpha(C.amber, 0.5)}`, borderBottom: `3px solid ${alpha(C.amber, 0.5)}` }} />
        <div style={{ position: 'absolute', right: 30, bottom: 18, width: 18, height: 18, borderRadius: 9, background: alpha(C.amber, 0.4 + 0.6 * msg), boxShadow: `0 0 ${Math.round(16 * msg)}px ${alpha(C.amber, 0.8 * msg)}` }} />
      </div>
      {/* the message on its way in */}
      {msg < 0.98 ? (
        <div
          style={{
            position: 'absolute',
            left: bx,
            top: 74,
            height: 64,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderRadius: 22,
            border: `3px solid ${alpha(C.amber, 0.85)}`,
            background: alpha(C.amber, 0.13),
            fontFamily: FONT.sans,
            fontSize: 37,
            fontWeight: 800,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, msg * 6) * (1 - Math.max(0, msg - 0.85) * 6.6),
          }}
        >
          recado
        </div>
      ) : null}
      {/* nobody confirms */}
      <div style={{ position: 'absolute', left: 310, top: 78, display: 'flex', alignItems: 'center', gap: 14, opacity: silent, transform: `translateX(${Math.round((1 - silent) * -16)}px)` }}>
        <Icon name="x" size={44} color={C.amber} strokeWidth={3} />
        <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>nadie confirma</span>
      </div>
      <div style={{ position: 'absolute', left: 310, top: 140, fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: silent }}>lo dejas y cuelgas</div>
    </div>
  );
}

