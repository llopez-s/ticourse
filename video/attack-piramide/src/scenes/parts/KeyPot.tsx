import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { pulse } from '../../../../engine/src/theme/motion';

/**
 * Concept 1's image: a landing (rellano) with a door and a flowerpot; a key
 * hidden under the pot with a small tag «revisión del gas» lying on the floor;
 * optionally an ajar window drawn dimmed («otra técnica, el mismo porqué»).
 * The house is sky, the key's tag amber. Drawn in design units (KEYPOT_BASE_W
 * × KEYPOT_BASE_H) and scaled to `width`; the labels stay ≥ 32 px at
 * width ≥ 560.
 */

export const KEYPOT_BASE_W = 600;
export const KEYPOT_BASE_H = 520;

const FLOOR_Y = 400;
const DOOR = { x: 318, y: 92, w: 178, h: FLOOR_Y - 92 };
const POT = { cx: 150, base: 444, top: 334, wTop: 128, wBase: 92 };
/** Key: bit under the pot, bow peeking out towards the door. */
const KEY = { x0: 116, x1: 272, y: 440 };
const TAG = { x: 278, y: 450, w: 314, h: 58 };
const WINDOW = { x: 18, y: 60, w: 112, h: 138 };
const LABEL_SIZE = 36;

/** Centre of the tag in px from the KeyPot's top-left, at `width` (to attach links). */
export function keyPotTagAnchor(width: number): { x: number; y: number; x0: number; x1: number } {
  const s = width / KEYPOT_BASE_W;
  return { x: (TAG.x + TAG.w / 2) * s, y: (TAG.y + TAG.h / 2) * s, x0: TAG.x * s, x1: (TAG.x + TAG.w) * s };
}

/** Centre of the window in px from the KeyPot's top-left, at `width`. */
export function keyPotWindowAnchor(width: number): { x: number; y: number } {
  const s = width / KEYPOT_BASE_W;
  return { x: (WINDOW.x + WINDOW.w / 2) * s, y: (WINDOW.y + WINDOW.h / 2) * s };
}

/** Height in px of the KeyPot drawn at `width`. */
export function keyPotHeight(width: number): number {
  return (KEYPOT_BASE_H * width) / KEYPOT_BASE_W;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function KeyPot({
  width,
  frame: frameProp,
  show = 1,
  glow = 0,
  tag = 0,
  window: windowP = 0,
  style,
}: {
  width: number;
  frame?: number;
  /** 0–1 appearance. */
  show?: number;
  /** 0–1 halo on the key. */
  glow?: number;
  /** 0–1 highlight of the tag «revisión del gas». */
  tag?: number;
  /** 0–1: the ajar window (dimmed) with its caption. */
  window?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const s = width / KEYPOT_BASE_W;
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const g = clamp01(glow) * (0.75 + 0.25 * pulse(frame, fps, 0.6));
  const t = clamp01(tag);
  const wp = clamp01(windowP);
  const metal = g > 0.05 ? '#fde68a' : '#cbd5e1';
  const sky = C.sky;

  return (
    <div style={{ position: 'relative', width, height: KEYPOT_BASE_H * s, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: KEYPOT_BASE_W,
          height: KEYPOT_BASE_H,
          transform: `translateY(${(1 - sh) * 16}px) scale(${s})`,
          transformOrigin: '0 0',
          opacity: sh,
        }}
      >
        <svg width={KEYPOT_BASE_W} height={KEYPOT_BASE_H} viewBox={`0 0 ${KEYPOT_BASE_W} ${KEYPOT_BASE_H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id="kp-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={alpha(C.ink800, 0.0)} />
              <stop offset="100%" stopColor={alpha(C.ink800, 0.9)} />
            </linearGradient>
            <linearGradient id="kp-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.ink700} />
              <stop offset="100%" stopColor={C.ink850} />
            </linearGradient>
            <radialGradient id="kp-keyglow">
              <stop offset="0%" stopColor={alpha(C.amber, 0.55)} />
              <stop offset="100%" stopColor={alpha(C.amber, 0)} />
            </radialGradient>
          </defs>

          {/* Wall and landing */}
          <rect x={0} y={40} width={KEYPOT_BASE_W} height={FLOOR_Y - 40} rx={18} fill="url(#kp-wall)" />
          <path d={`M0 ${FLOOR_Y} L${KEYPOT_BASE_W} ${FLOOR_Y} L${KEYPOT_BASE_W - 10} ${KEYPOT_BASE_H - 2} L10 ${KEYPOT_BASE_H - 2} Z`} fill="url(#kp-floor)" />
          <line x1={0} y1={FLOOR_Y} x2={KEYPOT_BASE_W} y2={FLOOR_Y} stroke={alpha(sky, 0.55)} strokeWidth={3} />
          <line x1={10} y1={KEYPOT_BASE_H - 2} x2={KEYPOT_BASE_W - 10} y2={KEYPOT_BASE_H - 2} stroke={C.ink600} strokeWidth={3} />

          {/* Ajar window: another way in (dimmed). */}
          {wp > 0 ? (
            <g opacity={0.6 * wp}>
              <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={6} fill={C.ink950} stroke={alpha(sky, 0.7)} strokeWidth={4} strokeDasharray="10 7" />
              {/* Fixed pane */}
              <rect x={WINDOW.x + 8} y={WINDOW.y + 8} width={WINDOW.w / 2 - 12} height={WINDOW.h - 16} rx={3} fill={alpha(sky, 0.08)} stroke={alpha(sky, 0.5)} strokeWidth={2} />
              {/* Opened pane, swung outwards */}
              <path
                d={`M${WINDOW.x + WINDOW.w - 4} ${WINDOW.y + 8} L${WINDOW.x + WINDOW.w + 34} ${WINDOW.y - 6} L${WINDOW.x + WINDOW.w + 34} ${WINDOW.y + WINDOW.h + 6} L${WINDOW.x + WINDOW.w - 4} ${WINDOW.y + WINDOW.h - 8} Z`}
                fill={alpha(sky, 0.12)}
                stroke={alpha(sky, 0.7)}
                strokeWidth={3}
              />
            </g>
          ) : null}

          {/* Door */}
          <rect x={DOOR.x - 12} y={DOOR.y - 12} width={DOOR.w + 24} height={DOOR.h + 12} rx={8} fill="none" stroke={sky} strokeWidth={4} />
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={5} fill={C.ink700} stroke={alpha(sky, 0.6)} strokeWidth={2} />
          <rect x={DOOR.x + 22} y={DOOR.y + 24} width={DOOR.w - 44} height={104} rx={4} fill="none" stroke={alpha(sky, 0.35)} strokeWidth={2} />
          <rect x={DOOR.x + 22} y={DOOR.y + 152} width={DOOR.w - 44} height={DOOR.h - 176} rx={4} fill="none" stroke={alpha(sky, 0.35)} strokeWidth={2} />
          <circle cx={DOOR.x + DOOR.w / 2} cy={DOOR.y + 70} r={6} fill={alpha(sky, 0.6)} />
          <circle cx={DOOR.x + 28} cy={DOOR.y + DOOR.h / 2 + 18} r={9} fill={sky} />
          <rect x={DOOR.x + 24} y={DOOR.y + DOOR.h / 2 + 34} width={8} height={16} rx={3} fill={C.ink950} />

          {/* Key (drawn before the pot, which covers its bit) */}
          {g > 0 ? <ellipse cx={(KEY.x0 + KEY.x1) / 2 + 40} cy={KEY.y} rx={110} ry={48} fill="url(#kp-keyglow)" opacity={g} /> : null}
          <g>
            <rect x={KEY.x0} y={KEY.y - 5} width={KEY.x1 - KEY.x0 - 26} height={10} rx={4} fill={metal} />
            <path d={`M${KEY.x0 + 6} ${KEY.y - 4} l0 -12 l12 0 l0 6 l10 0 l0 -6 l10 0 l0 12 Z`} fill={metal} />
            <circle cx={KEY.x1 - 14} cy={KEY.y} r={18} fill="none" stroke={metal} strokeWidth={9} />
          </g>
          {/* Tag string */}
          <path
            d={`M${KEY.x1 - 2} ${KEY.y + 2} C ${KEY.x1 + 10} ${KEY.y + 20}, ${TAG.x - 6} ${TAG.y + 20}, ${TAG.x + 20} ${TAG.y + TAG.h / 2}`}
            fill="none"
            stroke={alpha(C.amber, 0.7 + 0.3 * t)}
            strokeWidth={3}
          />

          {/* Flowerpot with a plant */}
          <g>
            {[
              `M${POT.cx} ${POT.top} C ${POT.cx - 70} ${POT.top - 30}, ${POT.cx - 80} ${POT.top - 80}, ${POT.cx - 60} ${POT.top - 110} C ${POT.cx - 40} ${POT.top - 70}, ${POT.cx - 20} ${POT.top - 40}, ${POT.cx} ${POT.top}`,
              `M${POT.cx} ${POT.top} C ${POT.cx + 70} ${POT.top - 30}, ${POT.cx + 84} ${POT.top - 86}, ${POT.cx + 62} ${POT.top - 118} C ${POT.cx + 40} ${POT.top - 74}, ${POT.cx + 18} ${POT.top - 40}, ${POT.cx} ${POT.top}`,
              `M${POT.cx} ${POT.top} C ${POT.cx - 20} ${POT.top - 60}, ${POT.cx - 10} ${POT.top - 120}, ${POT.cx + 6} ${POT.top - 150} C ${POT.cx + 20} ${POT.top - 110}, ${POT.cx + 18} ${POT.top - 60}, ${POT.cx} ${POT.top}`,
            ].map((d, i) => (
              <path key={i} d={d} fill={i === 2 ? '#3f6b5c' : '#4d7f6d'} stroke="#2c4d42" strokeWidth={2} />
            ))}
            <path
              d={`M${POT.cx - POT.wTop / 2} ${POT.top + 18} L${POT.cx + POT.wTop / 2} ${POT.top + 18} L${POT.cx + POT.wBase / 2} ${POT.base} L${POT.cx - POT.wBase / 2} ${POT.base} Z`}
              fill="#7c4a32"
              stroke="#a8673f"
              strokeWidth={3}
            />
            <rect x={POT.cx - POT.wTop / 2 - 10} y={POT.top} width={POT.wTop + 20} height={24} rx={5} fill="#94593b" stroke="#b9774a" strokeWidth={3} />
          </g>
        </svg>

        {/* The tag «revisión del gas» */}
        <div
          style={{
            position: 'absolute',
            left: TAG.x,
            top: TAG.y,
            width: TAG.w,
            height: TAG.h,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingLeft: 14,
            borderRadius: '10px 16px 16px 10px',
            border: `3px solid ${alpha(C.amber, 0.65 + 0.35 * t)}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.14 + 0.16 * t)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: t > 0 ? `0 0 ${Math.round(30 * t)}px ${alpha(C.amber, 0.5 * t)}` : undefined,
            transform: `rotate(${-3 + 3 * t}deg)`,
            transformOrigin: 'left center',
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, border: `3px solid ${alpha(C.amber, 0.8)}`, flexShrink: 0 }} />
          <span style={{ fontFamily: FONT.sans, fontSize: LABEL_SIZE, fontWeight: 750, color: t > 0.3 ? '#fde68a' : '#fcd34d', whiteSpace: 'nowrap', letterSpacing: -0.4 }}>
            revisión del gas
          </span>
        </div>

        {/* Window caption */}
        {wp > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: KEYPOT_BASE_W,
              fontFamily: FONT.sans,
              fontSize: LABEL_SIZE,
              fontWeight: 650,
              color: alpha(C.sky, 0.85),
              whiteSpace: 'nowrap',
              opacity: wp,
              letterSpacing: -0.3,
            }}
          >
            otra técnica, el mismo porqué
          </div>
        ) : null}
      </div>
    </div>
  );
}
