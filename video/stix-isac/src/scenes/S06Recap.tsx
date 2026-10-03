import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { S06_END, S06_NEXT, S06_RULES } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { Stage } from './kit';
import { ContactMini } from './parts/ContactCard';
import { IncomingCard, incomingCardHeight } from './parts/IncomingCard';
import { LetterMini } from './parts/Letter';
import { NeighbourNote } from './parts/NeighbourNote';

const W = STAGE.width;
const CARDS_TOP = 40;
const CARDS_H = 440;
const NEXT_TOP = 506;
const ART_H = 176;
const CARD_IN_W = 660;

/**
 * s06-recap «Tres reglas»: while the voice says «la próxima vez que parpadee
 * ese botón», the incoming card of s01 is back with its «Bloquear» button
 * beating; it gives way to the three numbered slots, and each rule
 * card lights as the voice says it (the previous one steps back), with the
 * video's own image in miniature — the neighbours' note, the contact, the
 * letter beside the envelope. Then one next action — the lesson's ten
 * questions — and the ALERTÓPOLIS end card, which holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOpacity = 1 - progress(frame, endcardAt - 14, 14, EASE.inOut);
  // The incoming card (recap), until the first rule takes over.
  const cardIn = progress(frame, Math.min(2, recapAt - 6), 14);
  const cardOut = progress(frame, ruleAt[0] - 28, 12, EASE.inOut);
  const cardH = incomingCardHeight(CARD_IN_W);
  const r1 = S06_RULES[0];
  const r2 = S06_RULES[1];
  const r3 = S06_RULES[2];

  const rules: RuleCardDef[] = [
    {
      title: r1.title,
      sub: (
        <span>
          <span style={{ color: '#fcd34d' }}>{r1.sub.lead}</span> <span style={{ color: '#6ee7b7' }}>{r1.sub.rest}</span>
        </span>
      ),
      tone: 'amber',
      at: ruleAt[0],
      art: <NeighbourNote mini width={262} frame={frame} />,
    },
    {
      title: r2.title,
      sub: [r2.sub[0], r2.sub[1]],
      tone: 'cyan',
      at: ruleAt[1],
      art: <ContactMini width={300} />,
    },
    {
      title: r3.title,
      sub: (
        <span>
          <span style={{ color: '#c4b5fd' }}>{r3.sub.stix}</span> {r3.sub.describe} <span style={{ color: '#c4b5fd' }}>{r3.sub.taxii}</span> {r3.sub.transports}
        </span>
      ),
      tone: 'sky',
      at: ruleAt[2],
      art: <LetterMini width={300} />,
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
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      {cardIn > 0 && cardOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: (W - CARD_IN_W) / 2,
            top: (CARDS_TOP + CARDS_H - cardH) / 2 + 20,
            opacity: cardIn * (1 - cardOut),
            transform: `scale(${(0.96 + 0.04 * cardIn) * (1 - 0.25 * cardOut)})`,
            transformOrigin: '50% 50%',
          }}
        >
          <IncomingCard width={CARD_IN_W} pulseAt={recapAt} glow={0.4} frame={frame} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next action: the lesson's ten questions. */
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
          padding: '18px 36px 18px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S06_NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1420;

/** Closing card: the letter beside its envelope, ALERTÓPOLIS, title, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const objective = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
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
        gap: 64,
        padding: '0 72px',
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
        <LetterMini width={380} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 76, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>{S06_END.title}</div>
        <div style={{ marginTop: 10, fontSize: 44, fontWeight: 650, color: C.text, whiteSpace: 'nowrap', ...sub }}>{S06_END.sub}</div>
        <div style={{ marginTop: 24, ...objective }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {S06_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 28, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 24, width: 720, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
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
