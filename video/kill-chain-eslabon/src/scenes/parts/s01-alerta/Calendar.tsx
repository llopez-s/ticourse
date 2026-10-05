import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { CALENDAR } from '../../../data/s01-alerta';

export const TILE = { w: 300, h: 236, gap: 36, header: 70 } as const;
export const CALENDAR_W = CALENDAR.length * TILE.w + (CALENDAR.length - 1) * TILE.gap;

/**
 * s01 `back`: four calendar pages, oldest on the left (lunes 02-03 … jueves 05-03). The alert day (jueves, rose
 * bell) is lit first; a cyan frame walks back day by day and lands on «lunes 02-03» at `landAt`, which turns cyan
 * (your own logs, Meridian's colour). Frames are relative to the Sequence.
 */
export function Calendar({ frame, at, landAt }: { frame: number; at: number; landAt: number }) {
  const last = CALENDAR.length - 1;
  const walkFrom = at + 14;
  const walk = progress(frame, walkFrom, Math.max(8, landAt - walkFrom), EASE.inOut);
  const pos = last - last * walk;
  const landed = progress(frame, landAt - 2, 12);
  const ringIn = progress(frame, at + 6, 10);
  return (
    <div style={{ position: 'relative', width: CALENDAR_W, height: TILE.h, fontFamily: FONT.sans }}>
      {CALENDAR.map((d, i) => {
        const alertDay = i === last;
        const monday = i === 0;
        const e = enter(frame, at + (last - i) * 4, { distance: 20 });
        const lit = monday ? landed : 0;
        const accent = alertDay ? C.rose : monday && lit > 0 ? C.cyan : C.ink600;
        const passed = !alertDay && !monday && pos < i - 0.5 ? 1 : 0;
        return (
          <div
            key={d.date}
            style={{
              position: 'absolute',
              left: i * (TILE.w + TILE.gap),
              top: 0,
              width: TILE.w,
              height: TILE.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
              border: `2px solid ${alertDay ? alpha(C.rose, 0.6) : monday ? alpha(C.cyan, 0.3 + 0.6 * lit) : C.ink700}`,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              boxShadow: monday && lit > 0 ? `0 0 ${Math.round(40 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : `0 18px 40px ${alpha('#000000', 0.3)}`,
              opacity: e.opacity * (alertDay ? 1 - 0.35 * walk : passed ? 0.6 : 1),
              transform: `${e.transform} scale(${1 + 0.04 * lit})`,
            }}
          >
            <div
              style={{
                height: TILE.header,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                background: alertDay ? alpha(C.rose, 0.22) : monday ? alpha(C.cyan, 0.08 + 0.2 * lit) : alpha(C.ink700, 0.7),
                borderBottom: `2px solid ${alpha(accent, 0.5)}`,
                fontSize: 34,
                fontWeight: 800,
                color: alertDay ? C.roseSoft : monday && lit > 0 ? C.cyanSoft : C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {alertDay ? <Icon name="bell" size={32} color={C.rose} strokeWidth={2} /> : null}
              {d.weekday}
            </div>
            <div
              style={{
                height: TILE.h - TILE.header - 4,
                display: 'grid',
                placeItems: 'center',
                fontFamily: FONT.mono,
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: -2,
                color: monday && lit > 0 ? C.textStrong : alertDay ? C.text : C.muted,
              }}
            >
              {d.date}
            </div>
          </div>
        );
      })}
      {/* The walking frame: one cyan outline that slides from the alert day back to Monday. */}
      {ringIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: pos * (TILE.w + TILE.gap) - 10,
            top: -10,
            width: TILE.w + 20,
            height: TILE.h + 20,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg + 8,
            border: `4px solid ${alpha(C.cyan, 0.85)}`,
            boxShadow: `0 0 ${24 + 16 * landed}px ${alpha(C.cyan, 0.35 + 0.2 * landed)}`,
            opacity: ringIn,
          }}
        />
      ) : null}
    </div>
  );
}
