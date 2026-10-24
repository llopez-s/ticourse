import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { S06_END, S06_NEXT, S06_NEXT_SUB, TONE } from '../data/niveles';
import { TIMELINE } from '../timeline/load';
import { MiniEnvelopes, MiniScale, MiniTable } from './parts/Minis';
import { Stage } from './kit';

const W = STAGE.width;
const CARDS_TOP = 24;
const CARDS_H = 470;
const NEXT_TOP = 526;
const ART_H = 176;

/**
 * s06-recap «Tres reglas». The two envelopes of s05 are still there on `recap`, then give way to
 * three numbered slots; each rule card lights as the voice says it (the previous one steps back), with
 * its image in miniature: the table of three rows with the player, the coach and the board (`rule-1`),
 * the two envelopes each in its place (`rule-2`), the house with the bar and the roof lit (`rule-3`).
 * On `next` one call to action, the lesson's six questions; on `endcard` the ALERTÓPOLIS closing card
 * (the envelopes, title, GCTI objective, disclaimer), which holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOpacity = 1 - progress(frame, endcardAt - 14, 14, EASE.inOut);
  const envIn = progress(frame, Math.min(2, recapAt - 6), 14);
  const envOut = progress(frame, ruleAt[0] - 24, 12, EASE.inOut);

  const rules: RuleCardDef[] = [
    {
      title: ['El nivel lo marca', 'quién lee'],
      sub: (
        <>
          <div style={{ color: '#67e8f9' }}>tactical para hoy</div>
          <div style={{ color: '#fcd34d' }}>operational para entender al grupo</div>
          <div style={{ color: '#6ee7b7' }}>strategic para invertir</div>
        </>
      ),
      tone: 'sky',
      at: ruleAt[0],
      art: <MiniTable width={300} />,
    },
    {
      title: ['Producto correcto', 'audiencia correcta'],
      sub: (
        <>
          <div>indicadores al consejo o</div>
          <div>tendencias al SOC:</div>
          <div style={{ color: '#fda4af' }}>el error clásico</div>
        </>
      ),
      tone: 'cyan',
      at: ruleAt[1],
      art: <MiniEnvelopes width={330} />,
    },
    {
      title: ['Primero la base,', 'luego Intelligence'],
      sub: (
        <>
          <div>multiplica,</div>
          <div style={{ color: '#fcd34d' }}>no sustituye</div>
        </>
      ),
      tone: 'emerald',
      at: ruleAt[2],
      art: <MiniScale width={300} />,
    },
  ];

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={ruleAt[0] - 14}
            dimFrom={nextAt}
            subSize={28}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      {envIn > 0 && envOut < 1 ? (
        <div style={{ position: 'absolute', left: (W - 640) / 2, top: CARDS_TOP + (CARDS_H - 280) / 2 + 20, opacity: envIn * (1 - envOut), transform: `scale(${(0.96 + 0.04 * envIn) * (1 - 0.25 * envOut)})`, transformOrigin: '50% 50%' }}>
          <MiniEnvelopes width={640} check={1} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next action: the lesson's six questions. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '16px 34px 16px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S06_NEXT}</span>
        <Chip accent="muted" size={30}>
          {S06_NEXT_SUB}
        </Chip>
      </div>
    </div>
  );
}

const CARD_W = 1420;

/** Closing card: the two envelopes, ALERTÓPOLIS, title, tagline, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const tag = enter(frame, at + 9, { distance: 14 });
  const objective = enter(frame, at + 12, { distance: 18 });
  const ruleDraw = progress(frame, at + 12, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 64px',
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
      <div style={{ flexShrink: 0, ...art }}>
        <MiniEnvelopes width={430} check={1} tilt={3} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 74, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>{S06_END.title}</div>
        <div style={{ marginTop: 6, fontSize: 50, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...sub }}>{S06_END.sub}</div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 650, color: TONE.tactical, whiteSpace: 'nowrap', ...tag }}>{S06_END.tagline}</div>
        <div style={{ marginTop: 22, ...objective }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {S06_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 24, width: 600 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 22, width: 640, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {S06_END.disclaimer}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
