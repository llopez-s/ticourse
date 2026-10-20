import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The network disk's own units (front view). */
export const NAS = { w: 220, h: 170 } as const;

/** Blink pattern of one LED: deterministic from the frame (no randomness between renders). */
function blink(frame: number, k: number): number {
  const period = [23, 9, 14][k % 3];
  const duty = [23, 4, 8][k % 3];
  return (frame + k * 5) % period < duty ? 1 : 0.18;
}

/**
 * The passenger terminal office's network disk (the video's thread): a small dark box seen from the front, two drive
 * bays with their handles and a column of three LEDs that blink while it runs (`frame`; `running` 0 stops them). `tone`
 * is its outline (cyan = the port's thing; rose once the sweep finds it outside the list). `open` 0–1 slides the two
 * bays out a little (s06: it carries two drives). No brand, no name, no label.
 */
export function Nas({
  width = NAS.w,
  frame,
  tone = C.cyan,
  glow = 0,
  running = 1,
  open = 0,
  dim = 0,
}: {
  width?: number;
  frame: number;
  tone?: string;
  glow?: number;
  running?: number;
  open?: number;
  dim?: number;
}) {
  const g = clamp01(glow);
  const o = clamp01(open);
  const run = clamp01(running);
  const BAY_W = 56;
  const BAY_H = 116;
  const bayX = [84, 148];
  return (
    <svg
      width={width}
      height={(width * NAS.h) / NAS.w}
      viewBox={`0 0 ${NAS.w} ${NAS.h}`}
      style={{ display: 'block', overflow: 'visible', opacity: 1 - 0.6 * clamp01(dim) }}
    >
      {g > 0.01 ? <rect x={-14} y={-14} width={NAS.w + 28} height={NAS.h + 28} rx={30} fill={alpha(tone, 0.14 * g)} /> : null}
      {/* body */}
      <rect x={4} y={4} width={NAS.w - 8} height={NAS.h - 14} rx={16} fill={C.ink800} stroke={alpha(tone, 0.55 + 0.4 * g)} strokeWidth={4} />
      <rect x={16} y={NAS.h - 12} width={34} height={8} rx={3} fill={C.ink700} />
      <rect x={NAS.w - 50} y={NAS.h - 12} width={34} height={8} rx={3} fill={C.ink700} />
      {/* LEDs */}
      {[0, 1, 2].map((k) => {
        const on = k === 0 ? run : run * blink(frame, k);
        const col = k === 0 ? C.cyan : k === 1 ? C.emerald : C.sky;
        return (
          <g key={k}>
            <circle cx={42} cy={36 + k * 30} r={11} fill={alpha(col, 0.18 * on)} />
            <circle cx={42} cy={36 + k * 30} r={6} fill={on > 0.5 ? col : alpha(col, 0.25)} />
          </g>
        );
      })}
      {/* two bays, sliding out a little when open */}
      {bayX.map((x, i) => (
        <g key={i} transform={`translate(${x} ${22 + o * 14})`}>
          <rect x={0} y={0} width={BAY_W} height={BAY_H} rx={8} fill={C.ink900} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
          {[0, 1, 2, 3, 4].map((k) => (
            <line key={k} x1={14} y1={18 + k * 12} x2={BAY_W - 14} y2={18 + k * 12} stroke={alpha(C.text, 0.16)} strokeWidth={3} strokeLinecap="round" />
          ))}
          <rect x={14} y={BAY_H - 30} width={BAY_W - 28} height={14} rx={5} fill={alpha(C.text, 0.3)} />
        </g>
      ))}
    </svg>
  );
}

/** A plain office shelf plank with two brackets (stage px). Things stand on its top edge. */
export function Shelf({ width, frameTone = C.muted }: { width: number; frameTone?: string }) {
  return (
    <svg width={width} height={70} viewBox={`0 0 ${width} 70`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={0} y={0} width={width} height={18} rx={5} fill={C.ink700} stroke={alpha(frameTone, 0.35)} strokeWidth={2} />
      <path d={`M 40 18 L 40 66 L 86 18 Z`} fill={C.ink800} stroke={alpha(frameTone, 0.25)} strokeWidth={2} />
      <path d={`M ${width - 40} 18 L ${width - 40} 66 L ${width - 86} 18 Z`} fill={C.ink800} stroke={alpha(frameTone, 0.25)} strokeWidth={2} />
    </svg>
  );
}
