import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { ACTIONS, CELL, MATRIX_TEXT, PHASES, type ActionId, type CellId, type Line, type PhaseId } from '../../../data/matrix';

export type CellTone = 'cyan' | 'emerald' | 'amber' | 'violet';
export const TONE: Record<CellTone, { fg: string; soft: string }> = {
  cyan: { fg: C.cyan, soft: C.cyanSoft },
  emerald: { fg: C.emerald, soft: '#6ee7b7' },
  amber: { fg: C.amber, soft: '#fcd34d' },
  violet: { fg: C.violet, soft: '#c4b5fd' },
};
export const VIOLET_SOFT = '#c4b5fd';
export const AMBER_SOFT = '#fcd34d';
const SLATE = '#64748b';

/** Pre-broken lines; `{ m }` tokens are identifiers, set in mono. */
export function Lines({ lines, size, mono, color = C.text, lineHeight = 1.19, weight = 600, align = 'left' }: { lines: Line[]; size: number; mono?: number; color?: string; lineHeight?: number; weight?: number; align?: 'left' | 'center' }) {
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: size, lineHeight, fontWeight: weight, color, textAlign: align, whiteSpace: 'pre' }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.map((t, k) =>
            typeof t === 'string' ? (
              <span key={k}>{t}</span>
            ) : (
              <span key={k} style={{ fontFamily: FONT.mono, fontSize: mono ?? size * 0.86, fontWeight: 700, color: C.textStrong }}>
                {t.m}
              </span>
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/** The `[!]` mark: an action the actor can see (amber). `glow` 0–1. */
export function MarkChip({ size, glow = 0, style }: { size: number; glow?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1,
        padding: `${size * 0.14}px ${size * 0.22}px`,
        borderRadius: size * 0.28,
        color: glow > 0.5 ? C.ink950 : C.amber,
        background: alpha(C.amber, 0.16 + 0.84 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(size * 1.1 * glow)}px ${alpha(C.amber, 0.7 * glow)}` : undefined,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {MATRIX_TEXT.mark}
    </span>
  );
}

export const phaseName = (id: PhaseId) => PHASES.find((p) => p.id === id)!.name;
export const actionName = (id: ActionId) => ACTIONS.find((a) => a.id === id)!.name;

/** Border and fill of a cell: Detect cells are cyan (looking), the rest steel; `tone` + `lit` recolour it. */
export function cellSkin(action: ActionId, { lit = 0, tone = 'cyan', ghost = false }: { lit?: number; tone?: CellTone; ghost?: boolean } = {}) {
  const base = action === 'detect' ? C.cyan : SLATE;
  const t = TONE[tone].fg;
  if (ghost) return { border: `2px dashed ${alpha(SLATE, 0.8)}`, background: 'transparent', boxShadow: undefined as string | undefined };
  return {
    border: `${lit > 0.3 ? 3 : 2}px solid ${lit > 0.01 ? alpha(t, 0.5 + 0.5 * lit) : alpha(base, action === 'detect' ? 0.5 : 0.7)}`,
    background: lit > 0.01 ? alpha(t, 0.1 + 0.1 * lit) : alpha(base, action === 'detect' ? 0.09 : 0.12),
    boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(t, 0.4 * lit)}` : undefined,
  };
}

/**
 * One cell as a readable card (the lifted cell, the cards of an enlarged row; also on its own for s02's
 * example and s06's thumbnails). `fontSize` is the text's px; mono identifiers are 0.86 × that.
 * - `form`: 'wide' (two lines, default) or 'lines' (the narrow breaks of the grid);
 * - `header`: 'full' «PHASE · ACTION» (default), 'action' or 'none';
 * - `width` / `height`: fixed box (default: as wide and tall as its text);
 * - `lit` 0–1 + `tone`, `markGlow` 0–1 (the `[!]` chip), `ghost` (dashed grey).
 */
export function MatrixCell({
  cell,
  fontSize = 32,
  form = 'wide',
  header = 'full',
  width,
  height,
  lit = 0,
  tone = 'cyan',
  markGlow = 0,
  ghost,
  style,
}: {
  cell: CellId;
  fontSize?: number;
  form?: 'wide' | 'lines';
  header?: 'full' | 'action' | 'none';
  width?: number;
  height?: number;
  lit?: number;
  tone?: CellTone;
  markGlow?: number;
  ghost?: boolean;
  style?: CSSProperties;
}) {
  const def = CELL[cell];
  if (!def) return null;
  const f = fontSize;
  const skin = cellSkin(def.action, { lit, tone, ghost: ghost ?? false });
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width,
        height,
        padding: `${0.3 * f}px ${0.5 * f}px ${0.36 * f}px`,
        borderRadius: 0.36 * f,
        ...skin,
        background: ghost ? 'transparent' : `linear-gradient(${skin.background}, ${skin.background}), ${C.ink900}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {header !== 'none' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0.3 * f, height: 0.95 * f, whiteSpace: 'nowrap', fontWeight: 800, letterSpacing: 0.5 }}>
          {header === 'full' ? <span style={{ fontSize: 0.58 * f, color: alpha(VIOLET_SOFT, 0.75) }}>{phaseName(def.phase)} ·</span> : null}
          <span style={{ fontSize: 0.7 * f, color: VIOLET_SOFT }}>{actionName(def.action)}</span>
          {def.mark ? <MarkChip size={0.66 * f} glow={markGlow} style={{ marginLeft: 'auto' }} /> : null}
        </div>
      ) : null}
      <Lines lines={form === 'wide' ? def.wide : def.lines} size={f} color={C.textStrong} lineHeight={1.2} weight={650} />
      {def.markNote ? (
        <div style={{ fontSize: 0.9 * f, lineHeight: 1.15, fontWeight: 750, color: AMBER_SOFT, whiteSpace: 'pre' }}>
          {form === 'wide' ? `${header === 'none' ? `${MATRIX_TEXT.mark} ` : ''}${def.markNote.join(' ')}` : def.markNote.map((ln) => <div key={ln}>{ln}</div>)}
        </div>
      ) : null}
      {def.note ? (
        <div style={{ fontSize: 0.62 * f, lineHeight: 1.25, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>
          {form === 'wide' ? def.note.join(' ') : def.note.map((ln) => <div key={ln}>{ln}</div>)}
        </div>
      ) : null}
    </div>
  );
}
