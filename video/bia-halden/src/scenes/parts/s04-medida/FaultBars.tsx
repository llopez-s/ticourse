import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { FAULTS, RTO_MIN } from '../../../data/s04-medida';

const CYAN_FILL = `linear-gradient(180deg, #0e7490, #0b5a70)`;
const ROSE_FILL = `linear-gradient(180deg, #e11d48, #9f1239)`;

/**
 * The four bars of s04 on ONE scale (`pxPerMin`), all starting at x0. Each bar is a cyan measurement; the part past
 * the 30-minute promise turns rose on `gapP` (0–1). `rowAt` = frame the row label lands, `barAt` = frame its bar
 * starts to grow (the spoken number). Frames are relative to the Sequence.
 */
export function FaultBars({
  frame,
  x0,
  pxPerMin,
  rowH,
  barH,
  rowAt,
  barAt,
  gapAt,
  labelW,
}: {
  frame: number;
  x0: number;
  pxPerMin: number;
  rowH: number;
  barH: number;
  rowAt: number[];
  barAt: number[];
  gapAt: number;
  labelW: number;
}) {
  return (
    <>
      {FAULTS.map((f, i) => {
        const top = i * rowH;
        const rowIn = progress(frame, rowAt[i], 12);
        const grow = progress(frame, barAt[i], 20, EASE.out);
        const len = f.minutes * pxPerMin * grow;
        const rto = RTO_MIN * pxPerMin;
        const base = Math.min(len, rto);
        const over = Math.max(0, len - rto);
        const rose = progress(frame, gapAt + i * 6, 14, EASE.inOut);
        return (
          <div key={f.ordinal} style={{ position: 'absolute', left: 0, top, height: rowH, width: '100%', opacity: rowIn }}>
            {/* ordinal */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: labelW,
                top: 0,
                height: rowH,
                display: 'flex',
                alignItems: 'center',
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 700,
                color: C.text,
                whiteSpace: 'nowrap',
                transform: `translateX(${(1 - rowIn) * -16}px)`,
              }}
            >
              {f.ordinal}
            </div>
            {/* bar track */}
            <div style={{ position: 'absolute', left: x0, top: (rowH - barH) / 2, height: barH, width: f.minutes * pxPerMin, borderRadius: RADIUS.sm, background: alpha(C.ink700, 0.35) }} />
            {/* cyan base (up to the promise) */}
            <div
              style={{
                position: 'absolute',
                left: x0,
                top: (rowH - barH) / 2,
                height: barH,
                width: base,
                borderRadius: over > 0 ? `${RADIUS.sm}px 0 0 ${RADIUS.sm}px` : RADIUS.sm,
                background: CYAN_FILL,
                boxShadow: `inset 0 0 0 2px ${alpha(C.cyan, 0.7)}`,
              }}
            />
            {/* the part past the promise: cyan, then rose on the gap */}
            {over > 0 ? (
              <div style={{ position: 'absolute', left: x0 + rto, top: (rowH - barH) / 2, height: barH, width: over, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: CYAN_FILL, boxShadow: `inset 0 0 0 2px ${alpha(C.cyan, 0.7)}` }} />
                <div style={{ position: 'absolute', inset: 0, opacity: rose, background: ROSE_FILL, boxShadow: `inset 0 0 0 2px ${alpha(C.roseSoft, 0.8)}` }} />
              </div>
            ) : null}
            {/* the value, inside the bar so the mean line never crosses it */}
            <div
              style={{
                position: 'absolute',
                left: x0 + 18,
                top: (rowH - barH) / 2,
                height: barH,
                display: 'flex',
                alignItems: 'center',
                fontFamily: FONT.mono,
                fontSize: 36,
                fontWeight: 850,
                color: C.textStrong,
                whiteSpace: 'nowrap',
                opacity: Math.min(1, grow * 2.2),
                textShadow: `0 1px 6px ${alpha('#000000', 0.55)}`,
              }}
            >
              {f.minutes} min
            </div>
          </div>
        );
      })}
    </>
  );
}
