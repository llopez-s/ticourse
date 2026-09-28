import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Diamond } from './parts/Diamond';
import { Stage, wordFrame } from './kit';

const S = 's11-limits';

const CARD_W = 540;
const GAP = 54;
const CARD_TOP = 90;
const CARD_H = 470;

/**
 * S11 «Lo que el diamante no hace»: three cards over a dimmed diamond.
 *   no-attrib  it does not attribute on its own
 *   one-event  one event is not a campaign
 *   plan       its value: the pivot plan (what you know · what is missing · where to look)
 */
export function S11Limits(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const attribAt = props.cue('no-attrib');
  const oneAt = props.cue('one-event');
  const planAt = props.cue('plan');
  const rows = [
    { text: 'qué sabes', at: wordFrame(S, 's11-03', 'sabes') },
    { text: 'qué te falta', at: wordFrame(S, 's11-03', 'falta') },
    { text: 'dónde buscarlo', at: wordFrame(S, 's11-03', 'buscarlo') },
  ];

  // The diamond is the subject until the first limit lands, then it recedes.
  const recede = progress(frame, attribAt - 6, 20, EASE.inOut);
  const diamondOpacity = fadeIn(frame, 0, 12) * (0.75 - 0.6 * recede);
  const planFocus = progress(frame, planAt, 18);

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, opacity: diamondOpacity }}>
        <Diamond
          cy={330}
          hw={560}
          hh={250}
          cardW={340}
          vertices={{
            adv: { unknown: true, question: false },
            cap: { items: ['GLASS VIPER'], question: false },
            infra: { items: ['update-svc-cdn.com'], question: false },
            vic: { items: ['ENG-WS-041'], question: false },
          }}
        />
      </div>
      <LimitCard
        index={0}
        frame={frame}
        fps={fps}
        at={attribAt}
        accent="rose"
        icon="x"
        title="No atribuye por sí solo"
        detail="Poner nombre real al adversario exige muchas más pruebas."
        dim={planFocus}
      />
      <LimitCard
        index={1}
        frame={frame}
        fps={fps}
        at={oneAt}
        accent="amber"
        icon="x"
        title="Un evento no es una campaña"
        detail="Un diamante = un paso. La campaña sale de muchos hilos."
        dim={planFocus}
      />
      <LimitCard index={2} frame={frame} fps={fps} at={planAt} accent="emerald" icon="check" title="Su valor: el plan de pivotes" dim={0} glow={planFocus}>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rows.map((r) => (
            <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, r.at - 4, { distance: 20, axis: 'x' }) }}>
              <Icon name="check" size={34} color={C.emerald} />
              <span style={{ fontSize: TYPE.body, fontWeight: 700, color: C.textStrong }}>{r.text}</span>
            </div>
          ))}
        </div>
      </LimitCard>
    </Stage>
  );
}

function LimitCard({
  index,
  frame,
  fps,
  at,
  accent,
  icon,
  title,
  detail,
  dim,
  glow = 0,
  children,
}: {
  index: number;
  frame: number;
  fps: number;
  at: number;
  accent: Accent;
  icon: IconName;
  title: string;
  detail?: string;
  dim: number;
  glow?: number;
  children?: ReactNode;
}) {
  if (frame < at - 6) return null;
  const a = ACCENT[accent];
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  return (
    <div
      style={{
        position: 'absolute',
        left: index * (CARD_W + GAP),
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '34px 36px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(a.fg, 0.55 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(a.fg, 0.12 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0)} 65%), ${C.ink900}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(46 * glow)}px ${alpha(a.fg, 0.35 * glow)}` : `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.3),
        filter: dim > 0 ? `brightness(${1 - 0.45 * dim})` : undefined,
        transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
      }}
    >
      <div style={{ width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', background: alpha(a.fg, 0.2) }}>
        <Icon name={icon} size={40} color={a.fg} strokeWidth={2.4} />
      </div>
      <div style={{ marginTop: 24, fontSize: TYPE.h3 - 4, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{title}</div>
      {detail ? <div style={{ marginTop: 20, fontSize: TYPE.label, fontWeight: 600, color: a.soft, lineHeight: 1.35 }}>{detail}</div> : null}
      {children}
    </div>
  );
}
