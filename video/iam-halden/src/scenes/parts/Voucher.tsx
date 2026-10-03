import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Image 4, the concierge voucher (OAuth): a ticket slip with a perforated
 * stub, «vale · recoger el paquete de hoy». `mini` draws it as an icon (stub +
 * «vale») for s06 / s11; `idCard` (0–1) lays a small identity card on top
 * (OpenID Connect = the same voucher plus «quién eres»). The crossed-out
 * alternatives of s05 are separate pieces: `DniCard` («DNI») and `Keyring`
 * («llaves»), each with a 0–1 rose `crossed`. Design units scaled to `width`.
 */

export const VOUCHER_TEXT = { head: 'vale', body: 'recoger el paquete de hoy', dni: 'DNI', keys: 'llaves' } as const;

export const VOUCHER_BASE = { w: 720, h: 190 } as const;
export const VOUCHER_MINI = { w: 170, h: 120 } as const;

/** Height in px of the voucher at `width` (full or mini; idCard adds no height). */
export function voucherHeight(width: number, mini = false): number {
  const b = mini ? VOUCHER_MINI : VOUCHER_BASE;
  return (b.h * width) / b.w;
}

/** The slip outline: a rounded ticket with notches at the perforation. */
function Slip({ w, h, stub, color, fill, stroke }: { w: number; h: number; stub: number; color: string; fill: string; stroke: number }) {
  const r = Math.min(16, h * 0.12);
  const notch = Math.min(14, h * 0.1);
  const d = [
    `M ${r} 0`,
    `H ${stub - notch}`,
    `A ${notch} ${notch} 0 0 0 ${stub + notch} 0`,
    `H ${w - r}`,
    `Q ${w} 0 ${w} ${r}`,
    `V ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `H ${stub + notch}`,
    `A ${notch} ${notch} 0 0 0 ${stub - notch} ${h}`,
    `H ${r}`,
    `Q 0 ${h} 0 ${h - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    'Z',
  ].join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={d} fill={fill} stroke={color} strokeWidth={stroke} />
      <line x1={stub} y1={notch + 6} x2={stub} y2={h - notch - 6} stroke={alpha(color, 0.7)} strokeWidth={stroke * 0.8} strokeDasharray={`${stroke * 2.2} ${stroke * 2}`} />
    </svg>
  );
}

/** Small identity card (OIDC's «ficha de quién eres»). */
function IdCardGlyph({ w, color }: { w: number; color: string }) {
  const h = w * 0.66;
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: w * 0.09,
        border: `${Math.max(3, w * 0.035)}px solid ${color}`,
        background: C.ink850,
        boxShadow: `0 10px 24px ${alpha('#000000', 0.5)}`,
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.2, width: w * 0.28, height: w * 0.28, borderRadius: '50%', background: alpha(color, 0.35), border: `2px solid ${color}` }} />
      <div style={{ position: 'absolute', left: w * 0.46, top: h * 0.26, width: w * 0.42, height: h * 0.1, borderRadius: 4, background: alpha(C.text, 0.55) }} />
      <div style={{ position: 'absolute', left: w * 0.46, top: h * 0.46, width: w * 0.32, height: h * 0.1, borderRadius: 4, background: alpha(C.text, 0.35) }} />
      <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.72, width: w * 0.78, height: h * 0.09, borderRadius: 4, background: alpha(C.text, 0.25) }} />
    </div>
  );
}

export function Voucher({
  width,
  mini = false,
  show = 1,
  idCard = 0,
  glow = 0,
  dim = 0,
  style,
}: {
  width?: number;
  mini?: boolean;
  /** 0–1 appear. */
  show?: number;
  /** 0–1: the identity card on top (OpenID Connect). */
  idCard?: number;
  /** 0–1 cyan halo. */
  glow?: number;
  /** 0–1 grey-out. */
  dim?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const base = mini ? VOUCHER_MINI : VOUCHER_BASE;
  const w = width ?? base.w;
  const s = w / base.w;
  const g = clamp01(glow);
  const idP = clamp01(idCard);
  const d = clamp01(dim);
  const stub = mini ? 44 : 150;
  const color = C.cyan;
  return (
    <div style={{ position: 'relative', width: w, height: base.h * s, opacity: sh * (1 - 0.6 * d), filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: base.w,
          height: base.h,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          filter: g > 0 ? `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(color, 0.55 * g)})` : `drop-shadow(0 16px 26px ${alpha('#000000', 0.45)})`,
        }}
      >
        <Slip w={base.w} h={base.h} stub={stub} color={color} fill={C.ink850} stroke={mini ? 4 : 3} />
        {/* Stub: a parcel glyph */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: stub, height: base.h, display: 'grid', placeItems: 'center' }}>
          <svg width={mini ? 28 : 74} height={mini ? 28 : 74} viewBox="0 0 24 24" fill="none" stroke={C.cyanSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z" />
            <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9M7.8 5.5l8.5 4" />
          </svg>
        </div>
        {mini ? (
          <div
            style={{
              position: 'absolute',
              left: stub,
              top: 0,
              width: base.w - stub,
              height: base.h,
              display: 'grid',
              placeItems: 'center',
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 850,
              color: C.cyanSoft,
            }}
          >
            {VOUCHER_TEXT.head}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: stub + 28,
              top: 0,
              right: 24,
              height: base.h,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 850, color: C.cyanSoft, lineHeight: 1 }}>
              {VOUCHER_TEXT.head} <span style={{ color: C.faint, fontWeight: 400 }}>·</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.textStrong, lineHeight: 1.15 }}>{VOUCHER_TEXT.body}</div>
          </div>
        )}
        {idP > 0 ? (
          <div
            style={{
              position: 'absolute',
              right: mini ? -26 : -40,
              top: mini ? -40 : -70,
              opacity: idP,
              transform: `translateY(${(1 - idP) * -16}px) rotate(8deg)`,
            }}
          >
            <IdCardGlyph w={mini ? 92 : 170} color={C.cyan} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A rose cross drawn over a box of w × h (0–1 draws both strokes). */
function Cross({ w, h, p, stroke = 8 }: { w: number; h: number; p: number; stroke?: number }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g stroke={C.rose} strokeWidth={stroke} strokeLinecap="round">
        <line x1={w * 0.08} y1={h * 0.1} x2={w * 0.08 + w * 0.84 * Math.min(1, k * 2)} y2={h * 0.1 + h * 0.8 * Math.min(1, k * 2)} />
        {k > 0.5 ? <line x1={w * 0.92} y1={h * 0.1} x2={w * 0.92 - w * 0.84 * (k * 2 - 1)} y2={h * 0.1 + h * 0.8 * (k * 2 - 1)} /> : null}
      </g>
    </svg>
  );
}

/** An identity card labelled «DNI», optionally crossed out. */
export function DniCard({ width = 200, crossed = 0, show = 1 }: { width?: number; crossed?: number; show?: number }) {
  const h = width * 0.64;
  const sh = clamp01(show);
  if (sh <= 0) return null;
  return (
    <div style={{ position: 'relative', width, height: h + 46, opacity: sh }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height: h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.muted, 0.8)}`,
          background: C.ink850,
          opacity: 1 - 0.45 * clamp01(crossed),
        }}
      >
        <div style={{ position: 'absolute', left: width * 0.1, top: h * 0.22, width: width * 0.26, height: width * 0.26, borderRadius: '50%', border: `2px solid ${C.muted}`, background: alpha(C.muted, 0.25) }} />
        <div style={{ position: 'absolute', left: width * 0.44, top: h * 0.28, width: width * 0.44, height: 10, borderRadius: 4, background: alpha(C.text, 0.45) }} />
        <div style={{ position: 'absolute', left: width * 0.44, top: h * 0.5, width: width * 0.32, height: 10, borderRadius: 4, background: alpha(C.text, 0.3) }} />
        <Cross w={width} h={h} p={crossed} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: h + 6, width, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.text, textDecoration: crossed > 0.6 ? 'line-through' : undefined, textDecorationColor: C.rose }}>
        {VOUCHER_TEXT.dni}
      </div>
    </div>
  );
}

/** A keyring labelled «llaves», optionally crossed out. */
export function Keyring({ width = 180, crossed = 0, show = 1 }: { width?: number; crossed?: number; show?: number }) {
  const h = width * 0.72;
  const sh = clamp01(show);
  if (sh <= 0) return null;
  return (
    <div style={{ position: 'relative', width, height: h + 46, opacity: sh }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height: h, opacity: 1 - 0.45 * clamp01(crossed) }}>
        <svg width={width} height={h} viewBox="0 0 100 72" fill="none" stroke={C.muted} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="30" cy="24" r="14" />
          <circle cx="56" cy="26" r="7" />
          <path d="M63 26h28M83 26v8M75 26v6" />
          <circle cx="42" cy="50" r="7" />
          <path d="M47 55l18 12M60 63l5-6" />
        </svg>
        <Cross w={width} h={h} p={crossed} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: h + 6, width, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.text, textDecoration: crossed > 0.6 ? 'line-through' : undefined, textDecorationColor: C.rose }}>
        {VOUCHER_TEXT.keys}
      </div>
    </div>
  );
}
