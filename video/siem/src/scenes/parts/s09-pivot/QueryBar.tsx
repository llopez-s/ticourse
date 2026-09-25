import { C, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Icon, MonoLine, monoLength, type MonoToken } from '../../../../../engine/src/ui';
import { QUERY_LINES, type QueryTokenKind } from '../../../data/s09-pivot';

const SIZE = TYPE.label;
/** Typing speed of the query, in characters per second (the scene derives the run time from it). */
export const QUERY_CPS = 40;

const KIND_STYLE: Record<QueryTokenKind, Omit<MonoToken, 't'>> = {
  kw: { c: C.cyanSoft, bold: true },
  field: { c: C.muted },
  value: { c: C.textStrong },
  time: { c: C.amber, bold: true },
  pipe: { c: C.faint },
};

/**
 * Two-line search box. Shows a placeholder until `typeAt`, then types the
 * Spanish pseudo-query; `timeLit` (0–1) highlights "01:30" as it is spoken,
 * and once typed a thin progress bar runs the search.
 */
export function QueryBar({
  frame,
  fps,
  typeAt,
  timeLit,
  focus,
  width,
  height,
}: {
  frame: number;
  fps: number;
  typeAt: number;
  timeLit: number;
  focus: number;
  width: number;
  height: number;
}) {
  const lines: MonoToken[][] = QUERY_LINES.map((line) =>
    line.map((token) => ({
      t: token.t,
      ...KIND_STYLE[token.k],
      bg: token.k === 'time' && timeLit > 0 ? alpha(C.amber, 0.22 * timeLit) : undefined,
    })),
  );
  const len1 = monoLength(lines[0]);
  const total = len1 + monoLength(lines[1]);
  const typed = frame < typeAt ? 0 : Math.min(total, Math.floor(((frame - typeAt) / fps) * QUERY_CPS));
  const doneAt = typeAt + Math.ceil((total / QUERY_CPS) * fps);
  const run = progress(frame, doneAt + 2, 16, EASE.inOut);
  const runFade = 1 - progress(frame, doneAt + 22, 10);
  const caretOn = frame < doneAt + 2 && pulse(frame, fps, 0.9) > 0.35;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 28px 0 22px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${alpha(C.cyan, 0.3 + 0.5 * focus)}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}, 0 0 ${20 + 30 * focus}px ${alpha(C.cyan, 0.25 * focus)}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.12),
          border: `2px solid ${alpha(C.cyan, 0.4)}`,
          flexShrink: 0,
        }}
      >
        <Icon name="search" size={36} color={C.cyan} />
      </div>
      <div style={{ flex: 1, minWidth: 0, height: SIZE * 1.45 * 2 }}>
        {typed === 0 ? (
          <MonoLine tokens={[{ t: 'Buscar en el SIEM', c: C.faint }]} size={SIZE} caret={caretOn} style={{ paddingTop: (SIZE * 1.45) / 2 }} />
        ) : (
          <>
            <MonoLine tokens={lines[0]} size={SIZE} visibleChars={typed} caret={caretOn && typed < len1} />
            <MonoLine
              tokens={lines[1]}
              size={SIZE}
              visibleChars={Math.max(0, typed - len1)}
              caret={caretOn && typed >= len1}
              style={{ minHeight: SIZE * 1.45 }}
            />
          </>
        )}
      </div>
      {run > 0 && runFade > 0 ? (
        <div style={{ position: 'absolute', left: 0, bottom: 0, height: 5, width: `${run * 100}%`, background: C.cyan, opacity: runFade }} />
      ) : null}
    </div>
  );
}
