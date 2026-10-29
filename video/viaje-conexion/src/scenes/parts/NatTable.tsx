import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { NAT_ROWS } from './data';

/**
 * The NAT table of the shipping company's router (s08, s09): one row per conversation,
 * «interno · público · destino · hora». Rows come from `NAT_ROWS` (the first is the laptop's own; the other
 * three are the fixed fillers). Native size NAT_W x NAT_H; s09 draws it smaller with a CSS scale.
 * `rows` is the reveal of each row (typed in from the left), `lit` its highlight (the voice is on it or the
 * lookup blinks it), `markAddr` underlines the shared public address and `markPorts` turns the four ports
 * amber (s08 `shared`: one public address, a different port each).
 */
const ROW_H = 62;
const ROW_GAP = 8;
const HEAD_H = 42;
const PAD = 20;
const COLS = [392, 392, 296, 186] as const;
const COL_GAP = 14;

export const NAT_ROW_H = ROW_H;
export const NAT_W = PAD * 2 + COLS.reduce((a, b) => a + b, 0) + COL_GAP * (COLS.length - 1);
/** y of row i inside the table. */
export function natRowTop(i: number): number {
  return HEAD_H + 6 + i * (ROW_H + ROW_GAP);
}
export const NAT_H = natRowTop(NAT_ROWS.length) - ROW_GAP;
/** x of column c inside a row (for pointers). */
export function natColX(c: number): number {
  return PAD + COLS.slice(0, c).reduce((a, b) => a + b + COL_GAP, 0);
}

const HEADS = ['interno', 'público', 'destino', 'hora'] as const;
const MONO = 31;

function splitAddr(v: string): [string, string] {
  const i = v.lastIndexOf(':');
  return [v.slice(0, i), v.slice(i + 1)];
}

export function NatTable({
  rows = [1, 1, 1, 1],
  lit = [0, 0, 0, 0],
  markAddr = 0,
  markPorts = 0,
  markTime = 0,
  count = NAT_ROWS.length,
  skeleton = false,
  style,
}: {
  rows?: readonly number[];
  lit?: readonly number[];
  markAddr?: number;
  markPorts?: number;
  /** 0-1: the first row's time lights cyan (s09 match). */
  markTime?: number;
  /** How many of the NAT_ROWS exist in the table (s08 starts with one). */
  count?: number;
  /** Dashed empty slots for the rows that are not written yet (s08 shows the table waiting). */
  skeleton?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div style={{ position: 'relative', width: NAT_W, height: NAT_H, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: NAT_W, height: HEAD_H, display: 'flex', alignItems: 'center', paddingLeft: PAD, gap: COL_GAP }}>
        {HEADS.map((h, i) => (
          <div key={h} style={{ width: COLS[i], fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, letterSpacing: 0.4, color: C.muted }}>
            {h}
          </div>
        ))}
      </div>
      {skeleton
        ? NAT_ROWS.map((r, i) => (
            <div
              key={`sk${r.outside}`}
              style={{ position: 'absolute', left: 0, top: natRowTop(i), width: NAT_W, height: ROW_H, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink500, 0.6)}`, opacity: 1 - Math.min(1, (rows[i] ?? 0) * 3) }}
            />
          ))
        : null}
      {NAT_ROWS.slice(0, count).map((r, i) => {
        const reveal = rows[i] ?? 0;
        const l = lit[i] ?? 0;
        const [pubA, pubP] = splitAddr(r.outside);
        const col = C.cyan;
        const cell = (c: number): CSSProperties => ({ width: COLS[c], fontFamily: FONT.mono, fontSize: MONO, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' });
        return (
          <div
            key={r.outside}
            style={{
              position: 'absolute',
              left: 0,
              top: natRowTop(i),
              width: NAT_W,
              height: ROW_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: COL_GAP,
              paddingLeft: PAD,
              borderRadius: RADIUS.md,
              border: `2px solid ${l > 0.02 ? alpha(col, 0.55 + 0.4 * l) : C.ink600}`,
              background: l > 0.02 ? alpha(col, 0.08 + 0.12 * l) : C.ink850,
              boxShadow: l > 0.05 ? `0 0 ${Math.round(34 * l)}px ${alpha(col, 0.4 * l)}` : undefined,
              opacity: Math.min(1, reveal * 3),
              clipPath: `inset(-12px ${Math.round((1 - reveal) * 100)}% -12px 0)`,
            }}
          >
            <div style={cell(0)}>{r.inside}</div>
            <div style={cell(1)}>
              <span style={{ color: C.amber, borderBottom: `3px solid ${alpha(C.cyan, markAddr)}` }}>{pubA}</span>
              <span style={{ color: C.amber }}>:</span>
              <span style={{ color: C.amber, textDecoration: markPorts > 0.5 ? 'underline' : undefined, textDecorationThickness: 4, textUnderlineOffset: 6, fontWeight: markPorts > 0.5 ? 900 : 700 }}>{pubP}</span>
            </div>
            <div style={cell(2)}>{r.dest}</div>
            <div style={{ ...cell(3), color: i === 0 && markTime > 0.5 ? C.cyanSoft : C.muted, textDecoration: i === 0 && markTime > 0.5 ? 'underline' : undefined, textDecorationThickness: 4, textUnderlineOffset: 6 }}>{r.time}</div>
          </div>
        );
      })}
    </div>
  );
}
