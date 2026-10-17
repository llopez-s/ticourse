import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { PLAQUE, STAMP } from '../../../data/s01-hook';

export const STAMP_H = 60;
export const CHIP_H = 58;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/** The case stamp: «Autoridad Portuaria de Halden · caso de ejemplo» (no date). */
export function CaseStamp() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: STAMP_H,
        padding: '0 28px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={32} color={C.cyan} />
      <span style={{ fontWeight: 800, color: C.textStrong }}>{STAMP.what}</span>
      <Dot />
      <span style={{ fontWeight: 700, color: C.cyanSoft }}>{STAMP.kind}</span>
    </div>
  );
}

/** The objective plate «SY0-701 · 1.1» (violet = exam). Drawn here because ExamBadge prints «EXAMEN · …». */
export function PlaqueChip() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 50,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.7)}`,
        background: alpha(C.violet, 0.12),
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 800,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={30} color={C.violet} />
      <span>{PLAQUE}</span>
    </div>
  );
}

/** One chip of the promise. `on` 0–1: the voice is on it. */
export function PromiseChip({ icon, text, on, tone }: { icon: IconName; text: string; on: number; tone: string }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: CHIP_H,
        padding: '0 28px 0 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.4 + 0.5 * o)}`,
        background: alpha(tone, 0.06 + 0.12 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(22 * o)}px ${alpha(tone, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={32} color={tone} />
      <span>{text}</span>
    </div>
  );
}

/**
 * A soft ring over one box of a ControlTag (width 420, hole on), drawn by this scene on top of the shared tag:
 * ControlTag only lights a box when a value lands, and s01's boxes stay empty. Geometry mirrors ControlTag at s = 1:
 * hole 56, border 3, padding 18, gap 12, box height 118 (the engine renders border-box, checked on a still).
 */
const BOX_H = 118;
export const TAG_BOXES = {
  top: { x: 56 + 3 + 18, y: 3 + 18, w: 420 - 56 - 6 - 36, h: BOX_H },
  bottom: { x: 56 + 3 + 18, y: 3 + 18 + BOX_H + 12, w: 420 - 56 - 6 - 36, h: BOX_H },
} as const;

export function BoxGlow({ box, tone, on }: { box: 'top' | 'bottom'; tone: string; on: number }) {
  const o = clamp01(on);
  if (o < 0.01) return null;
  const b = TAG_BOXES[box];
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x - 4,
        top: b.y - 4,
        width: b.w + 8,
        height: b.h + 8,
        borderRadius: 15,
        border: `3px solid ${alpha(tone, 0.85 * o)}`,
        boxShadow: `0 0 ${Math.round(26 * o)}px ${alpha(tone, 0.45 * o)}, inset 0 0 ${Math.round(18 * o)}px ${alpha(tone, 0.25 * o)}`,
        pointerEvents: 'none',
      }}
    />
  );
}
