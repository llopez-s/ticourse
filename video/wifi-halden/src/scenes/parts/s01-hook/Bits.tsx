import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { STAMP } from '../../../data/s01-hook';

export const STAMP_H = 58;
export const CHIP_H = 54;

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/** Monday's strip: «14-12 · lunes · auditoría del trimestre · wifi de la terminal» (the series' date idiom). */
export function AuditStamp() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: STAMP_H,
        padding: '0 26px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: 34,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="clock" size={34} color={C.cyan} />
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{STAMP.day}</span>
      <Dot />
      <span style={{ fontWeight: 700, color: C.text }}>{STAMP.weekday}</span>
      <Dot />
      <span style={{ fontWeight: 800, color: C.textStrong }}>{STAMP.what}</span>
      <Dot />
      <span style={{ fontWeight: 750, color: C.cyanSoft }}>{STAMP.where}</span>
    </div>
  );
}

/** One chip of the promise. `on` 0–1: the voice is on it. */
export function PromiseChip({ icon, text, on }: { icon: IconName; text: string; on: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: CHIP_H,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * o)}`,
        background: alpha(C.cyan, 0.06 + 0.12 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(22 * o)}px ${alpha(C.cyan, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={32} color={C.cyan} />
      <span>{text}</span>
    </div>
  );
}
