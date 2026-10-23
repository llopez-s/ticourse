import type { ReactNode } from 'react';
import { BrandMark } from '../../../../engine/src/overlay/ChapterRail';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../../engine/src/theme/motion';
import { isElevenLabsVoice } from '../../../../engine/src/timeline/voice';
import { Chip, DIM, Icon, dimStyle } from '../../../../engine/src/ui';
import { TIMELINE } from '../../timeline/load';
import { Scale, WeightSvg } from './Scale';

const W = STAGE.width;

export const NEXT = { text: 'Tu turno: las preguntas de la lección', chip: 's4m1 · 6 preguntas' } as const;
export const END = {
  lead: 'El instrumento de medida',
  rest: 'eres tú',
  sub: 'Cuatro atajos de la cabeza y cómo frenarlos',
  objective: 'GIAC GCTI · Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;

/**
 * One rule card, as a full-width row: a numbered dashed slot waits from the start; on `at` the card springs in
 * and glows until the next one lights (`lit`, `glow`), earlier cards step back (`dim`).
 * Children are the card's content, laid out by the caller inside the box (left padding 96 px for the number).
 */
export function RuleRow({
  index,
  top,
  height,
  frame,
  fps,
  slotAt,
  at,
  dim,
  glow,
  children,
}: {
  index: number;
  top: number;
  height: number;
  frame: number;
  fps: number;
  slotAt: number;
  at: number;
  dim: number;
  glow: number;
  children: ReactNode;
}) {
  const slot = progress(frame, slotAt + index * 4, 12);
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const on = glow > 0.3;
  const box = { position: 'absolute' as const, inset: 0, boxSizing: 'border-box' as const, borderRadius: RADIUS.lg };
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, height, ...dimStyle(dim), transform: `translateY(${(1 - slot) * 14}px) scale(${1 - (1 - DIM.scale) * dim * 0.5})` }}>
      {lit < 1 ? <div style={{ ...box, border: `2px dashed ${C.ink600}`, opacity: slot * (1 - lit) }} /> : null}
      {lit > 0 ? (
        <div
          style={{
            ...box,
            border: `${on ? 3 : 2}px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
            background: `linear-gradient(90deg, ${alpha(C.cyan, 0.06 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 38%)`,
            boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 16px 40px ${alpha('#000000', 0.3)}`,
            opacity: lit,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: (height - 54) / 2,
          width: 54,
          height: 54,
          boxSizing: 'border-box',
          borderRadius: 27,
          display: 'grid',
          placeItems: 'center',
          background: on ? C.cyan : alpha(C.cyan, 0.18 * lit),
          border: `2px solid ${lit > 0.5 ? alpha(C.cyan, 0.7) : C.ink600}`,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 850,
          color: on ? C.ink950 : lit > 0.5 ? C.cyanSoft : C.ink500,
          opacity: slot,
        }}
      >
        {index + 1}
      </div>
      <div style={{ position: 'absolute', left: 96, right: 20, top: 0, height, opacity: Math.max(0.35 * slot, lit), transform: `translateX(${(1 - Math.min(1, p)) * 18}px)` }}>{children}</div>
    </div>
  );
}

/** The recap's thumbnail of rule 1: a scale and, outside it, a weight (the video's one image, small). */
export function ScaleAndWeight({ lit = 1 }: { lit?: number }) {
  return (
    <div style={{ position: 'relative', width: 280, height: 118, opacity: 0.45 + 0.55 * lit }}>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Scale width={180} />
      </div>
      <svg width={100} height={118} viewBox="0 0 100 118" style={{ position: 'absolute', left: 184, top: 0, overflow: 'visible' }}>
        <g transform="translate(50 108)">
          <WeightSvg size={74} label="1" glow={0.5 * lit} />
        </g>
      </svg>
    </div>
  );
}

/** The closing action: a pill centred on the stage, from `at`. */
export function NextAction({ frame, fps, at, top }: { frame: number; fps: number; at: number; top: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '13px 30px 13px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{NEXT.text}</span>
        <Chip accent="cyan" icon="check" size={TYPE.label} solid>
          {NEXT.chip}
        </Chip>
      </div>
    </div>
  );
}

/**
 * Where the video ends: the scale with its weight on the platform, ALERTÓPOLIS, the video's title, the next
 * step (the lesson's questions — no lab), the objective and the disclaimer. Everything is in by `at` + ~35 and
 * nothing moves afterwards: it holds to the scene's last frame (the music tail).
 */
export function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const sub = enter(frame, at + 2, { distance: 18 });
  const cta = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18, EASE.out);
  const disclaimer = enter(frame, at + 14, { distance: 12 });
  const sentences = END.disclaimer.split('. ');
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - 1600) / 2,
        top: 24,
        width: 1600,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 70,
        padding: '0 56px 0 70px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      <div style={{ ...art, flexShrink: 0, width: 330, height: 230, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 26 }}>
          <Scale
            width={330}
            reading="2,0"
            glow={0.35}
            platform={
              <g transform="translate(0 0)">
                <WeightSvg size={84} label="1" glow={0.4} />
              </g>
            }
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 80, fontWeight: 850, letterSpacing: -2.2, lineHeight: 1.04, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.textStrong }}>{END.lead}</div>
          <div style={{ color: C.cyan }}>{END.rest}</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 44, fontWeight: 750, letterSpacing: -0.6, lineHeight: 1.12, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT.text}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.small} solid>
            {NEXT.chip}
          </Chip>
          <Chip accent="muted" icon="mortarboard" size={TYPE.small}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 18, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 10, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {sentences.map((s, k) => (
            <div key={k}>{k < sentences.length - 1 ? `${s}.` : s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}
