import type { ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { CANON, KEY_COLOR, KeyBadge, MiniBlock, MiniHouse, Pill, RedactBar, dimStyle } from './bits';

/** The right-hand area of the scene (right of the C2 column). */
export const RIGHT_X = 476;
export const RIGHT_W = 1728 - RIGHT_X;

export const BAR_H = 88;
/** Bar-local x of the searched value (the fingerprint lands here). */
export const BAR_VALUE_X = 676;
/** Size of the searched value once it has landed in the bar. */
export const BAR_VALUE_SIZE = 44;
/** Bar-local x of the «huella» pill (the definition line aligns under it). */
const BAR_PILL_X = 470;

/** Tiles sit mid-area while they are the subject, then rise to make room for the pDNS console. */
export const TILES_Y = 150;
export const TILE_H = 180;
export const FIELD_H = 500;
export const TILES_MID = TILES_Y + Math.round((FIELD_H - TILE_H) / 2);
export const TILE_W = 400;
const TILE_GAP = (RIGHT_W - 3 * TILE_W) / 2;
export const tileX = (i: number) => RIGHT_X + i * (TILE_W + TILE_GAP);

/**
 * The search over Internet scan data: «Escaneos de Internet» + the «huella»
 * being searched. The value itself is drawn by the scene (it flies in from
 * the certificate); `status` is 0 before the search, 1 while it runs and 2
 * when the three hits are in.
 */
export function SearchBar({ opacity, huellaGlow, defP, status, dim = 0 }: { opacity: number; huellaGlow: number; defP: number; status: 0 | 1 | 2; dim?: number }) {
  return (
    <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: RIGHT_W, height: 160, ...dimStyle(dim, opacity) }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: RIGHT_W,
          height: BAR_H,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 18px 40px ${alpha('#000000', 0.35)}`,
        }}
      >
        <div style={{ position: 'absolute', left: 22, top: 0, height: BAR_H - 4, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="radar" size={36} color={C.cyan} />
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>Escaneos de Internet</span>
        </div>
        <div style={{ position: 'absolute', left: BAR_PILL_X - 22, top: 16, width: 2, height: BAR_H - 36, background: C.ink600 }} />
        <div style={{ position: 'absolute', left: BAR_PILL_X, top: 0, height: BAR_H - 4, display: 'flex', alignItems: 'center' }}>
          <Pill color={KEY_COLOR} size={40} glow={huellaGlow}>
            huella
          </Pill>
        </div>
        <div style={{ position: 'absolute', right: 22, top: 0, height: BAR_H - 4, display: 'flex', alignItems: 'center' }}>
          {status === 1 ? (
            <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>buscando…</span>
          ) : status === 2 ? (
            <Pill color={KEY_COLOR} size={TYPE.label} solid icon="check">
              3 IP
            </Pill>
          ) : null}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: BAR_PILL_X,
          top: BAR_H + 6,
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 700,
          color: '#6ee7b7',
          whiteSpace: 'nowrap',
          opacity: defP,
          transform: `translateY(${(1 - defP) * -8}px)`,
        }}
      >
        el código que lo identifica
      </div>
    </div>
  );
}

const FIELD_COLS = 34;
const FIELD_ROWS = 12;
const CELL_W = RIGHT_W / FIELD_COLS;
const CELL_H = FIELD_H / FIELD_ROWS;
/** The three servers that present the key — one under each result tile (at its mid position). */
const MATCHES = [
  { col: 5, row: 6 },
  { col: 16, row: 4 },
  { col: 28, row: 7 },
];

/**
 * Internet scan data as texture: a field of servers swept by a scan line;
 * at {hits} the three that present the key light up and the field fades
 * behind the result tiles.
 */
export function ScanField({ frame, showAt, sweepAt, hits }: { frame: number; showAt: number; sweepAt: number; hits: number }) {
  const on = fadeIn(frame, showAt, 16) * (1 - progress(frame, hits + 6, 14, EASE.inOut));
  if (on <= 0) return null;
  const PERIOD = 54;
  const running = frame >= sweepAt && frame < hits + 6;
  const sweepX = running ? (((frame - sweepAt) % PERIOD) / PERIOD) * RIGHT_W : -999;
  const matchP = progress(frame, hits - 2, 8);
  return (
    <svg width={RIGHT_W} height={FIELD_H} style={{ position: 'absolute', left: RIGHT_X, top: TILES_Y, opacity: on, overflow: 'visible' }}>
      <rect x={0} y={0} width={RIGHT_W} height={FIELD_H} rx={18} fill={alpha(C.ink900, 0.6)} stroke={C.ink700} strokeWidth={2} strokeDasharray="8 10" />
      {Array.from({ length: FIELD_COLS * FIELD_ROWS }, (_, i) => {
        const col = i % FIELD_COLS;
        const row = Math.floor(i / FIELD_COLS);
        const cx = col * CELL_W + CELL_W / 2;
        const cy = row * CELL_H + CELL_H / 2;
        const isMatch = MATCHES.some((m) => m.col === col && m.row === row);
        const near = Math.max(0, 1 - Math.abs(cx - sweepX) / 70);
        const fill = isMatch && matchP > 0 ? KEY_COLOR : near > 0 ? alpha(C.cyan, 0.35 + 0.6 * near) : alpha(C.muted, 0.32);
        const s = isMatch ? 1 + 0.5 * matchP : 1;
        return <rect key={i} x={cx - 7 * s} y={cy - 5 * s} width={14 * s} height={10 * s} rx={2} fill={fill} />;
      })}
      {running ? (
        <g>
          <rect x={sweepX - 60} y={2} width={60} height={FIELD_H - 4} fill={alpha(C.cyan, 0.08)} />
          <line x1={sweepX} y1={4} x2={sweepX} y2={FIELD_H - 4} stroke={alpha(C.cyan, 0.8)} strokeWidth={3} />
        </g>
      ) : null}
    </svg>
  );
}

/** Where a tile grows from (its matched server in the field), tile-local at the mid position. */
function growOrigin(i: number): string {
  const m = MATCHES[i];
  const ox = RIGHT_X + m.col * CELL_W + CELL_W / 2 - tileX(i);
  const oy = TILES_Y + m.row * CELL_H + CELL_H / 2 - TILES_MID;
  return `${Math.round(ox)}px ${Math.round(oy)}px`;
}

export interface TileState {
  /** 0–1 appearance. */
  p: number;
  /** 0–1 highlight in the tile's accent. */
  hl: number;
  /** 0–1 focus dimming (see dimStyle). */
  d: number;
  keyGlow: number;
  /** 0–1 appearance of the tag. */
  tagP: number;
}

/** Where a tile sits and how big it is drawn: top-left of the scaled box, and the scale. */
export interface TileBox {
  x: number;
  y: number;
  s: number;
}

/**
 * Lays the row out from per-tile scales: the tiles keep filling RIGHT_W with
 * equal gaps, so one can grow (the one the voice is on) while the others
 * shrink aside. With all scales at 1 this is exactly tileX().
 */
export function rowXs(scales: readonly [number, number, number]): [number, number, number] {
  const widths = scales.map((k) => TILE_W * k);
  const gap = (RIGHT_W - widths[0] - widths[1] - widths[2]) / 2;
  return [RIGHT_X, RIGHT_X + widths[0] + gap, RIGHT_X + widths[0] + widths[1] + 2 * gap];
}

/** One scan hit: a server that presents the same self-signed key. */
export function ResultTile({ i, box, s, accent, children }: { i: number; box: TileBox; s: TileState; accent: string; children?: ReactNode }) {
  if (s.p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: TILE_W,
        height: TILE_H,
        transform: `scale(${box.s})`,
        transformOrigin: '0 0',
        ...dimStyle(s.d),
      }}
    >
      <div
        style={{
          width: TILE_W,
          height: TILE_H,
          boxSizing: 'border-box',
          padding: '18px 22px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${s.hl > 0 ? alpha(accent, 0.35 + 0.6 * s.hl) : C.ink700}`,
          background: `linear-gradient(180deg, ${s.hl > 0 ? alpha(accent, 0.1 * s.hl) : C.ink850} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
          boxShadow: `0 20px 44px ${alpha('#000000', 0.35)}${s.hl > 0 ? `, 0 0 ${Math.round(34 * s.hl)}px ${alpha(accent, 0.3 * s.hl)}` : ''}`,
          opacity: s.p,
          transform: `scale(${0.3 + 0.7 * s.p})`,
          transformOrigin: growOrigin(i),
          fontFamily: FONT.sans,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Row 1 of a tile: server icon, the IP (or its redaction) and the key it presents. */
export function TileHead({ ip, keyGlow }: { ip: string | null; keyGlow: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 52 }}>
      <Icon name="server" size={34} color={C.sky} />
      {ip ? (
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{ip}</span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.sky, whiteSpace: 'nowrap' }}>
          IP ·
          <RedactBar width={150} height={28} />
        </span>
      )}
      <div style={{ flex: 1 }} />
      <KeyBadge size={52} glow={keyGlow} />
    </div>
  );
}

/** The three hits, in canon order. */
export function ResultTiles({ frame, boxes, states }: { frame: number; boxes: [TileBox, TileBox, TileBox]; states: [TileState, TileState, TileState] }) {
  const [a, b, c] = states;
  const pulseOn = pulse(frame, 30, 0.5);
  return (
    <>
      <ResultTile i={0} box={boxes[0]} s={a} accent={C.amber}>
        <TileHead ip={CANON.blockIp} keyGlow={a.keyGlow} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, opacity: a.tagP }}>
          <MiniBlock height={50} glow={a.hl} />
          <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap' }}>el bloque · 14.000</span>
        </div>
      </ResultTile>
      <ResultTile i={1} box={boxes[1]} s={b} accent={C.emerald}>
        <TileHead ip={CANON.vpsIp} keyGlow={b.keyGlow} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, opacity: b.tagP, transform: `translateY(${(1 - b.tagP) * 10}px)` }}>
          <MiniHouse size={58} glow={b.hl * (0.7 + 0.3 * pulseOn)} />
          <div style={{ fontSize: TYPE.label, fontWeight: 750, color: C.emerald, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            pocos inquilinos
            <br />
            servidor propio
          </div>
        </div>
      </ResultTile>
      <ResultTile i={2} box={boxes[2]} s={c} accent={C.sky}>
        <TileHead ip={null} keyGlow={c.keyGlow} />
        <div style={{ marginTop: 26, opacity: c.tagP * 0.55 }}>
          <RedactBar width={230} height={24} color={C.faint} />
        </div>
      </ResultTile>
    </>
  );
}
