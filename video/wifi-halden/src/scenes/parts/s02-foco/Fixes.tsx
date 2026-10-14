import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { FIXES, STILL } from '../../../data/s02-foco';

/** Amber's soft tone for text (not LAMP: that warm white is the floodlight's light only). */
const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';
const VIOLET_SOFT = '#c4b5fd';

export const FIX_ROW_H = 50;

/** An exam name (violet plate, mono). `size` is its font size; the plate follows it. */
export function NamePlate({ text, size }: { text: string; size: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: Math.round(size * 1.46),
        padding: `0 ${Math.round(size * 0.4)}px`,
        boxSizing: 'border-box',
        borderRadius: Math.round(size * 0.28),
        border: `${Math.max(2, Math.round(size / 18))}px solid ${alpha(C.violet, 0.85)}`,
        background: alpha(C.violetDeep, 0.85),
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: 0.5,
        color: VIOLET_SOFT,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}

/**
 * A fix that does not work: its text, crossed out by a rose stroke that draws with `strike`
 * 0–1 (rose: a struck-out wrong fix, the one meaning it shares with the adversary's colour).
 */
export function StrikeRow({ text, strike }: { text: string; strike: number }) {
  const s = clamp01(strike);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: FIX_ROW_H, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <Icon name="x" size={38} color={C.rose} strokeWidth={3} />
      <span style={{ position: 'relative', fontSize: 38, fontWeight: 800, color: alpha(C.textStrong, 1 - 0.12 * s) }}>
        {text}
        <span style={{ position: 'absolute', left: -6, top: '57%', height: 3.5, width: `calc(${Math.round(s * 100)}% + ${Math.round(12 * s)}px)`, borderRadius: 3, background: alpha(C.rose, 0.92) }} />
      </span>
    </div>
  );
}

/** Why it does not work: one or two lines under the struck fix, amber (what still leaks). */
export function Why({ lines }: { lines: readonly string[] }) {
  return (
    <div style={{ paddingLeft: 50, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, lineHeight: 1.18, color: AMBER_SOFT, whiteSpace: 'nowrap' }}>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

/** What does work: «colocación y potencia» (emerald). `lit` 0–1 adds a halo. */
export function WorksRow({ lit = 0 }: { lit?: number }) {
  const l = clamp01(lit);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 62,
        padding: '0 24px 0 14px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.emerald, 0.75)}`,
        background: alpha(C.emerald, 0.1 + 0.08 * l),
        boxShadow: l > 0.02 ? `0 0 ${Math.round(26 * l)}px ${alpha(C.emerald, 0.35 * l)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="check" size={40} color={C.emerald} strokeWidth={3} />
      <span style={{ fontSize: 42, fontWeight: 850, letterSpacing: -0.3, color: EMERALD_SOFT }}>{FIXES.works}</span>
    </div>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/** A date strip in the series' idiom: «15-12 · martes · …». */
export function DateStamp({ day, weekday, what, tone }: { day: string; weekday: string; what: string; tone: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 13,
        height: 54,
        padding: '0 24px 0 14px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.7)}`,
        background: alpha(tone, 0.1),
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="clock" size={32} color={tone} />
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: tone }}>{day}</span>
      <Dot />
      <span style={{ fontWeight: 700, color: C.text }}>{weekday}</span>
      <Dot />
      <span style={{ fontWeight: 800, color: C.textStrong }}>{what}</span>
    </div>
  );
}

/** The chapter's close, in two lines: «Se oye menos,» / «pero se oye» (the second one amber: it still leaks). */
export function StillLines({ show }: { show: [number, number] }) {
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 900, letterSpacing: -0.8, lineHeight: 1.14, whiteSpace: 'nowrap' }}>
      <div style={{ color: C.textStrong, opacity: clamp01(show[0]), transform: `translateY(${(1 - clamp01(show[0])) * 12}px)` }}>{STILL[0]}</div>
      <div style={{ color: AMBER_SOFT, opacity: clamp01(show[1]), transform: `translateY(${(1 - clamp01(show[1])) * 12}px)` }}>{STILL[1]}</div>
    </div>
  );
}
