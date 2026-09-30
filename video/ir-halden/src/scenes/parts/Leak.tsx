import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * The leak (concept 4, «causas, no culpables»): a roof with a hole (rose
 * outline = the cause), drops falling (sky), a puddle and a mop.
 *   mopping — the mop dries the floor, and a new drop falls anyway: the symptom.
 *   patched — a patch (emerald) goes on the hole and no new drop leaves it:
 *             the cause. A drop already in the air still lands.
 * Timing is in Sequence-relative frames (`mopAt`, `patchAt`); `state` is a
 * shorthand for static art (s10's rule card). Drawn in a 520×380 design space
 * scaled to `width`.
 */

const VB_W = 520;
const VB_H = 380;
const HOLE = { x: 262, y: 66 };
const FLOOR = 332;
const PUDDLE_X = 262;
const MOP_REST_X = 452;
const FALL = 20;

export type LeakState = 'dripping' | 'mopping' | 'patched';

export interface LeakProps {
  /** Width of the art in px (default 520); height = width × 380/520. */
  width?: number;
  /** Static shorthand: 'dripping' (no mop), 'mopping' (mop always at work), 'patched' (dry, patch on, mop resting). */
  state?: LeakState;
  /** Frame of the first drop (default 0). */
  dripFrom?: number;
  /** Frames between drops (default 36). */
  dripEvery?: number;
  /** Frame the mop starts working (overrides `state`). */
  mopAt?: number;
  /** Frame the mop goes back to rest. */
  mopUntil?: number;
  /** Frame the patch lands on the hole: no drop leaves it afterwards. */
  patchAt?: number;
  /** 0–1 step-back. */
  dim?: number;
  /** 0–1 appear. Default 1. */
  show?: number;
  frame?: number;
  style?: CSSProperties;
}

/** Points of a leak drawn at `width`, in px from its top-left: the hole, the puddle centre, the resting mop. */
export function leakAnchors(width = 520) {
  const s = width / VB_W;
  return {
    hole: { x: HOLE.x * s, y: HOLE.y * s },
    puddle: { x: PUDDLE_X * s, y: FLOOR * s },
    mop: { x: MOP_REST_X * s, y: 230 * s },
    height: VB_H * s,
  };
}

const FAR = -1e6;

/** progress() that accepts ±Infinity for «never» / «always». */
function at(frame: number, start: number, duration: number): number {
  if (!Number.isFinite(start)) return start < 0 ? 1 : 0;
  return progress(frame, start, duration, EASE.inOut);
}

function resolve(p: LeakProps) {
  const st = p.state ?? 'dripping';
  return {
    mopAt: p.mopAt ?? (st === 'mopping' ? FAR : Number.POSITIVE_INFINITY),
    // By default the mop stops once a patched roof has let the floor dry.
    mopUntil: p.mopUntil ?? (p.patchAt !== undefined ? p.patchAt + FALL + 90 : Number.POSITIVE_INFINITY),
    patchAt: p.patchAt ?? (st === 'patched' ? FAR : Number.POSITIVE_INFINITY),
    dripFrom: p.dripFrom ?? (p.state ? FAR : 0),
    every: Math.max(8, p.dripEvery ?? 36),
    staticPatched: st === 'patched' && p.patchAt === undefined,
  };
}

/** Spawn frames of the drops (only the ones that can matter near `frame`). */
function dropSpawns(frame: number, dripFrom: number, every: number, patchAt: number): number[] {
  const first = Math.max(0, Math.ceil((frame - 400 - dripFrom) / every));
  const out: number[] = [];
  for (let i = first; ; i++) {
    const at = dripFrom + i * every;
    if (at > frame || at >= patchAt) break;
    out.push(at);
  }
  return out;
}

/**
 * Wetness of the floor (0–1) at `frame`: each landed drop adds some, the mop
 * takes it away while it works. Simulated over the last 400 frames (the
 * process forgets its past), so it is deterministic and cheap.
 */
function wetness(frame: number, r: ReturnType<typeof resolve>): number {
  if (r.staticPatched) return 0;
  const start = frame - 400;
  const lands = new Set(dropSpawns(frame, r.dripFrom, r.every, r.patchAt).map((a) => a + FALL));
  let w = r.dripFrom < start ? 0.7 : 0;
  const dryRate = 0.34 / (r.every * 0.6);
  for (let f = start; f <= frame; f++) {
    if (lands.has(f)) w = Math.min(1, w + 0.34);
    const mopping = f >= r.mopAt + 12 && f < r.mopUntil;
    if (mopping) w = Math.max(0, w - dryRate);
  }
  return w;
}

export function Leak(props: LeakProps) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.frame ?? current;
  const width = props.width ?? 520;
  const s = width / VB_W;
  const r = resolve(props);
  const show = clamp01(props.show ?? 1);
  const wet = wetness(frame, r);
  const drops = dropSpawns(frame, r.dripFrom, r.every, r.patchAt).filter((at) => frame < at + FALL + 12);
  const patchP = r.staticPatched ? 1 : Number.isFinite(r.patchAt) ? progress(frame, r.patchAt, 10, EASE.out) : at(frame, r.patchAt, 10);

  // Mop: walks from its rest to the puddle, sweeps side to side (≤ 1 Hz) and walks back at mopUntil.
  const workIn = at(frame, r.mopAt, 14);
  const workOut = at(frame, r.mopUntil, 14);
  const atWork = clamp01(workIn * (1 - workOut));
  const sweep = Math.sin((2 * Math.PI * 0.7 * frame) / fps);
  const workX = PUDDLE_X + 60 * sweep * (0.4 + 0.6 * clamp01(wet * 2));
  const mopX = MOP_REST_X + (workX - MOP_REST_X) * atWork;
  const lean = 1 - atWork;

  return (
    <div style={{ position: 'relative', width, height: VB_H * s, ...dimStyle(props.dim ?? 0, show), ...props.style }}>
      <svg width={width} height={VB_H * s} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Room: back wall, floor */}
        <rect x={28} y={64} width={464} height={FLOOR - 64} fill={alpha(C.ink800, 0.7)} />
        <line x1={20} y1={FLOOR} x2={500} y2={FLOOR} stroke={C.ink600} strokeWidth={4} strokeLinecap="round" />
        <rect x={28} y={FLOOR} width={464} height={14} fill={alpha(C.ink700, 0.5)} />

        {/* Roof slab with tiles and the hole */}
        <path d="M 10 70 L 260 18 L 510 70 L 496 76 L 260 28 L 24 76 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
        <rect x={24} y={62} width={472} height={10} fill={C.ink700} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={60 + i * 58} y1={52 - Math.abs(i - 3.5) * 6} x2={60 + i * 58} y2={72} stroke={alpha(C.ink500, 0.5)} strokeWidth={2} />
        ))}
        <path
          d={`M ${HOLE.x - 22} ${HOLE.y - 26} L ${HOLE.x - 8} ${HOLE.y - 34} L ${HOLE.x + 6} ${HOLE.y - 27} L ${HOLE.x + 20} ${HOLE.y - 33} L ${HOLE.x + 24} ${HOLE.y - 12} L ${HOLE.x + 12} ${HOLE.y + 6} L ${HOLE.x - 4} ${HOLE.y + 2} L ${HOLE.x - 18} ${HOLE.y + 8} Z`}
          fill={C.ink950}
          stroke={alpha(C.rose, 0.85 * (1 - patchP) + 0.15)}
          strokeWidth={3}
          strokeLinejoin="round"
          style={{ filter: patchP < 1 ? `drop-shadow(0 0 8px ${alpha(C.rose, 0.6 * (1 - patchP))})` : undefined }}
        />

        {/* Patch: slaps on like a stamp */}
        {patchP > 0 ? (
          <g transform={`translate(${HOLE.x + 1} ${HOLE.y - 14}) rotate(-5) scale(${1.5 - 0.5 * patchP})`} opacity={patchP}>
            <rect x={-38} y={-28} width={76} height={54} rx={6} fill={alpha(C.emerald, 0.4)} stroke={C.emerald} strokeWidth={3.5} />
            <line x1={-44} y1={-18} x2={44} y2={16} stroke={alpha(C.emerald, 0.9)} strokeWidth={8} strokeLinecap="round" />
            <line x1={-44} y1={16} x2={44} y2={-18} stroke={alpha(C.emerald, 0.9)} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}

        {/* Puddle */}
        {wet > 0.01 ? (
          <ellipse cx={PUDDLE_X} cy={FLOOR + 4} rx={18 + 112 * wet} ry={5 + 9 * wet} fill={alpha(C.sky, 0.3 + 0.2 * wet)} stroke={alpha(C.sky, 0.65)} strokeWidth={2} />
        ) : null}

        {/* Drops and splashes */}
        {drops.map((at) => {
          const t = frame - at;
          if (t < FALL) {
            const k = (t / FALL) ** 2;
            const y = HOLE.y + 10 + (FLOOR - HOLE.y - 16) * k;
            return (
              <path
                key={at}
                transform={`translate(${HOLE.x} ${y}) scale(1.35)`}
                d="M 0 -10 C 4 -4 6.5 0 6.5 3.5 A 6.5 6.5 0 0 1 -6.5 3.5 C -6.5 0 -4 -4 0 -10 Z"
                fill={C.sky}
                opacity={0.95}
              />
            );
          }
          const sp = (t - FALL) / 12;
          return (
            <g key={at} opacity={1 - sp} stroke={C.sky} strokeWidth={3} strokeLinecap="round" fill="none">
              <path d={`M ${HOLE.x - 10 - 18 * sp} ${FLOOR - 4 - 10 * sp} l -8 -8`} />
              <path d={`M ${HOLE.x + 10 + 18 * sp} ${FLOOR - 4 - 10 * sp} l 8 -8`} />
              <ellipse cx={HOLE.x} cy={FLOOR + 3} rx={10 + 30 * sp} ry={3 + 5 * sp} />
            </g>
          );
        })}

        {/* Mop */}
        <Mop x={mopX} lean={lean} />
      </svg>
    </div>
  );
}

function Mop({ x, lean }: { x: number; lean: number }) {
  // At rest the mop leans against the right wall; at work it stands on the floor, handle to the right.
  const topX = x + 70 - 30 * lean;
  const topY = 150 + 10 * lean;
  const footY = FLOOR - 18;
  return (
    <g>
      <line x1={topX} y1={topY} x2={x} y2={footY} stroke={C.muted} strokeWidth={7} strokeLinecap="round" />
      <rect x={x - 34} y={footY - 4} width={68} height={10} rx={4} fill={C.ink500} />
      {[-28, -18, -8, 2, 12, 22].map((dx) => (
        <line key={dx} x1={x + dx + 3} y1={footY + 5} x2={x + dx + 1} y2={FLOOR + 1} stroke={alpha(C.text, 0.85)} strokeWidth={5} strokeLinecap="round" />
      ))}
    </g>
  );
}
