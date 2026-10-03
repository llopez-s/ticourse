import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * Image 2, the sealed locker (deprovisioning): a metal locker with a glass
 * door; inside, three labelled shelves (default «buzón» · «archivos» ·
 * «registros»); a steel seal strip («precintada») lands across the door's top edge —
 * sealed, not emptied. `mini` drops the texts (icon for s11 rule-1). All
 * states are 0–1 weights: `seal` (the strip lands; drive it with
 * progress(frame, at, 9) so the hit is on `at`), `contents` (the labels).
 * Design units (LOCKER_BASE) scaled to `width`.
 */

export const LOCKER_BASE = { w: 380, h: 590 } as const;

export const LOCKER_TEXT = { seal: 'precintada', labels: ['buzón', 'archivos', 'registros'] } as const;

const ICONS: IconName[] = ['mail', 'file', 'archive'];

/** Height in px of the locker at `width`. */
export function lockerHeight(width: number): number {
  return (LOCKER_BASE.h * width) / LOCKER_BASE.w;
}

export function Locker({
  width = LOCKER_BASE.w,
  show = 1,
  seal = 0,
  contents = 1,
  labels = LOCKER_TEXT.labels,
  sealLabel = LOCKER_TEXT.seal,
  mini = false,
  glow = 0,
  dim = 0,
  style,
}: {
  width?: number;
  show?: number;
  /** 0–1: the seal strip lands (scale-down) across the door. */
  seal?: number;
  /** 0–1: the labels on the shelves. */
  contents?: number;
  labels?: readonly string[];
  sealLabel?: string;
  mini?: boolean;
  /** 0–1 cyan halo. */
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const s = width / LOCKER_BASE.w;
  const sp = clamp01(seal);
  const cp = clamp01(contents);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const W = LOCKER_BASE.w;
  const H = LOCKER_BASE.h;
  const door = { x: 28, y: 128, w: W - 56, h: H - 164 };
  const shelfH = (door.h - 40) / 3;

  return (
    <div style={{ position: 'relative', width, height: H * s, opacity: sh * (1 - 0.6 * d), filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {/* Body */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            background: `linear-gradient(90deg, #1e293b 0%, #334155 45%, #1e293b 100%)`,
            border: `3px solid ${alpha(C.muted, 0.7)}`,
            boxShadow: `0 26px 60px ${alpha('#000000', 0.5)}${g > 0 ? `, 0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.35 * g)}` : ''}`,
          }}
        />
        {/* Vents */}
        {[28, 44, 60].map((y) => (
          <div key={y} style={{ position: 'absolute', left: W / 2 - 70, top: y, width: 140, height: 7, borderRadius: 4, background: alpha(C.ink950, 0.75) }} />
        ))}
        {/* Door with glass */}
        <div
          style={{
            position: 'absolute',
            left: door.x,
            top: door.y,
            width: door.w,
            height: door.h,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `3px solid ${alpha(C.muted, 0.8)}`,
            background: `linear-gradient(160deg, ${alpha(C.sky, 0.1)} 0%, ${alpha(C.ink950, 0.82)} 40%, ${alpha(C.ink950, 0.88)} 100%)`,
            overflow: 'hidden',
          }}
        >
          {labels.map((label, i) => {
            const y = 20 + i * shelfH;
            return (
              <div key={label} style={{ position: 'absolute', left: 0, top: y, width: door.w - 6, height: shelfH }}>
                {/* Shelf board */}
                <div style={{ position: 'absolute', left: 10, right: 10, bottom: 6, height: 6, borderRadius: 3, background: alpha(C.muted, 0.55) }} />
                {/* The item (box with tag) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    right: 18,
                    bottom: 14,
                    height: shelfH - 34,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.sm,
                    border: `2px solid ${alpha(C.cyan, 0.35 + 0.4 * cp)}`,
                    background: alpha(C.cyan, 0.06 + 0.08 * cp),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '0 16px',
                  }}
                >
                  <Icon name={ICONS[i % ICONS.length]} size={mini ? 44 : 40} color={alpha(C.cyanSoft, 0.5 + 0.5 * cp)} />
                  {!mini ? (
                    <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, opacity: cp, whiteSpace: 'nowrap' }}>{label}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
          {/* Glass sheen */}
          <div style={{ position: 'absolute', left: -40, top: -20, width: 90, height: door.h + 60, background: alpha('#ffffff', 0.05), transform: 'rotate(18deg)' }} />
        </div>
        {/* Handle */}
        <div style={{ position: 'absolute', right: 10, top: door.y + door.h / 2 - 40, width: 10, height: 80, borderRadius: 5, background: '#94a3b8' }} />
        {/* Seal strip */}
        {sp > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: -30,
              width: W + 60,
              top: door.y - 40,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: `linear-gradient(90deg, ${alpha(C.ink700, 0.96)} 0%, ${alpha('#475569', 0.98)} 50%, ${alpha(C.ink700, 0.96)} 100%)`,
              borderTop: `3px solid ${C.muted}`,
              borderBottom: `3px solid ${C.muted}`,
              boxShadow: `0 10px 24px ${alpha('#000000', 0.5)}`,
              transform: `rotate(-6deg) scale(${1.3 - 0.3 * sp})`,
              opacity: sp,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="lock" size={mini ? 44 : 38} color={C.textStrong} strokeWidth={2.2} />
            {!mini ? <span style={{ fontSize: 36, fontWeight: 850, color: C.textStrong }}>{sealLabel}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
