import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * Image 1, the port badge with doors: a credential «Autoridad Portuaria de
 * Halden» with the holder (`name` mono · `dept`), an optional `sub` line and a
 * grid of door tiles. Cyan doors belong to the current post, amber ones to
 * earlier posts. Doors without a label draw as icon-only tiles (o.virta's
 * badge: no invented door names). Per door: `at` (appears), `focusAt`
 * (lifts and grows, the rest dims; `note` under it), `checkAt` (emerald
 * tick, needs the badge's `listAt` boxes), `goneAt` (fades, dashed).
 * `disabledAt`: the badge greys out and a steel seal lands across its door
 * row with `disabledLabel` (never red, never removed; the holder stays readable).
 *
 * Laid out at `width / scale` design px and drawn scaled by `scale`, so a
 * small badge keeps its proportions. Frames are Sequence-relative.
 */

export interface DoorDef {
  label: string;
  tone: 'cyan' | 'amber';
  at?: number;
  goneAt?: number;
  focusAt?: number;
  /** Frame the focus ends (default: never). */
  focusUntil?: number;
  /** Frame the review tick lands (emerald). */
  checkAt?: number;
  /** Line under the door while it is in focus (e.g. «nadie lo decidió»). */
  note?: string;
  /** Frame the note appears (default: with the focus). */
  noteAt?: number;
  /** Grid column (0-based). Default: flows row by row. */
  col?: number;
  /** Grid row (0-based). */
  row?: number;
}

/** A caption over one or more columns (e.g. «de su puesto»). */
export interface BadgeCaption {
  text: string;
  tone: 'cyan' | 'amber';
  col: number;
  span?: number;
  at?: number;
}

/** A post chip at the head of a column (e.g. «Facturación · 2023»). */
export interface BadgeHead {
  text: string;
  tone: 'cyan' | 'amber';
  at?: number;
}

export interface PortBadgeProps {
  name: string;
  dept: string;
  doors: DoorDef[];
  disabledAt?: number;
  /** On-screen width in px. */
  width?: number;
  /** Draw scale (layout happens at width / scale). */
  scale?: number;
  /** Frame the badge appears. Undefined: already on screen. */
  at?: number;
  /** Second identity line (e.g. «la oficina que trata con aduanas»). */
  sub?: string;
  subAt?: number;
  /** Seal text (default «deshabilitada»). */
  disabledLabel?: string;
  /** Grid columns (default: 4, or one per door for icon-only badges). */
  cols?: number;
  captions?: BadgeCaption[];
  heads?: BadgeHead[];
  /** Frame the review checkboxes appear on every door. */
  listAt?: number;
  /** 0–1 halo around the badge. */
  glow?: number;
  /** 0–1: how much of the door grid the card shows (0 = holder only, the card grows to full height). Default 1. */
  grid?: number;
  frame?: number;
  style?: CSSProperties;
}

const PAD = 26;
const HEADER_H = 60;
const ID_H = 66;
const SUB_H = 42;
const CAPTION_H = 38;
const HEAD_H = 52;
const TILE_H = 72;
const ICON_TILE_H = 78;
const GAP = 10;
const BOTTOM = 20;
const DOOR_FONT = 26;
const FOCUS_SCALE = 1.5;

const TONE = {
  cyan: { fg: C.cyan, soft: C.cyanSoft },
  amber: { fg: C.amber, soft: '#fcd34d' },
} as const;

function iconOnly(doors: DoorDef[]): boolean {
  return doors.length > 0 && doors.every((d) => d.label === '');
}

/** Resolved grid position of every door. */
function places(doors: DoorDef[], cols: number): { col: number; row: number }[] {
  let next = 0;
  return doors.map((d) => {
    if (d.col !== undefined && d.row !== undefined) return { col: d.col, row: d.row };
    const p = { col: next % cols, row: Math.floor(next / cols) };
    next++;
    return p;
  });
}

interface Layout {
  W: number;
  cols: number;
  colW: number;
  tileH: number;
  rows: number;
  idTop: number;
  captionTop: number;
  headTop: number;
  gridTop: number;
  height: number;
  pos: { col: number; row: number }[];
}

function layout(p: PortBadgeProps): Layout {
  const scale = p.scale ?? 1;
  const W = (p.width ?? 1200) / scale;
  const icons = iconOnly(p.doors);
  const cols = p.cols ?? (icons ? Math.max(1, p.doors.length) : 4);
  const pos = places(p.doors, cols);
  const rows = pos.reduce((m, q) => Math.max(m, q.row + 1), 0);
  const tileH = icons ? ICON_TILE_H : TILE_H;
  const colW = (W - 2 * PAD - (cols - 1) * GAP) / cols;
  const idTop = HEADER_H + 12;
  let y = idTop + ID_H + (p.sub ? SUB_H : 0) + 8;
  const captionTop = y;
  if (p.captions?.length) y += CAPTION_H;
  const headTop = y;
  if (p.heads?.length) y += HEAD_H;
  const gridTop = y;
  const height = gridTop + rows * tileH + Math.max(0, rows - 1) * GAP + BOTTOM;
  return { W, cols, colW, tileH, rows, idTop, captionTop, headTop, gridTop, height, pos };
}

/** Height in px of a PortBadge with these props (pass the same props). */
export function portBadgeHeight(p: PortBadgeProps): number {
  return layout(p).height * (p.scale ?? 1);
}

/**
 * On-screen geometry (px from the badge's top-left) of the door grid, to
 * anchor scene labels over columns: `cell(col, row)` > { x, y, w, h }.
 */
export function portBadgeGeometry(p: PortBadgeProps) {
  const L = layout(p);
  const k = p.scale ?? 1;
  const cell = (col: number, row: number) => ({
    x: (PAD + col * (L.colW + GAP)) * k,
    y: (L.gridTop + row * (L.tileH + GAP)) * k,
    w: L.colW * k,
    h: L.tileH * k,
  });
  return { width: L.W * k, height: L.height * k, gridTop: L.gridTop * k, gridHeight: (L.rows * L.tileH + Math.max(0, L.rows - 1) * GAP) * k, gap: GAP * k, cell };
}

/** The door glyph: a door leaf with a knob, tinted. */
function DoorGlyph({ w, h, color, open = 0 }: { w: number; h: number; color: string; open?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 26 36" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="1.5" y="1.5" width="23" height="33" rx="2.5" fill={alpha(color, 0.12)} stroke={color} strokeWidth="2.4" />
      <rect x="5.5" y="5.5" width="15" height="25" rx="1.5" fill={alpha(color, 0.18 + 0.2 * open)} stroke={alpha(color, 0.6)} strokeWidth="1.4" />
      <circle cx="17.5" cy="18.5" r="1.9" fill={color} />
    </svg>
  );
}

/** Small anchor emblem for the port's header band. */
function PortEmblem({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="12" cy="5" r="2.3" />
      <path d="M12 7.3V21M7.5 11h9M4 14.5c.6 3.6 3.9 6.5 8 6.5s7.4-2.9 8-6.5M4 14.5l-1.6 1.6M4 14.5l1.8 1.3M20 14.5l1.6 1.6M20 14.5l-1.8 1.3" />
    </svg>
  );
}

export function PortBadge(props: PortBadgeProps) {
  const { name, dept, doors, disabledAt, at, sub, subAt, disabledLabel = 'deshabilitada', captions, heads, listAt, glow = 0, grid = 1, frame: frameProp, style } = props;
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const scale = props.scale ?? 1;
  const L = layout(props);
  const icons = iconOnly(doors);

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  // Disabled: grey out, then the seal lands exactly at disabledAt.
  const grey = disabledAt === undefined ? 0 : progress(frame, disabledAt, 14, EASE.inOut);
  const sealP = disabledAt === undefined ? 0 : progress(frame, disabledAt, 9, EASE.out);
  const sealFlash = disabledAt === undefined ? 0 : progress(frame, disabledAt, 5) * (1 - progress(frame, disabledAt + 8, 26, EASE.inOut));

  // Focus: the most recent focused door wins; the rest dim.
  const focusW = doors.map((d) => {
    if (d.focusAt === undefined) return 0;
    const inP = progress(frame, d.focusAt - 4, 14, EASE.inOut);
    const outP = d.focusUntil === undefined ? 0 : progress(frame, d.focusUntil, 14, EASE.inOut);
    return inP * (1 - outP);
  });
  const anyFocus = Math.max(0, ...focusW);
  const listP = listAt === undefined ? 0 : progress(frame, listAt, 14);
  const g = clamp01(glow) * (0.8 + 0.2 * pulse(frame, fps, 0.6));

  const tileX = (col: number) => PAD + col * (L.colW + GAP);
  const tileY = (row: number) => L.gridTop + row * (L.tileH + GAP);

  // Draw order: the focused door last so it sits on top.
  const order = doors.map((_, i) => i).sort((a, b) => focusW[a] - focusW[b]);

  return (
    <div style={{ position: 'relative', width: L.W * scale, height: L.height * scale, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: L.W,
          height: L.height,
          transform: `scale(${scale}) translateY(${(1 - show) * 20}px)`,
          transformOrigin: '0 0',
          opacity: show,
          fontFamily: FONT.sans,
        }}
      >
        {/* The card */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: L.W,
            height: L.gridTop + BOTTOM + (L.height - L.gridTop - BOTTOM) * clamp01(grid),
            borderRadius: RADIUS.lg,
            border: `2px solid ${g > 0 ? alpha(C.cyan, 0.4 + 0.5 * g) : alpha(C.cyan, 0.35)}`,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            boxShadow: `0 28px 64px ${alpha('#000000', 0.42)}${g > 0 ? `, 0 0 ${24 + 30 * g}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
            overflow: 'hidden',
            filter: grey > 0 ? `grayscale(${0.9 * grey}) brightness(${1 - 0.28 * grey})` : undefined,
          }}
        >
          {/* Header band */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              height: HEADER_H,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: `0 ${PAD}px`,
              background: `linear-gradient(90deg, ${alpha(C.cyanDeep, 0.55)} 0%, ${alpha(C.ink800, 0.9)} 70%)`,
              borderBottom: `2px solid ${alpha(C.cyan, 0.35)}`,
            }}
          >
            <PortEmblem size={36} color={C.cyanSoft} />
            <span style={{ fontSize: 30, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', letterSpacing: 0.2 }}>Autoridad Portuaria de Halden</span>
          </div>

          {/* Holder */}
          <div style={{ position: 'absolute', left: PAD, top: L.idTop, height: ID_H, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: alpha(C.cyan, 0.1),
                border: `2px solid ${alpha(C.cyan, 0.45)}`,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="user" size={40} color={C.cyanSoft} />
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong }}>{name}</span>
            <span style={{ fontSize: 38, color: C.faint }}>·</span>
            <span style={{ fontSize: 40, fontWeight: 750, color: C.text }}>{dept}</span>
          </div>
          {sub ? (
            <div
              style={{
                position: 'absolute',
                left: PAD + 82,
                top: L.idTop + ID_H - 6,
                fontSize: 32,
                fontWeight: 600,
                color: C.muted,
                whiteSpace: 'nowrap',
                opacity: subAt === undefined ? 1 : progress(frame, subAt, 14),
              }}
            >
              {sub}
            </div>
          ) : null}

          {/* Captions over columns */}
          {captions?.map((c) => {
            const p = c.at === undefined ? 1 : progress(frame, c.at, 14);
            const span = c.span ?? 1;
            const x = tileX(c.col);
            const w = span * L.colW + (span - 1) * GAP;
            return (
              <div
                key={c.text}
                style={{
                  position: 'absolute',
                  left: x,
                  top: L.captionTop,
                  width: w,
                  height: CAPTION_H - 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: p,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 750, color: TONE[c.tone].soft }}>{c.text}</span>
                <span style={{ flex: 1, height: 2, background: alpha(TONE[c.tone].fg, 0.45) }} />
              </div>
            );
          })}

          {/* Post chips at the head of each column */}
          {heads?.map((h, i) => {
            const p = h.at === undefined ? 1 : progress(frame, h.at, 14);
            return (
              <div
                key={h.text}
                style={{
                  position: 'absolute',
                  left: tileX(i),
                  top: L.headTop,
                  width: L.colW,
                  height: HEAD_H - 12,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.sm,
                  background: alpha(TONE[h.tone].fg, 0.14),
                  border: `2px solid ${alpha(TONE[h.tone].fg, 0.5)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 750,
                  color: TONE[h.tone].soft,
                  whiteSpace: 'nowrap',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                {h.text}
              </div>
            );
          })}

          {/* Doors */}
          {order.map((i) => {
            const d = doors[i];
            const q = L.pos[i];
            const t = TONE[d.tone];
            const inP = d.at === undefined ? 1 : progress(frame, d.at, 12);
            if (inP <= 0) return null;
            const gone = d.goneAt === undefined ? 0 : progress(frame, d.goneAt, 18, EASE.inOut);
            const fw = focusW[i];
            const dimK = (anyFocus - fw) * 0.6;
            const check = d.checkAt === undefined ? 0 : progress(frame, d.checkAt, 8, EASE.out);
            const k = 1 + (FOCUS_SCALE - 1) * fw;
            const x = tileX(q.col);
            const y = tileY(q.row);
            const op = inP * (1 - 0.78 * gone) * (1 - dimK);
            return (
              <div
                key={`${d.label}-${i}`}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: L.colW,
                  height: L.tileH,
                  transform: `scale(${(0.9 + 0.1 * inP) * k})`,
                  transformOrigin: 'center top',
                  opacity: op,
                  zIndex: fw > 0 ? 2 : 1,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.sm,
                    border: `2px ${gone > 0.5 ? 'dashed' : 'solid'} ${alpha(t.fg, 0.55 + 0.4 * fw)}`,
                    background: fw > 0 ? alpha(C.ink850, 0.96) : alpha(t.fg, 0.08),
                    boxShadow: fw > 0 ? `0 0 ${Math.round(30 * fw)}px ${alpha(t.fg, 0.4 * fw)}, 0 18px 40px ${alpha('#000000', 0.5 * fw)}` : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: icons ? 'center' : 'flex-start',
                    gap: 12,
                    padding: icons ? 0 : '0 12px',
                    filter: gone > 0 ? `saturate(${1 - 0.8 * gone})` : undefined,
                  }}
                >
                  {icons ? (
                    <DoorGlyph w={36} h={50} color={t.fg} />
                  ) : (
                    <>
                      <DoorGlyph w={26} h={36} color={t.fg} />
                      <span
                        style={{
                          flex: 1,
                          fontSize: DOOR_FONT,
                          fontWeight: 650,
                          lineHeight: 1.12,
                          color: fw > 0 ? C.textStrong : t.soft,
                          textDecoration: gone > 0.5 ? 'line-through' : undefined,
                          textDecorationColor: alpha(t.fg, 0.8),
                        }}
                      >
                        {d.label}
                      </span>
                      {listP > 0 ? (
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            borderRadius: 8,
                            boxSizing: 'border-box',
                            border: `3px solid ${check > 0 ? C.emerald : alpha(C.muted, 0.8)}`,
                            background: alpha(C.emerald, 0.9 * check),
                            display: 'grid',
                            placeItems: 'center',
                            opacity: listP,
                          }}
                        >
                          {check > 0 ? <Icon name="check" size={26} color={C.ink950} strokeWidth={3.2} style={{ opacity: check, transform: `scale(${1.4 - 0.4 * check})` }} /> : null}
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
                {d.note && fw > 0 && (d.noteAt === undefined || frame >= d.noteAt) ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: L.tileH + 8,
                      width: L.colW,
                      textAlign: 'center',
                      fontSize: 32 / FOCUS_SCALE + 6,
                      fontWeight: 800,
                      color: '#fcd34d',
                      whiteSpace: 'nowrap',
                      opacity: clamp01((fw - 0.4) / 0.6) * (d.noteAt === undefined ? 1 : progress(frame, d.noteAt, 12)),
                    }}
                  >
                    <span style={{ padding: '2px 14px', borderRadius: RADIUS.pill, background: alpha(C.ink950, 0.9), border: `2px solid ${alpha(C.amber, 0.7)}` }}>{d.note}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Seal across the badge */}
        {sealP > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: -24,
              right: -24,
              top: L.gridTop + L.tileH / 2 - 40,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              background: `linear-gradient(90deg, ${alpha(C.ink700, 0.95)} 0%, ${alpha('#334155', 0.97)} 50%, ${alpha(C.ink700, 0.95)} 100%)`,
              borderTop: `3px solid ${alpha(C.muted, 0.9)}`,
              borderBottom: `3px solid ${alpha(C.muted, 0.9)}`,
              boxShadow: `0 10px 30px ${alpha('#000000', 0.5)}, 0 0 ${Math.round(34 * sealFlash)}px ${alpha(C.text, 0.35 * sealFlash)}`,
              transform: `rotate(-5deg) scale(${1.25 - 0.25 * sealP})`,
              opacity: sealP,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="lock" size={42} color={C.textStrong} strokeWidth={2.2} />
            <span style={{ fontSize: Math.min(46, Math.floor((L.W - 60) / (disabledLabel.length * 0.54))), fontWeight: 850, color: C.textStrong, letterSpacing: 0.3 }}>{disabledLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
