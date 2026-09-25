import type { SceneProps } from '../../../timeline/types';
import { FIELD_ORDER, SOURCES, type FieldKey, type RawPart } from '../../../data/s03-normalize';
import { EASE, progress } from '../../../theme/motion';

/** Stage-local geometry of scene 03 (stage = 1728 x 660). */
export const L = {
  rawY: 96,
  rawH: 304,
  /** How far below its final place the raw panel sits before the table arrives. */
  rawDrop: 108,
  /** Body top (below the compact header) relative to the panel. */
  rawBody: 52,
  rowTop0: 6,
  rowStep: 80,
  iconX: 24,
  textX: 94,
  /** Raw line top inside a row, and its type metrics (JetBrains Mono advance = 0.6 em). */
  rawLineDy: 35,
  rawSize: 28,
  rawLineH: 28 * 1.45,
  tableY: 416,
  tableH: 244,
  headerCy: 40,
  tableRow0: 74,
  tableRowStep: 56,
  cellSize: 32,
  callout: { x: 40, y: 104, w: 820, h: 252 },
} as const;

export const CHAR_W = L.rawSize * 0.6;

/** Left edge and width of each schema column (stage x). */
export const COL: Record<FieldKey, { x: number; w: number }> = {
  hora: { x: 44, w: 250 },
  host: { x: 312, w: 290 },
  usuario: { x: 620, w: 222 },
  ip: { x: 860, w: 270 },
  accion: { x: 1148, w: 330 },
};

/** Every beat of scene 03 in LOCAL frames, anchored to cues. */
export interface S03Timing {
  intro: number;
  raw: number;
  parse: number;
  schema: number;
  utc: number;
  /** Words inside the schema sentence ("usuario", "IP de origen", "acción", "igual"). */
  wUser: number;
  wIp: number;
  wAction: number;
  wSame: number;
  /** "se guardan como" / "09:14" / "UTC" inside the utc sentence. */
  wShift: number;
  wRoll: number;
  wUtc: number;
}

export function buildTiming({ cue, segments }: SceneProps): S03Timing {
  const seg = (id: string, fallback: number) => segments.find((s) => s.id === id)?.from ?? fallback;
  const schema = cue('schema');
  const utc = cue('utc');
  return {
    intro: seg('s03-01', cue('raw') - 50),
    raw: cue('raw'),
    parse: cue('parse'),
    schema,
    utc,
    wUser: schema + 34,
    wIp: schema + 57,
    wAction: schema + 82,
    wSame: schema + 108,
    wShift: utc + 49,
    wRoll: utc + 70,
    wUtc: utc + 97,
  };
}

/** Raw panel vertical offset: centred at first, it rises to make room for the table. */
export function rawOffset(frame: number, T: S03Timing): number {
  return L.rawDrop * (1 - progress(frame, T.schema - 26, 22, EASE.inOut));
}

export interface PartGeo extends RawPart {
  /** First character index in the line. */
  c0: number;
}

/** Character offsets of every part, per source line. */
export const PART_GEO: PartGeo[][] = SOURCES.map((src) => {
  let c = 0;
  return src.parts.map((part) => {
    const g = { ...part, c0: c };
    c += part.t.length;
    return g;
  });
});

export const LINE_LEN: number[] = SOURCES.map((src) => src.parts.reduce((n, p) => n + p.t.length, 0));

/** Stage-space top of raw row `r` (without the drop offset). */
export function rowTop(r: number): number {
  return L.rawY + L.rawBody + L.rowTop0 + r * L.rowStep;
}

/** Stage-space centre of the raw text line in row `r` (without the drop offset). */
export function rawLineCy(r: number): number {
  return rowTop(r) + L.rawLineDy + L.rawLineH / 2;
}

/** Stage-space vertical centre of schema row `r`. */
export function cellCy(r: number): number {
  return L.tableY + L.tableRow0 + r * L.tableRowStep + L.tableRowStep / 2 - 2;
}

/** Field index within FIELD_ORDER (for staggering). */
export function fieldIndex(f: FieldKey): number {
  return FIELD_ORDER.indexOf(f);
}

/** When the value of field `f` in row `r` leaves the raw line (flight start). */
export function flightStart(T: S03Timing, r: number, f: FieldKey): number {
  return T.schema - 4 + r * 9 + fieldIndex(f) * 3;
}

export const FLIGHT = 22;

/** Focus (0-1) on a schema column while the voice names it. */
export function columnFocus(frame: number, T: S03Timing, f: FieldKey): number {
  const on = (at: number, off: number) => progress(frame, at, 8) * (1 - progress(frame, off, 10));
  switch (f) {
    case 'usuario':
      return on(T.wUser, T.wIp);
    case 'ip':
      return on(T.wIp, T.wAction);
    case 'accion':
      return on(T.wAction, T.wSame + 14);
    case 'hora':
      return progress(frame, T.utc - 4, 12);
    default:
      return 0;
  }
}
