import { useId, type CSSProperties } from 'react';
import { interpolateColors, useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01, tone as toneOf, type Tone } from '../../../../../engine/src/ui';

/**
 * «La cámara de la valla» (canon: out/scene-brief.md «Visual metaphors») = a
 * passive sensor on a tap: it sees everyone pass and raises an alert, but it
 * never lowers the barrier. s09 only (and s10's rule-3 icon).
 *
 * Drawn in the same dark-stage world as `Checkpoint look="scene"`: a CCTV
 * camera on its own pole, the housing under a visor, the lens and a status
 * LED, aimed down-left at a road. Weights (0–1) the scene drives:
 *   - `power`  1 = lens lit, LED emerald, view cone on; 0 = switched off
 *              (dark lens, no cone: a blind spot — it still blocks nothing);
 *   - `watch`  the view cone (default follows power);
 *   - `alert`  the amber bell badge and the LED turning amber («avisa»).
 * Design units CAMERA_BASE (240 × 200): the pole stands at x 196 and its foot
 * is the bottom edge, so the scene stands it on a fence line with
 * `fenceCameraPoint(width, 'foot')`. Nothing is positioned and nothing reads
 * the timeline except the optional `at` pop-in. The cone is drawn outside the
 * box (overflow visible) along `aim` degrees below the horizontal, to the left.
 */

export const CAMERA_BASE = { w: 240, h: 200 } as const;

const POLE_X = 196;
const MOUNT = { x: 196, y: 66 } as const;
/** Housing centre and the lens (before the aim rotation, the housing points left). */
const BODY = { x: 118, y: 70, len: 112, h: 44 } as const;

export type FenceCameraPoint = 'foot' | 'lens' | 'body' | 'badge';

function lensAt(aim: number) {
  const a = (aim * Math.PI) / 180;
  const half = BODY.len / 2 + 6;
  return { x: BODY.x - half * Math.cos(a), y: BODY.y + half * Math.sin(a) };
}

/** An anchor in px from the camera's top-left at `width`. */
export function fenceCameraPoint(width: number, which: FenceCameraPoint, aim = 32): { x: number; y: number } {
  const s = width / CAMERA_BASE.w;
  const p =
    which === 'foot'
      ? { x: POLE_X, y: CAMERA_BASE.h }
      : which === 'lens'
        ? lensAt(aim)
        : which === 'badge'
          ? { x: BODY.x - 6, y: 10 }
          : { x: BODY.x, y: BODY.y };
  return { x: p.x * s, y: p.y * s };
}

export function fenceCameraSize(width: number) {
  const s = width / CAMERA_BASE.w;
  return { w: width, h: CAMERA_BASE.h * s, scale: s };
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export function FenceCamera({
  width,
  power = 1,
  watch: watchProp,
  alert = 0,
  aim = 32,
  coneLength = 300,
  coneSpread = 21,
  tone = 'cyan',
  glow = 0,
  dim = 0,
  icon: iconProp,
  at,
  frame: frameProp,
  style,
}: {
  width: number;
  /** 1 = on (lens lit, LED emerald), 0 = switched off. */
  power?: number;
  /** 0–1 the view cone (default = power). */
  watch?: number;
  /** 0–1 the amber alert: bell badge + LED. */
  alert?: number;
  /** Degrees below the horizontal the camera looks, to the left. */
  aim?: number;
  /** Cone length in design units (it may leave the box). */
  coneLength?: number;
  /** Cone half-angle in degrees. */
  coneSpread?: number;
  tone?: Tone;
  glow?: number;
  dim?: number;
  /** Thicker strokes, no texture (default below ~130 px wide). */
  icon?: boolean;
  /** Frame (Sequence-relative) the camera pops in; omitted = on screen. */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('fcam');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const pop = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  if (pop <= 0) return null;
  const s = width / CAMERA_BASE.w;
  const h = CAMERA_BASE.h * s;
  const icon = iconProp ?? width < 130;
  const t = toneOf(tone);
  const on = clamp01(power);
  const watch = clamp01(watchProp ?? on) * on;
  const al = clamp01(alert) * on;
  const g = clamp01(glow);
  const d = clamp01(dim);

  /** A stroke width in design units that never renders thinner than `minPx`. */
  const sw = (base: number, minPx: number) => Math.max(base, minPx / s);
  const lw = sw(3.4, icon ? 1.8 : 2);
  const thin = sw(2.2, icon ? 1.3 : 1.2);

  const line = interpolateColors(on, [0, 1], ['#64748b', t.fg]);
  const fill = C.ink800;
  const led = al > 0.5 ? C.amber : interpolateColors(on, [0, 1], ['#334155', C.emerald]);
  const lens = lensAt(aim);

  // View cone: a wedge from the lens along the aim.
  const a = (aim * Math.PI) / 180;
  const sp = (coneSpread * Math.PI) / 180;
  const dir = (ang: number) => ({ x: -Math.cos(ang), y: Math.sin(ang) });
  const e1 = dir(a - sp);
  const e2 = dir(a + sp);
  const L = coneLength;
  const cone = `M ${lens.x} ${lens.y} L ${lens.x + e1.x * L} ${lens.y + e1.y * L} Q ${lens.x + dir(a).x * L * 1.08} ${lens.y + dir(a).y * L * 1.08} ${lens.x + e2.x * L} ${lens.y + e2.y * L} Z`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: pop * (1 - 0.6 * d),
        transform: pop < 1 ? `translateY(${(1 - pop) * 12}px)` : undefined,
        filter: [g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 14 * g)}px ${alpha(t.fg, 0.6 * g)})` : '', d > 0.01 ? `saturate(${1 - 0.6 * d})` : '']
          .filter(Boolean)
          .join(' ') || undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${CAMERA_BASE.w} ${CAMERA_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient
            id={`${id}-cone`}
            x1={lens.x}
            y1={lens.y}
            x2={lens.x + dir(a).x * L}
            y2={lens.y + dir(a).y * L}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={al > 0.01 ? interpolateColors(al, [0, 1], [t.fg, C.amber]) : t.fg} stopOpacity={0.34} />
            <stop offset="1" stopColor={t.fg} stopOpacity={0} />
          </linearGradient>
          <radialGradient id={`${id}-ring`}>
            <stop offset="0" stopColor={C.amber} stopOpacity={0.5} />
            <stop offset="1" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* View cone (under the camera) */}
        {watch > 0.01 ? (
          <g opacity={watch}>
            <path d={cone} fill={`url(#${id}-cone)`} />
            <path
              d={`M ${lens.x} ${lens.y} L ${lens.x + e1.x * L * 0.92} ${lens.y + e1.y * L * 0.92} M ${lens.x} ${lens.y} L ${lens.x + e2.x * L * 0.92} ${lens.y + e2.y * L * 0.92}`}
              stroke={alpha(t.fg, 0.32)}
              strokeWidth={thin}
              strokeDasharray={icon ? undefined : '6 8'}
              fill="none"
            />
          </g>
        ) : null}

        {/* Pole with its foot plate and the arm to the mount */}
        <g stroke={interpolateColors(on, [0, 1], ['#475569', '#64748b'])} strokeLinecap="round" fill="none">
          <line x1={POLE_X} y1={CAMERA_BASE.h} x2={POLE_X} y2={MOUNT.y - 6} strokeWidth={sw(7, 2.4)} />
          <line x1={POLE_X - 16} y1={CAMERA_BASE.h - 2} x2={POLE_X + 16} y2={CAMERA_BASE.h - 2} strokeWidth={sw(5, 2)} />
          {!icon ? <path d={`M ${POLE_X} ${MOUNT.y + 26} L ${MOUNT.x - 32} ${MOUNT.y + 2}`} strokeWidth={sw(3.2, 1.4)} /> : null}
          <line x1={POLE_X} y1={MOUNT.y} x2={BODY.x + BODY.len / 2 - 6} y2={BODY.y - 4} strokeWidth={sw(6, 2.2)} />
        </g>

        {/* Housing, rotated to the aim: body, visor, lens, LED */}
        <g transform={`rotate(${-aim} ${BODY.x} ${BODY.y})`} strokeLinejoin="round">
          {/* visor */}
          <path
            d={`M ${BODY.x - BODY.len / 2 - 16} ${BODY.y - BODY.h / 2 - 4} L ${BODY.x + BODY.len / 2 + 4} ${BODY.y - BODY.h / 2 - 4} L ${BODY.x + BODY.len / 2 + 4} ${BODY.y - BODY.h / 2 + 6} L ${BODY.x - BODY.len / 2 - 10} ${BODY.y - BODY.h / 2 + 6} Z`}
            fill={C.ink700}
            stroke={line}
            strokeWidth={thin}
          />
          {/* body */}
          <rect x={BODY.x - BODY.len / 2} y={BODY.y - BODY.h / 2 + 4} width={BODY.len} height={BODY.h} rx={10} fill={fill} stroke={line} strokeWidth={lw} />
          {!icon ? (
            <path
              d={`M ${BODY.x - 6} ${BODY.y + 4} L ${BODY.x + BODY.len / 2 - 10} ${BODY.y + 4}`}
              stroke={alpha(t.fg, 0.2 + 0.3 * on)}
              strokeWidth={thin}
              strokeLinecap="round"
            />
          ) : null}
          {/* lens ring */}
          <rect x={BODY.x - BODY.len / 2 - 12} y={BODY.y - 14} width={16} height={36} rx={5} fill={C.ink900} stroke={line} strokeWidth={thin} />
          <circle cx={BODY.x - BODY.len / 2 - 4} cy={BODY.y + 4} r={11} fill="#0b1220" stroke={line} strokeWidth={thin} />
          {on > 0.01 ? <circle cx={BODY.x - BODY.len / 2 - 4} cy={BODY.y + 4} r={9} fill={t.fg} opacity={0.55 * on} /> : null}
          {on > 0.01 ? <circle cx={BODY.x - BODY.len / 2 - 7} cy={BODY.y} r={3.4} fill={alpha('#ffffff', 0.75 * on)} /> : null}
          {/* status LED */}
          <circle cx={BODY.x + BODY.len / 2 - 18} cy={BODY.y - 6} r={icon ? 6 : 5} fill={led} stroke={alpha('#020617', 0.6)} strokeWidth={sw(1.2, 0.8)} />
        </g>

        {/* Alert: an amber ring and a bell badge over the camera («avisa») */}
        {al > 0.01 ? (
          <g opacity={al}>
            <circle cx={BODY.x} cy={BODY.y} r={70 + 18 * al} fill={`url(#${id}-ring)`} />
            <g transform={`translate(${BODY.x - 6} ${icon ? 4 : 10}) scale(${(icon ? 1.5 : 1.15) * (0.8 + 0.2 * al)})`}>
              <circle cx={0} cy={0} r={20} fill={C.ink900} stroke={C.amber} strokeWidth={sw(3, 1.6)} />
              {/* bell */}
              <path d="M -9 6 Q -9 -11 0 -11 Q 9 -11 9 6 L 12 9 L -12 9 Z" fill={C.amber} />
              <circle cx={0} cy={12} r={3.2} fill={C.amber} />
            </g>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
