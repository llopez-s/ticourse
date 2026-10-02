import { interpolateColors } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, dimStyle, mix } from '../../../../../engine/src/ui';
import { COVERAGE, DARK_TAG, FIXES, FIX_HEADS, HISTOGRAM, RESULT, TILES, type Fix, type ServerTile } from '../../../data/s05-huecos';
import { fitSize, textWidth } from '../s04-caza/text';

/**
 * Pieces of s05-huecos, in stage-local coordinates (the stage is 1728×660).
 * They never read the timeline: the scene passes Sequence-relative frames.
 */

const W = 1728;
const EMERALD_SOFT = '#6ee7b7';
const AMBER_SOFT = '#fcd34d';

// ---------------------------------------------------------------------------
// s05-01: the result — 30 nights by the hour, all grey; «sin explicar: 0».
// ---------------------------------------------------------------------------

const PLOT = { left: 96, right: 1180, top: 156, bottom: 530 } as const;
/** Every bar is grey: known tasks, nothing highlighted. */
const BAR = C.faint;
const BAR_LIT = '#94a3b8';

export function Histogram({ frame, fps, resultAt, legendAt, opacity }: { frame: number; fps: number; resultAt: number; legendAt: number; opacity: number }) {
  if (opacity <= 0.001) return null;
  const plotW = PLOT.right - PLOT.left;
  const binW = plotW / RESULT.bins;
  const barW = Math.round(binW * 0.78);
  const h = PLOT.bottom - PLOT.top;
  // A scan sweeps the six hours and finds nothing to explain; it reaches the end on the cue.
  const scanEnd = Math.max(resultAt + 6, 24);
  const scan = progress(frame, 0, scanEnd, EASE.inOut);
  const scanOn = 1 - progress(frame, scanEnd, 12);
  const scanX = PLOT.left + plotW * scan;
  const counter = springIn(frame, fps, resultAt, { damping: 14 });
  const legend = progress(frame, legendAt - 4, 14);
  // Title and axes are there from the first frame (the crossfade shows them); only the bars grow.
  const head = 1;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, fontFamily: FONT.sans }}>
      {/* title + range */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 56, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', opacity: head }}>
        <Icon name="search" size={42} color={C.emerald} strokeWidth={2.3} />
        <span style={{ fontSize: fitSize(RESULT.title, 1130, 40), fontWeight: 800, color: C.textStrong, letterSpacing: -0.4 }}>{RESULT.title}</span>
      </div>
      <div style={{ position: 'absolute', left: PLOT.left, top: 74, display: 'flex', alignItems: 'center', gap: 28, whiteSpace: 'nowrap', opacity: head }}>
        <Chip accent="muted" icon="archive" size={28}>
          {RESULT.range}
        </Chip>
        {legend > 0.001 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, legendAt - 4, { distance: 10, axis: 'x' }) }}>
            <div style={{ width: 24, height: 34, borderRadius: 4, background: BAR }} />
            <span style={{ fontSize: 36, fontWeight: 750, color: C.text }}>{RESULT.legend}</span>
          </div>
        ) : null}
      </div>

      {/* plot */}
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={PLOT.left} y1={PLOT.top} x2={PLOT.right} y2={PLOT.top} stroke={alpha(C.ink600, 0.8)} strokeWidth={2} strokeDasharray="6 8" />
        <line x1={PLOT.left} y1={PLOT.bottom} x2={PLOT.right} y2={PLOT.bottom} stroke={C.ink600} strokeWidth={3} strokeLinecap="round" />
        {RESULT.hours.map((_, k) => {
          const x = PLOT.left + (plotW * k) / (RESULT.hours.length - 1);
          return <line key={k} x1={x} y1={PLOT.bottom} x2={x} y2={PLOT.bottom + 10} stroke={C.ink600} strokeWidth={3} strokeLinecap="round" />;
        })}
        {Array.from({ length: RESULT.bins }, (_, i) => {
          const n = HISTOGRAM[i] ?? 0;
          if (n === 0) return null;
          const grow = progress(frame, 2 + i * 0.6, 16);
          const bh = (h * n * grow) / RESULT.nights;
          const x = PLOT.left + i * binW + (binW - barW) / 2;
          const lit = scanOn * clamp01(1 - Math.abs(scanX - (x + barW / 2)) / 60);
          return <rect key={i} x={x} y={PLOT.bottom - bh} width={barW} height={bh} rx={4} fill={interpolateColors(lit, [0, 1], [BAR, BAR_LIT])} />;
        })}
        {scanOn > 0.001 ? (
          <g opacity={scanOn}>
            <line x1={scanX} y1={PLOT.top - 16} x2={scanX} y2={PLOT.bottom} stroke={alpha(C.emerald, 0.85)} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${alpha(C.emerald, 0.7)})` }} />
          </g>
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: PLOT.left - 70, top: PLOT.top - 16, width: 56, textAlign: 'right', fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: C.faint, opacity: head }}>{RESULT.nights}</div>
      <div style={{ position: 'absolute', left: PLOT.left - 70, top: PLOT.bottom - 16, width: 56, textAlign: 'right', fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: C.faint, opacity: head }}>0</div>
      {RESULT.hours.map((hh, k) => (
        <div key={hh} style={{ position: 'absolute', left: PLOT.left + (plotW * k) / (RESULT.hours.length - 1) - 60, top: PLOT.bottom + 18, width: 120, textAlign: 'center', fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.muted, opacity: head }}>
          {hh}
        </div>
      ))}

      {/* the counter */}
      {counter > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 1250,
            top: 196,
            width: 478,
            height: 300,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px solid ${alpha(C.emerald, 0.55)}`,
            background: `linear-gradient(180deg, ${alpha(C.emerald, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
            boxShadow: `0 0 40px ${alpha(C.emerald, 0.18)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            opacity: Math.min(1, counter * 1.4),
            transform: `scale(${mix(1.2, 1, counter)})`,
          }}
        >
          <span style={{ fontSize: 46, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{RESULT.unexplained}</span>
          <span style={{ fontSize: 150, fontWeight: 850, lineHeight: 1, color: C.emerald, textShadow: `0 0 34px ${alpha(C.emerald, 0.5)}` }}>{RESULT.zero}</span>
        </div>
      ) : null}
    </div>
  );
}

/** «sin explicar: 0» kept small once the map takes over (s05-04 / s05-05). */
export function ResultChip({ frame, fps, at, pulseAt, left, top }: { frame: number; fps: number; at: number; pulseAt: number; left: number; top: number }) {
  if (frame < at - 2) return null;
  const p = progress(frame, at, 16);
  const stress = progress(frame, pulseAt - 4, 12) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  return (
    <div style={{ position: 'absolute', left, top, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 26px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.emerald, 0.45 + 0.4 * stress)}`,
          background: alpha(C.emerald, 0.08 + 0.08 * stress),
          boxShadow: stress > 0.02 ? `0 0 ${Math.round(28 * stress)}px ${alpha(C.emerald, 0.35 * stress)}` : undefined,
          whiteSpace: 'nowrap',
          fontFamily: FONT.sans,
        }}
      >
        <Icon name="search" size={36} color={C.emerald} strokeWidth={2.3} />
        <span style={{ fontSize: 36, fontWeight: 750, color: C.text }}>{RESULT.unexplained}</span>
        <span style={{ fontSize: 48, fontWeight: 850, lineHeight: 1, color: C.emerald }}>{RESULT.zero}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-02 / s05-03: the coverage map — 22 servers with logs, 2 never connected.
// ---------------------------------------------------------------------------

export const GRID = { left: 0, top: 84, tileW: 236, tileH: 44, gapX: 12, gapY: 10 } as const;
export const GRID_W = COVERAGE.cols * GRID.tileW + (COVERAGE.cols - 1) * GRID.gapX;
export const GRID_H = COVERAGE.rows * GRID.tileH + (COVERAGE.rows - 1) * GRID.gapY;

export function CoverageHeader({ frame, at, darkAt }: { frame: number; at: number; darkAt: number }) {
  if (frame < at - 4) return null;
  const p = progress(frame, at, 14);
  const d = progress(frame, darkAt, 12);
  const sep = <span style={{ color: C.faint, fontWeight: 600 }}>·</span>;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, height: 56, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, letterSpacing: -0.4, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <Icon name="server" size={42} color={C.cyan} strokeWidth={2} />
      <span style={{ color: C.textStrong }}>{COVERAGE.total}</span>
      {sep}
      <span style={{ color: C.cyanSoft }}>{COVERAGE.lit}</span>
      {sep}
      <span style={{ color: AMBER_SOFT, opacity: d }}>{COVERAGE.dark}</span>
    </div>
  );
}

/**
 * The 24 tiles. Lit tiles come on in a quick stagger from `at`; the two dark
 * ones are drawn on `darkAt` (dashed amber, an eye struck through).
 */
export function ServerGrid({
  frame,
  fps,
  at,
  darkAt,
  darkGlow,
  litDim,
}: {
  frame: number;
  fps: number;
  at: number;
  darkAt: number;
  /** 0–1 amber halo on the two dark tiles. */
  darkGlow: number;
  /** 0–1 step-back of the lit tiles (the voice is on the dark ones). */
  litDim: number;
}) {
  let litIndex = 0;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: GRID_W, height: GRID_H }}>
      {TILES.map((t, i) => {
        const col = i % COVERAGE.cols;
        const row = Math.floor(i / COVERAGE.cols);
        const left = col * (GRID.tileW + GRID.gapX);
        const top = row * (GRID.tileH + GRID.gapY);
        if (t.dark) return <DarkTile key={i} tile={t} left={left} top={top} frame={frame} at={darkAt} glow={darkGlow} />;
        const k = litIndex++;
        return <LitTile key={i} tile={t} left={left} top={top} frame={frame} fps={fps} at={at + k * 1.5} phase={k} dim={litDim} />;
      })}
    </div>
  );
}

function LitTile({ tile, left, top, frame, fps, at, phase, dim }: { tile: ServerTile; left: number; top: number; frame: number; fps: number; at: number; phase: number; dim: number }) {
  const p = progress(frame, at, 12);
  if (p <= 0.001) return null;
  // Its logs keep arriving: a small dot breathes at the right edge (≤ 1 Hz, phases spread).
  const beat = pulse(frame + phase * 7, fps, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: GRID.tileW,
        height: GRID.tileH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `2px solid ${alpha(C.cyan, 0.5)}`,
        background: alpha(C.cyan, 0.09),
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 14px',
        ...dimStyle(dim, p),
        transform: `scale(${0.94 + 0.06 * p})`,
      }}
    >
      {tile.name ? (
        <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{tile.name}</span>
      ) : (
        <div style={{ width: 110, height: 10, borderRadius: 5, background: alpha(C.cyan, 0.28) }} />
      )}
      <div style={{ marginLeft: 'auto', width: 12, height: 12, borderRadius: 6, background: C.cyan, opacity: 0.45 + 0.55 * beat, boxShadow: `0 0 ${Math.round(4 + 8 * beat)}px ${alpha(C.cyan, 0.8)}` }} />
    </div>
  );
}

function DarkTile({ tile, left, top, frame, at, glow }: { tile: ServerTile; left: number; top: number; frame: number; at: number; glow: number }) {
  const p = progress(frame, at, 12);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: GRID.tileW,
        height: GRID.tileH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `2px dashed ${alpha(C.amber, 0.65 + 0.3 * glow)}`,
        background: alpha(C.ink950, 0.95),
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(24 * glow)}px ${alpha(C.amber, 0.45 * glow)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
        opacity: p,
      }}
    >
      <span style={{ fontFamily: FONT.mono, fontSize: fitSize(tile.name ?? '', GRID.tileW - 64, 24, { mono: true }), fontWeight: 800, color: AMBER_SOFT, whiteSpace: 'nowrap' }}>{tile.name}</span>
      <Icon name="eyeOff" size={28} color={C.amber} strokeWidth={2.2} style={{ marginLeft: 'auto' }} />
    </div>
  );
}

/** Under the grid: who the two dark servers are, and «0 registros · nunca conectados». */
export function DarkCallouts({ frame, at, tagAt, opacity }: { frame: number; at: number; tagAt: number; opacity: number }) {
  if (opacity <= 0.001) return null;
  const dark = TILES.filter((t) => t.dark);
  return (
    <div style={{ position: 'absolute', left: 0, top: GRID.top + GRID_H + 34, width: GRID_W, opacity, fontFamily: FONT.sans }}>
      {dark.map((t, i) => {
        const a = at + i * 8;
        if (frame < a - 4) return null;
        const tag = progress(frame, tagAt + i * 6, 12);
        return (
          <div key={t.name} style={{ position: 'absolute', left: 0, top: i * 104, whiteSpace: 'nowrap', ...enter(frame, a, { distance: 14, axis: 'x' }) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon name="eyeOff" size={38} color={C.amber} strokeWidth={2.2} />
              <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: AMBER_SOFT }}>{t.name}</span>
              <div style={{ opacity: tag, transform: `translateX(${(1 - tag) * 10}px)` }}>
                <Chip accent="amber" size={30}>
                  {DARK_TAG}
                </Chip>
              </div>
            </div>
            <div style={{ marginTop: 4, marginLeft: 54, fontSize: 32, fontWeight: 650, color: C.text }}>{t.dark?.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-04: the two fixes, with owner and date (the look of V5's improvement rows).
// ---------------------------------------------------------------------------

export const FIX = { top: 326, pitch: 88, rowH: 72, textX: 70, ownerX: 1330, dateX: 1574, textSize: 36 } as const;

export function FixRows({ frame, fps, at, headAt, dim }: { frame: number; fps: number; at: number[]; headAt: number; dim: number }) {
  if (frame < Math.min(headAt, ...at) - 4) return null;
  const head = progress(frame, headAt, 14);
  const textW = FIX.ownerX - FIX.textX - 40;
  const colHead = (x: number, text: string) => (
    <div style={{ position: 'absolute', left: x, top: 0, fontSize: 28, fontWeight: 750, letterSpacing: 0.4, color: C.muted, whiteSpace: 'nowrap', opacity: head }}>{text}</div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: FIX.top, width: W, fontFamily: FONT.sans, ...dimStyle(dim) }}>
      {colHead(FIX.ownerX, FIX_HEADS.owner)}
      {colHead(FIX.dateX, FIX_HEADS.date)}
      {/* «dos arreglos»: two empty slots first, each filled as the voice names it */}
      {FIXES.map((f, i) => {
        const slot = head * (1 - progress(frame, at[i], 8));
        return slot > 0.001 ? (
          <div key={`slot-${f.owner}`} style={{ position: 'absolute', left: 0, top: 40 + i * FIX.pitch, width: W, height: FIX.rowH, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.emerald, 0.35)}`, opacity: slot }} />
        ) : null;
      })}
      {FIXES.map((f, i) => (
        <FixRow key={f.owner} fix={f} top={40 + i * FIX.pitch} textW={textW} frame={frame} fps={fps} at={at[i]} />
      ))}
    </div>
  );
}

function FixRow({ fix, top, textW, frame, fps, at }: { fix: Fix; top: number; textW: number; frame: number; fps: number; at: number }) {
  const p = springIn(frame, fps, at, { damping: 16 });
  if (p <= 0.001) return null;
  const o = springIn(frame, fps, at + 8, { damping: 15 });
  const d = springIn(frame, fps, at + 12, { damping: 15 });
  // Mono pieces are wider: measure them as mono.
  const est = fix.text.reduce((sum, piece) => sum + (typeof piece === 'string' ? textWidth(piece, 1) : textWidth(piece.mono, 1, { mono: true })), 0);
  const size = Math.min(FIX.textSize, Math.floor(textW / est));
  const glow = 1 - progress(frame, at + 30, 30);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: W,
        height: FIX.rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        background: alpha(C.ink850, 0.94),
        border: `2px solid ${alpha(C.emerald, 0.3 + 0.4 * glow)}`,
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.emerald, 0.25 * glow)}` : undefined,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - Math.min(1, p)) * 14}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 20, top: 0, height: FIX.rowH, display: 'flex', alignItems: 'center' }}>
        <Icon name="check" size={36} color={C.emerald} strokeWidth={2.8} />
      </div>
      <div style={{ position: 'absolute', left: FIX.textX, top: 0, height: FIX.rowH, display: 'flex', alignItems: 'center', fontSize: size, fontWeight: 750, color: C.textStrong, whiteSpace: 'pre' }}>
        <span>
          {fix.text.map((piece, k) =>
            typeof piece === 'string' ? (
              <span key={k}>{piece}</span>
            ) : (
              <span key={k} style={{ fontFamily: FONT.mono, fontWeight: 800, color: AMBER_SOFT }}>
                {piece.mono}
              </span>
            ),
          )}
        </span>
      </div>
      <div style={{ position: 'absolute', left: FIX.ownerX, top: 0, height: FIX.rowH, display: 'flex', alignItems: 'center', opacity: Math.min(1, o * 1.3), transform: `scale(${0.85 + 0.15 * Math.min(1, o)})`, transformOrigin: 'left center' }}>
        <Chip accent="cyan" icon="user" size={30}>
          {fix.owner}
        </Chip>
      </div>
      <div style={{ position: 'absolute', left: FIX.dateX, top: 0, height: FIX.rowH, display: 'flex', alignItems: 'center', fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: C.text, opacity: Math.min(1, d * 1.3), transform: `translateX(${(1 - Math.min(1, d)) * 10}px)` }}>
        {fix.date}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-05: the closing line.
// ---------------------------------------------------------------------------

export function NeverEmpty({ frame, fps, at, text }: { frame: number; fps: number; at: number; text: string }) {
  if (frame < at - 4) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 556, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * 16}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
        <Icon name="search" size={60} color={C.emerald} strokeWidth={2.4} />
        <span style={{ fontSize: 62, fontWeight: 850, letterSpacing: -1, color: EMERALD_SOFT, textShadow: `0 0 28px ${alpha(C.emerald, 0.4)}` }}>{text}</span>
      </div>
    </div>
  );
}
