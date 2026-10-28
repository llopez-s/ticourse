import type { CSSProperties } from 'react';
import { ACCENT, C, FONT, RADIUS, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/**
 * An IPv4 address as four framed number cells (+ optional «/24» suffix), so scenes can frame each number,
 * tint the network part cyan and the host part amber, and align 8-bit groups under the cells.
 * Layout is deterministic (monospace advance 0.6 em): `addrLayout` returns the cells' x and width.
 */
export interface AddrCellLayout {
  x: number;
  w: number;
}

const PAD_X = 0.16; // em
const ADVANCE = 0.6; // em per mono glyph

export function addrLayout(ip: string, size: number, prefix?: string | number): { cells: AddrCellLayout[]; width: number; suffixX: number } {
  const parts = ip.split('.');
  const padPx = PAD_X * size;
  const dotW = ADVANCE * size;
  const cells: AddrCellLayout[] = [];
  let x = 0;
  parts.forEach((p, i) => {
    const w = p.length * ADVANCE * size + padPx * 2;
    cells.push({ x, w });
    x += w + (i < parts.length - 1 ? dotW : 0);
  });
  const suffixX = x;
  const suffixW = prefix === undefined ? 0 : (String(prefix).length + 1) * ADVANCE * size;
  return { cells, width: x + suffixW, suffixX };
}

export function Addr({
  ip,
  prefix,
  size = 92,
  frame,
  tints,
  prefixTone,
  prefixFrame = 0,
  weight = 700,
  style,
}: {
  ip: string;
  prefix?: string | number;
  size?: number;
  /** 0-1 per number: a rounded frame around it (s02 «cuatro números»). */
  frame?: readonly number[];
  /** Accent per number (cyan = network, amber = host); null = plain. */
  tints?: readonly (Accent | null)[];
  prefixTone?: Accent | null;
  prefixFrame?: number;
  weight?: number;
  style?: CSSProperties;
}) {
  const parts = ip.split('.');
  const lay = addrLayout(ip, size, prefix);
  const cellStyle = (i: number): CSSProperties => {
    const f = frame?.[i] ?? 0;
    const tone = tints?.[i] ?? null;
    const a = tone ? ACCENT[tone] : null;
    return {
      width: lay.cells[i].w,
      boxSizing: 'border-box',
      textAlign: 'center',
      borderRadius: RADIUS.md,
      border: `${Math.max(2, Math.round(size * 0.035))}px solid ${a ? alpha(a.fg, 0.35 + 0.6 * Math.max(f, 0.4)) : alpha(C.cyanSoft, 0.9 * f)}`,
      background: a ? alpha(a.fg, 0.1 + 0.1 * f) : alpha(C.cyan, 0.1 * f),
      color: a ? a.soft : C.textStrong,
      lineHeight: 1.18,
    };
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', fontFamily: FONT.mono, fontSize: size, fontWeight: weight, whiteSpace: 'nowrap', ...style }}>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={cellStyle(i)}>{p}</span>
          {i < parts.length - 1 ? <span style={{ width: ADVANCE * size, textAlign: 'center', color: C.muted }}>.</span> : null}
        </span>
      ))}
      {prefix !== undefined ? (
        <span
          style={{
            marginLeft: 0,
            borderRadius: RADIUS.md,
            padding: `0 ${PAD_X * size * 0.5}px`,
            color: prefixTone ? ACCENT[prefixTone].soft : C.text,
            border: `${Math.max(2, Math.round(size * 0.035))}px solid ${prefixTone ? alpha(ACCENT[prefixTone].fg, 0.35 + 0.6 * prefixFrame) : alpha(C.cyanSoft, 0.9 * prefixFrame)}`,
            lineHeight: 1.18,
          }}
        >
          /{prefix}
        </span>
      ) : null}
    </div>
  );
}
