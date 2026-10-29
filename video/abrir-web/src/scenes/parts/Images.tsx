import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { IMAGE_TAG } from './data';

/**
 * The borrowed images (each labelled «imagen · no es del puerto»):
 *   - `BookImage`   the library book with its return slip «devolver antes de…» = the DHCP lease (s03). The slip has
 *                   no date (bars): the case has no date. The voice never says «préstamo».
 *   - `AgendaImage` the phone's contact list = DNS (s04): one row lights «nombre → número»; the other rows are grey bars.
 *   (The DNI of s07 and s10 is `Dni.tsx`.)
 * `ImageTag` is the shared label. All pieces size from `width`, are not positioned and take `show` (0–1).
 */

export function ImageTag({ style }: { style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 16px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.muted, 0.5)}`,
        background: alpha(C.ink950, 0.7),
        fontFamily: FONT.sans,
        fontSize: 26,
        fontWeight: 650,
        color: C.muted,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {IMAGE_TAG}
    </span>
  );
}

/** The book (a cover seen from the front, pages edge at the right) with a slip tucked in: 4:3.4 box. */
export function BookImage({ width = 420, show = 1, slip = 1, tag = true }: { width?: number; show?: number; slip?: number; tag?: boolean }) {
  const s = clamp01(show);
  const k = width / 420;
  const sl = clamp01(slip);
  return (
    <div style={{ position: 'relative', width, opacity: s, transform: `translateY(${(1 - s) * 14}px)`, fontFamily: FONT.sans }}>
      <div style={{ position: 'relative', width, height: 360 * k }}>
        <svg width={width} height={360 * k} viewBox="0 0 420 360" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* pages */}
          <rect x={44} y={34} width={330} height={292} rx={10} fill="#cbd5e1" />
          <path d="M 52 44 H 366 M 52 58 H 366 M 52 72 H 366" stroke="#94a3b8" strokeWidth={2} />
          {/* cover */}
          <rect x={20} y={20} width={330} height={300} rx={12} fill="#334155" stroke="#64748b" strokeWidth={3} />
          <rect x={20} y={20} width={42} height={300} rx={12} fill="#1e293b" stroke="#64748b" strokeWidth={3} />
          <path d="M 80 70 H 320 M 80 100 H 270" stroke="#94a3b8" strokeWidth={9} strokeLinecap="round" />
          {/* an open-book emblem on the cover */}
          <path d="M 120 228 V 188 Q 150 172 176 190 V 232 Q 150 214 120 228 Z M 176 190 Q 202 172 232 188 V 228 Q 202 214 176 232 Z" fill="none" stroke="#94a3b8" strokeWidth={5} strokeLinejoin="round" />
        </svg>
        {/* the slip */}
        <div
          style={{
            position: 'absolute',
            left: 238 * k,
            top: 150 * k,
            width: 168 * k,
            height: 150 * k,
            boxSizing: 'border-box',
            borderRadius: 10,
            background: C.ink900,
            border: `3px solid ${alpha(C.cyan, 0.85)}`,
            transform: `rotate(${6 - 6 * (1 - sl)}deg) translateX(${(1 - sl) * -30}px)`,
            opacity: sl,
            boxShadow: `0 12px 28px ${alpha('#000000', 0.45)}`,
            padding: `${12 * k}px ${12 * k}px`,
          }}
        >
          <div style={{ fontSize: Math.max(24, 27 * k), fontWeight: 800, color: C.cyanSoft, lineHeight: 1.12 }}>devolver antes de…</div>
          <div style={{ marginTop: 14 * k, height: 12, borderRadius: 6, background: alpha(C.muted, 0.4), width: '86%' }} />
          <div style={{ marginTop: 10 * k, height: 12, borderRadius: 6, background: alpha(C.muted, 0.3), width: '58%' }} />
        </div>
      </div>
      {tag ? (
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <ImageTag />
        </div>
      ) : null}
    </div>
  );
}

/** The phone agenda: a screen with six rows; the lit row shows «nombre» and «número» slots and a call glyph. */
export function AgendaImage({ width = 360, show = 1, pick = 0, tag = true }: { width?: number; show?: number; pick?: number; tag?: boolean }) {
  const s = clamp01(show);
  const p = clamp01(pick);
  const k = width / 360;
  const rowH = 58 * k;
  return (
    <div style={{ position: 'relative', width, opacity: s, transform: `translateY(${(1 - s) * 14}px)`, fontFamily: FONT.sans }}>
      <div
        style={{
          width,
          height: 420 * k,
          boxSizing: 'border-box',
          borderRadius: 38,
          border: `5px solid ${C.ink500}`,
          background: C.ink950,
          padding: `${22 * k}px ${16 * k}px`,
          boxShadow: `0 24px 50px ${alpha('#000000', 0.5)}`,
        }}
      >
        <div style={{ width: 70, height: 8, borderRadius: 4, background: C.ink600, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 * k }}>
          <Icon name="user" size={34} color={C.muted} />
          <span style={{ fontSize: 28, fontWeight: 750, color: C.muted }}>agenda</span>
        </div>
        {[0, 1, 2, 3, 4].map((i) => {
          const lit = i === 2;
          return (
            <div
              key={i}
              style={{
                height: rowH,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 12px',
                marginBottom: 6 * k,
                borderRadius: 12,
                border: `2px solid ${lit ? alpha(C.cyan, 0.3 + 0.6 * p) : 'transparent'}`,
                background: lit ? alpha(C.cyan, 0.05 + 0.12 * p) : alpha(C.ink800, 0.7),
              }}
            >
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: alpha(C.muted, 0.35), flexShrink: 0 }} />
              {lit ? (
                <>
                  <span style={{ fontSize: 27, fontWeight: 800, color: C.textStrong }}>nombre</span>
                  <span style={{ flex: 1, height: 3, borderTop: `3px dotted ${alpha(C.cyan, 0.8)}` }} />
                  <span style={{ fontSize: 27, fontWeight: 800, color: C.cyanSoft }}>número</span>
                </>
              ) : (
                <>
                  <span style={{ width: `${40 + ((i * 17) % 20)}%`, height: 14, borderRadius: 7, background: alpha(C.muted, 0.3) }} />
                  <span style={{ flex: 1 }} />
                  <span style={{ width: 70, height: 14, borderRadius: 7, background: alpha(C.muted, 0.2) }} />
                </>
              )}
            </div>
          );
        })}
      </div>
      {tag ? (
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <ImageTag />
        </div>
      ) : null}
    </div>
  );
}
