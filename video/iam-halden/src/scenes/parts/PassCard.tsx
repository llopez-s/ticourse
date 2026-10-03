import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * Image 3, the visitor pass signed by your home (SAML assertion): a pass
 * card with a lanyard slot, four rows («quién: cuenta del puerto» · «para:
 * plataforma aduanera» · «válido: 5 min» · «firma: IdP de Halden») and a
 * round cyan seal that lands at `signAt`. `mini` draws the same pass as an
 * icon (no text, grey lines + seal) for s06 / s11. `crossed` (0–1) puts a
 * rose cross over it (a pass that is not issued). Drawn in design units and
 * scaled to `width`.
 */

export const PASS_TEXT = {
  head: 'pase de visita',
  rows: [
    { k: 'quién', v: 'cuenta del puerto' },
    { k: 'para', v: 'plataforma aduanera' },
    { k: 'válido', v: '5 min' },
    { k: 'firma', v: 'IdP de Halden' },
  ],
} as const;

export const PASS_BASE = { w: 540, h: 384 } as const;
export const PASS_MINI = { w: 150, h: 120 } as const;

/** Height in px of the pass at `width` (full or mini). */
export function passHeight(width: number, mini = false): number {
  const b = mini ? PASS_MINI : PASS_BASE;
  return (b.h * width) / b.w;
}

/** Round signature seal (cyan ring with a check). */
export function PassSeal({ size, p = 1, color = C.cyan }: { size: number; p?: number; color?: string }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${Math.max(3, size * 0.07)}px solid ${color}`,
        background: alpha(C.ink950, 0.85),
        boxShadow: `0 0 ${size * 0.3}px ${alpha(color, 0.45)}, inset 0 0 0 ${Math.max(2, size * 0.05)}px ${alpha(color, 0.35)}`,
        display: 'grid',
        placeItems: 'center',
        opacity: k,
        transform: `rotate(-12deg) scale(${1.5 - 0.5 * k})`,
      }}
    >
      <Icon name="check" size={size * 0.56} color={color} strokeWidth={3} />
    </div>
  );
}

export function PassCard({
  width = PASS_BASE.w,
  mini = false,
  show = 1,
  rowsAt,
  signAt,
  glow = 0,
  crossed = 0,
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  mini?: boolean;
  /** 0–1 appear. */
  show?: number;
  /** Frame each of the four rows appears (default: all shown). */
  rowsAt?: readonly number[];
  /** Frame the seal lands (default: already signed). */
  signAt?: number;
  /** 0–1 cyan halo. */
  glow?: number;
  /** 0–1 rose cross over the pass. */
  crossed?: number;
  /** 0–1 grey-out (not focused). */
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const base = mini ? PASS_MINI : PASS_BASE;
  const s = width / base.w;
  const sealP = signAt === undefined ? 1 : progress(frame, signAt, 9, EASE.out);
  const g = clamp01(glow);
  const x = clamp01(crossed);
  const d = clamp01(dim);

  const card = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: mini ? 14 : 22,
        width: base.w - (mini ? 14 : 30),
        height: base.h - (mini ? 14 : 22),
        boxSizing: 'border-box',
        borderRadius: mini ? 12 : RADIUS.lg,
        border: `${mini ? 4 : 3}px solid ${alpha(C.cyan, 0.75 + 0.25 * g)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${Math.round(36 * g)}px ${alpha(C.cyan, 0.4 * g)}` : ''}`,
        overflow: 'hidden',
      }}
    >
      {/* Lanyard slot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: mini ? 8 : 14,
          width: mini ? 34 : 70,
          height: mini ? 8 : 12,
          marginLeft: mini ? -17 : -35,
          borderRadius: 6,
          background: C.ink950,
          border: `2px solid ${alpha(C.cyan, 0.5)}`,
        }}
      />
      {mini ? (
        // Icon: header strip + three text lines
        <>
          <div style={{ position: 'absolute', left: 14, right: 14, top: 26, height: 12, borderRadius: 4, background: alpha(C.cyan, 0.55) }} />
          {[48, 64, 80].map((y, i) => (
            <div key={y} style={{ position: 'absolute', left: 14, top: y, width: i === 2 ? 52 : 90, height: 8, borderRadius: 4, background: alpha(C.text, 0.4) }} />
          ))}
        </>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 38,
              height: 54,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 26px',
              background: alpha(C.cyanDeep, 0.45),
              borderTop: `2px solid ${alpha(C.cyan, 0.35)}`,
              borderBottom: `2px solid ${alpha(C.cyan, 0.35)}`,
              fontFamily: FONT.sans,
              fontSize: 30,
              fontWeight: 800,
              color: C.cyanSoft,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="user" size={32} color={C.cyanSoft} />
            {PASS_TEXT.head}
          </div>
          {PASS_TEXT.rows.map((r, i) => {
            const p = rowsAt ? progress(frame, rowsAt[i] ?? 0, 12) : 1;
            return (
              <div
                key={r.k}
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 108 + i * 56,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  fontFamily: FONT.sans,
                  whiteSpace: 'nowrap',
                  opacity: p,
                  transform: `translateX(${(1 - p) * 12}px)`,
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 600, color: C.muted }}>{r.k}:</span>
                <span style={{ fontSize: 36, fontWeight: 800, color: i === 3 ? C.cyanSoft : C.textStrong }}>{r.v}</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: base.h * s,
        opacity: sh * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: base.w, height: base.h, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        {card}
        <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
          <PassSeal size={mini ? 54 : 104} p={sealP} />
        </div>
        {x > 0 ? (
          <svg width={base.w} height={base.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <g opacity={x} stroke={C.rose} strokeWidth={mini ? 10 : 12} strokeLinecap="round">
              <line x1={base.w * 0.12} y1={base.h * 0.18} x2={base.w * 0.12 + (base.w * 0.76) * x} y2={base.h * 0.18 + base.h * 0.7 * x} />
              <line x1={base.w * 0.88} y1={base.h * 0.18} x2={base.w * 0.88 - (base.w * 0.76) * x} y2={base.h * 0.18 + base.h * 0.7 * x} />
            </g>
          </svg>
        ) : null}
      </div>
    </div>
  );
}
