import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { DECOYS, SENSORS } from '../data/canon';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { Decoy } from './parts/Decoy';
import { FloorPlan } from './parts/FloorPlan';
import { SensorRoom } from './parts/SensorRoom';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 470;
const ART_H = 104;
const PHRASE_TOP = 500;
const NEXT_TOP = 510;

const PHRASE_TONE = { cyan: C.cyan, amber: C.amber } as const;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/** The three icons, one per image of the video. */
function Art({ art, glow }: { art: RuleArt; glow: number }) {
  if (art === 'plan') return <FloorPlan width={280} car={1} bollards={1} vestibule={1} reader={1} log={glow} idSuffix="-s8" />;
  const grid = (items: ReactNode[]) => <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 6 }}>{items}</div>;
  if (art === 'rooms') return grid(SENSORS.map((s) => <SensorRoom key={s.kind} kind={s.kind} width={70} on={0.5 + 0.5 * glow} weak={0.8} idSuffix="-s8" />));
  return grid(DECOYS.map((d) => <Decoy key={d.kind} kind={d.kind} width={62} on={0.5 + 0.5 * glow} alarm={glow} />));
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with
 * its icon — the plan with its three controls, the four rooms, the four decoys — and the full rule of the ficha, its
 * lines lit on the voice's words. On `phrase` the cards step back and «Cada cosa tapa un hueco y falla por algún sitio»
 * comes in under them, a beat per half. On `next` it gives way to «Tu turno: las preguntas de la lección»; on `endcard`
 * the ALERTÓPOLIS end card takes the stage and holds.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);
  const beatAt = PHRASE.map((p, i) => (i === 0 ? phraseAt : Math.max(phraseAt + 6, wordFrame(S, 's08-04', p.word) - 8)));
  // Rule 1's card lights on `recap` (its first sentence), the others on their cues.
  const cardAt = [Math.min(recapAt, ruleAt[0]), ruleAt[1], ruleAt[2]];

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => (l.word ? Math.max(cardAt[i] + 4, wordFrame(S, r.seg, l.word) - 6) : cardAt[i] + 8));
    const show = progress(frame, cardAt[i] + 2, 14);
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.2 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.35 + 0.65 * progress(frame, frames[k] + k * 2, 12)} />
          ))}
        </div>
      ),
      tone: i === 1 ? 'amber' : i === 2 ? 'violet' : 'cyan',
      at: cardAt[i],
      art: (
        <div style={{ opacity: show }}>
          <Art art={r.art} glow={0.5 * show} />
        </div>
      ),
    };
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={recapAt - 20}
            dimFrom={phraseAt}
            titleSize={50}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />

          {phraseIn > 0.01 && phraseOut < 0.99 ? (
            <div style={{ position: 'absolute', left: 0, top: PHRASE_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  boxSizing: 'border-box',
                  padding: '16px 40px',
                  borderRadius: 26,
                  background: alpha(C.violet, 0.08),
                  border: `3px solid ${alpha(C.violet, 0.6)}`,
                  boxShadow: `0 0 34px ${alpha(C.violet, 0.18)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  opacity: phraseIn * (1 - phraseOut),
                  transform: `translateY(${(1 - phraseIn) * 16 - phraseOut * 10}px)`,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="mortarboard" size={56} color={C.violet} strokeWidth={2} />
                <div style={{ fontSize: 50, fontWeight: 850 }}>
                  {PHRASE.map((p, i) => (
                    <span key={p.text} style={{ color: PHRASE_TONE[p.tone], opacity: 0.25 + 0.75 * progress(frame, beatAt[i], 12) }}>
                      {p.text}
                      {i === 0 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
