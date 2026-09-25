import { interpolateColors } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, lerp, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, Panel } from '../../../../../engine/src/ui';
import { COLUMN_LABEL, FIELD_ORDER, SOURCES, type FieldKey } from '../../../data/s03-normalize';
import {
  CHAR_W,
  COL,
  FLIGHT,
  L,
  PART_GEO,
  cellCy,
  columnFocus,
  flightStart,
  rawLineCy,
  rawOffset,
  type S03Timing,
} from './layout';

const cellFont = (f: FieldKey) => (f === 'accion' ? FONT.sans : FONT.mono);

/** Frame at which row `r`'s time switches to UTC. */
function utcAt(T: S03Timing, r: number): number {
  return T.wRoll + 4 + r * 5;
}

/** Colour of a time cell: neutral, amber while it is still local (utc beat), emerald once in UTC. */
function timeColor(frame: number, T: S03Timing, r: number): string {
  const warn = progress(frame, T.utc, 12);
  const done = progress(frame, utcAt(T, r), 10);
  return interpolateColors(warn + done, [0, 1, 2], [C.textStrong, C.amber, C.emerald]);
}

/**
 * The common schema: five columns, one row per source. The table frame
 * appears as the raw panel rises; cells are filled by the flying fields.
 */
export function SchemaTable({ frame, T }: { frame: number; T: S03Timing }) {
  const e = enter(frame, T.schema - 20, { distance: 12 });
  const utcFocus = progress(frame, T.utc - 4, 12) * (1 - progress(frame, T.wUtc + 16, 16));
  const utcHeader = progress(frame, T.wRoll + 8, 10);
  const schemaChip = progress(frame, T.schema + 6, 12);

  return (
    <div style={{ position: 'absolute', left: 0, top: L.tableY, width: 1728, height: L.tableH, ...e }}>
      <Panel glow={0.25 * progress(frame, T.schema, 12) * (1 - progress(frame, T.wSame + 20, 20))} style={{ width: '100%', height: '100%' }} />
      {/* Column focus bands */}
      {FIELD_ORDER.map((f) => {
        const focus = columnFocus(frame, T, f);
        if (focus <= 0) return null;
        const isTime = f === 'hora';
        const done = isTime ? progress(frame, utcAt(T, 0), 10) : 0;
        const color = isTime ? interpolateColors(done, [0, 1], [C.amber, C.emerald]) : C.cyan;
        return (
          <div
            key={f}
            style={{
              position: 'absolute',
              left: COL[f].x - 18,
              top: 10,
              width: COL[f].w,
              height: L.tableH - 20,
              borderRadius: 14,
              background: color,
              opacity: 0.1 * focus,
            }}
          />
        );
      })}
      {FIELD_ORDER.map((f) => {
        const focus = columnFocus(frame, T, f);
        const dimmed = f === 'hora' ? 1 : 1 - 0.55 * utcFocus;
        const isTime = f === 'hora';
        const color = isTime
          ? interpolateColors(progress(frame, T.utc, 12) + utcHeader, [0, 1, 2], [C.cyanSoft, C.amber, C.emerald])
          : focus > 0.3
            ? C.textStrong
            : C.cyanSoft;
        return (
          <div
            key={f}
            style={{
              position: 'absolute',
              left: COL[f].x,
              top: L.headerCy - 22,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              whiteSpace: 'nowrap',
              opacity: dimmed,
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 750,
              color,
            }}
          >
            {COLUMN_LABEL[f]}
            {isTime ? (
              <>
                <span style={{ opacity: utcHeader }}>(UTC)</span>
                <span style={{ opacity: progress(frame, T.wUtc, 10) }}>
                  <Icon name="check" size={30} color={C.emerald} strokeWidth={2.6} />
                </span>
              </>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', right: 26, top: L.headerCy - 24, opacity: schemaChip }}>
        <Chip accent="cyan" icon="layers" size={TYPE.small}>
          esquema común
        </Chip>
      </div>
      <div style={{ position: 'absolute', left: 22, right: 22, top: L.tableRow0 - 6, height: 2, background: C.ink700 }} />
      {[1, 2].map((r) => (
        <div
          key={r}
          style={{ position: 'absolute', left: 22, right: 22, top: L.tableRow0 + r * L.tableRowStep - 4, height: 1, background: alpha(C.ink700, 0.7) }}
        />
      ))}
      {/* Landed cells */}
      {SOURCES.map((src, r) =>
        FIELD_ORDER.map((f) => {
          if (frame < flightStart(T, r, f) + FLIGHT) return null;
          const isTime = f === 'hora';
          const conv = isTime ? progress(frame, utcAt(T, r), 10) : 0;
          const dimmed = isTime ? 1 : 1 - 0.55 * utcFocus;
          const focus = columnFocus(frame, T, f);
          const style = {
            position: 'absolute' as const,
            left: COL[f].x,
            top: cellCy(r) - L.tableY - 22,
            lineHeight: '44px',
            fontFamily: cellFont(f),
            fontSize: L.cellSize,
            fontWeight: 600,
            whiteSpace: 'nowrap' as const,
          };
          if (isTime) {
            const color = timeColor(frame, T, r);
            return (
              <div key={src.id + f}>
                <div style={{ ...style, color, opacity: 1 - conv, transform: `translateY(${-conv * 16}px)` }}>{src.row.hora}</div>
                <div style={{ ...style, color, opacity: conv, transform: `translateY(${(1 - conv) * 16}px)` }}>{src.utc}</div>
              </div>
            );
          }
          return (
            <div key={src.id + f} style={{ ...style, color: focus > 0.3 ? C.textStrong : f === 'accion' ? C.text : C.textStrong, opacity: dimmed }}>
              {src.row[f]}
            </div>
          );
        }),
      )}
    </div>
  );
}

/**
 * Each extracted value lifts off its raw line and lands in its schema cell,
 * turning into the normalised value on the way.
 */
export function Flights({ frame, T }: { frame: number; T: S03Timing }) {
  const drop = rawOffset(frame, T);
  return (
    <>
      {SOURCES.map((src, r) =>
        PART_GEO[r].map((part, i) => {
          if (!part.field) return null;
          const f = part.field;
          const start = flightStart(T, r, f);
          const p = progress(frame, start, FLIGHT, EASE.inOut);
          if (p <= 0 || p >= 1) return null;
          const x0 = L.textX + part.c0 * CHAR_W;
          const y0 = rawLineCy(r) + drop;
          const x1 = COL[f].x;
          const y1 = cellCy(r);
          const x = lerp(p, [0, 1], [x0, x1]);
          const y = lerp(p, [0, 1], [y0, y1]);
          const size = lerp(p, [0, 1], [L.rawSize, L.cellSize]);
          const morph = progress(p, 0.3, 0.4, EASE.inOut);
          const pill = 1 - progress(p, 0.75, 0.25);
          const target = src.row[f];
          const wRaw = part.t.length * size * 0.6;
          const wTarget = target.length * size * (f === 'accion' ? 0.53 : 0.6);
          const width = lerp(morph, [0, 1], [wRaw, wTarget]);
          const common = {
            position: 'absolute' as const,
            left: 0,
            top: 0,
            lineHeight: `${Math.round(size * 1.35)}px`,
            fontSize: size,
            fontWeight: 650,
            whiteSpace: 'nowrap' as const,
            color: C.textStrong,
          };
          return (
            <div
              key={`${src.id}-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: y - (size * 1.35) / 2,
                width,
                height: size * 1.35,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -8,
                  top: -2,
                  right: -8,
                  bottom: -2,
                  borderRadius: 10,
                  background: alpha(C.ink800, 0.96 * pill),
                  boxShadow: `inset 0 0 0 2px ${alpha(C.cyan, 0.75 * pill)}, 0 10px 26px ${alpha('#000000', 0.45 * pill)}`,
                }}
              />
              <span style={{ ...common, fontFamily: FONT.mono, opacity: 1 - morph }}>{part.t}</span>
              <span style={{ ...common, fontFamily: cellFont(f), opacity: morph }}>{target}</span>
            </div>
          );
        }),
      )}
    </>
  );
}
