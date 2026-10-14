import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { CALENDAR_MARKS } from '../../../data/s06-recap';
import { Phone } from '../Phone';

/** Height of the art slot of a rule card. */
export const ART_H = 190;

/**
 * Rule 1: the phone whose screen cracks, with a block of four quarters beside it, one of them gone. «Un evento no
 * se lo lleva todo».
 */
export function PhoneArt({ frame, at, crackAt }: { frame: number; at: number; crackAt: number }) {
  const crack = progress(frame, crackAt, 22, EASE.inOut);
  const cells = [0, 1, 2, 3];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
      <Phone width={78} crack={crack} />
      <div style={{ display: 'flex', gap: 8 }}>
        {cells.map((i) => {
          const lost = i === 3;
          const lit = lost ? crack : 0;
          return (
            <div
              key={i}
              style={{
                width: 46,
                height: 96,
                boxSizing: 'border-box',
                borderRadius: i === 0 ? '12px 4px 4px 12px' : i === 3 ? '4px 12px 12px 4px' : 4,
                border: `3px ${lost && lit > 0.3 ? 'dashed' : 'solid'} ${alpha(lost && lit > 0.3 ? C.rose : C.cyan, 0.8)}`,
                background: lost ? alpha(C.rose, 0.1 + 0.25 * lit) : alpha(C.cyan, 0.2),
                opacity: progress(frame, at + i * 3, 12),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Rule 2: the ten-year calendar — ten squares, five marked at uneven positions («esperados, no fijos»); the marks
 * come in one by one.
 */
export function CalendarArt({ frame, at, marksAt }: { frame: number; at: number; marksAt: number }) {
  const size = 38;
  const gap = 9;
  return (
    <div>
      <div style={{ display: 'flex', gap }}>
        {Array.from({ length: 10 }, (_, i) => {
          const markIdx = (CALENDAR_MARKS as readonly number[]).indexOf(i);
          const mark = markIdx >= 0 ? progress(frame, marksAt + markIdx * 6, 12) : 0;
          return (
            <div
              key={i}
              style={{
                width: size,
                height: size,
                boxSizing: 'border-box',
                borderRadius: 8,
                border: `3px solid ${mark > 0.3 ? C.cyan : C.ink600}`,
                background: mark > 0.3 ? alpha(C.cyan, 0.15 + 0.5 * mark) : alpha(C.ink800, 0.9),
                boxShadow: mark > 0.3 ? `0 0 ${Math.round(16 * mark)}px ${alpha(C.cyan, 0.35 * mark)}` : undefined,
                opacity: progress(frame, at + i * 2, 10),
              }}
            />
          );
        })}
      </div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.sans, fontSize: 26, fontWeight: 650, color: C.muted }}>
        <span>año 1</span>
        <span>año 10</span>
      </div>
    </div>
  );
}

/** Rule 3: the two annual bars on one scale — the ALE (cyan) and the control (emerald), with the ALE's line. */
export function BarsArt({ frame, at }: { frame: number; at: number }) {
  const full = 300; // 50.000
  const ctl = Math.round((full * 20) / 50); // 20.000, same scale
  const grow = progress(frame, at + 4, 20, EASE.inOut);
  const grow2 = progress(frame, at + 14, 20, EASE.inOut);
  const row = (label: string, color: string, w: number, g: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 54 }}>
      <span style={{ width: 124, fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color, textAlign: 'right' }}>{label}</span>
      <div style={{ width: w * g, height: 40, borderRadius: 8, background: `linear-gradient(90deg, ${alpha(color, 0.55)} 0%, ${alpha(color, 0.95)} 100%)`, boxShadow: `0 0 18px ${alpha(color, 0.25)}` }} />
    </div>
  );
  return (
    <div style={{ position: 'relative', paddingBottom: 4 }}>
      {row('ALE', C.cyan, full, grow)}
      <div style={{ height: 14 }} />
      {row('control', C.emerald, ctl, grow2)}
      {/* The ALE's line: the yardstick the control is held against */}
      <div style={{ position: 'absolute', left: 124 + 14 + full, top: -10, height: 54 * 2 + 14 + 20, borderLeft: `3px dashed ${alpha(C.cyanSoft, 0.8 * grow)}` }} />
    </div>
  );
}
