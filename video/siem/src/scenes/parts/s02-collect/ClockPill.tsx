import { interpolateColors } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { CLOCK_SYNCED } from '../../../data/s02-collect';
import type { S02Timing } from './timing';

export const CLOCK_W = 222;

/**
 * A source's own clock. Neutral at first, amber once the voice brings up the
 * time ("hora sincronizada"), then it snaps to the shared NTP time in emerald
 * and the clock glyph gives way to an "NTP" tag.
 */
export function ClockPill({ frame, T, drifted }: { frame: number; T: S02Timing; drifted: string }) {
  const warn = progress(frame, T.ntp - 32, 10);
  const sync = progress(frame, T.ntp, 10);
  const state = warn + sync;
  const border = interpolateColors(state, [0, 1, 2], [C.ink600, alpha(C.amber, 0.8), alpha(C.emerald, 0.9)]);
  const fg = interpolateColors(state, [0, 1, 2], [C.muted, C.amber, C.emerald]);
  const bg = interpolateColors(state, [0, 1, 2], [alpha(C.ink800, 0.9), alpha(C.amber, 0.1), alpha(C.emerald, 0.12)]);
  const roll = (text: string, i: number) => {
    const o = i === 0 ? 1 - sync : sync;
    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          lineHeight: '34px',
          fontFamily: FONT.mono,
          fontSize: TYPE.small,
          fontWeight: 650,
          color: fg,
          opacity: o,
          transform: `translateY(${(i === 0 ? -sync : 1 - sync) * 14}px)`,
        }}
      >
        {text}
      </span>
    );
  };
  return (
    <div
      style={{
        width: CLOCK_W,
        height: 46,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 14px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${border}`,
        background: bg,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: 56, height: 34, flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 15, top: 4, opacity: 1 - sync }}>
          <Icon name="clock" size={26} color={fg} />
        </div>
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            lineHeight: '34px',
            fontFamily: FONT.sans,
            fontSize: TYPE.small,
            fontWeight: 850,
            letterSpacing: 0.5,
            color: C.emerald,
            opacity: sync,
          }}
        >
          NTP
        </span>
      </div>
      <div style={{ position: 'relative', height: 34, flex: 1 }}>{[drifted, CLOCK_SYNCED].map(roll)}</div>
    </div>
  );
}

/**
 * The shared reference clock, floating above the links while the voice says
 * "con la hora sincronizada por NTP".
 */
export function NtpBadge({ frame, T, x, y }: { frame: number; T: S02Timing; x: number; y: number }) {
  const p = progress(frame, T.ntp - 6, 12);
  if (p <= 0) return null;
  const settle = 1 - 0.7 * progress(frame, T.wipeIn, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * p})`,
        opacity: p * settle,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.emerald, 0.85)}`,
        background: alpha(C.ink900, 0.92),
        boxShadow: `0 0 28px ${alpha(C.emerald, 0.3)}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="clock" size={32} color={C.emerald} />
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 850, color: C.emerald }}>NTP</span>
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 650, color: C.textStrong }}>{CLOCK_SYNCED}</span>
    </div>
  );
}
