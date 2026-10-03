import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * Image 5 of the video: the guardhouse key cabinet (PAM). A wall cabinet of
 * hooks (2 rows × 4), each with a key hanging under a small padlock whose bars
 * show its «combination», and a logbook («registro») beside it where every use
 * is written down. Used by s09 (`cabinet`), s10 (`lock-change`: the lent key
 * goes back on its hook and the padlock above it changes), s11 (rule 3 and the
 * end card, whose doors close) and the Poster.
 *
 * Every state is driven by Sequence-relative frames (all optional; with none
 * set the cabinet is drawn static, keys on their hooks — safe for a still):
 * - `at`: the cabinet appears (fade + rise).
 * - `takeAt` / `returnAt`: the focus key leaves its hook (lent) and comes back.
 *   With `returnAt` but no `takeAt` the key is already out when the scene opens.
 * - `lockChangeAt`: the focus padlock spins, its bars change to a new
 *   combination and it turns emerald; the key on the hook is re-cut to match.
 * - `closeAt`: both doors swing shut and a padlock drops on the seam.
 * - `logLines` (+ `logAt`): lines written in the logbook, one by one.
 * Drawn in a CAB_W × CAB_H design space scaled to `width`.
 */

export const CAB_W = 720;
export const CAB_H = 500;

const BODY = { x: 10, y: 30, w: 440, h: 460, r: 18 };
const HEAD_H = 54;
const PANEL = { x: 34, y: 100, w: 392, h: 366 };
const COLS = 4;
const PITCH = PANEL.w / COLS;
const ROW_LOCK_Y = [128, 300];
const PEG_DY = 40;
const KEY_H = 104;
const LEDGER = { x: 480, y: 64, w: 232, h: 318, head: 44, lineTop: 132, pitch: 36, size: 21 };
/** Where the lent key floats (ring top), under the logbook. */
const KEY_OUT = { x: 596, y: 396, rot: -24 };

/** Two combinations of five pins (heights 1–4); the focus padlock goes from OLD to NEW. */
export const CODE_OLD = [2, 4, 1, 3, 2] as const;
export const CODE_NEW = [4, 1, 3, 2, 4] as const;
const HOOK_CODES: readonly (readonly number[])[] = [
  [3, 1, 4, 2, 3],
  [1, 3, 2, 4, 1],
  CODE_OLD,
  [4, 2, 3, 1, 2],
  [2, 3, 4, 1, 3],
  [3, 4, 2, 2, 1],
  [1, 2, 3, 4, 2],
  [4, 3, 1, 2, 4],
];

const METAL = '#cbd5e1';
const METAL_DIM = '#94a3b8';

function hookCenter(i: number): { x: number; lockY: number; pegY: number } {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return { x: PANEL.x + PITCH * (col + 0.5), lockY: ROW_LOCK_Y[row], pegY: ROW_LOCK_Y[row] + PEG_DY };
}

/** Height in px of the cabinet drawn at `width`. */
export function cabinetHeight(width = CAB_W): number {
  return (CAB_H * width) / CAB_W;
}

/** Useful points (px from the cabinet's top-left at `width`) to anchor labels and connectors. */
export function cabinetAnchors(width = CAB_W, hook = 2) {
  const s = width / CAB_W;
  const h = hookCenter(hook);
  return {
    /** The focus hook's peg. */
    hook: { x: h.x * s, y: h.pegY * s },
    /** The focus padlock (centre). */
    lock: { x: h.x * s, y: h.lockY * s },
    /** The lent key's resting point outside the cabinet. */
    keyOut: { x: KEY_OUT.x * s, y: (KEY_OUT.y + KEY_H / 2) * s },
    /** The logbook's box. */
    ledger: { x: LEDGER.x * s, y: LEDGER.y * s, w: LEDGER.w * s, h: LEDGER.h * s },
    /** The cabinet body's box. */
    body: { x: BODY.x * s, y: BODY.y * s, w: BODY.w * s, h: BODY.h * s },
  };
}

/**
 * A hanging key (ring on top, shaft down, teeth cut from `code`), drawn in an
 * SVG <g> with its ring's top at (0, 0). 40 × KEY_H design units.
 */
export function KeyShape({ code, color = METAL, glow = 0, strokeColor }: { code: readonly number[]; color?: string; glow?: number; strokeColor?: string }) {
  const teethTop = 58;
  const step = 8;
  const teeth = code
    .map((c, i) => {
      const y = teethTop + i * step;
      const d = 3 + c * 3;
      return `L 4 ${y} L ${4 + d} ${y + 1.5} L ${4 + d} ${y + step - 1.5} L 4 ${y + step}`;
    })
    .join(' ');
  const g = clamp01(glow);
  return (
    <g>
      {g > 0 ? <circle cx={0} cy={58} r={46} fill={alpha(C.cyan, 0.22 * g)} /> : null}
      <circle cx={0} cy={18} r={15} fill="none" stroke={color} strokeWidth={7} />
      <circle cx={0} cy={18} r={5} fill={alpha(C.ink950, 0.6)} />
      <path
        d={`M -4 32 L 4 32 L 4 ${teethTop} ${teeth} L 4 ${KEY_H - 4} Q 0 ${KEY_H} -4 ${KEY_H - 4} Z`}
        fill={color}
        stroke={strokeColor ?? alpha(C.ink950, 0.35)}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Small padlock whose body shows a pin combination; `spin` 0–1 turns it once, `fresh` tints it emerald. */
function Padlock({ code, spin = 0, fresh = 0, glow = 0, color = METAL_DIM }: { code: readonly number[]; spin?: number; fresh?: number; glow?: number; color?: string }) {
  const f = clamp01(fresh);
  const stroke = f > 0.5 ? C.emerald : color;
  return (
    <g transform={`rotate(${spin * 360})`}>
      {glow > 0 ? <circle cx={0} cy={2} r={30} fill="none" stroke={alpha(C.emerald, 0.8 * glow)} strokeWidth={4} /> : null}
      <path d="M -10 -4 L -10 -12 A 10 10 0 0 1 10 -12 L 10 -4" fill="none" stroke={stroke} strokeWidth={4.5} strokeLinecap="round" />
      <rect x={-17} y={-5} width={34} height={26} rx={5} fill={f > 0.5 ? alpha(C.emerald, 0.22) : C.ink800} stroke={stroke} strokeWidth={3} />
      {code.map((c, i) => (
        <rect key={i} x={-12.5 + i * 5.4} y={16 - c * 4.2} width={3.4} height={c * 4.2} rx={1} fill={f > 0.5 ? C.emerald : alpha(color, 0.9)} />
      ))}
    </g>
  );
}

export function KeyCabinet({
  at,
  takeAt,
  returnAt,
  lockChangeAt,
  closeAt,
  logLines,
  logAt,
  hook = 2,
  glow = 0,
  keyGlow = 0,
  dim = 0,
  width = CAB_W,
  showLedger = true,
  frame: frameProp,
  style,
}: {
  /** Frame the cabinet appears. Undefined: already on screen. */
  at?: number;
  /** Frame the focus key leaves its hook (lent). */
  takeAt?: number;
  /** Frame the lent key goes back on its hook (out before it when `takeAt` is unset). */
  returnAt?: number;
  /** Frame the focus padlock changes combination (spin, emerald) and the key is re-cut. */
  lockChangeAt?: number;
  /** Frame the doors start to swing shut (end card). */
  closeAt?: number;
  /** Lines in the logbook (texture: at most 14 characters each, the logbook is narrow). */
  logLines?: readonly string[];
  /** Frame the first line is written (then every 14 frames), or one frame per line. Undefined: already written. */
  logAt?: number | readonly number[];
  /** Index (0–7, row-major) of the hook that lends its key. */
  hook?: number;
  /** 0–1 cyan halo around the cabinet. */
  glow?: number;
  /** 0–1 halo on the focus key. */
  keyGlow?: number;
  /** 0–1 step-back. */
  dim?: number;
  width?: number;
  /** Draw the logbook (default true). */
  showLedger?: boolean;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const s = width / CAB_W;
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  // The lent key: 0 on its hook, 1 out.
  const outFrom = takeAt === undefined ? (returnAt === undefined ? 0 : 1) : progress(frame, takeAt, 20, EASE.inOut);
  const back = returnAt === undefined ? 0 : progress(frame, returnAt, 20, EASE.inOut);
  const out = clamp01(outFrom * (1 - back));
  const change = lockChangeAt === undefined ? 0 : progress(frame, lockChangeAt, 16, EASE.inOut);
  const changeGlow = lockChangeAt === undefined ? 0 : progress(frame, lockChangeAt + 6, 8) * (1 - progress(frame, lockChangeAt + 26, 30, EASE.inOut));
  const close = closeAt === undefined ? 0 : progress(frame, closeAt, 22, EASE.inOut);
  const hasp = closeAt === undefined ? 0 : progress(frame, closeAt + 20, 10, EASE.out);
  const g = clamp01(glow) * (0.8 + 0.2 * pulse(frame, fps, 0.5));
  const kg = clamp01(keyGlow);

  const focus = hookCenter(hook);
  const focusCode = change > 0.5 ? CODE_NEW : HOOK_CODES[hook] ?? CODE_OLD;
  const keyPos = {
    x: focus.x + (KEY_OUT.x - focus.x) * out,
    y: focus.pegY + (KEY_OUT.y - focus.pegY) * out,
    rot: KEY_OUT.rot * out,
  };
  const lines = logLines ?? [];
  const lineAt = (i: number): number | undefined => {
    if (logAt === undefined) return undefined;
    if (typeof logAt === 'number') return logAt + i * 14;
    return logAt[i];
  };
  // The pen follows the line being written.
  let penLine = -1;
  let penP = 0;
  lines.forEach((_, i) => {
    const a = lineAt(i);
    if (a === undefined) return;
    const p = progress(frame, a, 12, EASE.linear);
    if (p > 0 && p < 1) {
      penLine = i;
      penP = p;
    }
  });

  return (
    <div style={{ position: 'relative', width, height: CAB_H * s, ...style, ...dimStyle(dim, show) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: CAB_W, height: CAB_H, transform: `scale(${s}) translateY(${(1 - show) * 16}px)`, transformOrigin: '0 0' }}>
        <svg width={CAB_W} height={CAB_H} viewBox={`0 0 ${CAB_W} ${CAB_H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id="kc-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.ink800} />
              <stop offset="100%" stopColor={C.ink900} />
            </linearGradient>
            <linearGradient id="kc-door" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.ink700} />
              <stop offset="100%" stopColor={C.ink800} />
            </linearGradient>
            <pattern id="kc-dots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="9" cy="9" r="1.6" fill={alpha(C.ink600, 0.7)} />
            </pattern>
          </defs>

          {/* Halo */}
          {g > 0 ? (
            <rect x={BODY.x - 8} y={BODY.y - 8} width={BODY.w + 16} height={BODY.h + 16} rx={BODY.r + 8} fill="none" stroke={alpha(C.cyan, 0.5 * g)} strokeWidth={10} />
          ) : null}

          {/* Body */}
          <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx={BODY.r} fill="url(#kc-body)" stroke={alpha(C.cyan, 0.55 + 0.35 * g)} strokeWidth={4} />
          {/* Header band with a key mark */}
          <path d={`M ${BODY.x + 2} ${BODY.y + HEAD_H} L ${BODY.x + BODY.w - 2} ${BODY.y + HEAD_H}`} stroke={alpha(C.cyan, 0.4)} strokeWidth={3} />
          <g transform={`translate(${BODY.x + BODY.w / 2}, ${BODY.y + HEAD_H / 2})`}>
            <circle cx={-26} cy={0} r={10} fill="none" stroke={C.cyan} strokeWidth={4} />
            <path d="M -16 0 L 22 0 M 12 0 L 12 9 M 20 0 L 20 7" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
          </g>
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={BODY.x + 30 + k * 18} cy={BODY.y + HEAD_H / 2} r={4} fill={alpha(C.cyan, 0.35)} />
          ))}
          {/* Pegboard */}
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={10} fill={C.ink950} stroke={C.ink700} strokeWidth={2} />
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={10} fill="url(#kc-dots)" />
          <line x1={PANEL.x + 8} y1={(ROW_LOCK_Y[0] + PEG_DY + KEY_H + ROW_LOCK_Y[1]) / 2 - 14} x2={PANEL.x + PANEL.w - 8} y2={(ROW_LOCK_Y[0] + PEG_DY + KEY_H + ROW_LOCK_Y[1]) / 2 - 14} stroke={C.ink700} strokeWidth={2} />

          {/* Hooks, padlocks, keys */}
          {Array.from({ length: COLS * 2 }, (_, i) => {
            const h = hookCenter(i);
            const isFocus = i === hook;
            const code = isFocus ? focusCode : HOOK_CODES[i];
            return (
              <g key={i}>
                <g transform={`translate(${h.x}, ${h.lockY})`}>
                  <Padlock code={code} spin={isFocus ? change : 0} fresh={isFocus ? change : 0} glow={isFocus ? changeGlow : 0} />
                </g>
                {/* Peg */}
                <circle cx={h.x} cy={h.pegY} r={6} fill={METAL_DIM} />
                <path d={`M ${h.x} ${h.pegY} L ${h.x} ${h.pegY + 10}`} stroke={METAL_DIM} strokeWidth={4} strokeLinecap="round" />
                {/* Empty hook outline while its key is lent */}
                {isFocus && out > 0.05 ? (
                  <g transform={`translate(${h.x}, ${h.pegY + 2})`} opacity={out}>
                    <circle cx={0} cy={18} r={15} fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={2.5} strokeDasharray="5 5" />
                    <path d={`M -4 33 L -4 ${KEY_H - 4} M 4 33 L 4 ${KEY_H - 4}`} stroke={alpha(C.cyan, 0.55)} strokeWidth={2.5} strokeDasharray="5 5" />
                  </g>
                ) : null}
                {!isFocus || out <= 0.001 ? (
                  <g transform={`translate(${h.x}, ${h.pegY + 2})`}>
                    <KeyShape code={code} color={isFocus && kg > 0.3 ? '#a5f3fc' : METAL} glow={isFocus ? kg : 0} />
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Doors (closing from the hinges) */}
          {close > 0 ? (
            <g>
              {[0, 1].map((side) => {
                const hingeX = side === 0 ? BODY.x : BODY.x + BODY.w;
                const dir = side === 0 ? 1 : -1;
                const wDoor = (BODY.w / 2) * close;
                const freeX = hingeX + dir * wDoor;
                const lean = 14 * (1 - close);
                return (
                  <path
                    key={side}
                    d={`M ${hingeX} ${BODY.y} L ${freeX} ${BODY.y - lean} L ${freeX} ${BODY.y + BODY.h + lean} L ${hingeX} ${BODY.y + BODY.h} Z`}
                    fill="url(#kc-door)"
                    stroke={alpha(C.cyan, 0.6)}
                    strokeWidth={3}
                    strokeLinejoin="round"
                  />
                );
              })}
              {close > 0.98 ? <line x1={BODY.x + BODY.w / 2} y1={BODY.y + 6} x2={BODY.x + BODY.w / 2} y2={BODY.y + BODY.h - 6} stroke={C.ink950} strokeWidth={3} /> : null}
              {hasp > 0 ? (
                <g transform={`translate(${BODY.x + BODY.w / 2}, ${BODY.y + BODY.h / 2 - 30 * (1 - hasp)}) scale(2.4)`} opacity={hasp}>
                  <path d="M -10 -4 L -10 -12 A 10 10 0 0 1 10 -12 L 10 -4" fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
                  <rect x={-15} y={-5} width={30} height={24} rx={5} fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
                  <circle cx={0} cy={5} r={3} fill={C.cyan} />
                  <path d="M 0 7 L 0 13" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" />
                </g>
              ) : null}
            </g>
          ) : null}

          {/* The lent key, drawn above everything while it is off its hook */}
          {out > 0.001 ? (
            <g transform={`translate(${keyPos.x}, ${keyPos.y + 2}) rotate(${keyPos.rot})`}>
              <KeyShape code={focusCode} color={kg > 0.3 ? '#a5f3fc' : METAL} glow={Math.max(kg, out * 0.6)} />
            </g>
          ) : null}

          {/* Logbook */}
          {showLedger ? (
            <g>
              <rect x={LEDGER.x} y={LEDGER.y} width={LEDGER.w} height={LEDGER.h} rx={10} fill={C.ink850} stroke={C.ink600} strokeWidth={3} />
              <rect x={LEDGER.x} y={LEDGER.y} width={LEDGER.w} height={LEDGER.head} rx={10} fill={alpha(C.cyan, 0.14)} />
              <line x1={LEDGER.x} y1={LEDGER.y + LEDGER.head} x2={LEDGER.x + LEDGER.w} y2={LEDGER.y + LEDGER.head} stroke={C.ink600} strokeWidth={2} />
              <line x1={LEDGER.x + 30} y1={LEDGER.y + LEDGER.head} x2={LEDGER.x + 30} y2={LEDGER.y + LEDGER.h - 6} stroke={alpha(C.rose, 0.35)} strokeWidth={2} />
              {Array.from({ length: 7 }, (_, k) => (
                <line
                  key={k}
                  x1={LEDGER.x + 12}
                  y1={LEDGER.y + LEDGER.lineTop - LEDGER.y + k * LEDGER.pitch + 8}
                  x2={LEDGER.x + LEDGER.w - 12}
                  y2={LEDGER.y + LEDGER.lineTop - LEDGER.y + k * LEDGER.pitch + 8}
                  stroke={alpha(C.ink600, 0.7)}
                  strokeWidth={1.5}
                />
              ))}
            </g>
          ) : null}
        </svg>

        {/* Logbook text */}
        {showLedger ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: LEDGER.x,
                top: LEDGER.y,
                width: LEDGER.w,
                height: LEDGER.head,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.sans,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 1,
                color: C.cyanSoft,
              }}
            >
              registro
            </div>
            {lines.map((text, i) => {
              const a = lineAt(i);
              const p = a === undefined ? 1 : progress(frame, a, 12, EASE.linear);
              if (p <= 0) return null;
              const n = Math.ceil(text.length * p);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: LEDGER.x + 38,
                    top: LEDGER.lineTop + i * LEDGER.pitch - 22,
                    fontFamily: FONT.mono,
                    fontSize: LEDGER.size,
                    fontWeight: 650,
                    color: C.text,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text.slice(0, n)}
                </div>
              );
            })}
            {penLine >= 0 ? (
              <svg
                width={60}
                height={60}
                viewBox="0 0 60 60"
                style={{
                  position: 'absolute',
                  left: LEDGER.x + 38 + Math.min(LEDGER.w - 70, lines[penLine].length * LEDGER.size * 0.6 * penP) - 4,
                  top: LEDGER.lineTop + penLine * LEDGER.pitch - 50,
                  overflow: 'visible',
                }}
              >
                <path d="M 6 50 L 10 38 L 44 4 L 54 14 L 20 48 Z" fill={C.amber} stroke={C.amberDeep} strokeWidth={2} strokeLinejoin="round" />
                <path d="M 6 50 L 10 38 L 18 46 Z" fill={C.text} />
              </svg>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
