import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

/** Widths of the log's lines (percent of the body), fixed so the log looks the same every time. */
const LINE_W = [78, 62, 86, 54, 72, 66, 80, 58] as const;

/**
 * The SOC's log: a small console panel. `shown` is how many lines are written (0 = empty: only faint ghost rows
 * wait; fractional values fade the last one in). Lines are bars, not words: nothing here is a host, address or date.
 */
export function SocLog({
  width,
  height,
  shown = 0,
  rows = 6,
  title = 'registro del SOC',
  titleSize = 28,
  tone = C.cyan,
}: {
  width: number;
  height: number;
  shown?: number;
  rows?: number;
  title?: string;
  titleSize?: number;
  tone?: string;
}) {
  const head = titleSize + 22;
  const pad = 16;
  const rowH = Math.max(14, (height - head - pad * 2) / rows);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(shown > 0 ? tone : C.muted, shown > 0 ? 0.7 : 0.45)}`,
        background: C.ink900,
        boxShadow: shown > 0 ? `0 0 26px ${alpha(tone, 0.2)}` : undefined,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: head, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: `2px solid ${alpha(C.text, 0.1)}`, fontSize: titleSize, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: alpha(shown > 0 ? C.amber : C.muted, 0.8) }} />
        {title}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: head + pad, bottom: pad }}>
        {Array.from({ length: rows }, (_, i) => {
          const on = Math.max(0, Math.min(1, shown - i));
          const w = LINE_W[i % LINE_W.length];
          return (
            <div key={i} style={{ position: 'absolute', left: 16, right: 16, top: i * rowH, height: rowH, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: on > 0 ? alpha(i % 3 === 1 ? C.amber : C.cyan, 0.9 * on) : 'transparent' }} />
              <div style={{ width: `${w}%`, height: 8, borderRadius: 4, background: on > 0 ? alpha(tone, 0.6 * on) : 'transparent', border: on > 0 ? undefined : `2px dashed ${alpha(C.muted, 0.16)}`, boxSizing: 'border-box', opacity: on > 0 ? 1 : 1 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
