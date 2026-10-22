import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, focusWeights, type IconName } from '../../../engine/src/ui';
import { ASSISTANT, ASSUME, BARRIERS, OUTSIDE } from '../data/s05-capas';
import { WaveLogo, fitSize } from './parts/Bits';
import { Stage } from './kit';

const W = STAGE.width;

/** The assistant (with the model inside) in the middle; the barriers around it. */
const CORE = { cx: 864, cy: 318, r: 112 };
/** Ring of barrier arcs just outside the assistant. */
const RING_R = 152;
/** The stroke that gathers the barriers: an ellipse through the three cards' centres. */
const ELLIPSE = { rx: 594, ry: 250 };
const CARD_H = 150;
const CARDS = [
  { x: CORE.cx - ELLIPSE.rx - 230, y: CORE.cy - CARD_H / 2, w: 460, arc: [150, 210] as const },
  { x: CORE.cx + ELLIPSE.rx - 230, y: CORE.cy - CARD_H / 2, w: 460, arc: [-30, 30] as const },
  { x: CORE.cx - 380, y: CORE.cy + ELLIPSE.ry - CARD_H / 2, w: 760, arc: [60, 120] as const },
];
const TONES = ['cyan', 'emerald', 'violet'] as const;
const TONE_HEX = { cyan: C.cyan, emerald: C.emerald, violet: C.violet } as const;

/**
 * s05-capas «Lo que sí funciona». `assume`: «supón que alguna vez fallará»
 * over the assistant (the model at its core). The barriers, one at a time,
 * each a card and an arc around the assistant: `least` (the asker's
 * permissions), `nolimit` (no free way out; a person approves), `log` (a
 * record for the SOC: document processed · tool used). `outside` (with the
 * lock sound, on the cue): a stroke gathers the three barriers around — not
 * inside — the model, and the top line becomes «todas fuera del modelo».
 */
export function S05Capas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const assume = props.cue('assume');
  const at = [props.cue('least'), props.cue('nolimit'), props.cue('log')];
  const outside = props.cue('outside');

  const coreIn = springIn(frame, fps, Math.max(0, assume - 10), { damping: 16 });
  const assumeIn = enter(frame, assume, { distance: 16 });
  const assumeOut = progress(frame, outside - 8, 10, EASE.inOut);
  const { weights } = focusWeights(frame, at, { end: outside });
  const gather = progress(frame, outside, 26, EASE.inOut);
  const label = springIn(frame, fps, outside, { damping: 15 });
  const lockGlow = progress(frame, outside, 6) * (1 - progress(frame, outside + 30, 20));

  const rad = (d: number) => (d * Math.PI) / 180;
  const arcPath = (a0: number, a1: number) =>
    `M ${CORE.cx + RING_R * Math.cos(rad(a0))} ${CORE.cy + RING_R * Math.sin(rad(a0))} A ${RING_R} ${RING_R} 0 0 1 ${CORE.cx + RING_R * Math.cos(rad(a1))} ${CORE.cy + RING_R * Math.sin(rad(a1))}`;

  return (
    <Stage>
      {/* the top line: assume it fails → all outside the model */}
      {frame >= assume - 2 && assumeOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', opacity: assumeIn.opacity * (1 - assumeOut), transform: assumeIn.transform }}>
          <TopLine icon="alert" color={C.amber} text={ASSUME} />
        </div>
      ) : null}
      {label > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, label * 1.3), transform: `scale(${0.9 + 0.1 * Math.min(1, label)})` }}>
          <TopLine icon="lock" color={C.emerald} text={OUTSIDE} glow={lockGlow} />
        </div>
      ) : null}

      <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* the gathering stroke, outside the model */}
        {gather > 0.001 ? (
          <ellipse cx={CORE.cx} cy={CORE.cy} rx={ELLIPSE.rx} ry={ELLIPSE.ry} fill="none" stroke={C.emerald} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - gather} style={{ filter: `drop-shadow(0 0 ${Math.round(10 + 14 * lockGlow)}px ${alpha(C.emerald, 0.6)})` }} />
        ) : null}
        {/* arcs: each barrier wraps part of the assistant */}
        {CARDS.map((c, i) => {
          const p = progress(frame, at[i] - 2, 16, EASE.inOut);
          if (p <= 0.001) return null;
          const col = TONE_HEX[TONES[i]];
          return <path key={i} d={arcPath(c.arc[0], c.arc[1])} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.6 + 0.4 * weights[i]} />;
        })}
      </svg>

      {/* the assistant, the model at its core */}
      {coreIn > 0.001 ? (
        <div style={{ position: 'absolute', left: CORE.cx - CORE.r, top: CORE.cy - CORE.r, width: CORE.r * 2, height: CORE.r * 2, opacity: Math.min(1, coreIn * 1.3), transform: `scale(${0.7 + 0.3 * Math.min(1, coreIn)})` }}>
          <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: CORE.r, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: alpha(C.cyan, 0.1), border: `3px solid ${alpha(C.cyan, 0.75)}` }}>
            <WaveLogo size={50} />
            <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong }}>{ASSISTANT}</span>
            <Icon name="brain" size={50} color={C.cyanSoft} strokeWidth={1.6} />
          </div>
        </div>
      ) : null}

      {/* the barrier cards */}
      {BARRIERS.map((b, i) => {
        const c = CARDS[i];
        const p = springIn(frame, fps, at[i] - 4, { damping: 16 });
        if (p <= 0.001) return null;
        const col = TONE_HEX[TONES[i]];
        const glow = weights[i] * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const d = (1 - weights[i]) * 0.35 * (1 - gather);
        return (
          <div
            key={b.key}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              width: c.w,
              height: CARD_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(col, 0.4 + 0.5 * Math.max(glow, gather))}`,
              background: `linear-gradient(90deg, ${alpha(col, 0.1 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
              boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(col, 0.28 * glow)}` : `0 18px 44px ${alpha('#000000', 0.3)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 26px',
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
              ...dimStyle(d, Math.min(1, p * 1.3)),
              transform: `translateY(${(1 - p) * 20}px)`,
            }}
          >
            <div style={{ width: 76, height: 76, borderRadius: 38, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(col, 0.16), border: `3px solid ${alpha(col, 0.8)}` }}>
              <Icon name={b.icon as IconName} size={42} color={col} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: fitSize(b.title, 46, c.w - 150), fontWeight: 850, letterSpacing: -0.6, color: C.textStrong }}>{b.title}</span>
              <span style={{ fontSize: fitSize(b.sub, 34, c.w - 150), fontWeight: 700, color: C.text }}>{b.sub}</span>
            </div>
          </div>
        );
      })}
    </Stage>
  );
}

function TopLine({ icon, color, text, glow = 0 }: { icon: IconName; color: string; text: string; glow?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        height: 60,
        padding: '0 30px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.7)}`,
        background: alpha(C.ink900, 0.95),
        boxShadow: `0 0 ${Math.round(18 + 24 * glow)}px ${alpha(color, 0.2 + 0.3 * glow)}`,
        fontFamily: FONT.sans,
        fontSize: 44,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={42} color={color} strokeWidth={2.2} />
      {text}
    </div>
  );
}
