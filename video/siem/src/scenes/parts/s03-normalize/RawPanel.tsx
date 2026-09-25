import { interpolateColors, useVideoConfig } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, MonoLine, Panel, type MonoToken } from '../../../../../engine/src/ui';
import { SOURCES } from '../../../data/s03-normalize';
import { CHAR_W, L, LINE_LEN, PART_GEO, columnFocus, flightStart, rawOffset, rowTop, type S03Timing } from './layout';

/** Frames the parser's scan bar takes to cross one line. */
const SCAN = 26;

export function typeStart(T: S03Timing, r: number): number {
  return T.raw - 6 + r * 12;
}

export function scanStart(T: S03Timing, r: number): number {
  return T.parse + r * 8;
}

/**
 * The three raw lines, one per dialect. They type in at "raw"; at "parse" a
 * scan bar crosses each line and leaves the extracted fields highlighted
 * while the rest fades; the dialect's own field names light up when the voice
 * names the matching schema column.
 */
export function RawPanel({ frame, T }: { frame: number; T: S03Timing }) {
  const { fps } = useVideoConfig();
  const e = enter(frame, 4, { distance: 20 });
  const y = L.rawY + rawOffset(frame, T);
  const dim = 1 - 0.93 * progress(frame, T.utc - 6, 14);
  const chipA = progress(frame, T.raw + 36, 12) * (1 - progress(frame, T.parse + 34, 10));
  const chipB = progress(frame, T.parse + 38, 12);

  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: 1728, height: L.rawH, opacity: e.opacity * dim, transform: e.transform }}>
      <Panel style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 20,
          top: 0,
          height: L.rawBody,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: `2px solid ${C.ink700}`,
        }}
      >
        <Icon name="file" size={28} color={C.cyan} />
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 700, color: C.text }}>Registros en bruto</span>
        <div style={{ position: 'relative', marginLeft: 'auto', width: 360, height: 44 }}>
          <div style={{ position: 'absolute', right: 0, top: 0, opacity: chipA }}>
            <Chip accent="muted" size={TYPE.small}>
              3 fuentes · 3 dialectos
            </Chip>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, opacity: chipB }}>
            <Chip accent="cyan" icon="check" size={TYPE.small}>
              15 campos extraídos
            </Chip>
          </div>
        </div>
      </div>
      {SOURCES.map((src, r) => {
        const top = rowTop(r) - L.rawY;
        const rowIn = enter(frame, 12 + r * 6, { distance: 16, axis: 'x' });
        const typedStart = typeStart(T, r);
        const visible = Math.max(0, Math.floor(((frame - typedStart) / fps) * 100));
        const typing = visible > 0 && visible < LINE_LEN[r];
        const scanP = progress(frame, scanStart(T, r), SCAN, EASE.inOut);
        const scanX = scanP * LINE_LEN[r] * CHAR_W;
        const dialect = progress(frame, typedStart, 12);
        const geo = PART_GEO[r];

        const tokens: MonoToken[] = geo.map((part) => {
          const passed = progress(frame, scanStart(T, r) + ((part.c0 + 0.5) / LINE_LEN[r]) * SCAN, 6);
          const focusKey = part.key ? columnFocus(frame, T, part.key) : 0;
          if (part.field) return { t: part.t, c: interpolateColors(passed, [0, 1], [C.text, C.textStrong]), bold: passed > 0.5 };
          if (part.key) {
            const base = interpolateColors(passed, [0, 1], [C.text, C.muted]);
            return { t: part.t, c: focusKey > 0.3 ? C.cyanSoft : base, bold: focusKey > 0.3 };
          }
          return { t: part.t, c: interpolateColors(passed, [0, 1], [C.text, C.faint]) };
        });

        return (
          <div key={src.id} style={{ position: 'absolute', left: 0, top, width: 1728, height: L.rowStep, ...rowIn }}>
            {r > 0 ? <div style={{ position: 'absolute', left: 24, right: 24, top: -5, height: 1, background: alpha(C.ink700, 0.8) }} /> : null}
            <div
              style={{
                position: 'absolute',
                left: L.iconX,
                top: 12,
                width: 50,
                height: 50,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.cyan, 0.08),
                border: `2px solid ${alpha(C.cyan, 0.3)}`,
              }}
            >
              <Icon name={src.icon} size={28} color={C.cyanSoft} />
            </div>
            <div style={{ position: 'absolute', left: L.textX, top: 0, height: 34, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.textStrong }}>{src.kind}</span>
              <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 550, color: C.cyanSoft, opacity: 0.85 * dialect }}>
                · {src.dialect}
              </span>
            </div>
            {/* Field highlights (behind the text) */}
            {geo.map((part, i) => {
              if (!part.field) return null;
              const on = progress(frame, scanStart(T, r) + (part.c0 / LINE_LEN[r]) * SCAN, 6);
              if (on <= 0) return null;
              const lifted = 1 - 0.5 * progress(frame, flightStart(T, r, part.field), 8);
              const keyPart = i > 0 && geo[i - 1].key === part.field ? geo[i - 1] : null;
              const f = columnFocus(frame, T, part.field);
              const x0 = (keyPart ? keyPart.c0 : part.c0) * CHAR_W;
              const x1 = (part.c0 + part.t.length) * CHAR_W;
              return (
                <div key={i}>
                  <div
                    style={{
                      position: 'absolute',
                      left: L.textX + part.c0 * CHAR_W - 2,
                      top: L.rawLineDy + 2,
                      width: part.t.length * CHAR_W + 4,
                      height: L.rawLineH - 4,
                      borderRadius: 6,
                      background: alpha(C.cyan, 0.2 * on * lifted),
                      boxShadow: `inset 0 0 0 2px ${alpha(C.cyan, 0.55 * on * lifted)}`,
                    }}
                  />
                  {f > 0 && part.field !== 'hora' ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: L.textX + x0 - 8,
                        top: L.rawLineDy - 3,
                        width: x1 - x0 + 16,
                        height: L.rawLineH + 6,
                        borderRadius: 10,
                        border: `3px solid ${alpha(C.cyanSoft, 0.95 * f)}`,
                        boxShadow: `0 0 18px ${alpha(C.cyan, 0.45 * f)}`,
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
            <MonoLine
              tokens={tokens}
              size={L.rawSize}
              visibleChars={visible}
              caret={typing}
              style={{ position: 'absolute', left: L.textX, top: L.rawLineDy }}
            />
            {scanP > 0 && scanP < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: L.textX + scanX - 2,
                  top: L.rawLineDy - 4,
                  width: 4,
                  height: L.rawLineH + 8,
                  borderRadius: 2,
                  background: C.cyan,
                  boxShadow: `0 0 16px ${alpha(C.cyan, 0.9)}`,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
