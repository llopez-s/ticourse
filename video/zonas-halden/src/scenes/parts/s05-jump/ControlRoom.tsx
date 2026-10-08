import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { pulse } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * «La sala de mandos de la red» with ONE door (canon: out/scene-brief.md
 * «Visual metaphors») = the jump server. Seen from the front: the building
 * wall, a window onto the racks (the network's controls), the only door with a
 * turnstile in front, a card reader with a PIN pad on a post, and a camera
 * whose log writes every passage («todo queda grabado»). It is NOT
 * Operations' «sala de control» (that one is only a fenced area in s02).
 *
 * Design units ROOM_BASE (1100 × 540) scaled to `width`. The three labels are
 * drawn inside (their texts come from the scene's data) so they stay next to
 * what they name; each has its own 0–1 weight. Nothing positions itself.
 */

export const ROOM_BASE = { w: 1100, h: 540 } as const;

const DOOR = { x: 470, y: 210, w: 160, h: 310 } as const;
const READER = { x: 650, y: 330, w: 64, h: 90 } as const;
const CAMERA = { x: 655, y: 146 } as const;
const LOG = { x: 780, y: 196, w: 270, h: 200 } as const;
const GROUND = 520;

export function roomSize(width: number) {
  const s = width / ROOM_BASE.w;
  return { w: width, h: ROOM_BASE.h * s, scale: s };
}

/** Px anchor (from the room's top-left): the door's centre, top or the reader. */
export function roomPoint(width: number, which: 'door' | 'doorTop' | 'reader' | 'camera') {
  const s = width / ROOM_BASE.w;
  const p =
    which === 'door'
      ? { x: DOOR.x + DOOR.w / 2, y: DOOR.y + DOOR.h / 2 }
      : which === 'doorTop'
        ? { x: DOOR.x + DOOR.w / 2, y: DOOR.y }
        : which === 'reader'
          ? { x: READER.x + READER.w / 2, y: READER.y + READER.h / 2 }
          : CAMERA;
  return { x: p.x * s, y: p.y * s };
}

function Label({ x, y, text, p, tone, anchor = 'left' }: { x: number; y: number; text: string; p: number; tone: string; anchor?: 'left' | 'center' }) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `${anchor === 'center' ? 'translateX(-50%) ' : ''}translateY(${(1 - k) * 8}px)`,
        opacity: k,
        padding: '6px 18px 8px',
        borderRadius: RADIUS.sm,
        background: alpha(C.ink950, 0.92),
        border: `2px solid ${alpha(tone, 0.8)}`,
        fontFamily: FONT.sans,
        fontSize: 40,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
      }}
    >
      {text}
    </div>
  );
}

export function ControlRoom({
  width,
  show = 1,
  door = 0,
  reader = 0,
  log = 0,
  labels,
  doorLabel = 0,
  readerLabel = 0,
  logLabel = 0,
  frame: frameProp,
  style,
}: {
  width: number;
  /** 0–1 appear. */
  show?: number;
  /** 0–1: the door glows (the only way in). */
  door?: number;
  /** 0–1: a card in the reader, the PIN typed, the light turns green. */
  reader?: number;
  /** 0–1: the log fills (rows written one by one) and the camera's REC lamp is on. */
  log?: number;
  /** Texts of the three labels: door, reader, recorded. */
  labels: { door: string; reader: string; recorded: string };
  doorLabel?: number;
  readerLabel?: number;
  logLabel?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const s = width / ROOM_BASE.w;
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const d = clamp01(door);
  const r = clamp01(reader);
  const lg = clamp01(log);
  const rows = Math.round(lg * 7);
  const recOn = lg > 0.01;
  const led = (i: number) => 0.35 + 0.65 * pulse(frame + i * 11, fps, 0.6);
  const wall = C.ink850;
  const edge = '#334155';

  return (
    <div style={{ position: 'relative', width, height: ROOM_BASE.h * s, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, ...style }}>
      <svg width={width} height={ROOM_BASE.h * s} viewBox={`0 0 ${ROOM_BASE.w} ${ROOM_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Building */}
        <rect x={20} y={40} width={1060} height={GROUND - 40} rx={10} fill={wall} stroke={edge} strokeWidth={3} />
        <rect x={10} y={30} width={1080} height={18} rx={6} fill={C.ink700} />
        <line x1={0} y1={GROUND} x2={1100} y2={GROUND} stroke="#475569" strokeWidth={4} />

        {/* Window onto the racks: the network's controls */}
        <rect x={70} y={120} width={260} height={220} rx={8} fill="#050a14" stroke="#64748b" strokeWidth={3} />
        {[100, 212].map((rx, k) => (
          <g key={rx}>
            <rect x={rx} y={146} width={90} height={176} rx={4} fill="#0f172a" stroke="#475569" strokeWidth={2.5} />
            {Array.from({ length: 6 }, (_, i) => (
              <g key={i}>
                <rect x={rx + 8} y={156 + i * 27} width={74} height={18} rx={2} fill="#1e293b" />
                <circle cx={rx + 18} cy={165 + i * 27} r={3.2} fill={i % 3 === 1 ? C.emerald : C.cyan} opacity={led(i + k * 6)} />
                <rect x={rx + 28} y={162 + i * 27} width={44} height={5} rx={2.5} fill={alpha(C.muted, 0.35)} />
              </g>
            ))}
          </g>
        ))}
        <path d="M 84 330 L 160 132 M 110 334 L 196 132" stroke={alpha('#ffffff', 0.06)} strokeWidth={10} />

        {/* The only door */}
        {d > 0.01 ? <rect x={DOOR.x - 14} y={DOOR.y - 14} width={DOOR.w + 28} height={DOOR.h + 14} rx={12} fill={alpha(C.cyan, 0.12 * d)} /> : null}
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={6} fill={C.ink700} stroke={alpha(C.cyan, 0.6 + 0.4 * d)} strokeWidth={5} />
        <rect x={DOOR.x + 34} y={DOOR.y + 30} width={DOOR.w - 68} height={60} rx={4} fill="#050a14" stroke={alpha(C.cyan, 0.5)} strokeWidth={2.5} />
        <circle cx={DOOR.x + DOOR.w - 26} cy={DOOR.y + 172} r={7} fill={C.cyanSoft} />
        {/* Lamp over the door */}
        <rect x={DOOR.x + 40} y={DOOR.y - 26} width={DOOR.w - 80} height={12} rx={6} fill={alpha(C.cyan, 0.35 + 0.4 * d)} />

        {/* Turnstile in front of the door: cabinet + three arms */}
        <rect x={398} y={398} width={66} height={GROUND - 398} rx={12} fill="#1e293b" stroke="#94a3b8" strokeWidth={3} />
        <rect x={410} y={412} width={42} height={10} rx={5} fill={alpha(C.cyan, 0.55)} />
        <g stroke="#cbd5e1" strokeLinecap="round">
          <line x1={464} y1={440} x2={612} y2={440} strokeWidth={10} />
          <line x1={464} y1={440} x2={526} y2={486} strokeWidth={8} opacity={0.75} />
          <line x1={464} y1={440} x2={486} y2={404} strokeWidth={7} opacity={0.6} />
        </g>
        <circle cx={464} cy={440} r={11} fill="#94a3b8" />

        {/* Card reader + PIN pad on a post */}
        <rect x={READER.x + READER.w / 2 - 6} y={READER.y + READER.h} width={12} height={GROUND - READER.y - READER.h} fill="#475569" />
        <rect x={READER.x} y={READER.y} width={READER.w} height={READER.h} rx={8} fill="#0f172a" stroke={C.cyan} strokeWidth={3} />
        <rect x={READER.x + 10} y={READER.y + 10} width={READER.w - 20} height={10} rx={4} fill={r > 0.5 ? C.emerald : alpha(C.cyan, 0.5)} />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={READER.x + 18 + (i % 3) * 14} cy={READER.y + 38 + Math.floor(i / 3) * 15} r={3.6} fill={i < Math.round(r * 9) ? C.cyanSoft : alpha(C.muted, 0.6)} />
        ))}
        {/* The card going in */}
        {r > 0.01 && r < 0.6 ? <rect x={READER.x + 14} y={READER.y - 34 + 30 * Math.min(1, r / 0.35)} width={36} height={24} rx={3} fill="#e2e8f0" stroke="#64748b" strokeWidth={2} /> : null}

        {/* Camera on a bracket, looking at the door */}
        <path d={`M 740 120 L 712 ${CAMERA.y}`} stroke="#64748b" strokeWidth={6} strokeLinecap="round" />
        <g transform={`translate(${CAMERA.x} ${CAMERA.y}) rotate(18)`}>
          <rect x={0} y={-16} width={70} height={32} rx={6} fill="#1e293b" stroke="#94a3b8" strokeWidth={3} />
          <circle cx={4} cy={0} r={11} fill="#050a14" stroke={C.cyan} strokeWidth={3} />
          <circle cx={58} cy={-6} r={5} fill={recOn ? C.rose : alpha(C.muted, 0.5)} opacity={recOn ? 0.55 + 0.45 * pulse(frame, fps, 0.8) : 1} />
        </g>
        {/* Its view cone over the turnstile */}
        {recOn ? <path d={`M ${CAMERA.x} ${CAMERA.y + 6} L 420 470 L 640 470 Z`} fill={alpha(C.cyan, 0.06 * Math.min(1, lg * 3))} /> : null}

        {/* The log: every passage written */}
        <rect x={LOG.x} y={LOG.y} width={LOG.w} height={LOG.h} rx={8} fill="#050a14" stroke="#64748b" strokeWidth={3} />
        <rect x={LOG.x} y={LOG.y} width={LOG.w} height={30} rx={8} fill="#1e293b" />
        <circle cx={LOG.x + 20} cy={LOG.y + 15} r={6} fill={recOn ? C.rose : alpha(C.muted, 0.5)} />
        <rect x={LOG.x + 36} y={LOG.y + 11} width={60} height={8} rx={4} fill={alpha(C.muted, 0.45)} />
        {Array.from({ length: rows }, (_, i) => (
          <g key={i}>
            <rect x={LOG.x + 16} y={LOG.y + 44 + i * 21} width={46} height={8} rx={4} fill={alpha(C.muted, 0.5)} />
            <rect x={LOG.x + 72} y={LOG.y + 44 + i * 21} width={100 + ((i * 37) % 70)} height={8} rx={4} fill={alpha(C.cyan, 0.55)} />
          </g>
        ))}
        <line x1={LOG.x + LOG.w / 2} y1={LOG.y + LOG.h} x2={LOG.x + LOG.w / 2} y2={GROUND} stroke="#475569" strokeWidth={8} />
      </svg>

      {/* Labels (px; the leaders are short lines to what they name) */}
      <svg width={width} height={ROOM_BASE.h * s} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {doorLabel > 0.01 ? <line x1={(DOOR.x + DOOR.w / 2) * s} y1={112 * s} x2={(DOOR.x + DOOR.w / 2) * s} y2={(DOOR.y - 30) * s} stroke={alpha(C.cyan, 0.8)} strokeWidth={3} opacity={doorLabel} /> : null}
        {readerLabel > 0.01 ? <line x1={(READER.x + READER.w + 4) * s} y1={(READER.y + 60) * s} x2={744 * s} y2={455 * s} stroke={alpha(C.cyan, 0.8)} strokeWidth={3} opacity={readerLabel} /> : null}
        {logLabel > 0.01 ? <line x1={760 * s} y1={130 * s} x2={(CAMERA.x + 40) * s} y2={(CAMERA.y - 4) * s} stroke={alpha(C.rose, 0.8)} strokeWidth={3} opacity={logLabel} /> : null}
      </svg>
      <Label x={(DOOR.x + DOOR.w / 2) * s} y={58 * s} text={labels.door} p={doorLabel} tone={C.cyan} anchor="center" />
      <Label x={744 * s} y={428 * s} text={labels.reader} p={readerLabel} tone={C.cyan} />
      <Label x={760 * s} y={104 * s} text={labels.recorded} p={logLabel} tone={C.rose} />
    </div>
  );
}

/**
 * The room's single door as an icon (s05's wrap): the door, its lamp and the
 * turnstile arm across it. `size` = height in px.
 */
export function DoorGlyph({ size = 120, tone = C.cyan }: { size?: number; tone?: string }) {
  return (
    <svg width={size * 0.86} height={size} viewBox="0 0 120 140" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <rect x={28} y={10} width={64} height={8} rx={4} fill={alpha(tone, 0.6)} />
      <rect x={24} y={24} width={72} height={110} rx={5} fill={C.ink700} stroke={tone} strokeWidth={5} />
      <rect x={40} y={38} width={40} height={26} rx={3} fill="#050a14" stroke={alpha(tone, 0.6)} strokeWidth={2.5} />
      <circle cx={82} cy={84} r={4} fill={tone} />
      <rect x={4} y={92} width={22} height={44} rx={5} fill="#1e293b" stroke="#94a3b8" strokeWidth={3} />
      <line x1={26} y1={102} x2={100} y2={102} stroke="#cbd5e1" strokeWidth={7} />
    </svg>
  );
}
