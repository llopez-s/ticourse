import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix, type IconName } from '../../../../engine/src/ui';

/**
 * «La alarma»: where a detection fires, drawn as a bell over a phase slot
 * (s07; s10 reuses it small in the rule-3 miniature «la alarma a la
 * izquierda»). It carries no text of its own — every label comes from props.
 *
 * States (all 0–1, combine freely; drive them from cues):
 * - `ring`: it rings — the bell swings and amber sound arcs spread, at 1 Hz
 *   (never faster). Ringing on its own stops nothing: the scene decides what
 *   changes around it, and only `act` should switch anything off.
 * - `act`: someone acts on it — an emerald padlock drops onto the bell and the
 *   bell turns emerald (the cut that holds). It silences `ring`.
 * - `off`: switched off / not reached — grey and quiet (its source pill too).
 * - `appear`: pop in (scale + fade).
 * Optional `source`: the source it sits on («correo», «equipo»…), as a small
 * pill under the bell — the screen, not the voice, says where it looks.
 *
 * Layout: the component's box is `alarmBox(size, hasSource)` px; the bell is
 * centred horizontally, its top at y = 0.18 × size (room for the arcs and the
 * dropping lock). Place it with an absolutely positioned wrapper, e.g. centred
 * over a slot with `left = slotCenterX - box.w / 2`.
 */
export interface AlarmProps {
  /** Bell height in px (default 72). Everything scales with it. */
  size?: number;
  frame?: number;
  appear?: number;
  ring?: number;
  act?: number;
  off?: number;
  /** Bell tone while armed / ringing (default amber: a warning nobody has acted on yet). */
  tone?: string;
  /** The source the alarm sits on. */
  source?: { icon: IconName; label: string; tone?: string; appear?: number };
  style?: CSSProperties;
}

const HZ = 1;

/** Box (px) of an <Alarm> of bell height `size`; `bellY` is the bell's vertical centre. */
export function alarmBox(size: number, hasSource = false): { w: number; h: number; bellY: number } {
  const bellTop = size * 0.18;
  const bellH = size;
  const sourceH = hasSource ? size * 0.62 : 0;
  return { w: size * 2, h: bellTop + bellH + (hasSource ? size * 0.12 : 0) + sourceH, bellY: bellTop + bellH / 2 };
}

export function Alarm({ size = 72, frame: frameProp, appear = 1, ring = 0, act = 0, off = 0, tone = C.amber, source, style }: AlarmProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const box = alarmBox(size, !!source);
  const a = clamp01(appear);
  if (a <= 0) return null;

  const acted = clamp01(act);
  const o = clamp01(off) * (1 - acted);
  const r = clamp01(ring) * (1 - acted) * (1 - o);
  const t = (frame / fps) * HZ;
  const swing = r * 12 * Math.sin(2 * Math.PI * t);
  const phase = t - Math.floor(t);

  const bellTone = acted > 0.5 ? C.emerald : o > 0.5 ? C.faint : tone;
  const fillTone = acted > 0.5 ? C.emeraldDeep : o > 0.5 ? C.ink800 : alpha(tone, 0.22);
  const glow = Math.max(r * 0.8, acted * 0.7);
  const glowTone = acted > 0.5 ? C.emerald : tone;

  // Bell drawn in a 100×100 box (pivot at the knob).
  const W = box.w;
  const bellTop = size * 0.18;
  const s = size / 100;
  const cx = W / 2;
  const lockDrop = mix(-size * 0.9, 0, acted);

  return (
    <div style={{ position: 'relative', width: W, height: box.h, opacity: a * (1 - 0.45 * o), transform: `scale(${mix(0.7, 1, a)})`, transformOrigin: '50% 60%', ...style }}>
      <svg width={W} height={bellTop + size} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Sound arcs */}
        {r > 0
          ? [0, 0.18].map((off0) => {
              // One wave per second (two concentric arcs on the same phase): never faster than 1 Hz.
              const p = phase;
              const rad = size * (0.48 + off0 + 0.36 * p);
              const op = r * (1 - p) * (off0 ? 0.55 : 0.9);
              const cy = bellTop + size * 0.5;
              return [-1, 1].map((side) => {
                const x0 = cx + side * rad * Math.cos(0.75);
                const y0 = cy - rad * Math.sin(0.75);
                const x1 = cx + side * rad * Math.cos(0.75);
                const y1 = cy + rad * Math.sin(0.75);
                return (
                  <path
                    key={`${off0}-${side}`}
                    d={`M${x0} ${y0} A${rad} ${rad} 0 0 ${side > 0 ? 1 : 0} ${x1} ${y1}`}
                    fill="none"
                    stroke={tone}
                    strokeWidth={Math.max(2, size * 0.05)}
                    strokeLinecap="round"
                    opacity={op}
                  />
                );
              });
            })
          : null}
        <g transform={`translate(${cx - 50 * s} ${bellTop}) scale(${s}) rotate(${swing} 50 6)`}>
          {glow > 0 ? <ellipse cx={50} cy={52} rx={44} ry={40} fill={alpha(glowTone, 0.18 * glow)} /> : null}
          {/* knob */}
          <circle cx={50} cy={7} r={5} fill={bellTone} />
          {/* dome + flared rim */}
          <path
            d="M29 72 L29 46 C29 25 39 13 50 13 C61 13 71 25 71 46 L71 72 Z"
            fill={fillTone}
            stroke={bellTone}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <rect x={18} y={70} width={64} height={11} rx={5.5} fill={fillTone} stroke={bellTone} strokeWidth={5} />
          {/* clapper */}
          <circle cx={50 + swing * -0.25} cy={90} r={7} fill={bellTone} />
        </g>
        {/* The padlock of whoever acts on it */}
        {acted > 0 ? (
          <g transform={`translate(${cx} ${bellTop + size * 0.5 + lockDrop})`} opacity={Math.min(1, acted * 2)}>
            <circle r={size * 0.34} fill={C.ink950} stroke={C.emerald} strokeWidth={Math.max(2, size * 0.045)} />
            <path
              d={`M${-size * 0.11} ${-size * 0.02} L${-size * 0.11} ${-size * 0.1} A${size * 0.11} ${size * 0.11} 0 0 1 ${size * 0.11} ${-size * 0.1} L${size * 0.11} ${-size * 0.02}`}
              fill="none"
              stroke={C.emerald}
              strokeWidth={Math.max(2, size * 0.05)}
              strokeLinecap="round"
            />
            <rect x={-size * 0.17} y={-size * 0.03} width={size * 0.34} height={size * 0.25} rx={size * 0.04} fill={C.emerald} />
          </g>
        ) : null}
      </svg>
      {source ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: W,
            top: bellTop + size + size * 0.12,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(source.appear ?? 1),
            filter: o > 0.01 ? `grayscale(${o})` : undefined,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: size * 0.1,
              padding: `${size * 0.06}px ${size * 0.18}px`,
              borderRadius: 999,
              border: `2px solid ${alpha(source.tone ?? C.cyan, 0.7)}`,
              background: C.ink900,
              fontFamily: FONT.sans,
              fontSize: Math.round(size * 0.4),
              fontWeight: 700,
              lineHeight: 1.1,
              color: source.tone ?? C.cyan,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name={source.icon} size={Math.round(size * 0.42)} color={source.tone ?? C.cyan} />
            {source.label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
