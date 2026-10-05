import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { ADDRESS, SKETCH } from '../../../data/s05-amp';
import { Storefront } from './Street';

export const INSET_W = 500;
export const INSET_H = 200;

/**
 * The inset of s05: someone phoning restaurants and giving YOUR address. A person (rose) with a phone,
 * short call waves to three storefronts, and the address tag (cyan, the portal's colour). `show`,
 * `calls` (0–1 the dial lines draw), `address` (the tag lands), `addressGlow` (REFLECTED is said).
 */
export function PhoneInset({ show, calls, address, addressGlow }: { show: number; calls: number; address: number; addressGlow: number }) {
  const phone = { x: 132, y: 72 };
  const shops = [
    { x: 360, y: 16 },
    { x: 360, y: 82 },
    { x: 360, y: 148 },
  ];
  return (
    <div
      style={{
        position: 'relative',
        width: INSET_W,
        height: INSET_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.35)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.45)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: show,
        transform: `scale(${0.94 + 0.06 * show})`,
        transformOrigin: '0 0',
      }}
    >
      <svg width={INSET_W} height={INSET_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* Dial lines: one short call to each restaurant */}
        {shops.map((s, k) => {
          const p = clamp01(calls * 3 - k);
          const x2 = phone.x + 26 + (s.x - phone.x - 26) * p;
          const y2 = phone.y + (s.y + 30 - phone.y) * p;
          return p > 0 ? (
            <line key={k} x1={phone.x + 26} y1={phone.y} x2={x2} y2={y2} stroke={alpha(C.roseSoft, 0.8)} strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />
          ) : null;
        })}
        {shops.map((s, k) => (
          <Storefront key={k} x={s.x} y={s.y} w={70} h={48} opacity={0.4 + 0.6 * clamp01(calls * 3 - k)} />
        ))}
        {/* The handset, at the person's ear */}
        <g transform={`translate(${phone.x} ${phone.y}) rotate(-28)`}>
          <path d="M-8 -22 q-8 0 -8 10 v24 q0 10 8 10 h6 v-12 h-4 v-20 h4 v-12 Z" fill={alpha(C.rose, 0.8)} stroke="#fecdd3" strokeWidth={2} strokeLinejoin="round" />
        </g>
        {/* Call waves */}
        {[0, 1].map((k) => (
          <path key={`w${k}`} d={`M${phone.x + 16 + k * 10} ${phone.y - 16 - k * 6} q${12 + k * 6} 16 0 ${32 + k * 12}`} fill="none" stroke={alpha(C.roseSoft, 0.7 * clamp01(calls * 2))} strokeWidth={3} strokeLinecap="round" />
        ))}
      </svg>
      {/* The caller */}
      <div style={{ position: 'absolute', left: 28, top: 22 }}>
        <Icon name="user" size={104} color={C.roseSoft} strokeWidth={1.7} />
      </div>
      {/* The address the caller gives: yours */}
      {address > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: INSET_H - 62,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 16px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.6 + 0.4 * addressGlow)}`,
            background: alpha(C.cyan, 0.12 + 0.1 * addressGlow),
            boxShadow: addressGlow > 0 ? `0 0 ${22 * addressGlow}px ${alpha(C.cyan, 0.45 * addressGlow)}` : undefined,
            opacity: address,
            transform: `translateY(${(1 - address) * 10}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="server" size={30} color={C.cyan} />
          <span style={{ fontSize: 32, fontWeight: 800, color: C.cyanSoft }}>{ADDRESS}</span>
        </div>
      ) : null}
    </div>
  );
}

export const SKETCH_W = 500;
export const SKETCH_H = 212;
const BAR_MAX = 440;

/**
 * The mechanism, as a sketch (dashed frame, «esquema del mecanismo · no es del registro»): a 60-byte
 * question and a 3.000-byte answer, bars to the same scale (1:50). `q` and `a` (0–1) draw them.
 */
export function BytesSketch({ show, q, a }: { show: number; q: number; a: number }) {
  const qW = (BAR_MAX * SKETCH.q) / SKETCH.a;
  return (
    <div
      style={{
        position: 'relative',
        width: SKETCH_W,
        height: SKETCH_H,
        boxSizing: 'border-box',
        padding: '12px 26px',
        borderRadius: RADIUS.lg,
        border: `2px dashed ${alpha(C.muted, 0.6)}`,
        background: alpha(C.ink900, 0.9),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
      }}
    >
      {SKETCH.tag.map((t) => (
        <div key={t} style={{ fontSize: 24, fontWeight: 700, fontStyle: 'italic', color: C.muted, lineHeight: 1.15 }}>
          {t}
        </div>
      ))}
      <div style={{ marginTop: 10, fontSize: 32, fontWeight: 750, color: C.text, opacity: 0.3 + 0.7 * q }}>{SKETCH.question}</div>
      <div style={{ marginTop: 4, height: 12, width: Math.max(4, qW * q), borderRadius: 4, background: C.roseSoft, opacity: q }} />
      <div style={{ marginTop: 8, fontSize: 32, fontWeight: 800, color: a > 0.5 ? '#fecdd3' : C.text, opacity: 0.3 + 0.7 * a }}>{SKETCH.answer}</div>
      <div style={{ marginTop: 4, height: 12, width: BAR_MAX * a, borderRadius: 4, background: C.rose, boxShadow: a > 0 ? `0 0 14px ${alpha(C.rose, 0.5 * a)}` : undefined }} />
    </div>
  );
}
