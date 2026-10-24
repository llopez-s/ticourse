import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { LoopIcon } from '../Labels';

export const COL_W = 660;
export const ITEM_H = 56;
export const ITEM_PITCH = 66;

/** One line of the timeline's lists: a card with an accent bar, its text and, on the right, an optional extra. */
export function ListItem({
  children,
  tone,
  on,
  extra,
  size = 30,
}: {
  children: ReactNode;
  tone: string;
  on: number;
  extra?: ReactNode;
  size?: number;
}) {
  const o = clamp01(on);
  return (
    <div
      style={{
        width: COL_W,
        height: ITEM_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 16px 0 14px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.28 + 0.6 * o)}`,
        background: alpha(tone, 0.05 + 0.09 * o),
        boxShadow: o > 0.05 ? `0 0 ${Math.round(20 * o)}px ${alpha(tone, 0.22 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 700,
        color: o > 0.45 ? C.textStrong : C.text,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 6, height: 30, borderRadius: 3, background: alpha(tone, 0.5 + 0.5 * o), flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {extra}
    </div>
  );
}

/** The routine's repetition mark: a loop, with an optional cadence label («cada trimestre»). */
export function Repeat({ every, on }: { every?: string; on: number }) {
  const o = clamp01(on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {every ? (
        <span
          style={{
            padding: '3px 12px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.emerald, 0.55 + 0.35 * o)}`,
            background: alpha(C.emerald, 0.12),
            fontSize: 26,
            fontWeight: 750,
            color: '#6ee7b7',
          }}
        >
          {every}
        </span>
      ) : null}
      <LoopIcon size={34} color={alpha(C.emerald, 0.6 + 0.4 * o)} />
    </div>
  );
}

export const BTN = { w: 260, h: 88 } as const;

/** The «lanzar» button in the middle of the line. `press` 0–1 is the push, `lit` 0–1 turns it emerald (it has run). */
export function LaunchButton({ press = 0, lit = 0, ring = 0 }: { press?: number; lit?: number; ring?: number }) {
  const tone = lit > 0.5 ? C.emerald : C.cyan;
  const scale = 1 - 0.08 * press;
  return (
    <div style={{ position: 'relative', width: BTN.w, height: BTN.h }}>
      {ring > 0.01 && ring < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            left: -ring * 70,
            top: -ring * 40,
            width: BTN.w + ring * 140,
            height: BTN.h + ring * 80,
            borderRadius: RADIUS.lg + ring * 40,
            border: `3px solid ${alpha(C.emerald, 0.7 * (1 - ring))}`,
          }}
        />
      ) : null}
      <div
        style={{
          width: BTN.w,
          height: BTN.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(tone, 0.85)}`,
          background: alpha(tone, 0.12 + 0.1 * lit),
          boxShadow: `0 0 ${Math.round(14 + 26 * lit)}px ${alpha(tone, 0.25 + 0.2 * lit)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 850,
          color: C.textStrong,
          transform: `scale(${scale})`,
        }}
      >
        <Icon name="play" size={40} color={tone} strokeWidth={2.2} />
        lanzar
      </div>
    </div>
  );
}
