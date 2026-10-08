import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, focusWeight, type IconName, type TerminalLine } from '../../../../../engine/src/ui';

/**
 * Chapter II's console (s04's `openssl x509 -ext`, s05's `s_client -status`): the engine `Terminal`
 * with one look in both scenes (the day as a stamp in its title bar, a change as a strip above it, as
 * in s02/s03), and `terminalRows`, which mirrors the
 * Terminal's own layout so a scene can pin notes beside a printed line. Pure helpers.
 */

/** Shared Terminal props of chapter II (commands at 30 px: they are never read; output at 32). */
export const CONSOLE = { size: 30, outSize: 32, resultSize: 44, focusScale: 1.12, title: 'consola' } as const;

/** Panel chrome above the first line: border 2 + header 64 + its border 2 + padding 18. */
const FIRST_TOP = 86;

/** Height of a line before focus scaling (the Terminal's `baseHeight`). */
function baseHeight(l: TerminalLine, o: { size: number; outSize: number; resultSize: number; noteSize: number; tagSize: number }): number {
  switch (l.kind ?? 'out') {
    case 'cmd':
      return Math.round(o.size * 1.45);
    case 'out':
      return Math.round(o.outSize * 1.45);
    case 'result':
      return 12 + 4 + 20 + Math.round(o.resultSize * 1.3) + (l.note ? 6 + Math.round(o.noteSize * 1.3) : 0);
    case 'redacted':
      return Math.max(56, Math.round(o.tagSize * 1.9));
    case 'gap':
      return l.height ?? Math.round(o.size * 0.5);
  }
}

/**
 * Top and height (px from the panel's outer top) of each line at `frame`, as the Terminal lays them
 * out (focused lines grow and push the rest down); `null` for lines not printed yet.
 */
export function terminalRows(
  lines: TerminalLine[],
  frame: number,
  {
    size = CONSOLE.size,
    outSize = CONSOLE.outSize,
    resultSize = CONSOLE.resultSize,
    noteSize = 32,
    tagSize = 30,
    focusScale = CONSOLE.focusScale,
  }: { size?: number; outSize?: number; resultSize?: number; noteSize?: number; tagSize?: number; focusScale?: number } = {},
): ({ top: number; h: number } | null)[] {
  const o = { size, outSize, resultSize, noteSize, tagSize };
  let y = FIRST_TOP;
  return lines.map((l) => {
    const start = l.kind === 'cmd' && l.promptAt !== undefined ? Math.min(l.promptAt, l.at) : l.at;
    if (frame < start) return null;
    const h = baseHeight(l, o) * (1 + (focusScale - 1) * focusWeight(l.focus, frame));
    const row = { top: y, h };
    y += h;
    return row;
  });
}

/**
 * The day stamp in the console's title bar (s02/s03's look: a mono chip, cyan), e.g. «10-11». Halden's
 * date, never a GMT console time.
 */
export function StampChip({ text }: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 40,
        padding: '0 16px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.6)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.mono,
        fontSize: 30,
        fontWeight: 800,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

/** The strip above the console (s03's look: cyan, an icon), for a change to the portal. */
export function EventStrip({ text, show = 1, icon = 'gear', size = 34, style }: { text: string; show?: number; icon?: IconName; size?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        height: Math.round(size * 1.6),
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * -10}px)`,
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.95)} color={C.cyan} />
      {text}
    </div>
  );
}
