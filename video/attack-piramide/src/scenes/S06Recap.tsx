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
import { Ladder, ladderLayout } from './parts/Ladder';
import { Person } from './parts/Person';
import { Pyramid, type RungId } from './parts/Pyramid';

const CARDS_TOP = 84;
const CARDS_H = 450;
const NEXT_TOP = 552;
const ART_H = 170;
const LADDER_W = 360;

/**
 * s06-recap «Tres reglas»: one big card per rule, lit as the voice says it
 * (the previous one steps back), each with the video's own image — the
 * ladder (procedure lit), the pyramid with its base lit, the person with the
 * footprints lit. Then one single next action — the lesson's ten questions —
 * and the ALERTÓPOLIS end card holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOpacity = progress(frame, 0, 10) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));
  const nextDim = progress(frame, nextAt - 4, 14);
  const headIn = enter(frame, Math.min(recapAt - 10, 4), { distance: 14 });

  const ladderH = ladderLayout(LADDER_W, true).height;
  const greyBut = (keep: RungId): Partial<Record<RungId, number>> =>
    Object.fromEntries((['hash', 'ip', 'domain', 'artifacts', 'tools', 'ttps'] as RungId[]).map((r) => [r, r === keep ? 0 : 0.45]));

  const rules: RuleCardDef[] = [
    {
      title: S06_RULES[0].title,
      sub: [
        <span key="a">
          <span style={{ color: C.cyan }}>{S06_RULES[0].sub[0][0]}</span>
          {S06_RULES[0].sub[0][1]}
        </span>,
        <span key="b">
          <span style={{ color: C.sky }}>{S06_RULES[0].sub[1][0]}</span>
          {S06_RULES[0].sub[1][1]}
        </span>,
      ],
      tone: S06_RULES[0].tone,
      at: ruleAt[0],
      art: (
        <div style={{ width: LADDER_W * (ART_H / ladderH), height: ART_H }}>
          <div style={{ transform: `scale(${ART_H / ladderH})`, transformOrigin: '0 0' }}>
            <Ladder width={LADDER_W} frame={frame} compact focus={2} rungs={[{}, {}, {}]} />
          </div>
        </div>
      ),
    },
    {
      title: S06_RULES[1].title,
      sub: [<span key="a" style={{ color: C.text }}>{S06_RULES[1].sub[0]}</span>, S06_RULES[1].sub[1]],
      tone: S06_RULES[1].tone,
      at: ruleAt[1],
      art: <Pyramid width={250} height={ART_H - 8} frame={frame} labels="none" grey={greyBut('hash')} focus={{ hash: 1 }} />,
    },
    {
      title: S06_RULES[2].title,
      sub: [
        S06_RULES[2].sub[0],
        <span key="b">
          <span style={{ color: C.emerald }}>cómo anda</span>, no qué <span style={{ color: C.amber }}>ropa</span> lleva
        </span>,
      ],
      tone: S06_RULES[2].tone,
      at: ruleAt[2],
      art: <Person width={Math.round(ART_H / 2.3)} height={ART_H} frame={frame} labels={false} focus={{ andar: 1 }} />,
    },
  ];

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
              opacity: headIn.opacity * (1 - 0.4 * nextDim),
            }}
          >
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <span style={{ color: C.cyan }}>Tres reglas</span> para apuntarte
            </span>
          </div>
          <RuleCards
            rules={rules}
            width={STAGE.width}
            height={CARDS_H}
            slotAt={2}
            dimFrom={nextAt}
            gap={24}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
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
        width: STAGE.width,
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
          padding: '18px 30px 18px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={44} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{S06_NEXT.text}</span>
        <Chip accent="cyan" icon="check" size={TYPE.label} solid>
          {S06_NEXT.chip}
        </Chip>
      </div>
    </div>
  );
}

const CARD_W = 1320;

/** Closing card: ALERTÓPOLIS brand, title, exam badge, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const disclaimer = enter(frame, at + 16, { distance: 12 });
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
        <BrandMark size={36} />
        <span style={{ fontSize: TYPE.label, fontWeight: 800, letterSpacing: 6, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 84, fontWeight: 850, letterSpacing: -2.5, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        Del comando al <span style={{ color: C.emerald }}>TTP</span>
      </div>
      <div style={{ marginTop: 26, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          {S06_END.objective}
        </Chip>
      </div>
      <div style={{ marginTop: 34, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div style={{ marginTop: 32, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        {S06_END.disclaimer}
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
