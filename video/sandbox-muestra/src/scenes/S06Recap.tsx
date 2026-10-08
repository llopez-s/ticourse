import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, windowWeight, type RuleCardDef } from '../../../engine/src/ui';
import { STATIC_LINES } from '../data/report';
import { S06_END, S06_NEXT, S06_RULES } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { BorrowedPhone } from './parts/BorrowedPhone';
import { CarVignette } from './parts/CarVignette';
import { Garment, garmentWidth } from './parts/Garment';
import { Stage, wordFrame } from './kit';

const SCENE = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 40;
const CARDS_H = 440;
const NEXT_TOP = 506;
const ART_H = 176;
const PDB_PATH = STATIC_LINES.find((l) => l.id === 'pdb')!.value;

/**
 * s06-recap «Tres reglas»: three numbered slots wait from the first frame; each rule card lights as the voice says
 * it (the previous one steps back), with the video's own image in miniature — the car with the notebook and the
 * struck note (rule 1), the borrowed phone (rule 2), the garment with the workshop label in its collar (rule 3).
 * Then one next action — the lesson's questions — and the ALERTÓPOLIS end card, which holds to the last frame
 * («Y mira siempre el cuello por dentro»: the garment's label glows). No lab.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const wCuello = wordFrame(SCENE, 's06-04', 'cuello');

  const boardOpacity = progress(frame, 0, 10) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));
  const [r1, r2, r3] = S06_RULES;

  const rules: RuleCardDef[] = [
    {
      title: r1.title,
      sub: <span style={{ color: C.cyanSoft }}>{r1.sub}</span>,
      tone: 'cyan',
      at: ruleAt[0],
      art: <CarVignette mini width={300} />,
    },
    {
      title: r2.title,
      sub: <span style={{ color: '#6ee7b7' }}>{r2.sub}</span>,
      tone: 'emerald',
      at: ruleAt[1],
      art: <BorrowedPhone mini height={ART_H - 6} />,
    },
    {
      title: r3.title,
      sub: <span style={{ color: '#fcd34d' }}>{r3.sub}</span>,
      tone: 'emerald',
      at: ruleAt[2],
      art: <Garment mini height={ART_H - 4} labelPath={PDB_PATH} />,
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
            slotAt={Math.min(0, recapAt - 20)}
            dimFrom={nextAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} labelGlow={windowWeight(frame, wCuello - 6, Number.POSITIVE_INFINITY, { ramp: 14 })} />
    </Stage>
  );
}

/** The one next action: the lesson's questions. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: NEXT_TOP,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * 18}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '18px 30px 18px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S06_NEXT.text}</span>
        <Chip accent="cyan" icon="check" size={TYPE.label} solid>
          {S06_NEXT.chip}
        </Chip>
      </div>
    </div>
  );
}

const CARD_W = 1460;
const END_ART_H = 380;

/** Closing card: the garment with its workshop label, ALERTÓPOLIS, title, the next action, objective, disclaimer. */
function EndCard({ frame, fps, at, labelGlow }: { frame: number; fps: number; at: number; labelGlow: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const next = enter(frame, at + 10, { distance: 18 });
  const objective = enter(frame, at + 14, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 60,
        padding: '0 70px',
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
      <div style={{ flexShrink: 0, width: garmentWidth(END_ART_H), ...art }}>
        <Garment mini height={END_ART_H} labelPath={PDB_PATH} labelGlow={labelGlow} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 70, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>{S06_END.title}</div>
        <div style={{ marginTop: 8, fontSize: 40, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap', ...sub }}>{S06_END.sub}</div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...next }}>
          <Icon name="play" size={38} color={C.cyan} strokeWidth={2} />
          <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{S06_NEXT.text}</span>
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, ...objective }}>
          <Chip accent="cyan" icon="check" size={TYPE.small} solid>
            {S06_NEXT.chip}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.small}>
            {S06_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 24, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 20, width: 760, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
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
