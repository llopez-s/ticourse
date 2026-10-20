import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';

export const FACE = { w: 552, h: 300 } as const;

/**
 * One of the week's three faces: a panel in the face's colour with a person icon and its title on top. `on` 0–1 lights
 * the border (the voice is on it); `flash` 0–1 is a single burst of the border (the error sound), never repeated.
 */
export function FacePanel({ title, tone, icon = 'user', on, flash = 0, children }: { title: string; tone: string; icon?: IconName; on: number; flash?: number; children: ReactNode }) {
  const o = clamp01(on);
  const f = clamp01(flash);
  return (
    <div
      style={{
        position: 'relative',
        width: FACE.w,
        height: FACE.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `${f > 0.05 ? 4 : 2}px solid ${alpha(tone, 0.3 + 0.6 * Math.max(o, f))}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.06 + 0.06 * o + 0.18 * f)} 0%, ${C.ink900} 100%)`,
        boxShadow: o > 0.02 || f > 0.02 ? `0 0 ${Math.round(20 * o + 30 * f)}px ${alpha(tone, 0.22 * o + 0.4 * f)}` : undefined,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', left: 18, top: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <Icon name={icon} size={30} color={tone} />
        {title}
      </div>
      {children}
    </div>
  );
}

/** A small pill inside a panel (a fact the voice says: «a propósito», «Sistemas no lo sabe»). */
export function FactChip({ text, tone, show, exam = false }: { text: string; tone: string; show: number; exam?: boolean }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 42,
        padding: '0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(exam ? C.violet : tone, 0.75)}`,
        background: exam ? alpha(C.violetDeep, 0.6) : alpha(tone, 0.12),
        fontSize: 28,
        fontWeight: 800,
        color: exam ? '#c4b5fd' : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 10}px)`,
      }}
    >
      {text}
    </div>
  );
}
