import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { ROUTES } from './data';

/**
 * The router's route table (s04, s05): three rows, exact canon texts. Rows light cyan (`lit`) when the voice
 * is on them; `miss` turns a row amber with a struck network («falta la ruta de vuelta»). Native width 760.
 * Row height ROUTE_ROW_H; `rowTop(i)` gives a row's y inside the table for pointers.
 */
export const ROUTE_TABLE_W = 760;
export const ROUTE_ROW_H = 66;
const HEAD_H = 52;

export function routeRowTop(i: number): number {
  return HEAD_H + 8 + i * (ROUTE_ROW_H + 8);
}
export const ROUTE_TABLE_H = routeRowTop(3) + 4;

export function RouteTable({
  rows = [1, 1, 1],
  lit = [0, 0, 0],
  miss = [0, 0, 0],
  opacity = 1,
  style,
}: {
  /** 0-1 reveal per row. */
  rows?: readonly number[];
  /** 0-1 highlight per row. */
  lit?: readonly number[];
  /** 0-1 amber «falta» per row. */
  miss?: readonly number[];
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width: ROUTE_TABLE_W, opacity, ...style }}>
      <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, letterSpacing: 0.4, color: C.muted }}>
        tabla de rutas del router
      </div>
      {ROUTES.map((r, i) => {
        const l = lit[i] ?? 0;
        const m = miss[i] ?? 0;
        const col = m > 0.05 ? C.amber : C.cyan;
        const k = Math.max(l, m);
        const grey = i === 2;
        return (
          <div
            key={r.net}
            style={{
              height: ROUTE_ROW_H,
              marginTop: 8,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 22px',
              borderRadius: RADIUS.md,
              border: `2px solid ${k > 0.02 ? alpha(col, 0.85) : C.ink600}`,
              background: k > 0.02 ? alpha(col, 0.1 + 0.1 * k) : C.ink850,
              boxShadow: k > 0.05 ? `0 0 ${Math.round(30 * k)}px ${alpha(col, 0.35 * k)}` : undefined,
              opacity: rows[i] ?? 1,
              transform: `translateX(${Math.round((1 - (rows[i] ?? 1)) * -24)}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontFamily: grey ? FONT.sans : FONT.mono, fontSize: 32, fontWeight: 750, color: C.textStrong, textDecoration: m > 0.5 ? 'line-through' : undefined }}>{r.net}</span>
            <span style={{ width: 22, height: 4, borderRadius: 2, background: alpha(col, 0.7), flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: k > 0.02 ? (m > 0.05 ? C.amber : C.cyanSoft) : C.text }}>{r.leg}</span>
          </div>
        );
      })}
    </div>
  );
}
