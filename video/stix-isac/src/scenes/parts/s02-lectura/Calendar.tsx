import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { CALENDAR } from '../../../data/s02-lectura';

export const CAL_W = 600;
export const CAL_H = 240;

const BINDER_H = 30;
const LABEL_Y = BINDER_H + 10;
const CELLS_Y = LABEL_Y + 48;
const CELL = { w: 64, h: 78, gap: 8 } as const;
const CELLS_X = (CAL_W - (CALENDAR.days.length * CELL.w + (CALENDAR.days.length - 1) * CELL.gap)) / 2;
const TODAY_Y = CELLS_Y + CELL.h + 10;

/**
 * A calendar page from 25-06 (valid_until) to 02-07 (today): the 25th framed
 * amber with «valid_until 2026-06-25» above it; on «today» the 2nd lights cyan
 * with «hoy · 02-07-2026» under it, and the expired week fills amber.
 * Frames are Sequence-relative.
 */
export function CalendarStrip({
  frame,
  at,
  todayAt,
  expiredAt,
  expiredGlow = 0,
}: {
  frame: number;
  /** The page appears with the 25th framed. */
  at: number;
  /** Today lights up. */
  todayAt: number;
  /** The expired days fill, left to right. */
  expiredAt: number;
  /** 0–1: the expired stretch glows (the voice is on «caducó hace una semana»). */
  expiredGlow?: number;
}) {
  const show = progress(frame, at, 16);
  if (show <= 0) return null;
  const today = progress(frame, todayAt, 14);
  const sweep = progress(frame, expiredAt, 26, EASE.inOut);
  const eg = clamp01(expiredGlow);
  const n = CALENDAR.days.length;

  return (
    <div
      style={{
        position: 'relative',
        width: CAL_W,
        height: CAL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.amber, 0.55)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 16}px)`,
      }}
    >
      {/* Binder strip with two rings */}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: BINDER_H, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, background: alpha(C.amber, 0.22) }} />
      {[CAL_W * 0.25, CAL_W * 0.75].map((x) => (
        <div key={x} style={{ position: 'absolute', left: x - 7, top: -10, width: 14, height: 28, borderRadius: 7, border: `3px solid ${C.muted}`, background: C.ink900 }} />
      ))}

      {/* valid_until 2026-06-25, above the 25th */}
      <div style={{ position: 'absolute', left: CELLS_X, top: LABEL_Y, height: 40, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.mono, fontSize: 32, whiteSpace: 'nowrap' }}>
        <span style={{ color: '#fcd34d', fontWeight: 600 }}>{CALENDAR.until.key}</span>
        <span style={{ color: '#fde68a', fontWeight: 800 }}>{CALENDAR.until.date}</span>
      </div>

      {/* Day cells */}
      {CALENDAR.days.map((d, i) => {
        const x = CELLS_X + i * (CELL.w + CELL.gap);
        const isUntil = i === 0;
        const isToday = i === n - 1;
        // Expired days (after the 25th, up to today) fill amber in a sweep.
        const fill = i === 0 ? 0 : clamp01(sweep * n - i + 1);
        const month = i === 0 ? CALENDAR.months.jun : d === 1 ? CALENDAR.months.jul : null;
        const border = isToday && today > 0 ? alpha(C.cyan, 0.4 + 0.6 * today) : isUntil ? C.amber : alpha(C.ink600, 0.9);
        return (
          <div
            key={`${d}-${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: CELLS_Y,
              width: CELL.w,
              height: CELL.h,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `${isUntil || (isToday && today > 0) ? 3 : 2}px solid ${border}`,
              background: isToday && today > 0 ? alpha(C.cyan, 0.16 * today) : alpha(C.amber, (0.14 + 0.18 * eg) * fill),
              boxShadow: isToday && today > 0 ? `0 0 ${Math.round(24 * today)}px ${alpha(C.cyan, 0.45 * today)}` : isUntil ? `0 0 16px ${alpha(C.amber, 0.35)}` : undefined,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, lineHeight: 1, color: isToday && today > 0.5 ? C.textStrong : isUntil ? '#fde68a' : fill > 0.5 ? '#fde68a' : C.text }}>
              {String(d).padStart(2, '0')}
            </span>
            {month ? <span style={{ marginTop: 4, fontSize: 18, fontWeight: 700, color: C.muted, lineHeight: 1 }}>{month}</span> : null}
          </div>
        );
      })}

      {/* hoy · 02-07-2026, under the 2nd */}
      {today > 0 ? (
        <div
          style={{
            position: 'absolute',
            right: CELLS_X,
            top: TODAY_Y,
            height: 46,
            display: 'flex',
            alignItems: 'center',
            fontSize: 36,
            fontWeight: 850,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: today,
            transform: `translateY(${(1 - today) * 8}px)`,
            textShadow: `0 0 18px ${alpha(C.cyan, 0.35)}`,
          }}
        >
          {CALENDAR.today}
        </div>
      ) : null}
    </div>
  );
}
