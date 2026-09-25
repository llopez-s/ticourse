import { useCurrentFrame, useVideoConfig } from 'remotion';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { enter, fadeOut, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage, wordFrame } from './kit';

type Reflex = { icon: IconName; title: string; detail: string; at: number };

/** S06 «Para el examen»: five exam reflexes, then the end card. */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's06-recap';
  const recap = props.cue('recap');
  const endcard = props.cue('endcard');

  const reflexes: Reflex[] = [
    { icon: 'file', title: 'Legal hold', detail: 'al prever el litigio, no con la demanda', at: wordFrame(S, 's06-01', 'hold') },
    { icon: 'bolt', title: 'Memoria antes que disco', detail: 'order of volatility', at: wordFrame(S, 's06-01', 'memoria') },
    { icon: 'key', title: 'Hash antes y después', detail: 'y el análisis, sobre la copia', at: wordFrame(S, 's06-01', 'hash') },
    { icon: 'x', title: 'Hash distinto', detail: 'repetir la adquisición y documentar', at: wordFrame(S, 's06-02', 'distinto') },
    { icon: 'users', title: 'Hueco en la custodia', detail: 'puede dejarla inadmisible', at: wordFrame(S, 's06-02', 'hueco') },
  ];
  const gridOut = fadeOut(frame, endcard - 14, 12);
  const headIn = enter(frame, recap - 10, { distance: 16 });

  return (
    <Stage>
      {gridOut > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: gridOut }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, ...headIn }}>
            <Icon name="mortarboard" size={40} color={C.violet} />
            <span style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong }}>Cinco reflejos de examen</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 96, width: 1728, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
            {reflexes.map((r, k) => {
              const p = springIn(frame, fps, r.at - 4, { damping: 15 });
              const warn = k >= 3;
              return (
                <div
                  key={r.title}
                  style={{
                    height: 420,
                    boxSizing: 'border-box',
                    padding: '26px 24px',
                    borderRadius: RADIUS.lg,
                    border: `2px solid ${alpha(warn ? C.rose : C.violet, 0.55)}`,
                    background: `linear-gradient(180deg, ${alpha(warn ? C.rose : C.violet, 0.12)} 0%, ${C.ink900} 70%)`,
                    fontFamily: FONT.sans,
                    opacity: Math.min(1, p * 1.3),
                    transform: `translateY(${(1 - p) * 40}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      display: 'grid',
                      placeItems: 'center',
                      background: alpha(warn ? C.rose : C.violet, 0.2),
                      fontSize: TYPE.label,
                      fontWeight: 850,
                      color: warn ? C.roseSoft : '#c4b5fd',
                    }}
                  >
                    {k + 1}
                  </div>
                  <Icon name={r.icon} size={52} color={warn ? C.roseSoft : C.violet} style={{ marginTop: 22 }} />
                  <div style={{ marginTop: 16, fontSize: 36, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>{r.title}</div>
                  <div style={{ marginTop: 14, fontSize: 30, lineHeight: 1.3, color: C.text }}>{r.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

const CARD_W = 1320;

/** Closing card: holds, unchanged, to the last frame. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const cta = enter(frame, at + 14, { distance: 18 });
  const disclaimer = enter(frame, at + 22, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (STAGE.width - CARD_W) / 2,
        top: 40,
        width: CARD_W,
        height: STAGE.height - 80,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>INTELFORGE ACADEMY</span>
      </div>
      <div style={{ marginTop: 22, fontSize: TYPE.hero, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        Adquisición <span style={{ color: C.cyan }}>forense</span>
      </div>
      <div style={{ marginTop: 22, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          Security+ SY0-701 · objetivo 4.8
        </Chip>
      </div>
      <div style={{ marginTop: 38, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '16px 30px 16px 22px',
          borderRadius: 999,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 36, fontWeight: 650, color: C.textStrong, whiteSpace: 'nowrap' }}>
          Sigue en la lección: <span style={{ color: C.cyanSoft }}>«Fuentes de datos»</span>
        </span>
      </div>
      <div style={{ marginTop: 40, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.
        {isElevenLabsVoice(TIMELINE.voice) ? (
          <>
            <br />
            Voz: ElevenLabs.
          </>
        ) : null}
      </div>
    </div>
  );
}
