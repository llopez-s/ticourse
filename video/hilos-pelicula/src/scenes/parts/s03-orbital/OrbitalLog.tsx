import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';

// Owner: builder B1 (scene-local to s03-orbital).

/**
 * Orbital's raw events, the lesson's lines verbatim (`src/data/s2.ts:880-883`), in one panel whose title replaces
 * the lesson's `[Victim 2 — Orbital Components (Meridian supplier)]` line. Each `->` of the lesson is a DRAWN
 * connector (SVG arrow `CONN_COLS` columns wide, the idiom of V13's LessonLog `ConnectorPart`), never a typed
 * character: the engine fonts are latin subsets and arrow characters are forbidden on screen. On screen the Windows
 * paths have ONE backslash (escaped twice in this source).
 *
 * Geometry in px at mono `MONO` (JetBrains Mono, advance 0.6 em): `logRowCenter(i)` and `logRowEnd(i)` are relative
 * to the panel's top-left; `LOG_W` / `LOG_H` its size. Every part sits on its own column, so anchors match the text.
 */

export const LOG_TITLE = { pre: 'eventos crudos', name: 'Orbital Components', post: 'proveedor de Meridian' } as const;

type Kind = 'time' | 'text' | 'lure' | 'victim' | 'path' | 'name' | 'domain' | 'pdb';
type TextPart = { text: string; kind?: Kind };
type ConnPart = { conn: true };
type Part = TextPart | ConnPart;

/** Columns of a drawn connector (the lesson's « -> », spaces included). */
const CONN_COLS = 4;
const isConn = (p: Part): p is ConnPart => 'conn' in p;

export type LogRowId = 'mail' | 'runs' | 'pdb' | 'beacon';

const ROWS: { id: LogRowId; parts: Part[] }[] = [
  {
    id: 'mail',
    parts: [
      { text: '2026-03-09 08:05', kind: 'time' },
      { text: '  email ' },
      { text: '"PO revision"', kind: 'lure' },
      { conn: true },
      { text: 'finance@orbital.example', kind: 'victim' },
    ],
  },
  {
    id: 'runs',
    parts: [
      { text: '2026-03-09 08:22', kind: 'time' },
      { text: '  attachment runs; drops ' },
      { text: 'C:\\Users\\..\\msdtcs.exe', kind: 'path' },
    ],
  },
  {
    id: 'pdb',
    parts: [{ text: '                  linker artifact: ' }, { text: 'D:\\proj\\cicada\\loader\\Release\\ldr.pdb', kind: 'pdb' }],
  },
  {
    id: 'beacon',
    parts: [
      { text: '2026-03-09 08:23', kind: 'time' },
      { text: '  ' },
      { text: 'msdtcs.exe', kind: 'name' },
      { text: ' beacons' },
      { conn: true },
      { text: 'portal-auth-check.example:443', kind: 'domain' },
    ],
  },
];

export const LOG_ROWS: readonly LogRowId[] = ROWS.map((r) => r.id);

const KIND_COLOR: Record<Kind, string> = {
  time: C.muted,
  text: C.text,
  lure: C.amber,
  victim: C.cyanSoft,
  path: C.textStrong,
  name: C.textStrong,
  domain: C.roseSoft,
  pdb: C.text,
};

export const MONO = 28;
const CH = MONO * 0.6;
const PAD_X = 30;
const HEADER_H = 66;
const BODY_TOP = 16;
const ROW_H = 56;
const BOTTOM = 20;

const partCols = (p: Part) => (isConn(p) ? CONN_COLS : p.text.length);
const rowCols = (i: number) => ROWS[i].parts.reduce((s, p) => s + partCols(p), 0);
const MAX_COLS = Math.max(...ROWS.map((_, i) => rowCols(i)));

/** Panel size in px. */
export const LOG_W = Math.ceil(PAD_X * 2 + MAX_COLS * CH);
export const LOG_H = HEADER_H + BODY_TOP + ROWS.length * ROW_H + BOTTOM;

/** Vertical centre of row `i` (px from the panel's top). */
export const logRowCenter = (i: number) => HEADER_H + BODY_TOP + i * ROW_H + ROW_H / 2;
/** Right end of row `i`'s text (px from the panel's left). */
export const logRowEnd = (i: number) => PAD_X + rowCols(i) * CH;

export interface OrbitalLogProps {
  /** 0–1 per row: the row appears (fade + slide). */
  show?: Partial<Record<LogRowId, number>>;
  /** 0–1 per row: in focus (brighter, its highlight on). */
  focus?: Partial<Record<LogRowId, number>>;
  /** 0–1 per row: pushed back (the voice is elsewhere; `pdb` stays back for s04). */
  dim?: Partial<Record<LogRowId, number>>;
  /** 0–1 per row: the drawn connector of that row (mail, beacon). Default 1. */
  conn?: Partial<Record<LogRowId, number>>;
  /** 0–1 position of a pulse travelling the beacon's connector (omit for none). */
  beat?: number;
  /** 0–1: the panel itself (frame + title) appears. */
  panel?: number;
}

export function OrbitalLog({ show = {}, focus = {}, dim = {}, conn = {}, beat, panel = 1 }: OrbitalLogProps) {
  const pIn = clamp01(panel);
  return (
    <div
      style={{
        position: 'relative',
        width: LOG_W,
        height: LOG_H,
        fontFamily: FONT.sans,
        opacity: EASE.out(pIn),
        transform: `translateY(${(1 - EASE.out(pIn)) * 16}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 22px 54px ${alpha('#000000', 0.42)}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LOG_W,
          height: HEADER_H,
          boxSizing: 'border-box',
          padding: `0 ${PAD_X}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderBottom: `2px solid ${C.ink700}`,
          fontSize: 30,
          fontWeight: 650,
          color: C.muted,
          whiteSpace: 'nowrap',
        }}
      >
        <span>{LOG_TITLE.pre}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ color: C.cyanSoft, fontWeight: 800 }}>{LOG_TITLE.name}</span>
        <span style={{ color: C.faint }}>·</span>
        <span>{LOG_TITLE.post}</span>
      </div>
      {ROWS.map((row, i) => {
        const s = clamp01(show[row.id] ?? 1);
        if (s <= 0.001) return null;
        const f = clamp01(focus[row.id] ?? 0);
        const d = clamp01(dim[row.id] ?? 0);
        const top = HEADER_H + BODY_TOP + i * ROW_H;
        return (
          <div
            key={row.id}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: LOG_W,
              height: ROW_H,
              opacity: EASE.out(s) * (1 - 0.62 * d),
              transform: `translateX(${(1 - EASE.out(s)) * -18}px)`,
            }}
          >
            {f > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  top: 4,
                  bottom: 4,
                  borderRadius: 10,
                  background: alpha(C.text, 0.07 * f),
                  boxShadow: `inset 4px 0 0 ${alpha(C.text, 0.55 * f)}`,
                }}
              />
            ) : null}
            <RowText parts={row.parts} focus={f} conn={clamp01(conn[row.id] ?? 1)} beat={row.id === 'beacon' ? beat : undefined} />
          </div>
        );
      })}
    </div>
  );
}

function RowText({ parts, focus, conn, beat }: { parts: Part[]; focus: number; conn: number; beat?: number }) {
  let col = 0;
  const out: ReactNode[] = [];
  parts.forEach((p, i) => {
    const left = PAD_X + col * CH;
    col += partCols(p);
    if (isConn(p)) {
      const w = CONN_COLS * CH;
      const y = ROW_H / 2;
      const x0 = CH * 0.75;
      const x1 = w - CH * 0.75;
      const xe = x0 + (x1 - x0) * conn;
      const head = MONO * 0.3;
      const b = beat === undefined ? -1 : clamp01(beat);
      out.push(
        <svg key={i} width={w} height={ROW_H} style={{ position: 'absolute', left, top: 0, overflow: 'visible' }}>
          {conn > 0 ? (
            <>
              <line x1={x0} y1={y} x2={Math.max(x0, xe - head * 0.6)} y2={y} stroke={C.sky} strokeWidth={MONO * 0.1} strokeLinecap="round" />
              <polygon points={`${xe - head * 1.1},${y - head * 0.62} ${xe},${y} ${xe - head * 1.1},${y + head * 0.62}`} fill={C.sky} opacity={conn} />
            </>
          ) : null}
          {b > 0 && b < 1 && conn >= 1 ? <circle cx={x0 + (x1 - x0) * b} cy={y} r={MONO * 0.17} fill={C.roseSoft} opacity={Math.sin(Math.PI * b)} /> : null}
        </svg>,
      );
      return;
    }
    const kind = p.kind ?? 'text';
    let color = KIND_COLOR[kind];
    if (kind === 'text' && focus > 0.5) color = C.textStrong;
    const lh = MONO * 1.3;
    out.push(
      <span
        key={i}
        style={{
          position: 'absolute',
          left,
          top: (ROW_H - lh) / 2,
          height: lh,
          lineHeight: `${lh}px`,
          fontFamily: FONT.mono,
          fontSize: MONO,
          whiteSpace: 'pre',
          color,
          fontWeight: kind === 'name' || kind === 'path' || kind === 'domain' || kind === 'victim' || kind === 'lure' ? 700 : 450,
        }}
      >
        {p.text}
      </span>,
    );
  });
  return <>{out}</>;
}
