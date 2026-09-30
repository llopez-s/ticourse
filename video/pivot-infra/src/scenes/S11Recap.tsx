import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage } from './kit';
import { LabAction, RULES, RuleCard } from './parts/s11-recap/Rules';

/**
 * s11-recap «Para el examen»: three practical rules, one big card each, lit as
 * the voice says them (the previous one steps back): count the tenants, look
 * for what is only his (the hand-made key), always look passively (the closed
 * eye). Then one single next action — Lab 3A with a query budget — and the
 * ALERTÓPOLIS end card holds to the last frame.
 */
export function S11Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const labAt = props.cue('lab3a');
  const endcardAt = props.cue('endcard');

  const boardOpacity = progress(frame, 0, 10) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));
  // The card the voice is on stays bright; the others step back. At the lab, all three do.
  const labDim = progress(frame, labAt - 4, 14);
  const dimOf = (i: number) => Math.max(labDim, i < 2 ? progress(frame, ruleAt[i + 1] - 4, 14) : 0);
  const headIn = enter(frame, Math.min(recapAt - 10, 6), { distance: 14 });

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              height: 64,
              ...headIn,
              opacity: headIn.opacity * (1 - 0.4 * labDim),
            }}
          >
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <span style={{ color: C.cyan }}>Tres reglas</span> para tu próximo pivote
            </span>
          </div>
          {RULES.map((r, i) => (
            <RuleCard key={r.art} n={i + 1} rule={r} frame={frame} fps={fps} slotAt={2 + i * 4} at={ruleAt[i]} dim={dimOf(i)} />
          ))}
          <LabAction frame={frame} fps={fps} at={labAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

const CARD_W = 1320;

/** Closing card: ALERTÓPOLIS brand, title, exam badge, the lab and the next lesson, disclaimer. */
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
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
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
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 70, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        Pivotar por la <span style={{ color: C.cyan }}>infraestructura</span>
      </div>
      <div style={{ marginTop: 20, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          GIAC GCTI · Collection
        </Chip>
      </div>
      <div style={{ marginTop: 30, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '16px 34px 16px 24px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: TYPE.body, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
            Ahora te toca a ti: <span style={{ color: C.cyanSoft }}>Lab 3A · Pivot Hunt</span>
          </span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>Siguiente: OSINT, TLP y comunidades de compartición</span>
        </div>
      </div>
      <div style={{ marginTop: 32, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.
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
